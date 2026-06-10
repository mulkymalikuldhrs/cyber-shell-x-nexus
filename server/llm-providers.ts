import { createHash } from 'crypto';
import type { LLMProviderConfig } from '@shared/schema';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  provider: string;
  model: string;
  tokensUsed?: number;
  latencyMs: number;
  cached: boolean;
}

export interface LLMProvider {
  name: string;
  generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<string>;
  isAvailable(): boolean;
  getModel(): string;
}

export interface LLMGenerateOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

// ── Response Cache ─────────────────────────────────────────────────────────────

class ResponseCache {
  private cache = new Map<string, { response: string; timestamp: number }>();
  private maxAge = 30 * 60 * 1000; // 30 minutes
  private maxSize = 500;

  private hashKey(messages: LLMMessage[], model: string): string {
    const data = JSON.stringify({ messages, model });
    return createHash('sha256').update(data).digest('hex');
  }

  get(messages: LLMMessage[], model: string): string | null {
    const key = this.hashKey(messages, model);
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    return entry.response;
  }

  set(messages: LLMMessage[], model: string, response: string): void {
    const key = this.hashKey(messages, model);
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    this.cache.set(key, { response, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// ── Gemini Provider ────────────────────────────────────────────────────────────

class GeminiProvider implements LLMProvider {
  name = 'gemini';
  private apiKey: string;
  private model: string;
  private available = false;

  constructor(config: LLMProviderConfig) {
    this.apiKey = config.apiKey || '';
    this.model = config.model || 'gemini-2.5-flash';
    this.available = !!this.apiKey;
  }

  async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<string> {
    if (!this.available) throw new Error('Gemini API key not configured');

    const { GoogleGenAI } = await import('@google/genai');
    const client = new GoogleGenAI({ apiKey: this.apiKey });

    const systemInstruction = messages.find(m => m.role === 'system')?.content;
    const userMessages = messages.filter(m => m.role !== 'system').map(m => m.content).join('\n');

    const start = Date.now();
    const response = await client.models.generateContent({
      model: this.model,
      contents: userMessages,
      config: {
        systemInstruction: systemInstruction || undefined,
        temperature: options?.temperature,
        maxOutputTokens: options?.maxTokens,
        topP: options?.topP,
      },
    });

    console.log(`[LLM] Gemini response in ${Date.now() - start}ms`);
    return response.text || 'No response generated';
  }

  isAvailable(): boolean {
    return this.available;
  }

  getModel(): string {
    return this.model;
  }
}

// ── OpenAI Provider ────────────────────────────────────────────────────────────

class OpenAIProvider implements LLMProvider {
  name = 'openai';
  private apiKey: string;
  private model: string;
  private baseUrl: string;
  private available = false;

  constructor(config: LLMProviderConfig) {
    this.apiKey = config.apiKey || '';
    this.model = config.model || 'gpt-4o';
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1';
    this.available = !!this.apiKey;
  }

  async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<string> {
    if (!this.available) throw new Error('OpenAI API key not configured');

    const start = Date.now();
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 2000,
        top_p: options?.topP,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${err}`);
    }

    const data = await response.json() as any;
    console.log(`[LLM] OpenAI response in ${Date.now() - start}ms`);
    return data.choices?.[0]?.message?.content || 'No response generated';
  }

  isAvailable(): boolean {
    return this.available;
  }

  getModel(): string {
    return this.model;
  }
}

// ── Anthropic Provider ─────────────────────────────────────────────────────────

class AnthropicProvider implements LLMProvider {
  name = 'anthropic';
  private apiKey: string;
  private model: string;
  private available = false;

  constructor(config: LLMProviderConfig) {
    this.apiKey = config.apiKey || '';
    this.model = config.model || 'claude-sonnet-4-20250514';
    this.available = !!this.apiKey;
  }

  async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<string> {
    if (!this.available) throw new Error('Anthropic API key not configured');

    const systemMsg = messages.find(m => m.role === 'system')?.content || '';
    const chatMessages = messages
      .filter(m => m.role !== 'system')
      .map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content }));

    const start = Date.now();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: options?.maxTokens ?? 2000,
        system: systemMsg,
        messages: chatMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${response.status} - ${err}`);
    }

    const data = await response.json() as any;
    console.log(`[LLM] Anthropic response in ${Date.now() - start}ms`);
    return data.content?.[0]?.text || 'No response generated';
  }

  isAvailable(): boolean {
    return this.available;
  }

  getModel(): string {
    return this.model;
  }
}

// ── Ollama Provider ────────────────────────────────────────────────────────────

class OllamaProvider implements LLMProvider {
  name = 'ollama';
  private baseUrl: string;
  private model: string;
  private available = false;

  constructor(config: LLMProviderConfig) {
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
    this.model = config.model || 'llama3';
    // Check availability on init
    this.checkAvailability();
  }

  private async checkAvailability(): Promise<void> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) });
      this.available = res.ok;
    } catch {
      this.available = false;
    }
  }

  async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<string> {
    await this.checkAvailability();
    if (!this.available) throw new Error('Ollama server not available');

    const start = Date.now();
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages,
        stream: false,
        options: {
          temperature: options?.temperature ?? 0.7,
          top_p: options?.topP,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json() as any;
    console.log(`[LLM] Ollama response in ${Date.now() - start}ms`);
    return data.message?.content || 'No response generated';
  }

  isAvailable(): boolean {
    return this.available;
  }

  getModel(): string {
    return this.model;
  }
}

