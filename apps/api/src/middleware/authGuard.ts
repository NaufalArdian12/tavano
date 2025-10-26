import type { Request, Response, NextFunction } from "express";
import { sbAnon } from "../lib/sb.js";

export async function authGuard(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: "no token" });

  const { data, error } = await sbAnon.auth.getUser(token);
  if (error || !data?.user) return res.status(401).json({ error: "invalid token" });

  // @ts-expect-error augment simple
  req.user = { id: data.user.id, meta: data.user.user_metadata };
  return next();
}
