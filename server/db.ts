import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "@shared/schema";

// ── Database Connection with Fallback ──────────────────────────────────────────
// If DATABASE_URL is not set, we create a null connection that will be
// handled gracefully by the MemStorage fallback in storage.ts

let connection: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  try {
    connection = postgres(process.env.DATABASE_URL);
    _db = drizzle(connection, { schema: { users } });
    console.log('[Database] PostgreSQL connected successfully');
  } catch (err) {
    console.warn('[Database] Failed to connect to PostgreSQL, using in-memory storage:', (err as Error).message);
  }
} else {
  console.warn('[Database] No DATABASE_URL set — using in-memory storage for development');
}

export const db = _db;
export const isDatabaseConnected = () => _db !== null;
