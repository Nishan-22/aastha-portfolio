import { getDb } from "./db.js";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: string;
}

const COLLECTION = "messages";

export async function saveMessage(
  input: Omit<ContactMessage, "id" | "createdAt">
): Promise<ContactMessage> {
  const message: ContactMessage = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  await getDb().then((db) =>
    db.collection<ContactMessage>(COLLECTION).insertOne(message)
  );
  return message;
}

export async function getMessages(): Promise<ContactMessage[]> {
  const db = await getDb();
  return db
    .collection<ContactMessage>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}