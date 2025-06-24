import React from 'react';
import { Github, GitFork, Star, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const GitHubSection = () => {
  const repoUrl = "https://github.com/mulkymalikuldhrs/cyber-shell-x-nexus";
  
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Open Source & Free
          </h2>
          <p className="text-xl text-gray-300">
            Clone, customize, and contribute to CyberShellX Nexus
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* GitHub Repository Card */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Github className="w-8 h-8 text-white" />
                <div>
                  <CardTitle className="text-white">GitHub Repository</CardTitle>
                  <CardDescription>cyber-shell-x-nexus</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Full source code, documentation, and community contributions
              </p>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  onClick={() => window.open(repoUrl, '_blank')}
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Repository
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open(`${repoUrl}/fork`, '_blank')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <GitFork className="w-4 h-4 mr-2" />
                  Fork
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => window.open(`${repoUrl}/stargazers`, '_blank')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Star
                </Button>
              </div>

              <div className="bg-gray-800/50 p-3 rounded-md">
                <code className="text-green-400 text-sm">
                  git clone {repoUrl}.git
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Quick Setup Card */}
          <Card className="bg-gray-900/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Download className="w-8 h-8 text-cyan-400" />
                <div>
                  <CardTitle className="text-white">Quick Setup</CardTitle>
                  <CardDescription>Get started in minutes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="text-white font-medium mb-1">1. Clone Repository</h4>
                  <div className="bg-gray-800/50 p-2 rounded text-sm">
                    <code className="text-gray-300">git clone {repoUrl}.git</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-1">2. Install Dependencies</h4>
                  <div className="bg-gray-800/50 p-2 rounded text-sm">
                    <code className="text-gray-300">npm install</code>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-1">3. Start Development</h4>
                  <div className="bg-gray-800/50 p-2 rounded text-sm">
                    <code className="text-gray-300">npm run dev</code>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={() => window.open(`${repoUrl}/blob/main/README.md`, '_blank')}
                  className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500"
                >
                  📖 Read Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-2">🛡️ Security Tools</h3>
            <p className="text-gray-400 text-sm">50+ cybersecurity tools with AI guidance</p>
          </div>
          
          <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-2">📱 Mobile App</h3>
            <p className="text-gray-400 text-sm">Android voice assistant with wake word</p>
          </div>
          
          <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-2">☁️ Cloud Sync</h3>
            <p className="text-gray-400 text-sm">Cross-device synchronization and backup</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubSection;