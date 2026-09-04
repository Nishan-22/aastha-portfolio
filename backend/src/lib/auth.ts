import crypto from "node:crypto";
import { getDb } from "./db.js";

const ENV_PASSWORD = process.env.ADMIN_PASSWORD;

const SETTINGS_COLLECTION = "settings";
const PASSWORD_DOC_ID = "admin_password";

/**
 * The active password source is the hashed credential stored in MongoDB.
 * The ADMIN_PASSWORD env var is only the bootstrap password used before
 * the admin sets their own from the panel — once a hash exists in the DB,
 * the env value no longer grants access.
 */

async function passwordCollection() {
  const db = await getDb();
  return db.collection<{ _id: string; hash: string }>(SETTINGS_COLLECTION);
}

export async function getStoredHash(): Promise<string | null> {
  const col = await passwordCollection();
  const doc = await col.findOne({ _id: PASSWORD_DOC_ID });
  return doc?.hash ?? null;
}

export async function hasStoredPassword(): Promise<boolean> {
  return (await getStoredHash()) !== null;
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function verifyScryptHash(candidate: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  try {
    const expected = Buffer.from(hashHex, "hex");
    const actual = crypto.scryptSync(candidate, Buffer.from(saltHex, "hex"), expected.length);
    return (
      actual.length === expected.length && crypto.timingSafeEqual(actual, expected)
    );
  } catch {
    return false;
  }
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Verify a login attempt against the DB hash, falling back to the env bootstrap password. */
export async function verifyPassword(candidate: string): Promise<boolean> {
  const stored = await getStoredHash();
  if (stored !== null) {
    return verifyScryptHash(candidate, stored);
  }
  if (!ENV_PASSWORD) return false;
  return safeEqual(candidate, ENV_PASSWORD);
}

/**
 * Set a new password (caller must already have verified the current one).
 * Tokens are signed with the active password material, so changing it
 * invalidates all previously issued sessions.
 */
export async function setPassword(newPassword: string): Promise<string> {
  const hash = hashPassword(newPassword);
  const col = await passwordCollection();
  await col.updateOne(
    { _id: PASSWORD_DOC_ID },
    { $set: { hash, updatedAt: new Date().toISOString() } },
    { upsert: true }
  );
  return createToken();
}

const TOKEN_TTL_SECONDS = 12 * 60 * 60; // 12 hours

async function signingKey(): Promise<string> {
  const stored = await getStoredHash();
  return stored ?? ENV_PASSWORD ?? "";
}

export async function createToken(): Promise<string> {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + TOKEN_TTL_SECONDS * 1000 })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", await signingKey())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export async function verifyToken(token: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const key = await signingKey();
  if (!key) return false;
  const expected = crypto.createHmac("sha256", key).update(payload).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expected);
  if (
    sigBuf.length !== expectedBuf.length ||
    !crypto.timingSafeEqual(sigBuf, expectedBuf)
  ) {
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
