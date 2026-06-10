import { eq } from "drizzle-orm";
import { db, isDatabaseConnected } from "./db";
import { users, type User, type InsertUser, insertUserSchemaSecure } from "@shared/schema";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// ── Password Hashing Utilities ──────────────────────────────────────────────

const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${derivedKey}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, derivedKey] = storedHash.split(':');
    if (!salt || !derivedKey) return false;
    const testKey = scryptSync(password, salt, KEY_LENGTH).toString('hex');
    // Use timing-safe comparison to prevent timing attacks
    return timingSafeEqual(Buffer.from(testKey), Buffer.from(derivedKey));
  } catch {
    return false;
  }
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyUser(username: string, password: string): Promise<User | null>;
}

// ── In-Memory Storage (fallback when no database) ──────────────────────────

class MemStorage implements IStorage {
  private userStore: Map<number, User> = new Map();
  private nextId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.userStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    for (const user of this.userStore.values()) {
      if (user.username === username) return user;
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const validated = insertUserSchemaSafe.parse(insertUser);
    const hashedPassword = hashPassword(validated.password);
    const user: User = {
      id: this.nextId++,
      username: validated.username,
      password: hashedPassword,
      email: validated.email || null,
      role: 'user',
      apiKey: null,
      createdAt: new Date(),
      lastLogin: null,
      isActive: true,
    };
    this.userStore.set(user.id, user);
    return user;
  }

  async verifyUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    if (verifyPassword(password, user.password)) {
      return user;
    }
    return null;
  }
}

// Simpler schema for in-memory that doesn't require DB validation
import { z } from "zod";
const insertUserSchemaSafe = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  email: z.string().email().optional().or(z.literal('')),
});

// ── Database Storage ──────────────────────────────────────────────────────

class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    if (!db) throw new Error('Database not connected');
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error('Database not connected');
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error('Database not connected');
    // Validate input with secure schema
    const validated = insertUserSchemaSecure.parse(insertUser);
    
    // Hash the password before storing
    const hashedPassword = hashPassword(validated.password);
    
    const result = await db.insert(users).values({
      username: validated.username,
      password: hashedPassword,
    }).returning();
    
    if (!result[0]) {
      throw new Error("Failed to create user: no row returned");
    }
    return result[0];
  }

  async verifyUser(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    
    if (verifyPassword(password, user.password)) {
      return user;
    }
    return null;
  }
}

// ── Export: Use DB storage if connected, otherwise in-memory ──────────────

export const storage: IStorage = isDatabaseConnected() 
  ? new DatabaseStorage() 
  : new MemStorage();

console.log(`[Storage] Using ${isDatabaseConnected() ? 'PostgreSQL' : 'in-memory'} storage`);