// ── Provider Registry ──────────────────────────────────────────────────────────

class LLMProviderRegistry {
  private providers: LLMProvider[] = [];
  private cache = new ResponseCache();
  private currentIndex = 0;

  register(provider: LLMProvider): void {
    if (provider.isAvailable()) {
      this.providers.push(provider);
      console.log(`[LLM Registry] Registered ${provider.name} (${provider.getModel()})`);
    }
  }

  async generate(messages: LLMMessage[], options?: LLMGenerateOptions): Promise<LLMResponse> {
    if (this.providers.length === 0) {
      throw new Error('No LLM providers available. Configure API keys in environment variables.');
    }

    // Try cache first
    const firstModel = this.providers[this.currentIndex]?.getModel() || 'unknown';
    const cached = this.cache.get(messages, firstModel);
    if (cached) {
      return {
        content: cached,
        provider: 'cache',
        model: firstModel,
        latencyMs: 0,
        cached: true,
      };
    }

    // Priority-based fallback chain
    const startIndex = this.currentIndex;
    let attempts = 0;

    do {
      const provider = this.providers[this.currentIndex];
      if (provider.isAvailable()) {
        try {
          const start = Date.now();
          const content = await provider.generate(messages, options);
          const latencyMs = Date.now() - start;

          // Cache the response
          this.cache.set(messages, provider.getModel(), content);

          return {
            content,
            provider: provider.name,
            model: provider.getModel(),
            latencyMs,
            cached: false,
          };
        } catch (error) {
          console.warn(`[LLM Registry] ${provider.name} failed:`, (error as Error).message);
          attempts++;
          this.currentIndex = (this.currentIndex + 1) % this.providers.length;
          if (this.currentIndex === startIndex && attempts > 1) break;
        }
      } else {
        this.currentIndex = (this.currentIndex + 1) % this.providers.length;
        if (this.currentIndex === startIndex) break;
      }
    } while (attempts < this.providers.length);

    throw new Error(`All LLM providers failed after ${attempts} attempts`);
  }

  getProviders(): { name: string; model: string; available: boolean }[] {
    return this.providers.map(p => ({
      name: p.name,
      model: p.getModel(),
      available: p.isAvailable(),
    }));
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size();
  }
}

// ── Singleton Registry ─────────────────────────────────────────────────────────

export const llmRegistry = new LLMProviderRegistry();

// Auto-register providers from environment variables
function initializeProviders(): void {
  // Gemini providers (multiple keys for fallback)
  const geminiKeys = [
    process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
    process.env.GOOGLE_API_KEY_2,
    process.env.GEMINI_BACKUP_KEY_1,
    process.env.GEMINI_BACKUP_KEY_2,
  ].filter(Boolean);

  geminiKeys.forEach((key, i) => {
    llmRegistry.register(new GeminiProvider({
      name: `Gemini ${i + 1}`,
      provider: 'gemini',
      apiKey: key!,
      model: i === 0 ? 'gemini-2.5-flash' : 'gemini-2.0-flash-lite',
      priority: i + 1,
      enabled: true,
    }));
  });

  // OpenAI
  if (process.env.OPENAI_API_KEY) {
    llmRegistry.register(new OpenAIProvider({
      name: 'OpenAI',
      provider: 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      priority: geminiKeys.length + 1,
      enabled: true,
    }));
  }

  // Anthropic
  if (process.env.ANTHROPIC_API_KEY) {
    llmRegistry.register(new AnthropicProvider({
      name: 'Anthropic',
      provider: 'anthropic',
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-20250514',
      priority: geminiKeys.length + 2,
      enabled: true,
    }));
  }

  // Ollama (local)
  llmRegistry.register(new OllamaProvider({
    name: 'Ollama',
    provider: 'ollama',
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3',
    priority: 99,
    enabled: true,
  }));

  console.log(`[LLM Registry] Initialized with ${llmRegistry.getProviders().length} provider(s)`);
}

initializeProviders();

// ── Helper: Single prompt generation ──────────────────────────────────────────

export async function generateWithLLM(
  prompt: string,
  systemPrompt?: string,
  options?: LLMGenerateOptions
): Promise<string> {
  const messages: LLMMessage[] = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });
  
  const response = await llmRegistry.generate(messages, options);
  return response.content;
}
