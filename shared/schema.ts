import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ── Users ──────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  role: text("role").notNull().default("user"), // admin, analyst, user
  apiKey: text("api_key"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastLogin: timestamp("last_login"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

export const usernameSchema = z.string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters");

export const insertUserSchemaSecure = z.object({
  username: usernameSchema,
  password: passwordSchema,
  email: z.string().email().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ── Scans ──────────────────────────────────────────────────────────────────────
export const scans = pgTable("scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name").notNull(),
  target: text("target").notNull(),
  type: text("type").notNull(), // vulnerability, recon, full, compliance
  status: text("status").notNull().default("pending"), // pending, running, completed, failed, cancelled
  progress: integer("progress").default(0),
  config: jsonb("config").default({}),
  result: jsonb("result").default({}),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScanSchema = createInsertSchema(scans).pick({
  name: true,
  target: true,
  type: true,
  userId: true,
  config: true,
});

export type InsertScan = z.infer<typeof insertScanSchema>;
export type Scan = typeof scans.$inferSelect;

// ── Findings ───────────────────────────────────────────────────────────────────
export const findings = pgTable("findings", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").references(() => scans.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // critical, high, medium, low, info
  vulnType: text("vuln_type").notNull(), // LFI, RCE, XSS, AFO, SSRF, SQLI, IDOR, etc.
  confidence: integer("confidence").default(0), // 0-10
  cvssScore: doublePrecision("cvss_score").default(0),
  epssScore: doublePrecision("epss_score").default(0),
  evidence: text("evidence"),
  remediation: text("remediation"),
  poc: text("poc"), // proof of concept
  falsePositive: boolean("false_positive").default(false),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFindingSchema = createInsertSchema(findings).pick({
  scanId: true,
  title: true,
  description: true,
  severity: true,
  vulnType: true,
  confidence: true,
  cvssScore: true,
  evidence: true,
  remediation: true,
  poc: true,
});

export type InsertFinding = z.infer<typeof insertFindingSchema>;
export type Finding = typeof findings.$inferSelect;

// ── Reports ────────────────────────────────────────────────────────────────────
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").references(() => scans.id),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  summary: text("summary"),
  content: jsonb("content").default({}),
  format: text("format").default("html"), // html, pdf, json, markdown
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  scanId: true,
  userId: true,
  title: true,
  summary: true,
  content: true,
  format: true,
});

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;

// ── Agent States ───────────────────────────────────────────────────────────────
export const agentStates = pgTable("agent_states", {
  id: serial("id").primaryKey(),
  scanId: integer("scan_id").references(() => scans.id),
  agentType: text("agent_type").notNull(), // recon, vuln, exploit, analysis, report
  status: text("status").notNull().default("idle"), // idle, running, paused, completed, error
  state: jsonb("state").default({}),
  messageLog: jsonb("message_log").default([]),
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AgentState = typeof agentStates.$inferSelect;

// ── Tool Configurations ────────────────────────────────────────────────────────
export const toolConfigs = pgTable("tool_configs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  toolName: text("tool_name").notNull(),
  config: jsonb("config").default({}),
  enabled: boolean("enabled").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type ToolConfig = typeof toolConfigs.$inferSelect;

// ── API Types (not DB tables) ──────────────────────────────────────────────────

export const vulnTypes = ["LFI", "RCE", "XSS", "AFO", "SSRF", "SQLI", "IDOR"] as const;
export type VulnType = typeof vulnTypes[number];

export const severityLevels = ["critical", "high", "medium", "low", "info"] as const;
export type SeverityLevel = typeof severityLevels[number];

export const scanTypes = ["vulnerability", "recon", "full", "compliance"] as const;
export type ScanType = typeof scanTypes[number];

export const agentTypes = ["recon", "vuln", "exploit", "analysis", "report"] as const;
export type AgentType = typeof agentTypes[number];

export interface LLMProviderConfig {
  name: string;
  provider: "gemini" | "openai" | "anthropic" | "ollama";
  apiKey?: string;
  model: string;
  baseUrl?: string;
  priority: number;
  enabled: boolean;
}

export interface ToolDefinition {
  name: string;
  category: string;
  description: string;
  safetyLevel: "safe" | "moderate" | "dangerous";
  command: string;
  options?: Record<string, string>;
  enabled: boolean;
}

export interface NotificationConfig {
  type: "discord" | "slack" | "telegram" | "email" | "webhook";
  enabled: boolean;
  webhookUrl?: string;
  email?: string;
  botToken?: string;
  chatId?: string;
}

export interface RiskScore {
  overall: number;
  cvss: number;
  epss: number;
  businessImpact: number;
  exploitability: number;
  confidence: number;
}

export interface SafetyCheckResult {
  passed: boolean;
  layer: string;
  message: string;
  details?: string;
}

// Scan configuration schema
export const scanConfigSchema = z.object({
  target: z.string().min(1, "Target is required"),
  type: z.enum(scanTypes),
  name: z.string().min(1, "Name is required"),
  vulnTypes: z.array(z.enum(vulnTypes)).optional(),
  agentMode: z.boolean().default(false),
  autoExploit: z.boolean().default(false),
  stealth: z.enum(["1", "2", "3", "4", "5"]).default("3"),
  maxConcurrency: z.number().min(1).max(10).default(3),
  timeout: z.number().min(60).max(3600).default(600),
});

export type ScanConfig = z.infer<typeof scanConfigSchema>;
