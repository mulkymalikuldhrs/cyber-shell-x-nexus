import React, { useState } from 'react';
import { LogIn, User, Lock, AlertCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';

const AuthPage = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Login successful!');
        localStorage.setItem('csx_token', data.token);
        localStorage.setItem('csx_user', JSON.stringify(data.user));
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Connection error');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registerPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: registerUsername, password: registerPassword, email: registerEmail || undefined }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Registration successful! You can now log in.');
        localStorage.setItem('csx_token', data.token);
        localStorage.setItem('csx_user', JSON.stringify(data.user));
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Connection error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 mx-auto text-cyan-400 mb-4" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            CyberShellX Nexus
          </h1>
          <p className="text-gray-400 mt-2">Cybersecurity Training & Testing Platform</p>
        </div>

        {error && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/50">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-500/10 border-green-500/50">
            <AlertDescription className="text-green-200">{success}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-gray-800/50 border-gray-700">
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                        placeholder="username"
                        className="bg-gray-900 border-gray-600 pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="password"
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="password"
                        className="bg-gray-900 border-gray-600 pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">
                    <LogIn className="w-4 h-4 mr-2" /> Login
                  </Button>
                </CardContent>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        value={registerUsername}
                        onChange={e => setRegisterUsername(e.target.value)}
                        placeholder="username (3-30 chars)"
                        className="bg-gray-900 border-gray-600 pl-10"
                        required
                        minLength={3}
                        maxLength={30}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Email (optional)</label>
                    <Input
                      type="email"
                      value={registerEmail}
                      onChange={e => setRegisterEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="bg-gray-900 border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Password (min 8 chars)</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="password"
                        value={registerPassword}
                        onChange={e => setRegisterPassword(e.target.value)}
                        placeholder="password"
                        className="bg-gray-900 border-gray-600 pl-10"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    Create Account
                  </Button>
                </CardContent>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-gray-500 text-xs mt-4">
          ⚠️ For educational and authorized testing purposes only
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
