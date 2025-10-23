import { Request, Response, NextFunction } from "express";
import { sbAnon } from "../lib/sb.js";

export async function authGuard(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });
  const { data, error } = await sbAnon.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: "Invalid token" });
  (req as any).user = { id: data.user.id, email: data.user.email };
  next();
}
