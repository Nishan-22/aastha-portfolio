import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: string;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

async function ensureFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf8");
  }
}

export async function saveMessage(
  input: Omit<ContactMessage, "id" | "createdAt">
): Promise<ContactMessage> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const messages: ContactMessage[] = JSON.parse(raw);

  const message: ContactMessage = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), "utf8");
  return message;
}

export async function getMessages(): Promise<ContactMessage[]> {
  await ensureFile();
  const raw = await fs.readFile(DATA_FILE, "utf8");
  return JSON.parse(raw) as ContactMessage[];
}
