import type { SiteContent } from "./contentTypes.js";
import { defaultContent } from "./seedContent.js";
import { getDb } from "./db.js";

const COLLECTION = "content";
const DOC_ID = "site";

interface ContentDoc {
  _id: string;
  data: SiteContent;
}

export async function getContent(): Promise<SiteContent> {
  const doc = await getDb()
    .then((db) => db.collection<ContentDoc>(COLLECTION).findOne({ _id: DOC_ID }));

  if (!doc) {
    const content = normalize(defaultContent);
    await saveContent(content);
    return content;
  }
  return normalize(doc.data);
}

export async function saveContent(content: SiteContent): Promise<SiteContent> {
  const normalized = normalize(content);
  await getDb().then((db) =>
    db.collection<ContentDoc>(COLLECTION).updateOne(
      { _id: DOC_ID },
      { $set: { data: normalized } },
      { upsert: true }
    )
  );
  return normalized;
}

export async function resetContent(): Promise<SiteContent> {
  const normalized = normalize(defaultContent);
  await getDb().then((db) =>
    db.collection<ContentDoc>(COLLECTION).updateOne(
      { _id: DOC_ID },
      { $set: { data: normalized } },
      { upsert: true }
    )
  );
  return normalized;
}

function normalize(content: SiteContent): SiteContent {
  const merged = deepMerge(defaultContent, content);
  const result = JSON.parse(JSON.stringify(merged)) as SiteContent;
  
  // Ensure all URLs have proper protocol prefix
  if (result.contact?.socials) {
    result.contact.socials = result.contact.socials.map(s => ({
      ...s,
      href: ensureProtocol(s.href)
    }));
  }
  
  return result;
}

function ensureProtocol(url: string): string {
  if (!url) return url;
  // If URL already has protocol, return as-is
  if (url.match(/^https?:\/\//i)) return url;
  // If URL starts with //, add https:
  if (url.startsWith('//')) return `https:${url}`;
  // Otherwise, add https://
  return `https://${url}`;
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