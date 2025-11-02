import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { authGuard } from "../middleware/authGuard.js";
import { createUserClient } from "../services/supabaseService.js";

const r: ExpressRouter = Router();

r.get("/quizzes/:id", authGuard, async (req, res) => {
  try {
    const { id } = req.params;
    const userToken = (req.headers.authorization || "")
      .replace("Bearer ", "")
      .trim();

    if (!userToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const sb = createUserClient(userToken);
    const { data, error } = await sb
      .from("quizzes")
      .select("id,prompt")
      .eq("id", id)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Not found" });

    return res.json(data);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: "Failed to load quiz" });
  }
});

export default r;
