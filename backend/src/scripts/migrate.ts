import "dotenv/config";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { SiteContent } from "../lib/contentTypes.js";
import { getDb } from "../lib/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

interface ContentDoc {
  _id: string;
  data: SiteContent;
}

async function main(): Promise<void> {
  const db = await getDb();

  try {
    await fs.access(CONTENT_FILE);
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const content = JSON.parse(raw) as SiteContent;
    await db
      .collection<ContentDoc>("content")
      .updateOne({ _id: "site" }, { $set: { data: content } }, { upsert: true });
    console.log(`Migrated ${CONTENT_FILE} → content collection`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("No content.json found, skipping content migration.");
    } else {
      throw err;
    }
  }

  try {
    await fs.access(MESSAGES_FILE);
    const raw = await fs.readFile(MESSAGES_FILE, "utf8");
    const messages = JSON.parse(raw) as Array<Record<string, unknown>>;
    if (messages.length > 0) {
      await db.collection("messages").insertMany(messages);
      console.log(`Migrated ${messages.length} message(s) → messages collection`);
    } else {
      console.log("messages.json is empty, skipping.");
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      console.log("No messages.json found, skipping messages migration.");
    } else {
      throw err;
    }
  }

  await db.client.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});