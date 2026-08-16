import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SiteContent } from "./contentTypes.js";
import { defaultContent } from "./seedContent.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DATA_FILE = path.join(DATA_DIR, "content.json");

export async function getContent(): Promise<SiteContent> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function saveContent(content: SiteContent): Promise<SiteContent> {
  await ensureFile();
  const normalized = normalize(content);
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}

export async function resetContent(): Promise<SiteContent> {
  const normalized = normalize(defaultContent);
  await fs.writeFile(DATA_FILE, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}

function normalize(content: SiteContent): SiteContent {
  const merged = deepMerge(defaultContent, content);
  return JSON.parse(JSON.stringify(merged)) as SiteContent;
}

function deepMerge<T>(base: T, override: T): T {
  if (
    override &&
    typeof override === "object" &&
    !Array.isArray(override) &&
    base &&
    typeof base === "object" &&
    !Array.isArray(base)
  ) {
    const result: Record<string, unknown> = { ...(base as object) };
    for (const key of Object.keys(override as object)) {
      const baseValue = (base as Record<string, unknown>)[key];
      const overrideValue = (override as Record<string, unknown>)[key];
      result[key] = deepMerge(baseValue, overrideValue);
    }
    return result as T;
  }
  return override === undefined ? base : override;
}

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await resetContent();
  }
}