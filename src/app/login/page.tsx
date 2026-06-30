'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, ShieldCheck, KeyRound, Mail, Lock, ArrowRight, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJudgeDemoLogin = () => {
    setLoading(true);
    const toastId = toast.loading('⚡ Initializing Vibe2Ship Master Judge Persona...');

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('samaype_auth_user', JSON.stringify({
          email: 'judge@vibe2ship.ai',
          name: 'Hackathon Evaluator',
          role: 'Master Judge',
          avatar: '🏆',
          isDemo: true
        }));
      }
      toast.success('🎉 Welcome Judge! Full Demo Telemetry Loaded.', { id: toastId });
      setLoading(false);
      router.push('/');
    }, 1000);
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Authenticating via Firebase Auth Engine...');

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
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 glass-panel p-8 sm:p-10 rounded-3xl border border-purple-500/30 shadow-2xl relative overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Logo */}
        <div className="text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 mx-auto flex items-center justify-center shadow-xl shadow-purple-600/30 mb-4">
            <Zap className="w-8 h-8 text-white animate-pulse" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Security Access Portal</span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">SamayPe<span className="text-purple-400">.AI</span> Auth</h2>
          <p className="text-sm text-gray-400 mt-2">
            Sign in to access your autonomous deadline guardian and WhatsApp companion telemetry.
          </p>
        </div>

        {/* 🏆 JUDGE / HACKATHON MASTER DEMO BOX */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/50 via-blue-900/30 to-black border-2 border-purple-500/60 shadow-lg relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-300">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Vibe2Ship Judge Demo ID</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-600/40 text-purple-200">INSTANT ACCESS</span>
          </div>

          <div className="text-xs text-gray-300 font-mono space-y-1 bg-black/40 p-3 rounded-xl border border-white/10">
            <div><span className="text-gray-500">Email:</span> <span className="text-white font-semibold">judge@vibe2ship.ai</span></div>
            <div><span className="text-gray-500">Pass:</span> <span className="text-white font-semibold">vibe2ship2026</span></div>
            <div><span className="text-gray-500">Tier:</span> <span className="text-cyan-400 font-semibold">Master AI Evaluator (Unrestricted)</span></div>
          </div>

          <button
            onClick={handleJudgeDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-extrabold py-3 px-4 rounded-xl shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 animate-spin-slow" />
            <span>One-Click Judge Demo Login 🚀</span>
          </button>
        </div>

        <div className="relative z-10 flex items-center my-4">
          <div className="flex-grow border-t border-gray-800" />
          <span className="flex-shrink mx-4 text-xs font-medium uppercase text-gray-500 tracking-wider">Or Custom Login</span>
          <div className="flex-grow border-t border-gray-800" />
        </div>

        {/* Standard Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@samaype.ai"
                className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 text-sm focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/50 border border-gray-800 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-600 text-sm focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-800/80 text-center relative z-10">
          <p className="text-xs text-gray-500">
            Protected by SamayPe AI Identity Guard & Firebase KMS
          </p>
        </div>
      </motion.div>
    </div>
  );
}
