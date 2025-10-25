import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { sbService } from "../lib/sb.js";
import { openai } from "../lib/openai.js";
import { authGuard } from "../middleware/authGuard.js";

const r: ExpressRouter = Router();

r.post("/ai/grade", authGuard, async (req, res) => {
    try {
        const userId = (req as any).user.id as string;
        const { quizId, answer } = req.body as { quizId?: string; answer?: string; };
        if (!quizId || !answer) return res.status(400).json({ error: "quizId & answer required" });

        const { data: quiz, error } = await sbService
            .from("quizzes")
            .select("id,prompt,canonical_answer,objectives")
            .eq("id", quizId).single();
        if (error || !quiz) return res.status(404).json({ error: "Quiz not found" });

        const prompt = `
            Return JSON only:
            {"label":"BENAR|HAMPIR_BENAR|PERLU_REVISI","feedback":"1-2 kalimat, ramah, tanpa jawab final"}

            Kamu tutor Matematika SD/SMP, singkat & positif.
            Soal: ${quiz.prompt}
            Jawaban siswa: ${answer}
            Jawaban ideal: ${quiz.canonical_answer}
            Tujuan konsep: ${quiz.objectives}
            `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            temperature: 0.4,
            messages: [
                { role: "system", content: "You are a friendly math tutor for kids. Keep answers short (1–2 sentences)." },
                { role: "user", content: prompt }
            ]
        });

        let payload = { label: "PERLU_REVISI", feedback: "Coba perbaiki dengan menyebutkan makna totalnya ya." };
        try { payload = JSON.parse(completion.choices[0]?.message?.content ?? "{}"); } catch { }

        const allowed = new Set(["BENAR", "HAMPIR_BENAR", "PERLU_REVISI"]);
        // @ts-ignore
        if (!allowed.has(payload.label)) payload.label = "PERLU_REVISI";

        await sbService.from("attempts").insert({
            user_id: userId, quiz_id: quizId, answer, label: payload.label, feedback: payload.feedback
        });

        res.json(payload);
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: "AI grading failed" });
    }
});

export default r;
