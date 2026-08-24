import { Router } from "express";
import crypto from "node:crypto";
import { z } from "zod";
import { getContent, saveContent, resetContent } from "../lib/contentStore.js";
import { adminPassword, createToken } from "../lib/auth.js";
import { requireAuth } from "../lib/requireAuth.js";
import { loginRateLimit, readRateLimit } from "../lib/rateLimits.js";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const router = Router();

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

router.post("/auth/login", loginRateLimit, (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success || !safeEqual(parsed.data.password, adminPassword)) {
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