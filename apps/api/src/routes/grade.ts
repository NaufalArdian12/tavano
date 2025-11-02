import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { authGuard } from "../middleware/authGuard.js";
import { gradeAnswer } from "../services/gradingService.js";
import { createUserClient, saveAttempt } from "../services/supabaseService.js";

const r: ExpressRouter = Router();

r.post("/ai/grade", authGuard, async (req, res) => {
  try {
    const userId = (req as any).user.id as string;
    const { quizId, answer } = (req.body ?? {}) as { quizId?: string; answer?: string };
    if (!quizId || !answer) return res.status(400).json({ error: "quizId & answer required" });

    const userToken = (req.headers.authorization || "").replace("Bearer ", "").trim();
    if (!userToken) return res.status(401).json({ error: "Missing user token" });

    const sbUser = createUserClient(userToken);

    const result = await gradeAnswer({
      sbUser,
      userId,
      quizId,
      answer,
    });

    await saveAttempt(sbUser, {
      user_id: userId,
      quiz_id: quizId,
      answer,
      label: result.label,
      feedback: result.feedback,
    });

    return res.json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "AI grading failed" });
  }
});

export default r;
