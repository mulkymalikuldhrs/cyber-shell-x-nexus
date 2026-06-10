import React, { useState, useEffect } from 'react';
import { Settings, Key, Bell, Shield, Palette, Server, Save, CheckCircle, Database, Cpu, HardDrive, Clock, Globe, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface SettingsConfig {
  llm: {
    providers: any[];
    customProvider: string;
    customApiKey: string;
    customModel: string;
    customBaseUrl: string;
  };
  notifications: {
    discord: { enabled: boolean; webhook: string };
    slack: { enabled: boolean; webhook: string };
    telegram: { enabled: boolean; token: string };
    email: { enabled: boolean; address: string };
  };
  safety: {
    guardrails: boolean;
    validation: boolean;
    factCheck: boolean;
    consistency: boolean;
    correction: boolean;
  };
  general: {
    autoStartScans: boolean;
    legalNotice: boolean;
    responseCaching: boolean;
    maxConcurrentScans: number;
    scanTimeout: number;
  };
}

const defaultSettings: SettingsConfig = {
  llm: { providers: [], customProvider: 'openai', customApiKey: '', customModel: '', customBaseUrl: '' },
  notifications: {
    discord: { enabled: false, webhook: '' },
    slack: { enabled: false, webhook: '' },
    telegram: { enabled: false, token: '' },
    email: { enabled: false, address: '' },
  },
  safety: { guardrails: true, validation: true, factCheck: true, consistency: true, correction: true },
  general: { autoStartScans: false, legalNotice: true, responseCaching: true, maxConcurrentScans: 3, scanTimeout: 600 },
};

const SettingsPage = () => {
  const [llmProviders, setLlmProviders] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState<SettingsConfig>(defaultSettings);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('csx_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig(prev => ({ ...prev, ...parsed }));
      }
    } catch {}

    // Load LLM providers from API
    fetch('/api/llm/providers')
      .then(r => r.json())
      .then(data => {
        setLlmProviders(data.providers || []);
        setConfig(prev => ({
          ...prev,
          llm: { ...prev.llm, providers: data.providers || [] }
        }));
      })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch system info
  useEffect(() => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cores: navigator.hardwareConcurrency || 'N/A',
      memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'N/A',
      online: navigator.onLine,
      screenRes: `${screen.width}x${screen.height}`,
      viewportRes: `${window.innerWidth}x${window.innerHeight}`,
      cookieEnabled: navigator.cookieEnabled,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(performance.now() / 1000),
    };
    setSystemInfo(info);

    // Check DB status
    fetch('/api/dashboard/stats')
      .then(r => r.json())
      .then(data => {
        setDbStatus({
          connected: true,
          totalScans: data.totalScans || 0,
          totalFindings: data.totalFindings || 0,
          providers: data.llmProviders?.length || 0,
        });
      })
      .catch(() => {
        setDbStatus({ connected: false, totalScans: 0, totalFindings: 0, providers: 0 });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    try {
      localStorage.setItem('csx_settings', JSON.stringify(config));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
  };

  const updateNotification = (channel: string, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [channel]: { ...(prev.notifications as any)[channel], [field]: value }
      }
    }));
  };

  const updateSafety = (layer: string, value: boolean) => {
    setConfig(prev => ({
      ...prev,
      safety: { ...prev.safety, [layer]: value }
    }));
  };

  const updateGeneral = (field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      general: { ...prev.general, [field]: value }
    }));
  };

  const toggleApiKeyVisibility = (key: string) => {
    setShowApiKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  const clearAllSettings = () => {
    localStorage.removeItem('csx_settings');
    setConfig(defaultSettings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white pt-14">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg shadow-gray-500/20">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-400 text-sm">Configure your CyberShellX Nexus platform</p>
          </div>
        </div>

        {saved && (
          <Alert className="mb-4 bg-green-500/10 border-green-500/50">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">Settings saved successfully to localStorage</AlertDescription>
          </Alert>
        )}

        {/* System Info Section */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Cpu className="w-5 h-5" /> System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            {systemInfo && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: <Cpu className="w-4 h-4" />, label: 'CPU Cores', value: systemInfo.cores },
                  { icon: <HardDrive className="w-4 h-4" />, label: 'Memory', value: systemInfo.memory },
                  { icon: <Globe className="w-4 h-4" />, label: 'Platform', value: systemInfo.platform },
                  { icon: <Palette className="w-4 h-4" />, label: 'Screen', value: systemInfo.screenRes },
                  { icon: <Clock className="w-4 h-4" />, label: 'Session Uptime', value: formatUptime(systemInfo.uptimeSeconds) },
                  { icon: <Shield className="w-4 h-4" />, label: 'Online', value: systemInfo.online ? 'Yes' : 'No' },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                      {item.icon} {item.label}
                    </div>
                    <div className="text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Status */}
        <Card className="bg-gray-800/50 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Database className="w-5 h-5" /> Database Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dbStatus ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  <div className={`w-3 h-3 rounded-full ${dbStatus.connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  <span className="font-medium text-sm">
                    {dbStatus.connected ? 'Database Connected' : 'Database Unavailable'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50 text-center">
                    <div className="text-xl font-bold text-cyan-400">{dbStatus.totalScans}</div>
                    <div className="text-[10px] text-gray-400">Total Scans</div>
                  </div>
                  <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50 text-center">
                    <div className="text-xl font-bold text-orange-400">{dbStatus.totalFindings}</div>
                    <div className="text-[10px] text-gray-400">Findings</div>
                  </div>
                  <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50 text-center">
                    <div className="text-xl font-bold text-purple-400">{dbStatus.providers}</div>
                    <div className="text-[10px] text-gray-400">LLM Providers</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-4">
                <div className="w-4 h-4 border-2 border-gray-600 border-t-cyan-400 rounded-full animate-spin" />
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="llm">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="llm" className="flex items-center gap-1">
              <Key className="w-4 h-4" /> LLM
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-1">
              <Bell className="w-4 h-4" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-1">
              <Shield className="w-4 h-4" /> Safety
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Server className="w-4 h-4" /> General
            </TabsTrigger>
          </TabsList>

          {/* LLM Settings */}
          <TabsContent value="llm">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">LLM Providers</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure AI model providers for the priority-based fallback chain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {llmProviders.length > 0 ? (
                  llmProviders.map((provider, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-gray-400">Model: {provider.model}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={provider.available ? 'default' : 'destructive'}>
                          {provider.available ? 'Available' : 'Unavailable'}
                        </Badge>
                        {provider.priority && (
                          <Badge variant="outline" className="text-xs">Priority: {provider.priority}</Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">Loading providers...</p>
                )}

                {/* API Key Management */}
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
                    <Key className="w-4 h-4 text-yellow-400" /> API Key Management
                  </h4>
                  {['Google Gemini', 'OpenAI', 'Anthropic'].map(provider => {
                    const key = provider.toLowerCase().replace(' ', '_');
                    return (
                      <div key={provider} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400 w-28 shrink-0">{provider}</span>
                        <div className="flex-1 relative">
                          <Input
                            type={showApiKeys[key] ? 'text' : 'password'}
                            placeholder="sk-... / AIza..."
                            className="bg-gray-900 border-gray-600 pr-10 h-8 text-xs"
                            value={(config.llm as any)[key] || ''}
                            onChange={e => setConfig(prev => ({ ...prev, llm: { ...prev.llm, [key]: e.target.value } }))}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-8 w-8 p-0 text-gray-500 hover:text-gray-300"
                            onClick={() => toggleApiKeyVisibility(key)}
                          >
                            {showApiKeys[key] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Provider */}
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Add Custom Provider</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400">Provider</label>
                      <Select value={config.llm.customProvider} onValueChange={v => setConfig(prev => ({ ...prev, llm: { ...prev.llm, customProvider: v } }))}>
                        <SelectTrigger className="bg-gray-900 border-gray-600">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="anthropic">Anthropic</SelectItem>
                          <SelectItem value="ollama">Ollama</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">API Key</label>
                      <Input
                        placeholder="sk-..."
                        className="bg-gray-900 border-gray-600 h-9"
                        value={config.llm.customApiKey}
                        onChange={e => setConfig(prev => ({ ...prev, llm: { ...prev.llm, customApiKey: e.target.value } }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Model</label>
                      <Input
                        placeholder="gpt-4o"
                        className="bg-gray-900 border-gray-600 h-9"
                        value={config.llm.customModel}
                        onChange={e => setConfig(prev => ({ ...prev, llm: { ...prev.llm, customModel: e.target.value } }))}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Base URL (optional)</label>
                      <Input
                        placeholder="https://api.openai.com/v1"
                        className="bg-gray-900 border-gray-600 h-9"
                        value={config.llm.customBaseUrl}
                        onChange={e => setConfig(prev => ({ ...prev, llm: { ...prev.llm, customBaseUrl: e.target.value } }))}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">Notification Channels</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure webhook integrations for scan alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'discord', label: 'Discord', placeholder: 'Discord Webhook URL' },
                  { key: 'slack', label: 'Slack', placeholder: 'Slack Webhook URL' },
                  { key: 'telegram', label: 'Telegram', placeholder: 'Bot Token' },
                  { key: 'email', label: 'Email', placeholder: 'email@example.com' },
                ].map(channel => (
                  <div key={channel.key} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{channel.label}</span>
                      <Switch
                        checked={(config.notifications as any)[channel.key]?.enabled}
                        onCheckedChange={v => updateNotification(channel.key, 'enabled', v)}
                      />
                    </div>
                    <Input
                      placeholder={channel.placeholder}
                      className="bg-gray-800 border-gray-600"
                      value={(config.notifications as any)[channel.key]?.webhook || (config.notifications as any)[channel.key]?.token || (config.notifications as any)[channel.key]?.address || ''}
                      onChange={e => {
                        const field = channel.key === 'email' ? 'address' : channel.key === 'telegram' ? 'token' : 'webhook';
                        updateNotification(channel.key, field, e.target.value);
                      }}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Settings */}
          <TabsContent value="safety">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">Safety Configuration</CardTitle>
                <CardDescription className="text-gray-400">
                  5-layer safety pipeline settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'guardrails', name: 'Guardrails Layer', desc: 'Block dangerous content and destructive commands' },
                  { key: 'validation', name: 'Validation Layer', desc: 'Validate input format and target scope' },
                  { key: 'factCheck', name: 'Fact-Check Layer', desc: 'Verify factual claims about targets' },
                  { key: 'consistency', name: 'Consistency Layer', desc: 'Check for logical inconsistencies' },
                  { key: 'correction', name: 'Correction Layer', desc: 'Apply safety corrections and disclaimers' },
                ].map((layer, i) => (
                  <div key={layer.key} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        (config.safety as any)[layer.key] ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{layer.name}</p>
                        <p className="text-xs text-gray-400">{layer.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={(config.safety as any)[layer.key]}
                      onCheckedChange={v => updateSafety(layer.key, v)}
                    />
                  </div>
                ))}
                <div className="p-3 bg-gray-900/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Active Layers</span>
                    <span className="text-sm font-bold text-cyan-400">
                      {Object.values(config.safety).filter(Boolean).length}/5
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-green-500 rounded-full transition-all duration-300"
                      style={{ width: `${(Object.values(config.safety).filter(Boolean).length / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <p className="font-medium text-sm">Auto-start scans</p>
                    <p className="text-xs text-gray-400">Automatically begin scanning when target is entered</p>
                  </div>
                  <Switch
                    checked={config.general.autoStartScans}
                    onCheckedChange={v => updateGeneral('autoStartScans', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <p className="font-medium text-sm">Legal notice on all responses</p>
                    <p className="text-xs text-gray-400">Append legal disclaimers to every AI response</p>
                  </div>
                  <Switch
                    checked={config.general.legalNotice}
                    onCheckedChange={v => updateGeneral('legalNotice', v)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <p className="font-medium text-sm">Response caching</p>
                    <p className="text-xs text-gray-400">Cache LLM responses for faster repeated queries</p>
                  </div>
                  <Switch
                    checked={config.general.responseCaching}
                    onCheckedChange={v => updateGeneral('responseCaching', v)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Max concurrent scans</label>
                  <Input
                    type="number"
                    value={config.general.maxConcurrentScans}
                    onChange={e => updateGeneral('maxConcurrentScans', parseInt(e.target.value) || 1)}
                    min={1}
                    max={10}
                    className="bg-gray-900 border-gray-600 w-32"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Default scan timeout (seconds)</label>
                  <Input
                    type="number"
                    value={config.general.scanTimeout}
                    onChange={e => updateGeneral('scanTimeout', parseInt(e.target.value) || 60)}
                    min={60}
                    max={3600}
                    className="bg-gray-900 border-gray-600 w-32"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Button variant="outline" onClick={clearAllSettings} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
            <Trash2 className="w-4 h-4 mr-2" /> Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
