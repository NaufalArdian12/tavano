// apps/api/src/routes/profile.ts
import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { authGuard } from "../middleware/authGuard.js"; // pastikan set req.user.id
import { sbService, sbAnon } from "../lib/sb.js"; // service = service_role client, anon = anon client

const r: ExpressRouter = Router();


r.post("/sync", authGuard, async (req, res) => {
  try {
    const token = (req.headers.authorization || "").replace("Bearer ", "");
    const { data: userData, error: uerr } = await sbAnon.auth.getUser(token);
    if (uerr || !userData?.user) return res.status(401).json({ error: "Invalid user" });

    const uid = userData.user.id;
    const meta = userData.user.user_metadata as Record<string, unknown> | null;
    const displayName =
      (meta?.display_name as string) ||
      (meta?.full_name as string) ||
      (userData.user.email?.split("@")[0] ?? "Siswa");

    const { error } = await sbService
      .from("profiles")
      .upsert({ id: uid, display_name: displayName, role: "student" }, { onConflict: "id" });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: (e as Error).message });
  }
});

export default r;
