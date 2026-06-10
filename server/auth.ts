// ── Authentication System ──────────────────────────────────────────────────────
// JWT-based authentication with API key management

import jwt from 'jsonwebtoken';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { storage } from './storage';
import type { User } from '@shared/schema';
import { ZodError } from 'zod';

// ── Configuration ──────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'cybershellx-dev-secret-change-in-production';
const JWT_EXPIRY = '24h';
const API_KEY_PREFIX = 'csx_';
const SALT_LENGTH = 16;
const KEY_LENGTH = 64;

// ── Password Utilities ─────────────────────────────────────────────────────────

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const derivedKey = scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, derivedKey] = storedHash.split(':');
    if (!salt || !derivedKey) return false;
    const testKey = scryptSync(password, salt, KEY_LENGTH).toString('hex');
    return timingSafeEqual(Buffer.from(testKey), Buffer.from(derivedKey));
  } catch {
    return false;
  }
}

// ── JWT Utilities ──────────────────────────────────────────────────────────────

export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
}

export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

// ── API Key Management ─────────────────────────────────────────────────────────

export function generateApiKey(): string {
  const key = randomBytes(32).toString('hex');
  return `${API_KEY_PREFIX}${key}`;
}

export function validateApiKey(key: string): boolean {
  return key.startsWith(API_KEY_PREFIX) && key.length > 10;
}

// ── Auth Service ───────────────────────────────────────────────────────────────

export class AuthService {
  /**
   * Register a new user
   */
  async register(username: string, password: string, email?: string): Promise<{ user: User; token: string }> {
    // Check if user exists
    const existing = await storage.getUserByUsername(username);
    if (existing) {
      throw new Error('Username already exists');
    }

    // Create user
    try {
      const user = await storage.createUser({
        username,
        password, // storage.createUser will hash it
        email: email || undefined,
      });

      // Generate JWT
      const token = generateToken(user);
      return { user, token };
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.issues.map(i => i.message).join(', ');
        console.error('[Auth] Zod validation error:', messages);
        throw new Error(messages || 'Validation failed');
      }
      console.error('[Auth] Register create user error:', error);
      throw new Error((error as Error).message || 'Registration failed');
    }
  }

  /**
   * Login a user
   */
  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    const user = await storage.verifyUser(username, password);
    if (!user) {
      throw new Error('Invalid username or password');
    }

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const token = generateToken(user);
    return { user, token };
  }

  /**
   * Validate a JWT token and return the user
   */
  async validateAuth(token: string): Promise<User | null> {
    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await storage.getUser(payload.userId);
    if (!user || !user.isActive) return null;

    return user;
  }

  /**
   * Generate a new API key for a user
   */
  async createApiKey(userId: number): Promise<string> {
    const apiKey = generateApiKey();
    // In production, store this in the database
    // For now, we'll just return it
    return apiKey;
  }
}

export const authService = new AuthService();
