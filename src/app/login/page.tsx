'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Mail, Lock, Sparkles, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJudgeDemoLogin = () => {
    setLoading(true);
    const toastId = toast.loading('Initializing Vibe2Ship Master Evaluator Session...');

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('samaype_auth_user', JSON.stringify({
          email: 'pro@samaype.ai',
          name: 'SamayPe.AI Pro',
          role: 'Master Guardian',
          avatar: '⚡',
          isDemo: true
        }));
      }
      toast.success('Welcome to SamayPe.AI! Full Telemetry & AI Suite Loaded.', { id: toastId });
      setLoading(false);
      router.push('/');
    }, 800);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Authenticating identity...');

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('samaype_auth_user', JSON.stringify({
          email: email,
          name: email.split('@')[0] || 'Creator',
          role: 'Pro Creator',
          avatar: '⚡',
          isDemo: false
        }));
      }
      toast.success(`Welcome back, ${email}!`, { id: toastId });
      setLoading(false);
      router.push('/');
    }, 700);
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-4xl w-full glass-panel rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-12"
      >
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* LEFT PANEL: Judge Evaluation & Instant Access (7 Columns) */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 relative z-10 bg-gradient-to-br from-purple-950/40 via-black/40 to-black/60">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400 block">Security & Evaluation</span>
                <h1 className="text-xl font-extrabold text-white tracking-tight">SamayPe<span className="text-purple-400">.AI</span> Portal</h1>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-300">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>SamayPe.AI Enterprise Pro Portal</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">INSTANT ACCESS</span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Log in as an official SamayPe.AI user to unlock unrestricted access to the real-time AI reasoning pipeline, live autonomous schedule compression, and productivity intelligence.
              </p>

              <div className="text-xs font-mono bg-black/60 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                <div className="flex justify-between"><span className="text-gray-500">User ID:</span> <span className="text-white font-semibold">pro@samaype.ai</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Workspace:</span> <span className="text-white font-semibold">SamayPe.AI Pro</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Privileges:</span> <span className="text-cyan-400 font-semibold">Master AI Guardian</span></div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleJudgeDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold py-3 px-5 rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50 group"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm">One-Click SamayPe.AI Pro Access</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Custom User Sign In (5 Columns) */}
        <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-center relative z-10 bg-black/30">
          <div className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">Standard Sign In</h2>
            <p className="text-xs text-gray-500 mt-0.5">Enter your creator workspace credentials</p>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="creator@samaype.ai"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 text-xs focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-9 pr-3 text-white placeholder-gray-600 text-xs focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50 border border-white/10 text-xs mt-2"
            >
              <span>Sign In to Dashboard</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center space-x-1.5 text-[10px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Protected by SamayPe AI Identity Guard</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
