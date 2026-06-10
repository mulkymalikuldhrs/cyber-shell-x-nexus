import React, { useState, useEffect } from 'react';
import { Settings, Key, Bell, Shield, Palette, Server, Save, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';

const SettingsPage = () => {
  const [llmProviders, setLlmProviders] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/llm/providers')
      .then(r => r.json())
      .then(data => setLlmProviders(data.providers || []))
      .catch(() => {});
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-8 h-8 text-gray-400" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-400 to-gray-300 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-400">Configure your CyberShellX Nexus platform</p>
          </div>
        </div>

        {saved && (
          <Alert className="mb-4 bg-green-500/10 border-green-500/50">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">Settings saved successfully</AlertDescription>
          </Alert>
        )}

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
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-gray-400">Model: {provider.model}</p>
                      </div>
                      <Badge variant={provider.available ? 'default' : 'destructive'}>
                        {provider.available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Loading providers...</p>
                )}

                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Add Custom Provider</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-400">Provider</label>
                      <select className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm">
                        <option>OpenAI</option>
                        <option>Anthropic</option>
                        <option>Ollama</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">API Key</label>
                      <Input placeholder="sk-..." className="bg-gray-900 border-gray-600" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Model</label>
                      <Input placeholder="gpt-4o" className="bg-gray-900 border-gray-600" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400">Base URL (optional)</label>
                      <Input placeholder="https://api.openai.com/v1" className="bg-gray-900 border-gray-600" />
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
                {['Discord', 'Slack', 'Telegram', 'Email'].map(channel => (
                  <div key={channel} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{channel}</span>
                      <Switch />
                    </div>
                    <Input
                      placeholder={channel === 'Email' ? 'email@example.com' : 'Webhook URL or Bot Token'}
                      className="bg-gray-800 border-gray-600"
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
              <CardContent className="space-y-4">
                {[
                  { name: 'Guardrails Layer', desc: 'Block dangerous content and destructive commands', default: true },
                  { name: 'Validation Layer', desc: 'Validate input format and target scope', default: true },
                  { name: 'Fact-Check Layer', desc: 'Verify factual claims about targets', default: true },
                  { name: 'Consistency Layer', desc: 'Check for logical inconsistencies', default: true },
                  { name: 'Correction Layer', desc: 'Apply safety corrections and disclaimers', default: true },
                ].map(layer => (
                  <div key={layer.name} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                    <div>
                      <p className="font-medium text-sm">{layer.name}</p>
                      <p className="text-xs text-gray-400">{layer.desc}</p>
                    </div>
                    <Switch defaultChecked={layer.default} />
                  </div>
                ))}
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
                  <Switch />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <p className="font-medium text-sm">Legal notice on all responses</p>
                    <p className="text-xs text-gray-400">Append legal disclaimers to every AI response</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div>
                    <p className="font-medium text-sm">Response caching</p>
                    <p className="text-xs text-gray-400">Cache LLM responses for faster repeated queries</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Max concurrent scans</label>
                  <Input type="number" defaultValue={3} min={1} max={10} className="bg-gray-900 border-gray-600 w-32" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Default scan timeout (seconds)</label>
                  <Input type="number" defaultValue={600} min={60} max={3600} className="bg-gray-900 border-gray-600 w-32" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700">
            <Save className="w-4 h-4 mr-2" /> Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
