
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Terminal, Play, Square } from 'lucide-react';

const TerminalInterface = () => {
  const [currentCommand, setCurrentCommand] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const commands = [
    {
      input: "install mitmproxy",
      outputs: [
        "🔍 Checking if mitmproxy is installed...",
        "❌ Not found. Executing installation via pip.",
        "📦 Installing mitmproxy...",
        "✅ mitmproxy successfully installed!"
      ]
    },
    {
      input: "cari tools brute force instagram",
      outputs: [
        "🔎 Searching GitHub & exploit-db...",
        "📊 Found 3 tools with high ratings",
        "🏆 Top result: instahack-toolkit (⭐ 2.1k stars)",
        "❓ Do you want me to clone and install? [y/n]"
      ]
    },
    {
      input: "upgrade sistem saya sekarang",
      outputs: [
        "⚠️ System upgrade requested",
        "🔍 Checking current packages...",
        "📋 Found 47 packages to update",
        "⚠️ Are you sure? I will update all packages using apt. [y/n]"
      ]
    },
    {
      input: "analyze network traffic",
      outputs: [
        "🌐 Starting network analysis...",
        "📡 Capturing packets on interface eth0",
        "🔍 Detecting 3 active connections",
        "📊 Analysis complete. Suspicious activity detected on port 443"
      ]
    }
  ];

  const runCommand = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setOutput([]);
    
    const command = commands[currentCommand];
    if (!command) return;
    
    // Show command input
    setOutput([`> ${command.input}`]);
    
    // Simulate command execution
    for (let i = 0; i < command.outputs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput(prev => [...prev, command.outputs[i]]);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRunning(false);
    
    // Move to next command
    setTimeout(() => {
      setCurrentCommand((prev) => (prev + 1) % commands.length);
    }, 1000);
  }, [currentCommand, isRunning, commands]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (!isRunning) {
        runCommand();
      }
    }, 8000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentCommand, isRunning, runCommand]);

  return (
    <div className="max-w-4xl mx-auto" role="region" aria-label="CyberShellX Terminal Demo">
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between p-4 bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Terminal className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            <span className="text-white font-semibold">CyberShellX Terminal</span>
            <span className="text-green-400 text-sm" aria-label="Connected">● Connected</span>
          </div>
          <div className="flex items-center space-x-2" aria-hidden="true">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm min-h-[300px]" role="log" aria-live="polite" aria-label="Terminal output">
          <div className="mb-4 text-cyan-400">
            CyberShellX v2.1.0 - Autonomous AI Assistant
          </div>
          <div className="mb-4 text-gray-400">
            Type &apos;help&apos; for available commands or watch the demo below:
          </div>
          
          {/* Command Output */}
          <div className="space-y-2">
            {output.map((line, index) => (
              <div 
                key={index} 
                className={`
                  ${line.startsWith('>') ? 'text-white font-semibold' : ''}
                  ${line.includes('✅') ? 'text-green-400' : ''}
                  ${line.includes('❌') ? 'text-red-400' : ''}
                  ${line.includes('🔍') || line.includes('🔎') ? 'text-blue-400' : ''}
                  ${line.includes('⚠️') ? 'text-yellow-400' : ''}
                  ${line.includes('📦') || line.includes('📊') ? 'text-purple-400' : ''}
                  ${!line.includes('✅') && !line.includes('❌') && !line.includes('🔍') && !line.includes('🔎') && !line.includes('⚠️') && !line.includes('📦') && !line.includes('📊') && !line.startsWith('>') ? 'text-gray-300' : ''}
                `}
              >
                {line}
                {index === output.length - 1 && isRunning && (
                  <span className="animate-pulse text-cyan-400 ml-1" aria-hidden="true">_</span>
                )}
              </div>
            ))}
          </div>

          {/* Status Indicator */}
          {isRunning && (
            <div className="mt-4 flex items-center space-x-2 text-cyan-400" role="status" aria-label="Processing command">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400" aria-hidden="true"></div>
              <span>Processing...</span>
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="text-sm text-gray-400">
              Demo Command {currentCommand + 1} of {commands.length}
            </div>
            <button
              onClick={runCommand}
              disabled={isRunning}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded text-white text-sm font-semibold transition-colors flex items-center space-x-2"
              aria-label={isRunning ? 'Command running' : 'Run next demo command'}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4" aria-hidden="true" />
                  <span>Running</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" aria-hidden="true" />
                  <span>Run Command</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalInterface;
