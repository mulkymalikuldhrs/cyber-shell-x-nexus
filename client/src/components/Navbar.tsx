import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield, Home, Scan, Eye, Bot, Wrench, BarChart3, FileText,
  Settings, LogIn, LogOut, Menu, X, Bell, Zap, ChevronDown
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const navItems = [
  { path: '/', label: 'Dashboard', icon: <Home className="w-4 h-4" /> },
  { path: '/scan', label: 'Scanner', icon: <Scan className="w-4 h-4" /> },
  { path: '/recon', label: 'Recon', icon: <Eye className="w-4 h-4" /> },
  { path: '/agents', label: 'Agents', icon: <Bot className="w-4 h-4" /> },
  { path: '/tools', label: 'Tools', icon: <Wrench className="w-4 h-4" /> },
  { path: '/risk', label: 'Risk', icon: <BarChart3 className="w-4 h-4" /> },
  { path: '/reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
  { path: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('csx_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('csx_token');
    localStorage.removeItem('csx_user');
    setUser(null);
    navigate('/auth');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg shadow-black/20'
        : 'bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/25 transition-all">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent hidden sm:block">
              CSX Nexus
            </span>
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-cyan-500/30 text-cyan-400 hidden md:flex">
              v3.0
            </Badge>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Status indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Online</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-gray-800/50 rounded-md border border-gray-700">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-gray-300">{user.username}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-400 hover:text-red-400">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                  <LogIn className="w-4 h-4 mr-1" /> Login
                </Button>
              </Link>
            )}

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-400"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="lg:hidden bg-gray-900/98 backdrop-blur-md border-b border-gray-700/50">
          <div className="px-4 py-3 space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
