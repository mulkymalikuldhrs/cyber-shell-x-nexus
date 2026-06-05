import { GoogleGenAI } from "@google/genai";

// ── Types ────────────────────────────────────────────────────────────────────

interface APIConfig {
  key: string;
  name: string;
  client: GoogleGenAI;
}

interface APIStatus {
  total: number;
  current: string;
  available: string[];
}

// ── Gemini API Manager ───────────────────────────────────────────────────────

class GeminiAPIManager {
  private apis: APIConfig[] = [];
  private currentApiIndex = 0;
  private maxRetries = 3;

  constructor() {
    // Initialize API configurations from environment variables only
    const apiKeys = [
      { key: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "", name: "Primary Gemini API" },
      { key: process.env.GOOGLE_API_KEY_2 || "", name: "Secondary Gemini API" },
      { key: process.env.GEMINI_BACKUP_KEY_1 || "", name: "Backup API 1" },
      { key: process.env.GEMINI_BACKUP_KEY_2 || "", name: "Backup API 2" }
    ];

    // Filter out empty keys and initialize clients
    this.apis = apiKeys
      .filter(api => api.key.trim() !== "")
      .map(api => ({
        ...api,
        client: new GoogleGenAI({ apiKey: api.key })
      }));

    console.log(`Initialized ${this.apis.length} Gemini API endpoint(s)`);
  }

  private async tryWithCurrentAPI<T>(operation: (client: GoogleGenAI) => Promise<T>): Promise<T> {
    if (this.apis.length === 0) {
      throw new Error("No valid API keys available. Configure GOOGLE_API_KEY or GEMINI_API_KEY environment variables.");
    }

    const currentApi = this.apis[this.currentApiIndex];
    if (!currentApi) {
      throw new Error("API configuration not found");
    }

    try {
      const result = await operation(currentApi.client);
      console.log(`Successfully used ${currentApi.name}`);
      return result;
    } catch (error) {
      console.warn(`${currentApi.name} failed:`, error);
      throw error;
    }
  }

  private switchToNextAPI(): boolean {
    this.currentApiIndex = (this.currentApiIndex + 1) % this.apis.length;
    return this.currentApiIndex !== 0;
  }

  async executeWithFallback<T>(operation: (client: GoogleGenAI) => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    let attempts = 0;
    const startingIndex = this.currentApiIndex;

    do {
      try {
        return await this.tryWithCurrentAPI(operation);
      } catch (error) {
        lastError = error as Error;
        attempts++;
        
        if (attempts >= this.maxRetries || this.apis.length === 1) {
          break;
        }

        console.log(`Switching to next API (attempt ${attempts}/${this.maxRetries})`);
        this.switchToNextAPI();
        
        if (this.currentApiIndex === startingIndex && attempts > 1) {
          break;
        }
      }
    } while (attempts < this.maxRetries);

    throw new Error(`All Gemini APIs failed after ${attempts} attempts. Last error: ${lastError?.message}`);
  }

  async generateContent(prompt: string): Promise<string> {
    return this.executeWithFallback(async (client) => {
      const response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      return response.text || "No response generated";
    });
  }

  async analyzeSentiment(text: string): Promise<{ rating: number; confidence: number }> {
    return this.executeWithFallback(async (client) => {
      const systemPrompt = `You are a sentiment analysis expert. 
Analyze the sentiment of the text and provide a rating from 1 to 5 stars and a confidence score between 0 and 1.
Respond with JSON in this format: {'rating': number, 'confidence': number}`;

      const response = await client.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              rating: { type: "number" },
              confidence: { type: "number" },
            },
            required: ["rating", "confidence"],
          },
        },
        contents: text,
      });

      const rawJson = response.text;
      if (rawJson) {
        const parsed = JSON.parse(rawJson) as { rating: number; confidence: number };
        return parsed;
      } else {
        throw new Error("Empty response from model");
      }
    });
  }

  getStatus(): APIStatus {
    return {
      total: this.apis.length,
      current: this.apis[this.currentApiIndex]?.name || "None",
      available: this.apis.map(api => api.name)
    };
  }
}

export const geminiAPI = new GeminiAPIManager();
