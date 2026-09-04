import { Router } from "express";
import { z } from "zod";
import { getContent, saveContent, resetContent } from "../lib/contentStore.js";
import { createToken, setPassword, verifyPassword } from "../lib/auth.js";
import { requireAuth } from "../lib/requireAuth.js";
import { loginRateLimit, readRateLimit } from "../lib/rateLimits.js";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .max(128, "New password is too long"),
});

const router = Router();

router.post("/auth/login", loginRateLimit, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Password is required" });
  }
  const valid = await verifyPassword(parsed.data.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid password" });
  }
  return res.json({ token: await createToken() });
});

router.post("/auth/change-password", requireAuth, loginRateLimit, async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    });
  }
  const { currentPassword, newPassword } = parsed.data;
  const valid = await verifyPassword(currentPassword);
  if (!valid) {
    return res.status(401).json({ error: "Current password is incorrect" });
  }
  const token = await setPassword(newPassword);
  return res.json({ token });
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