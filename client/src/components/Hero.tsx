
import React, { useState, useEffect } from 'react';
import { Terminal, Code, Zap } from 'lucide-react';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = "💻 CyberShellX – Autonomous Command Line AI Assistant";

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(fullText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        {/* Main Logo/Icon */}
        <div className="mb-8 relative">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mb-8 animate-pulse">
            <Terminal className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-xl"></div>
        </div>

        {/* Animated Title */}
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 font-mono">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {displayText}
          </span>
          <span className="animate-pulse text-cyan-400">|</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          The terminal that <span className="text-cyan-400 font-semibold">thinks</span>, 
          <span className="text-purple-400 font-semibold"> executes</span>, 
          <span className="text-pink-400 font-semibold"> learns</span>, and 
          <span className="text-yellow-400 font-semibold"> evolves</span>
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300">
            <Code className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Multi-Model AI</h3>
            <p className="text-gray-400 text-sm">OpenRouter, DeepInfra, LM Studio with intelligent fallback</p>
          </div>
          <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Autonomous</h3>
            <p className="text-gray-400 text-sm">Self-upgrading, learning, and adaptive behavior</p>
          </div>
          <div className="p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-pink-500/50 transition-all duration-300">
            <Terminal className="w-8 h-8 text-pink-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Universal</h3>
            <p className="text-gray-400 text-sm">Termux, Linux, VPS, Raspberry Pi, CloudShell</p>
          </div>
        </div>

        {/* CTA */}
        <div className="space-y-4">
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25">
            Experience the Future of CLI
          </button>
          <p className="text-gray-500 text-sm">
            Your second brain in the command line
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
