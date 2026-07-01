'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, CalendarDays, Flame, BarChart3, Zap, Sparkles, Users, UserCog, ShieldCheck, LogOut, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'AI Coach', href: '/chat', icon: MessageSquare },
  { name: 'Plan Builder', href: '/create-plan', icon: Sparkles },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Schedule', href: '/calendar', icon: CalendarDays },
  { name: 'Habits', href: '/habits', icon: Flame },
  { name: 'Insights', href: '/insights', icon: BarChart3 },
  { name: 'AI Setup', href: '/profile-setup', icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [authUser, setAuthUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const stored = localStorage.getItem('samaype_auth_user');
      if (stored) {
        try {
          setAuthUser(JSON.parse(stored));
        } catch (e) {
          setAuthUser(null);
        }
      } else {
        setAuthUser(null);
        if (pathname !== '/login') {
          router.push('/login');
        }
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('samaype_auth_user');
    setAuthUser(null);
    router.push('/login');
  };

  // If on login page and not logged in, hide full navigation sidebar
  if (pathname === '/login' && !authUser) {
    return null;
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 glass-panel border-r border-gray-800 z-50">
        <div className="flex flex-col flex-1 min-h-0 p-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 pb-6 border-b border-gray-800/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Zap className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">SamayPe<span className="text-purple-400">.AI</span></h1>
              <p className="text-xs text-gray-400 font-medium">Deadline Guardian</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 space-y-1.5 mt-6 overflow-y-auto pr-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all font-medium text-sm relative ${
                      isActive 
                        ? 'text-white bg-purple-600/20 border border-purple-500/30 shadow-lg shadow-purple-900/20' 
                        : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="activeIndicator" 
                        className="absolute right-3 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="mt-auto pt-4 border-t border-gray-800/60 space-y-3">
            <ThemeToggle />
            {authUser ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-black border border-purple-500/30 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-lg flex-shrink-0">
                    {authUser.avatar || '⚡'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center space-x-1">
                      <span>{authUser.name}</span>
                      {authUser.isDemo && <Award className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 inline" />}
                    </div>
                    <div className="text-[10px] text-purple-300 truncate">{authUser.role || 'Pro Creator'}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors flex-shrink-0"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 mt-auto">
              <div className="flex items-center space-x-2 text-purple-300 font-semibold text-xs uppercase tracking-wider">
                <span>🏆 Vibe2Ship 2026</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Autonomous Agentic Mode Active</p>
            </div>
          )}
          </div>
        </div>
      </aside>

      {/* Mobile Top Header Bar with Profile & Logout */}
      <div className="md:hidden fixed top-0 inset-x-0 glass-panel border-b border-gray-800 z-50 px-4 py-2.5 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-white text-base shadow-[0_0_15px_rgba(157,78,221,0.5)]">
            ⚡
          </div>
          <span className="font-extrabold text-white text-base tracking-tight">SamayPe<span className="text-purple-400">.AI</span></span>
        </Link>

        <div className="flex items-center space-x-2">
          {authUser ? (
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl pl-2.5 pr-1 py-1">
              <span className="text-xs font-bold text-gray-200 max-w-[90px] truncate">{authUser.name}</span>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition-all cursor-pointer flex items-center justify-center"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="text-xs font-bold text-purple-400 bg-purple-950/40 border border-purple-500/30 px-3 py-1.5 rounded-xl">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 glass-panel border-t border-gray-800 z-50 px-3 py-2 flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center">
              <div className={`p-2 rounded-xl ${isActive ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-purple-300' : 'text-gray-500'}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
