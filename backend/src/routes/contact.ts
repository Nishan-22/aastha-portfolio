import { Router } from "express";
import { z } from "zod";
import { saveMessage, getMessages } from "../lib/storage.js";
import { sendEmail } from "../lib/mailer.js";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().trim().email("A valid email is required"),
  projectType: z.string().trim().max(200).optional().default(""),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});

const router = Router();

router.post("/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Validation failed",
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const data = parsed.data;

  try {
    const saved = await saveMessage(data);

    let emailed = false;
    try {
      emailed = await sendEmail(data);
    } catch {
      emailed = false;
    }

    return res.status(201).json({
      success: true,
      message: emailed
        ? "Message sent. Thank you!"
        : "Message received. Thank you!",
      id: saved.id,
      emailed,
    });
  } catch (err) {
    console.error("Failed to store message:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contact", async (_req, res) => {
  try {
    const messages = await getMessages();
    return res.json({ messages });
  } catch (err) {
    console.error("Failed to read messages:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
