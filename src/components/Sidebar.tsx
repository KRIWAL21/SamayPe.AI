'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, CalendarDays, Flame, BarChart3, Zap, Sparkles, Users, UserCog, ShieldCheck, LogOut, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

const navSections = [
  {
    title: 'MY WORKSPACE',
    items: [
      { name: 'Dashboard & Inbox', href: '/', icon: LayoutDashboard, badge: 'Active' },
      { name: 'AI Coach (Super Agent)', href: '/chat', icon: MessageSquare, badge: 'AI 2.5' },
      { name: 'Goal Decomposer', href: '/create-plan', icon: Sparkles },
    ]
  },
  {
    title: 'SCHEDULE & VIEWS',
    items: [
      { name: 'Upcoming Calendar', href: '/calendar', icon: CalendarDays },
      { name: 'Habits & Velocity', href: '/habits', icon: Flame },
      { name: 'Reporting & Insights', href: '/insights', icon: BarChart3 },
    ]
  },
  {
    title: 'SUPER AGENTS & CHANNELS',
    items: [
      { name: 'Community Hub', href: '/community', icon: Users },
      { name: 'Agent Preferences', href: '/profile-setup', icon: UserCog },
    ]
  }
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

  if (pathname === '/login' && !authUser) {
    return null;
  }

  return (
    <>
      {/* Desktop ClickUp x Todoist Hybrid Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 glass-panel border-r border-gray-800 z-50 select-none">
        <div className="flex flex-col flex-1 min-h-0 p-5 space-y-5">
          
          {/* Workspace Switcher Header (ClickUp Style) */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/40 transition-all cursor-pointer">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-white text-base shadow-md flex-shrink-0">
                ⚡
              </div>
              <div className="min-w-0">
                <div className="text-xs font-extrabold text-white truncate flex items-center space-x-1.5">
                  <span>{authUser?.name ? `${authUser.name.split(' ')[0]}'s Workspace` : "Creator Workspace"}</span>
                </div>
                <div className="text-[10px] font-mono text-purple-300 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>Pro AI Guardian</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-gray-400">⌘K</div>
          </div>

          {/* Primary Action Button (+ Add Task / Goal - Todoist Style) */}
          <Link href="/create-plan">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
              <span>+ Create AI Commitment</span>
            </motion.div>
          </Link>

          {/* Grouped Navigation Sections */}
          <nav className="flex-1 space-y-6 overflow-y-auto pr-1 scrollbar-none">
            {navSections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1.5">
                <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3">
                  {sec.title}
                </div>
                {sec.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <motion.div
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all font-semibold text-xs relative ${
                          isActive 
                            ? 'text-white bg-purple-600/25 border border-purple-500/40 shadow-sm shadow-purple-900/30' 
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 truncate">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isActive ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Profile & Theme Footer */}
          <div className="pt-4 border-t border-gray-800/80 space-y-3">
            <ThemeToggle />
            {authUser ? (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-sm flex-shrink-0 font-bold text-white">
                    {authUser.avatar || authUser.name?.[0] || '⚡'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate flex items-center space-x-1">
                      <span>{authUser.name}</span>
                      {authUser.isDemo && <Award className="w-3 h-3 text-yellow-400 flex-shrink-0 inline" />}
                    </div>
                    <div className="text-[10px] text-purple-300 truncate">Vibe2Ship Finalist</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition-colors flex-shrink-0 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </aside>

      {/* Mobile Top Header Bar with ClickUp Profile Branding */}
      <div className="md:hidden fixed top-0 inset-x-0 glass-panel border-b border-gray-800 z-50 px-4 py-2.5 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-black text-white text-sm">
            ⚡
          </div>
          <span className="font-extrabold text-white text-sm tracking-tight">SamayPe<span className="text-purple-400">.AI</span> Workspace</span>
        </Link>

        <div className="flex items-center space-x-2">
          {authUser ? (
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl pl-2.5 pr-1 py-1">
              <span className="text-xs font-bold text-gray-200 max-w-[80px] truncate">{authUser.name}</span>
              <button
                onClick={handleLogout}
                className="p-1 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition-all cursor-pointer flex items-center justify-center"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 inset-x-0 glass-panel border-t border-gray-800 z-50 px-3 py-2 flex justify-around items-center">
        {[
          { name: 'Dashboard', href: '/', icon: LayoutDashboard },
          { name: 'AI Coach', href: '/chat', icon: MessageSquare },
          { name: 'New Goal', href: '/create-plan', icon: Sparkles },
          { name: 'Schedule', href: '/calendar', icon: CalendarDays },
          { name: 'Habits', href: '/habits', icon: Flame },
        ].map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center">
              <div className={`p-2 rounded-xl ${isActive ? 'bg-purple-600/25 text-purple-400 border border-purple-500/30' : 'text-gray-400'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-medium mt-1 ${isActive ? 'text-purple-300 font-bold' : 'text-gray-500'}`}>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
