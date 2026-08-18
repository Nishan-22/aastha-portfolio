import { MongoClient, type Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017";
const DB_NAME = process.env.MONGODB_DB ?? "aastha_portfolio";

let client: MongoClient | undefined;
let dbPromise: Promise<Db> | undefined;

export function getDb(): Promise<Db> {
  if (!dbPromise) {
    dbPromise = (async () => {
      client = new MongoClient(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
      await client.connect();
      return client.db(DB_NAME);
    })();
  }
  return dbPromise;
}