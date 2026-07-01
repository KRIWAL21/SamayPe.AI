'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MessageSquare, CalendarDays, Flame, BarChart3, Zap, Sparkles, Users, UserCog, ShieldCheck, LogOut, Award, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';

const navSections = [
  {
    title: 'MY WORKSPACE',
    items: [
      { name: 'Dashboard Overview', href: '/', icon: LayoutDashboard, badge: 'Live' },
      { name: 'Execution Inbox', href: '/inbox', icon: Inbox, badge: 'Tasks' },
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
      { name: 'My Profile & Avatar', href: '/profile', icon: UserCog, badge: 'Edit' },
      { name: 'Agent Preferences', href: '/profile-setup', icon: Sparkles },
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
                  <span>SamayPe.AI Workspace</span>
                </div>
                <div className="text-[10px] font-mono text-purple-300 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span>Pro AI Guardian</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded text-gray-400">⌘K</div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto space-y-5 pr-1 no-scrollbar">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-2 text-[10px] font-mono font-bold tracking-wider text-gray-500">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                            isActive ? 'bg-purple-500/30 text-purple-200 font-bold' : 'bg-white/10 text-gray-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Profile & Theme Footer */}
          <div className="pt-4 border-t border-gray-800/80 space-y-3">
            <ThemeToggle />
            {authUser ? (
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-purple-500/40 transition-all">
                <Link href="/profile" className="flex items-center space-x-2.5 overflow-hidden flex-1 cursor-pointer group" title="Click to view & edit profile">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-sm flex-shrink-0 font-bold text-white overflow-hidden group-hover:scale-105 transition-transform">
                    {authUser.avatar && authUser.avatar.startsWith('http') ? (
                      <img src={authUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      authUser.avatar || authUser.name?.[0] || '⚡'
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate flex items-center space-x-1 group-hover:text-purple-300 transition-colors">
                      <span>{authUser.name}</span>
                      {authUser.isDemo && <Award className="w-3 h-3 text-yellow-400 flex-shrink-0 inline" />}
                    </div>
                    <div className="text-[10px] text-purple-300 truncate">Click to Edit Profile</div>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/30 text-red-400 transition-colors flex-shrink-0 cursor-pointer ml-1"
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
            <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-xl pl-2 pr-1 py-1">
              <Link href="/profile" className="flex items-center space-x-1.5 cursor-pointer">
                <div className="w-5 h-5 rounded-md bg-purple-600/30 flex items-center justify-center text-xs overflow-hidden">
                  {authUser.avatar && authUser.avatar.startsWith('http') ? (
                    <img src={authUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    authUser.avatar || '⚡'
                  )}
                </div>
                <span className="text-xs font-bold text-gray-200 max-w-[80px] truncate hover:text-purple-300">{authUser.name}</span>
              </Link>
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
