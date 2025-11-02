import type { SupabaseClient } from "@supabase/supabase-js";
import { toNumberLike, equalsWithin } from "../utils/number.js";
import { safeJsonParse } from "../utils/json.js";
import { chatJson } from "./openaiService.js";

type GradeLabel = "BENAR" | "HAMPIR_BENAR" | "PERLU_REVISI";
type GradeRes = { label: GradeLabel; feedback: string };

const ALLOWED = new Set<GradeLabel>(["BENAR", "HAMPIR_BENAR", "PERLU_REVISI"]);

export async function gradeAnswer(params: {
    sbUser: SupabaseClient;
    userId: string;
    quizId: string;
    answer: string;
}): Promise<GradeRes> {
    const { sbUser, quizId, answer } = params;

    const { data: quiz, error } = await sbUser
        .from("quizzes")
        .select("id,prompt,canonical_answer,objectives,acceptable_answers,grading_notes,numeric_tolerance")
        .eq("id", quizId)
        .maybeSingle();

    if (error) throw new Error("DB select failed: " + error.message);
    if (!quiz) throw new Error("Quiz not found");

    const acceptList: string[] = Array.isArray(quiz.acceptable_answers) ? quiz.acceptable_answers : [];
    const accepted = acceptList.length ? acceptList : [quiz.canonical_answer];
    const tol = typeof quiz.numeric_tolerance === "number" ? quiz.numeric_tolerance : 0;

    // Fast path numeric
    const truthVals = new Set(accepted.map(toNumberLike).filter((v): v is number => v !== null));
    const ansVal = toNumberLike(answer);
    if (ansVal !== null && truthVals.size > 0) {
        for (const v of truthVals) {
            if (equalsWithin(ansVal, v, tol)) {
                return {
                    label: "BENAR",
                    feedback: `Mantap! Jawabanmu setara dengan hasil yang benar (${accepted.join(" / ")}).`,
                };
            }
        }
    }

    // LLM fallback
    const prompt = buildPrompt({ accepted, tol, quiz, answer });
    const raw = await chatJson(prompt);
    const parsed = safeJsonParse<Partial<GradeRes>>(raw, {});

    return {
        label: ALLOWED.has(parsed.label as GradeLabel) ? (parsed.label as GradeLabel) : "PERLU_REVISI",
        feedback:
            (typeof parsed.feedback === "string" && parsed.feedback.trim()) ||
            "Coba perbaiki dengan menyamakan penyebut lalu jumlahkan ya.",
    };
}

function buildPrompt({ accepted, tol, quiz, answer }: any) {
    return `
        Return JSON only:
        {"label":"BENAR|HAMPIR_BENAR|PERLU_REVISI","feedback":"1–2 kalimat, ramah, tanpa jawab final"}

        Peran: Kamu tutor Matematika SD/SMP, singkat & positif.
        Kriteria penilaian:
        - BENAR: hasil benar (salah satu dari: ${accepted.join(", ")}) DAN langkah inti tepat (samakan penyebut, lalu jumlahkan).
        - HAMPIR_BENAR: langkah inti benar tapi ada detail kecil kurang jelas / minor salah tulis.
        - PERLU_REVISI: hasil salah atau langkah inti keliru.

        Catatan tambahan: ${quiz.grading_notes ?? "-"}
        Jika jawaban numerik, toleransi kesetaraan numerik: ${tol}.

        Soal: ${quiz.prompt}
        Jawaban siswa: ${answer}
        Jawaban ideal: ${quiz.canonical_answer}
        Tujuan konsep: ${quiz.objectives ?? "-"}
        `.trim();
        }
