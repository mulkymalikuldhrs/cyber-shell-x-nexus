import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from "@google/genai";

interface APIEndpoint {
  name: string;
  api_key: string;
  model: string;
  max_tokens: number;
  rate_limit: number;
  free_tier?: boolean;
  free_limit?: string;
  local?: boolean;
  speciality?: string;
  cost?: string;
  free_credits?: string;
}

interface APIProvider {
  name: string;
  type: 'gemini' | 'openai';
  enabled: boolean;
  priority: number;
  base_url?: string;
  endpoints: APIEndpoint[];
}

interface APIConfig {
  providers: Record<string, APIProvider>;
  settings: {
    auto_failover: boolean;
    retry_attempts: number;
    retry_delay: number;
    timeout: number;
    log_api_usage: boolean;
    prefer_free_apis: boolean;
    prefer_coding_models: boolean;
    health_check_interval: number;
    rate_limit_buffer: number;
  };
  agent_modes: Record<string, {
    description: string;
    preferred_models: string[];
    system_prompt: string;
  }>;
}

interface ProviderHealth {
  provider: string;
  endpoint: string;
  status: 'healthy' | 'degraded' | 'down';
  last_check: number;
  response_time: number;
  error_count: number;
  success_count: number;
}

class AIProviderManager {
  private config: APIConfig;
  private currentProviderIndex = 0;
  private currentEndpointIndex = 0;
  private providerHealth: Map<string, ProviderHealth> = new Map();
  private rateLimitTracking: Map<string, { count: number; resetTime: number }> = new Map();
  private configPath: string;

  constructor() {
    this.configPath = path.join(process.cwd(), 'config', 'api-config.json');
    this.loadConfig();
    this.initializeProviders();
    this.startHealthCheck();
  }

  private loadConfig(): void {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf8');
      let configContent = configData;
      
      // Replace environment variables
      const envVars = configContent.match(/\$\{([^}]+)\}/g);
      if (envVars) {
        envVars.forEach(envVar => {
          const varName = envVar.slice(2, -1);
          const value = process.env[varName] || '';
          configContent = configContent.replace(envVar, value);
        });
      }
      
