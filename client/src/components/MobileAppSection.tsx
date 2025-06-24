import React from 'react';
import { Smartphone, Download, Mic, Shield, Wifi, Flashlight, Volume2, Settings, Terminal, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const MobileAppSection = () => {
  const features = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Wake Word Detection",
      description: "Always-listening 'Hey CyberShell' activation",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "WiFi Control",
      description: "Turn WiFi on/off, check connection status",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Flashlight className="w-6 h-6" />,
      title: "Flashlight Control",
      description: "Voice-activated flashlight toggle",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Volume2 className="w-6 h-6" />,
      title: "Volume Control",
      description: "Adjust media, ring, alarm volumes",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "System Control",
      description: "Bluetooth, brightness, device info",
      color: "from-gray-500 to-slate-500"
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "Shell Commands",
      description: "Execute system commands via voice",
      color: "from-red-500 to-rose-500"
    }
  ];

  const voiceCommands = [
    "Hey CyberShell, turn on WiFi",
    "Hey CyberShell, flashlight on",
    "Hey CyberShell, set volume to 70",
    "Hey CyberShell, system info",
    "Hey CyberShell, turn on Bluetooth",
    "Hey CyberShell, set brightness to 50"
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-black/50 to-gray-900/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <Smartphone className="w-12 h-12 text-cyan-400" />
            <Brain className="w-12 h-12 text-purple-400" />
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Personal Cyber Assistant
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Replace Google Assistant with CyberShellX - Your voice-activated cybersecurity companion that controls your device and provides security expertise
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* App Features */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              <Shield className="w-6 h-6 inline mr-2 text-cyan-400" />
              Android App Features
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-3`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Download Section */}
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Download className="w-5 h-5 mr-2 text-green-400" />
                  Download & Install
                </CardTitle>
                <CardDescription>
                  Get the CyberShellX Android app with system control capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800/50 p-3 rounded-md">
                  <h5 className="text-white font-medium mb-2">Build from Source:</h5>
                  <div className="space-y-2 text-sm">
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400 block">
                      cd android-assistant
                    </code>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400 block">
                      ./build-apk.sh
                    </code>
                    <code className="bg-black/50 px-2 py-1 rounded text-green-400 block">
                      ./install-apk.sh
                    </code>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-900/50 text-green-300">
                    Android 8.0+
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">
                    Kotlin/Compose
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-900/50 text-purple-300">
                    Always Listening
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Voice Commands Demo */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              <Mic className="w-6 h-6 inline mr-2 text-purple-400" />
              Voice Commands
            </h3>
            
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-6">
              <h4 className="text-white font-semibold mb-4">Try These Commands:</h4>
              <div className="space-y-3">
                {voiceCommands.map((command, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/50 p-3 rounded-md border-l-4 border-cyan-500"
                  >
                    <code className="text-cyan-400 text-sm">"{command}"</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Setup Instructions */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-700">
              <CardHeader>
                <CardTitle className="text-white">🚀 Quick Setup</CardTitle>
                <CardDescription>
                  Replace Google Assistant in 3 steps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-white font-medium">Install APK</p>
                      <p className="text-gray-400 text-sm">Build and install the CyberShellX APK</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white font-medium">Set as Default</p>
                      <p className="text-gray-400 text-sm">Go to Settings → Apps → Default Apps → Assistant</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-white font-medium">Start Using</p>
                      <p className="text-gray-400 text-sm">Say "Hey CyberShell" + your command</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Capabilities Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700">
            <Shield className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Cybersecurity Assistant</h3>
            <p className="text-gray-400 text-sm">
              50+ security tools knowledge, vulnerability guidance, and ethical hacking assistance
            </p>
          </div>
          
          <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700">
            <Settings className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">System Control</h3>
            <p className="text-gray-400 text-sm">
              Complete device management through voice commands - WiFi, Bluetooth, flashlight, volume
            </p>
          </div>
          
          <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700">
            <Brain className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">Always Learning</h3>
            <p className="text-gray-400 text-sm">
              Background service with continuous learning and command pattern recognition
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-gray-700 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Replace Google Assistant?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Experience the power of a cybersecurity-focused voice assistant with complete system control capabilities. 
              Built by security professionals, for security professionals.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.open('https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/tree/main/android-assistant', '_blank')}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
              >
                <Download className="w-4 h-4 mr-2" />
                View Android Code
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus/blob/main/android-assistant/README.md', '_blank')}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                📖 Installation Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;