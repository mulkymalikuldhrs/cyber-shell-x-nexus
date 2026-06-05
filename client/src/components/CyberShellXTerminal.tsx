
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Terminal, Send, Power, Wifi, WifiOff, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import LoadingSpinner from './LoadingSpinner';

interface Message {
  id: string;
  type: 'user' | 'ai' | 'system' | 'error' | 'status';
  content: string;
  timestamp: Date;
}

interface WebSocketMessage {
  type: string;
  message?: string;
  command?: string;
  output?: string;
  tools?: string[];
  success?: boolean;
  session_id?: string;
  timestamp?: string;
  [key: string]: unknown;
}

const MAX_MESSAGE_LENGTH = 2000;

const CyberShellXTerminal = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((type: Message['type'], content: string) => {
    const newMessage: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const processCommand = useCallback(async (command: string) => {
    addMessage('user', command);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/command', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Request failed' }));
        addMessage('error', errData.error || `HTTP ${response.status}: ${response.statusText}`);
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        addMessage('ai', data.response);
        
        if (data.legal_notice) {
          addMessage('system', '⚠️ Legal Notice: Use only on systems you own or have explicit permission to test.');
        }
        
        if (data.tools && data.tools.length > 0) {
          addMessage('status', `Tools: ${data.tools.join(', ')} | Difficulty: ${data.difficulty || 'N/A'}`);
        }
      } else {
        addMessage('error', data.error || 'Failed to process command');
      }
    } catch (error) {
      addMessage('error', 'Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage]);

  const connectToServer = useCallback(() => {
    if (ws) {
      ws.close();
    }

    setConnectionStatus('connecting');
    addMessage('system', 'Connecting to CyberShellX server...');

    // Connect to the server's WebSocket endpoint on the same host
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/cybershell`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      setConnected(true);
      setConnectionStatus('connected');
      setWs(websocket);
      addMessage('system', 'Connected to CyberShellX AI server');
    };

    websocket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        switch (data.type) {
          case 'system':
            addMessage('system', data.message ?? 'System message');
            if (data.session_id) {
              setSessionId(data.session_id);
            }
            break;
          case 'chat_response':
            addMessage('ai', data.message ?? '');
            break;
          case 'error':
            addMessage('error', data.message ?? 'Unknown error');
            break;
          case 'status':
            addMessage('status', data.message ?? '');
            break;
          case 'install_result':
            addMessage(data.success ? 'system' : 'error', data.message ?? '');
            break;
          case 'pentest_complete':
            addMessage('system', data.message ?? '');
            break;
          case 'environment_ready':
            addMessage('system', data.message ?? '');
            break;
          case 'command_result':
            addMessage('system', `Command: ${data.command}\nOutput: ${data.output}`);
            break;
          case 'tools_list':
            addMessage('system', `Installed tools: ${(data.tools ?? []).join(', ')}`);
            break;
          default:
            addMessage('system', data.message ?? JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        addMessage('error', 'Error parsing server response');
      }
    };

    websocket.onclose = () => {
      setConnected(false);
      setConnectionStatus('disconnected');
      setWs(null);
      addMessage('system', 'Disconnected from server');
    };

    websocket.onerror = () => {
      addMessage('error', 'Connection error occurred');
      setConnectionStatus('disconnected');
    };
  }, [ws, addMessage]);

  const sendMessage = useCallback(() => {
    if (!ws || !connected || !input.trim()) return;

    const userMessage = input.trim();
    if (userMessage.length > MAX_MESSAGE_LENGTH) {
      addMessage('error', `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`);
      return;
    }

    addMessage('user', userMessage);

    // Parse command and send appropriate message
    if (userMessage.startsWith('install ')) {
      const tool = userMessage.substring(8).trim();
      ws.send(JSON.stringify({
        type: 'install',
        tool
      }));
    } else if (userMessage.startsWith('pentest ')) {
      const parts = userMessage.substring(8).split(' ');
      const target = parts[0];
      const scanType = parts[1] || 'web';
      ws.send(JSON.stringify({
        type: 'pentest',
        target,
        scan_type: scanType
      }));
    } else if (userMessage.startsWith('prepare ')) {
      const environment = userMessage.substring(8).trim();
      ws.send(JSON.stringify({
        type: 'prepare',
        environment
      }));
    } else if (userMessage.startsWith('execute ')) {
      const command = userMessage.substring(8).trim();
      ws.send(JSON.stringify({
        type: 'execute',
        command
      }));
    } else if (userMessage === 'list tools') {
      ws.send(JSON.stringify({
        type: 'get_tools'
      }));
    } else {
      // Default to chat
      ws.send(JSON.stringify({
        type: 'chat',
        command: userMessage
      }));
    }

    setInput('');
  }, [ws, connected, input, addMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const getMessageColor = (type: Message['type']): string => {
    switch (type) {
      case 'user': return 'text-green-400';
      case 'ai': return 'text-cyan-400';
      case 'system': return 'text-blue-400';
      case 'error': return 'text-red-400';
      case 'status': return 'text-yellow-400';
      default: return 'text-gray-300';
    }
  };

  const getMessagePrefix = (type: Message['type']): string => {
    switch (type) {
      case 'user': return '$ ';
      case 'ai': return '🤖 ';
      case 'system': return '⚡ ';
      case 'error': return '❌ ';
      case 'status': return '🔄 ';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4" role="region" aria-label="CyberShellX Live Terminal">
      <Card className="bg-gray-900/95 border-gray-700 text-white">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Terminal className="w-6 h-6 text-cyan-400" aria-hidden="true" />
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                CyberShellX Terminal
              </CardTitle>
              {sessionId && (
                <Badge variant="secondary" className="text-xs">
                  Session: {sessionId.substring(0, 8)}...
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={connected ? "default" : "destructive"}
                className="flex items-center space-x-1"
              >
                {connected ? <Wifi className="w-3 h-3" aria-hidden="true" /> : <WifiOff className="w-3 h-3" aria-hidden="true" />}
                <span>{connectionStatus}</span>
              </Badge>
              <Button
                size="sm"
                variant={connected ? "destructive" : "default"}
                onClick={connected ? () => ws?.close() : connectToServer}
                disabled={connectionStatus === 'connecting'}
                aria-label={connected ? 'Disconnect from server' : 'Connect to server'}
              >
                <Power className="w-4 h-4 mr-1" aria-hidden="true" />
                {connected ? 'Disconnect' : connectionStatus === 'connecting' ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Terminal Output */}
          <ScrollArea className="h-96 w-full p-4 bg-black/50 rounded-lg border border-gray-700">
            <div className="space-y-2 font-mono text-sm" role="log" aria-live="polite" aria-label="Terminal messages">
              {messages.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <p>Connect to CyberShellX server to start</p>
                  <p className="text-xs mt-2">Run: python3 cybershellx_server.py</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className={`${getMessageColor(message.type)}`}>
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-500 text-xs whitespace-nowrap" aria-hidden="true">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="flex-1">
                        <span className="opacity-70" aria-hidden="true">{getMessagePrefix(message.type)}</span>
                        <span className="whitespace-pre-wrap">{message.content}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && <LoadingSpinner size="sm" text="Processing..." className="py-2" />}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Command Input */}
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={connected ? "Enter command or chat message..." : "Connect to server first"}
                disabled={!connected}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-10"
                aria-label="Terminal command input"
                maxLength={MAX_MESSAGE_LENGTH}
              />
              <Terminal className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!connected || !input.trim()}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700"
              aria-label="Send command"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Quick Commands */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Quick commands">
            {[
              { label: 'Help', command: 'help' },
              { label: 'List Tools', command: 'list tools' },
              { label: 'Prepare Pentest', command: 'prepare pentesting' },
              { label: 'Chat with AI', command: 'chat hello' },
            ].map(({ label, command }) => (
              <Button
                key={command}
                size="sm"
                variant="outline"
                onClick={() => setInput(command)}
                disabled={!connected}
                className="text-xs"
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Connection Info */}
          {!connected && (
            <div className="text-center p-4 bg-gray-800/50 rounded-lg border border-gray-700" role="status">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" aria-hidden="true" />
              <h3 className="text-lg font-semibold mb-2">Start CyberShellX Server</h3>
              <p className="text-gray-400 text-sm mb-3">
                To use the terminal interface, first start the Python server:
              </p>
              <div className="bg-black/50 p-2 rounded font-mono text-sm text-green-400 mb-3">
                python3 cybershellx_server.py
              </div>
              <p className="text-xs text-gray-500">
                Make sure you have installed the requirements: pip install -r requirements.txt
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CyberShellXTerminal;