      this.config = JSON.parse(configContent);
      console.log(`✅ Loaded API configuration with ${Object.keys(this.config.providers).length} providers`);
    } catch (error) {
      console.error('❌ Failed to load API configuration:', error);
      // Fallback to basic config
      this.config = this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): APIConfig {
    return {
      providers: {
        gemini: {
          name: "Google Gemini",
          type: "gemini",
          enabled: true,
          priority: 1,
          endpoints: [{
            name: "Default Gemini",
            api_key: process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || "",
            model: "gemini-2.5-flash",
            max_tokens: 8192,
            rate_limit: 60
          }]
        }
      },
      settings: {
        auto_failover: true,
        retry_attempts: 3,
        retry_delay: 1000,
        timeout: 30000,
        log_api_usage: true,
        prefer_free_apis: true,
        prefer_coding_models: false,
        health_check_interval: 300000,
        rate_limit_buffer: 0.8
      },
      agent_modes: {
        general: {
          description: "General AI assistant",
          preferred_models: ["general"],
          system_prompt: "You are a helpful AI assistant."
        }
      }
    };
  }

  private initializeProviders(): void {
    let totalEndpoints = 0;
    let enabledProviders = 0;

    for (const [providerId, provider] of Object.entries(this.config.providers)) {
      if (!provider.enabled) continue;
      
      enabledProviders++;
      for (const endpoint of provider.endpoints) {
        if (!endpoint.api_key || endpoint.api_key.trim() === '') continue;
        
        totalEndpoints++;
        const healthKey = `${providerId}-${endpoint.name}`;
        this.providerHealth.set(healthKey, {
          provider: providerId,
          endpoint: endpoint.name,
          status: 'healthy',
          last_check: 0,
          response_time: 0,
          error_count: 0,
          success_count: 0
        });
      }
    }

    console.log(`🚀 Initialized ${enabledProviders} providers with ${totalEndpoints} active endpoints`);
    this.logAvailableApis();
  }

  private logAvailableApis(): void {
    console.log('\n📋 Available AI Providers:');
    
    for (const [providerId, provider] of Object.entries(this.config.providers)) {
      if (!provider.enabled) continue;
      
      console.log(`\n🔹 ${provider.name} (Priority: ${provider.priority})`);
      
      for (const endpoint of provider.endpoints) {
        if (!endpoint.api_key || endpoint.api_key.trim() === '') continue;
        
        const status = endpoint.free_tier ? '🆓 FREE' : '💰 PAID';
        const specialty = endpoint.speciality ? `| ${endpoint.speciality.toUpperCase()}` : '';
        const limit = endpoint.free_limit ? `| Limit: ${endpoint.free_limit}` : '';
        
        console.log(`   ├─ ${endpoint.name} (${endpoint.model}) ${status} ${specialty} ${limit}`);
      }
    }
    console.log('');
  }

  private startHealthCheck(): void {
    if (this.config.settings.health_check_interval > 0) {
      setInterval(() => {
        this.performHealthCheck();
      }, this.config.settings.health_check_interval);
    }
  }

  private async performHealthCheck(): Promise<void> {
    console.log('🔍 Performing health check on all providers...');
    
    for (const [healthKey, health] of this.providerHealth.entries()) {
      try {
        const startTime = Date.now();
        await this.testEndpoint(health.provider, health.endpoint);
        const responseTime = Date.now() - startTime;
        
        health.status = responseTime > 10000 ? 'degraded' : 'healthy';
        health.response_time = responseTime;
        health.success_count++;
        health.last_check = Date.now();
      } catch (error) {
        health.status = 'down';
        health.error_count++;
        health.last_check = Date.now();
        console.warn(`⚠️ Health check failed for ${healthKey}:`, error);
      }
    }
  }

  private async testEndpoint(providerId: string, endpointName: string): Promise<void> {
    const provider = this.config.providers[providerId];
    const endpoint = provider.endpoints.find(e => e.name === endpointName);
    
    if (!endpoint) throw new Error(`Endpoint ${endpointName} not found`);

    if (provider.type === 'gemini') {
      const client = new GoogleGenAI({ apiKey: endpoint.api_key });
      await client.models.generateContent({
        model: endpoint.model,
        contents: "Test connection"
      });
    } else {
      // OpenAI-compatible API test
      const response = await fetch(`${provider.base_url}/models`, {
        headers: {
          'Authorization': `Bearer ${endpoint.api_key}`,
          'Content-Type': 'application/json'
        },
        signal: AbortSignal.timeout(this.config.settings.timeout)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }
  }

  private getNextAvailableEndpoint(mode: string = 'general'): { provider: APIProvider; endpoint: APIEndpoint; key: string } | null {
    const enabledProviders = Object.entries(this.config.providers)
      .filter(([_, provider]) => provider.enabled)
      .sort((a, b) => a[1].priority - b[1].priority);

    // Filter by mode preferences
    const modeConfig = this.config.agent_modes[mode];
    const preferCoding = modeConfig?.preferred_models.includes('coding') || this.config.settings.prefer_coding_models;
    const preferFree = this.config.settings.prefer_free_apis;

    for (const [providerId, provider] of enabledProviders) {
      for (const endpoint of provider.endpoints) {
        if (!endpoint.api_key || endpoint.api_key.trim() === '') continue;
        
        const healthKey = `${providerId}-${endpoint.name}`;
        const health = this.providerHealth.get(healthKey);
        
        if (health && health.status === 'down') continue;
        
        // Check rate limits
        const rateLimitKey = `${providerId}-${endpoint.name}`;
        const rateLimit = this.rateLimitTracking.get(rateLimitKey);
        if (rateLimit && rateLimit.count >= endpoint.rate_limit * this.config.settings.rate_limit_buffer && Date.now() < rateLimit.resetTime) {
          continue;
        }
        
        // Prefer coding models if needed
        if (preferCoding && endpoint.speciality === 'coding') {
          return { provider, endpoint, key: healthKey };
        }
        
        // Prefer free APIs if enabled
        if (preferFree && endpoint.free_tier) {
          return { provider, endpoint, key: healthKey };
        }
        
        // Return first available
        if (!preferCoding || endpoint.speciality !== 'coding') {
          return { provider, endpoint, key: healthKey };
        }
      }
    }

    return null;
  }

  private updateRateLimit(providerId: string, endpointName: string): void {
    const rateLimitKey = `${providerId}-${endpointName}`;
    const current = this.rateLimitTracking.get(rateLimitKey) || { count: 0, resetTime: Date.now() + 60000 };
    
    if (Date.now() > current.resetTime) {
      current.count = 1;
      current.resetTime = Date.now() + 60000;
    } else {
      current.count++;
    }
    
    this.rateLimitTracking.set(rateLimitKey, current);
  }

  async generateContent(prompt: string, mode: string = 'general'): Promise<string> {
    const modeConfig = this.config.agent_modes[mode];
    const systemPrompt = modeConfig?.system_prompt || this.config.agent_modes.general.system_prompt;
    const fullPrompt = systemPrompt + '\n\nUser: ' + prompt;

    let lastError: Error | null = null;
    let attempts = 0;

    while (attempts < this.config.settings.retry_attempts) {
      const available = this.getNextAvailableEndpoint(mode);
      
      if (!available) {
        throw new Error('No available API endpoints');
      }

      const { provider, endpoint, key } = available;

      try {
        let response: string;

        if (provider.type === 'gemini') {
          const client = new GoogleGenAI({ apiKey: endpoint.api_key });
          const result = await client.models.generateContent({
            model: endpoint.model,
            contents: fullPrompt,
          });
          response = result.text || 'No response generated';
        } else {
          // OpenAI-compatible API
          const fetchResponse = await fetch(`${provider.base_url}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${endpoint.api_key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: endpoint.model,
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt }
              ],
              max_tokens: endpoint.max_tokens,
              temperature: 0.7
            }),
            signal: AbortSignal.timeout(this.config.settings.timeout)
          });

          if (!fetchResponse.ok) {
            throw new Error(`HTTP ${fetchResponse.status}: ${fetchResponse.statusText}`);
          }

          const data = await fetchResponse.json();
          response = data.choices?.[0]?.message?.content || 'No response generated';
        }

        // Update success metrics
        const health = this.providerHealth.get(key);
        if (health) {
          health.success_count++;
          health.status = 'healthy';
        }

        this.updateRateLimit(provider.name, endpoint.name);

        if (this.config.settings.log_api_usage) {
          console.log(`✅ Successfully used ${provider.name} - ${endpoint.name} (${endpoint.model})`);
        }

        return response;

      } catch (error) {
        lastError = error as Error;
        attempts++;

        // Update error metrics
        const health = this.providerHealth.get(key);
        if (health) {
          health.error_count++;
          if (health.error_count > 5) {
            health.status = 'degraded';
          }
        }

        console.warn(`❌ ${provider.name} - ${endpoint.name} failed (attempt ${attempts}):`, error);

        if (attempts < this.config.settings.retry_attempts && this.config.settings.auto_failover) {
          console.log(`🔄 Trying next provider in ${this.config.settings.retry_delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, this.config.settings.retry_delay));
        }
      }
    }

    throw new Error(`All providers failed after ${attempts} attempts. Last error: ${lastError?.message}`);
  }

  getStatus(): { 
    total_providers: number; 
    total_endpoints: number;
    healthy_endpoints: number;
    current_config: string;
    health_summary: ProviderHealth[];
    free_apis_available: number;
  } {
    const healthArray = Array.from(this.providerHealth.values());
    const healthyCount = healthArray.filter(h => h.status === 'healthy').length;
    const freeApisCount = Object.values(this.config.providers)
      .flatMap(p => p.endpoints)
      .filter(e => e.free_tier && e.api_key).length;

    return {
      total_providers: Object.keys(this.config.providers).length,
      total_endpoints: healthArray.length,
      healthy_endpoints: healthyCount,
      current_config: this.configPath,
      health_summary: healthArray,
      free_apis_available: freeApisCount
    };
  }

  async reloadConfig(): Promise<void> {
    console.log('🔄 Reloading API configuration...');
    this.loadConfig();
    this.providerHealth.clear();
    this.rateLimitTracking.clear();
    this.initializeProviders();
  }

  getAvailableModes(): Record<string, any> {
    return this.config.agent_modes;
  }

  async addApiKey(providerId: string, endpointName: string, apiKey: string): Promise<void> {
    if (!this.config.providers[providerId]) {
      throw new Error(`Provider ${providerId} not found`);
    }

    const endpoint = this.config.providers[providerId].endpoints.find(e => e.name === endpointName);
    if (!endpoint) {
      throw new Error(`Endpoint ${endpointName} not found in provider ${providerId}`);
    }

    endpoint.api_key = apiKey;
    
    // Save updated config
    const configContent = JSON.stringify(this.config, null, 2);
    fs.writeFileSync(this.configPath, configContent, 'utf8');
    
    console.log(`✅ Updated API key for ${providerId} - ${endpointName}`);
    await this.reloadConfig();
  }
}

export const aiProviderManager = new AIProviderManager();
