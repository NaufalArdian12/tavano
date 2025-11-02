import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { authGuard } from "../middleware/authGuard.js";
import { sbService, sbAnon } from "../lib/sb.js";

const r: ExpressRouter = Router();


r.post("/sync", authGuard, async (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");

  const { data: userData, error: uerr } = await sbAnon.auth.getUser(token);
  
  if (uerr || !userData?.user) {
    return res.status(401).json({ error: "Invalid user" });
  }

  const meta = userData.user.user_metadata as Record<string, unknown> | null;
  
  const displayName =
    (meta?.display_name as string) ||
    (meta?.full_name as string) ||
    (userData.user.email?.split("@")[0] ?? "Siswa");

  return res.json({
    ok: true,
    user: {
      id: userData.user.id,
      email: userData.user.email,
      displayName,
    },
  });
});


export default r;
