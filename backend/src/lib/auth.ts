import crypto from "node:crypto";

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

const TOKEN_TTL_SECONDS = 12 * 60 * 60; // 12 hours

function secret(): string {
  return ADMIN_PASSWORD;
}

export function createToken(): string {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TOKEN_TTL_SECONDS * 1000 })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto
    .createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return false;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.exp !== "number" || data.exp < Date.now()) return false;
  } catch {
    return false;
  }
  return true;
}