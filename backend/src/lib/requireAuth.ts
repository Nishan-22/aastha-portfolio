import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "./auth.js";

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token || !(await verifyToken(token))) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  } catch (err) {
    next(err);
  }
}
