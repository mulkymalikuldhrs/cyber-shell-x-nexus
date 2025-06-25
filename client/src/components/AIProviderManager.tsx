import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RefreshCw, Plus, Send, Settings, Activity, Code, Shield, Brain } from 'lucide-react';

interface APIStatus {
  total_providers: number;
  total_endpoints: number;
  healthy_endpoints: number;
  current_config: string;
  health_summary: {
    provider: string;
    endpoint: string;
    status: 'healthy' | 'degraded' | 'down';
    last_check: number;
    response_time: number;
    error_count: number;
    success_count: number;
  }[];
  free_apis_available: number;
}

interface AgentCapabilities {
  programming: boolean;
  file_operations: boolean;
  system_commands: boolean;
  web_requests: boolean;
  code_execution: boolean;
  cybersecurity: boolean;
}

interface AgentTask {
  id: string;
  description: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  created_at: string;
  updated_at: string;
}

export default function AIProviderManager() {
  const [apiStatus, setApiStatus] = useState<APIStatus | null>(null);
  const [capabilities, setCapabilities] = useState<AgentCapabilities | null>(null);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedMode, setSelectedMode] = useState('general');
  const [response, setResponse] = useState('');
  const [newApiKey, setNewApiKey] = useState({ provider: '', endpoint: '', key: '' });

  const modes = {
    general: { icon: Brain, name: 'General', color: 'bg-blue-500' },
    programming: { icon: Code, name: 'Programming', color: 'bg-green-500' },
    cybersecurity: { icon: Shield, name: 'Cybersecurity', color: 'bg-red-500' }
  };

  useEffect(() => {
    fetchAPIStatus();
    fetchCapabilities();
    fetchTasks();
  }, []);

  const fetchAPIStatus = async () => {
    try {
      const response = await fetch('/api/ai/status');
      if (response.ok) {
        const data = await response.json();
        setApiStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch API status:', error);
    }
  };

  const fetchCapabilities = async () => {
    try {
      const response = await fetch('/api/agent/capabilities');
      if (response.ok) {
        const data = await response.json();
        setCapabilities(data);
      }
    } catch (error) {
      console.error('Failed to fetch capabilities:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/agent/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const reloadConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/reload', { method: 'POST' });
      if (response.ok) {
        await fetchAPIStatus();
        setResponse('✅ Configuration reloaded successfully');
      } else {
        setResponse('❌ Failed to reload configuration');
      }
    } catch (error) {
      setResponse('❌ Error reloading configuration');
    }
    setLoading(false);
  };

  const addApiKey = async () => {
    if (!newApiKey.provider || !newApiKey.endpoint || !newApiKey.key) {
      setResponse('❌ Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: newApiKey.provider,
          endpoint: newApiKey.endpoint,
          apiKey: newApiKey.key
        })
      });
      
      if (response.ok) {
        setResponse('✅ API key added successfully');
        setNewApiKey({ provider: '', endpoint: '', key: '' });
        await fetchAPIStatus();
      } else {
        const error = await response.json();
        setResponse(`❌ ${error.error}`);
      }
    } catch (error) {
      setResponse('❌ Error adding API key');
    }
    setLoading(false);
  };

  const processRequest = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setResponse('🤖 Processing request...');

    try {
      const response = await fetch('/api/agent/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request: userInput, mode: selectedMode })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          let result = `🤖 AI Agent Response (${selectedMode} mode):\n\n${data.data}`;
          
          if (data.code) {
            result += `\n\n💻 Generated Code (${data.language || 'text'}):\n\`\`\`${data.language || ''}\n${data.code}\n\`\`\``;
          }
          
          if (data.files_created && data.files_created.length > 0) {
            result += `\n\n📁 Files Created: ${data.files_created.join(', ')}`;
          }
          
          if (data.files_modified && data.files_modified.length > 0) {
            result += `\n\n📝 Files Modified: ${data.files_modified.join(', ')}`;
          }
          
          if (data.commands_executed && data.commands_executed.length > 0) {
            result += `\n\n⚡ Commands Executed: ${data.commands_executed.join(', ')}`;
          }
          
          setResponse(result);
        } else {
          setResponse(`❌ Error: ${data.message}`);
        }
      } else {
        const error = await response.json();
        setResponse(`❌ Error: ${error.message}`);
      }
    } catch (error) {
      setResponse('❌ Failed to process request');
    }
    
    setLoading(false);
    await fetchTasks();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '🔄';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🤖 AI Agent Control Center
        </h1>
        <p className="text-gray-600">Advanced AI assistant with multi-provider support and programming capabilities</p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Status
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>AI Agent Chat Interface</span>
                <div className="flex items-center gap-2">
                  {Object.entries(modes).map(([key, mode]) => {
                    const Icon = mode.icon;
                    return (
                      <Button
                        key={key}
                        variant={selectedMode === key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedMode(key)}
                        className={selectedMode === key ? mode.color : ''}
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {mode.name}
                      </Button>
                    );
                  })}
                </div>
              </CardTitle>
              <CardDescription>
                Interact with the AI agent. Switch modes for specialized assistance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="user-input">Your Request</Label>
                <Textarea
                  id="user-input"
                  placeholder="Ask the AI agent to help you with programming, cybersecurity, or general tasks..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={processRequest} 
                disabled={loading || !userInput.trim()}
                className="w-full"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Process Request
              </Button>

              {response && (
                <Alert>
                  <AlertDescription className="whitespace-pre-wrap font-mono text-sm">
                    {response}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {apiStatus?.total_providers || 0}
                </div>
                <div className="text-sm text-gray-600">Total Providers</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {apiStatus?.healthy_endpoints || 0}
                </div>
                <div className="text-sm text-gray-600">Healthy Endpoints</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {apiStatus?.free_apis_available || 0}
                </div>
                <div className="text-sm text-gray-600">Free APIs</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {selectedMode}
                </div>
                <div className="text-sm text-gray-600">Current Mode</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Provider Health Status
                <Button onClick={fetchAPIStatus} size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {apiStatus?.health_summary?.map((health, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        health.status === 'healthy' ? 'bg-green-500' :
                        health.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium">{health.provider}</span>
                      <span className="text-sm text-gray-600">- {health.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusColor(health.status)}>
                        {health.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {health.response_time}ms
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {capabilities && (
            <Card>
              <CardHeader>
                <CardTitle>Agent Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(capabilities).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-sm capitalize">{key.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent AI Agent Tasks
                <Button onClick={fetchTasks} size="sm">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent tasks</p>
                ) : (
                  tasks.slice(-10).reverse().map((task) => (
                    <div key={task.id} className="p-3 border rounded space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{getTaskStatusIcon(task.status)}</span>
                          <span className="font-medium">{task.type}</span>
                          <Badge variant="outline">{task.status}</Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(task.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      {task.error && (
                        <p className="text-sm text-red-600">Error: {task.error}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Management</CardTitle>
              <CardDescription>
                Reload AI configuration and manage API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={reloadConfig} disabled={loading}>
                {loading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Reload Configuration
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add API Key</CardTitle>
              <CardDescription>
                Add new API keys for additional providers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select value={newApiKey.provider} onValueChange={(value) => setNewApiKey({...newApiKey, provider: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="groq">Groq</SelectItem>
                      <SelectItem value="huggingface">Hugging Face</SelectItem>
                      <SelectItem value="openrouter">OpenRouter</SelectItem>
                      <SelectItem value="together">Together AI</SelectItem>
                      <SelectItem value="deepinfra">DeepInfra</SelectItem>
                      <SelectItem value="gemini">Gemini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endpoint">Endpoint Name</Label>
                  <Input
                    id="endpoint"
                    placeholder="e.g., Primary Groq"
                    value={newApiKey.endpoint}
                    onChange={(e) => setNewApiKey({...newApiKey, endpoint: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter API key"
                  value={newApiKey.key}
                  onChange={(e) => setNewApiKey({...newApiKey, key: e.target.value})}
                />
              </div>
              
              <Button onClick={addApiKey} disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Add API Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
