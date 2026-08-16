import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { getContent, saveContent, resetContent } from "../lib/contentStore.js";
import { ADMIN_PASSWORD, createToken, verifyToken } from "../lib/auth.js";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const router = Router();

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

router.post("/auth/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (parsed.data.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid password" });
  }
  return res.json({ token: createToken() });
});

router.get("/content", async (_req, res) => {
  try {
    const content = await getContent();
    return res.json(content);
  } catch (err) {
    console.error("Failed to read content:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/content", requireAuth, async (req, res) => {
  try {
    const content = await saveContent(req.body);
    return res.json(content);
  } catch (err) {
    console.error("Failed to save content:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/content/reset", requireAuth, async (_req, res) => {
  try {
    const content = await resetContent();
    return res.json(content);
  } catch (err) {
    console.error("Failed to reset content:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;