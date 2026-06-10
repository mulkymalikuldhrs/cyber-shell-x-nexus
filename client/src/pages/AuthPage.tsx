import React, { useState, useEffect } from 'react';
import { LogIn, User, Lock, AlertCircle, Shield, Eye, EyeOff, CheckCircle, Key, Mail, AtSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';

// Password strength calculator
const getPasswordStrength = (password: string) => {
  if (!password) return { score: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 4) return { score, label: 'Good', color: 'bg-yellow-500' };
  if (score <= 5) return { score, label: 'Strong', color: 'bg-green-500' };
  return { score, label: 'Excellent', color: 'bg-cyan-500' };
};

// Floating particles background
const AnimatedBackground = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
        25% { transform: translateY(-20px) translateX(10px); opacity: 0.6; }
        50% { transform: translateY(-40px) translateX(-5px); opacity: 0.3; }
        75% { transform: translateY(-20px) translateX(-10px); opacity: 0.5; }
      }
      .particle {
        position: absolute;
        border-radius: 50%;
        animation: float linear infinite;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 5,
    color: i % 3 === 0 ? 'rgba(0,255,255,0.4)' : i % 3 === 1 ? 'rgba(168,85,247,0.4)' : 'rgba(255,255,255,0.2)',
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      {/* Particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />
    </div>
  );
};

const AuthPage = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);

  const passwordStrength = getPasswordStrength(registerPassword);

  // Load remembered username
  useEffect(() => {
    try {
      const remembered = localStorage.getItem('csx_remember');
      if (remembered) {
        setLoginUsername(remembered);
        setRememberMe(true);
      }
    } catch {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('csx_token', data.token);
        localStorage.setItem('csx_user', JSON.stringify(data.user));
        if (rememberMe) {
          localStorage.setItem('csx_remember', loginUsername);
        } else {
          localStorage.removeItem('csx_remember');
        }
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Connection error');
    }
    setLoginLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (registerPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (passwordStrength.score <= 2) {
      setError('Password is too weak. Use a stronger password.');
      return;
    }

    setRegisterLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: registerUsername, password: registerPassword, email: registerEmail || undefined }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess('Registration successful! Redirecting...');
        localStorage.setItem('csx_token', data.token);
        localStorage.setItem('csx_user', JSON.stringify(data.user));
        setTimeout(() => window.location.href = '/', 1000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch {
      setError('Connection error');
    }
    setRegisterLoading(false);
  };

  return (
    <div className="min-h-screen text-white flex items-center justify-center px-4 pt-14 relative">
      <AnimatedBackground />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/20 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            CyberShellX Nexus
          </h1>
          <p className="text-gray-400 mt-2 text-sm">Cybersecurity Training & Testing Platform</p>
        </div>

        {error && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/50 backdrop-blur-sm">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-500/10 border-green-500/50 backdrop-blur-sm">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-200">{success}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm shadow-xl shadow-black/20">
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
                      <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        value={loginUsername}
                        onChange={e => setLoginUsername(e.target.value)}
                        placeholder="username"
                        className="bg-gray-900 border-gray-600 pl-10 focus:border-cyan-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={e => setLoginPassword(e.target.value)}
                        placeholder="password"
                        className="bg-gray-900 border-gray-600 pl-10 pr-10 focus:border-cyan-500"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-gray-500 hover:text-gray-300"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">Remember me</Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                    disabled={loginLoading}
                  >
                    {loginLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Signing in...</>
                    ) : (
                      <><LogIn className="w-4 h-4 mr-2" /> Login</>
                    )}
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
                        className="bg-gray-900 border-gray-600 pl-10 focus:border-cyan-500"
                        required
                        minLength={3}
                        maxLength={30}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Email (optional)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type="email"
                        value={registerEmail}
                        onChange={e => setRegisterEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="bg-gray-900 border-gray-600 pl-10 focus:border-cyan-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input
                        type={showRegisterPassword ? 'text' : 'password'}
                        value={registerPassword}
                        onChange={e => setRegisterPassword(e.target.value)}
                        placeholder="password (min 8 chars)"
                        className="bg-gray-900 border-gray-600 pl-10 pr-10 focus:border-cyan-500"
                        required
                        minLength={8}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-gray-500 hover:text-gray-300"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      >
                        {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {registerPassword && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Password Strength</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength.label === 'Weak' ? 'text-red-400' :
                          passwordStrength.label === 'Fair' ? 'text-orange-400' :
                          passwordStrength.label === 'Good' ? 'text-yellow-400' :
                          passwordStrength.label === 'Strong' ? 'text-green-400' : 'text-cyan-400'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 6 }, (_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i < passwordStrength.score ? passwordStrength.color : 'bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        {[
                          { label: '8+ chars', met: registerPassword.length >= 8 },
                          { label: 'Uppercase', met: /[A-Z]/.test(registerPassword) },
                          { label: 'Lowercase', met: /[a-z]/.test(registerPassword) },
                          { label: 'Number', met: /[0-9]/.test(registerPassword) },
                          { label: 'Special', met: /[^a-zA-Z0-9]/.test(registerPassword) },
                        ].map(req => (
                          <span key={req.label} className={`text-[10px] flex items-center gap-0.5 ${req.met ? 'text-green-400' : 'text-gray-600'}`}>
                            {req.met ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-gray-600" />}
                            {req.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={registerLoading}
                  >
                    {registerLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Creating...</>
                    ) : (
                      <><Key className="w-4 h-4 mr-2" /> Create Account</>
                    )}
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
