import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { openai } from "../lib/openai.js";
import { authGuard } from "../middleware/authGuard.js";
import { createClient } from "@supabase/supabase-js";

type GradeLabel = "BENAR" | "HAMPIR_BENAR" | "PERLU_REVISI";
type GradeRes = { label: GradeLabel; feedback: string };

const r: ExpressRouter = Router();

function toNumberLike(s: string): number | null {
  const t = s.trim();
  const mixed = /^(-?\d+)\s+(\d+)\/(\d+)$/;
  const frac  = /^-?\d+\/\d+$/;
  const num   = /^-?\d+(\.\d+)?$/;

  if (mixed.test(t)) {
    const [, a, b, c] = t.match(mixed)!;
    return Number(a) + Number(b) / Number(c);
  }
  if (frac.test(t)) {
    const [a, b] = t.split("/");
    return Number(a) / Number(b);
  }
  if (num.test(t)) return Number(t);
  return null;
}
const equalsWithin = (a: number, b: number, tol = 0) => Math.abs(a - b) <= tol;

r.post("/ai/grade", authGuard, async (req, res) => {
  try {
    const userId = (req as any).user.id as string;
    const { quizId, answer } = req.body as { quizId?: string; answer?: string };
    if (!quizId || !answer) return res.status(400).json({ error: "quizId & answer required" });

    const userToken = (req.headers.authorization || "").replace("Bearer ", "").trim();
    const sbUser = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${userToken}` } } }
    );

    const { data: quiz, error: qerr } = await sbUser
      .from("quizzes")
      .select("id,prompt,canonical_answer,objectives,acceptable_answers,grading_notes,numeric_tolerance")
      .eq("id", quizId)
      .maybeSingle();

    if (qerr) return res.status(500).json({ error: "DB select failed", details: qerr.message });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    const acceptList: string[] = Array.isArray(quiz.acceptable_answers) ? quiz.acceptable_answers : [];
    const accepted = (acceptList.length ? acceptList : [quiz.canonical_answer]);
    const tol = typeof quiz.numeric_tolerance === "number" ? quiz.numeric_tolerance : 0;

    const truthVals = new Set(
      accepted.map(toNumberLike).filter((v): v is number => v !== null)
    );
    const ansVal = toNumberLike(answer);
    if (ansVal !== null && truthVals.size > 0) {
      for (const v of truthVals) {
        if (equalsWithin(ansVal, v, tol)) {
          const payload: GradeRes = {
            label: "BENAR",
            feedback: `Mantap! Jawabanmu setara dengan hasil yang benar (${accepted.join(" / ")}).`,
          };
          await sbUser.from("attempts").insert({
            user_id: userId, quiz_id: quizId, answer, label: payload.label, feedback: payload.feedback,
          });
          return res.json(payload);
        }
      }
    }

    const gradingPrompt = `
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

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are a friendly math tutor for kids. Keep answers short (1–2 sentences)." },
        { role: "user", content: gradingPrompt },
      ],
    });

    let payload: GradeRes = {
      label: "PERLU_REVISI",
      feedback: "Coba perbaiki dengan menyamakan penyebut lalu jumlahkan ya.",
    };
    try {
      const raw = completion.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw);
      const allowed = new Set<GradeLabel>(["BENAR", "HAMPIR_BENAR", "PERLU_REVISI"]);
      if (parsed && allowed.has(parsed.label)) {
        payload = { label: parsed.label, feedback: String(parsed.feedback ?? payload.feedback) };
      }
    } catch {
    }

    await sbUser.from("attempts").insert({
      user_id: userId, quiz_id: quizId, answer, label: payload.label, feedback: payload.feedback,
    });

    return res.json(payload);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "AI grading failed" });
  }
});

export default r;
