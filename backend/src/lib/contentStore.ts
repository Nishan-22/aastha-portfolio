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
  return doc.data;
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