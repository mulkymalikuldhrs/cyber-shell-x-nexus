
import React, { useState } from 'react';
import { Heart, Coffee, Gift, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner';

const DonationSection = () => {
  const [copiedNumber, setCopiedNumber] = useState(false);
  
  // Phone number with hidden format for display
  const hiddenNumber = "+62 853-****-4048";
  
  const ewallets = [
    { name: "GoPay", color: "from-green-500 to-green-600" },
    { name: "OVO", color: "from-purple-500 to-purple-600" },
    { name: "DANA", color: "from-blue-500 to-blue-600" },
    { name: "ShopeePay", color: "from-orange-500 to-red-500" },
    { name: "LinkAja", color: "from-red-500 to-red-600" },
    { name: "SeaBank", color: "from-teal-500 to-cyan-600" }
  ];

  const copyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText("+6285322624048");
      setCopiedNumber(true);
      toast.success("Phone number copied to clipboard!");
      setTimeout(() => setCopiedNumber(false), 2000);
    } catch {
      toast.error("Failed to copy phone number");
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-gray-900/50 to-black/50" aria-label="Support development">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-4">
            Support Development
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            Help keep CyberShellX Nexus free and continuously improving
          </p>
          <div className="flex justify-center items-center space-x-2 text-gray-400">
            <Heart className="w-5 h-5 text-red-400" aria-hidden="true" />
            <span>Made with passion for cybersecurity community</span>
          </div>
        </div>

        {/* Donation Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Quick Donation Card */}
          <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Coffee className="w-8 h-8 text-amber-400" aria-hidden="true" />
                <div>
                  <CardTitle className="text-white">Buy Me a Coffee</CardTitle>
                  <CardDescription>Support ongoing development</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Your support helps maintain servers, develop new features, and keep the project free for everyone.
              </p>
              <div className="bg-gray-800/50 p-3 rounded-md mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Phone: {hiddenNumber}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={copyPhoneNumber}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    aria-label={copiedNumber ? 'Phone number copied' : 'Copy phone number'}
                  >
                    {copiedNumber ? <Check className="w-4 h-4" aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sponsor Card */}
          <Card className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Gift className="w-8 h-8 text-purple-400" aria-hidden="true" />
                <div>
                  <CardTitle className="text-white">Become a Sponsor</CardTitle>
                  <CardDescription>Get recognition and exclusive access</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Sponsors get early access to new features, priority support, and recognition in the project.
              </p>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• Priority bug fixes and feature requests</li>
                <li>• Sponsor badge on GitHub</li>
                <li>• Direct access to developer</li>
                <li>• Custom feature development</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* E-Wallet Options */}
        <div>
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Choose Your Preferred E-Wallet
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ewallets.map((wallet) => (
              <Button
                key={wallet.name}
                onClick={copyPhoneNumber}
                className={`h-20 bg-gradient-to-r ${wallet.color} hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center space-y-2 shadow-lg`}
                aria-label={`Copy phone number for ${wallet.name}`}
              >
                <span className="text-xs font-bold text-white bg-white/20 rounded px-2 py-1">
                  {wallet.name}
                </span>
                <span className="text-white font-medium text-sm">{wallet.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Click on any e-wallet to copy the phone number
            </p>
            <p className="text-gray-500 text-xs mt-2">
              All donations help improve CyberShellX Nexus for the community
            </p>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-gray-700 rounded-lg p-6">
            <h4 className="text-white font-semibold mb-2">🙏 Thank You!</h4>
            <p className="text-gray-300">
              Every contribution, no matter how small, makes a difference in keeping this project alive and growing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonationSection;
