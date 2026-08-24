import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./auth.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}
