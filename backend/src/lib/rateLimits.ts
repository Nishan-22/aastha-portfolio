import { rateLimit } from "express-rate-limit";

const windowMs = 15 * 60 * 1000;

export const loginRateLimit = rateLimit({
  windowMs,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many login attempts. Try again later." },
});

export const contactRateLimit = rateLimit({
  windowMs,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many messages sent. Try again later." },
});

export const readRateLimit = rateLimit({
  windowMs,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many requests. Try again later." },
});
