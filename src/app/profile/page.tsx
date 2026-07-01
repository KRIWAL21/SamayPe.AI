'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Camera, Sparkles, Shield, Award, CheckCircle2, ArrowLeft, Save, Zap, Phone, Brain, Award as BadgeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AVATAR_OPTIONS = ['⚡', '👑', '🚀', '💎', '🔥', '🦾', '🧠', '🎯', '🌟', '🛡️', '🦉', '🎨'];

export default function UserProfilePage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('⚡');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [archetype, setArchetype] = useState('Hackathon Warrior');
  const [cognitiveWindow, setCognitiveWindow] = useState('Night Owl');
  const [whatsappNumber, setWhatsappNumber] = useState('+14155238886');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('samaype_auth_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAuthUser(parsed);
        setName(parsed.name || '');
        setEmail(parsed.email || '');
        setAvatar(parsed.avatar || '⚡');
        if (parsed.avatar && parsed.avatar.startsWith('http')) {
          setCustomAvatarUrl(parsed.avatar);
        }
        setArchetype(parsed.archetype || 'Hackathon Warrior');
        setCognitiveWindow(parsed.cognitiveWindow || 'Night Owl');
        setWhatsappNumber(parsed.whatsappNumber || '+14155238886');
      } catch (e) {
        toast.error('Could not load profile session');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Username cannot be empty');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Saving profile to MongoDB Cloud...');

    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : avatar;

    try {
      await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: authUser?.id,
          email: authUser?.email || email,
          name,
          avatar: finalAvatar,
          archetype,
          cognitiveWindow,
          whatsappNumber
        })
      });

      const updatedUser = {
        ...authUser,
        name,
        email,
        avatar: finalAvatar,
        archetype,
        cognitiveWindow,
        whatsappNumber
      };

      localStorage.setItem('samaype_auth_user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('storage')); // trigger immediate sidebar update
      setAuthUser(updatedUser);

      toast.success('Profile updated & synchronized successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to update profile', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500" />
      </div>
    );
  }

  const isUrlAvatar = (customAvatarUrl || avatar).startsWith('http');

  return (
    <div className="space-y-6 text-white pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/60 via-blue-900/40 to-indigo-950/60 border border-purple-500/30 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex items-center space-x-5 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 p-0.5 shadow-2xl flex-shrink-0">
            <div className="w-full h-full bg-[#13161f] rounded-[14px] flex items-center justify-center overflow-hidden">
              {isUrlAvatar ? (
                <img src={customAvatarUrl || avatar} alt="Profile Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl">{avatar}</span>
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-2xl font-black text-white tracking-tight">{name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-[11px] font-mono font-bold text-purple-300 flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Pro Guardian</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1 flex items-center space-x-3">
              <span className="flex items-center space-x-1"><Mail className="w-3.5 h-3.5 text-gray-500" /> <span>{email}</span></span>
              <span>•</span>
              <span className="text-green-400 font-mono">Connected to MongoDB Cloud</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/')}
          className="relative z-10 flex items-center space-x-2 text-xs font-bold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 transition-all w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </button>
      </div>

      {/* Main Form Content */}
      <div className="w-full">
        <form onSubmit={handleSaveProfile} className="space-y-6">
          
          {/* Avatar / Photo Selection Card */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-purple-400" />
                  <span>Profile Photo & Avatar Badge</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">Select a signature AI Guardian icon or provide a custom image URL.</p>
              </div>
            </div>

            {/* Emoji Selector Grid */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Curated AI Guardian Badges</label>
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-2.5">
                {AVATAR_OPTIONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => { setAvatar(item); setCustomAvatarUrl(''); }}
                    className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all border ${
                      avatar === item && !customAvatarUrl ? 'bg-purple-600/30 border-purple-500 scale-110 shadow-lg shadow-purple-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Photo URL Input */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Or Paste Custom Image URL (e.g. GitHub/LinkedIn Photo)</label>
              <input
                type="url"
                value={customAvatarUrl}
                onChange={(e) => setCustomAvatarUrl(e.target.value)}
                placeholder="https://avatars.githubusercontent.com/u/..."
                className="w-full bg-[#13161f] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors placeholder-gray-600"
              />
            </div>
          </div>

          {/* User Identity Card */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>Account Identity & Credentials</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Manage your display username and verified login email address.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Username / Display Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name or handle"
                  className="w-full bg-[#13161f] border border-white/15 rounded-xl px-4 py-3 text-sm font-semibold text-white focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Email Address (Read-Only ID)</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* AI Cognitive Profile Card */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6 shadow-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Brain className="w-4 h-4 text-pink-400" />
                <span>AI Cognitive Window & Archetype</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Gemini 2.5 uses these settings to personalize task decomposition and alert timelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Execution Archetype</label>
                <select
                  value={archetype}
                  onChange={(e) => setArchetype(e.target.value)}
                  className="w-full bg-[#13161f] border border-white/15 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Hackathon Warrior">🏆 Vibe2Ship Hackathon Warrior</option>
                  <option value="Academic Grinder">🎓 Academic & Research Grinder</option>
                  <option value="High-Output Tech Executive">💼 High-Output Tech Executive</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block">Peak Cognitive Window</label>
                <select
                  value={cognitiveWindow}
                  onChange={(e) => setCognitiveWindow(e.target.value)}
                  className="w-full bg-[#13161f] border border-white/15 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Early Bird Flow">🌅 Early Bird Flow (6 AM - 10 AM)</option>
                  <option value="Midday Momentum">☀️ Midday Momentum (1 PM - 5 PM)</option>
                  <option value="Night Owl">🦉 Night Owl Deep Work (8 PM - 2 AM)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300 block flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-green-400" />
                <span>WhatsApp Notification Number (For Autonomous Reminders)</span>
              </label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="+14155238886"
                className="w-full bg-[#13161f] border border-white/15 rounded-xl px-4 py-3 text-sm font-mono text-green-400 focus:outline-none focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-sm font-black text-white shadow-xl shadow-purple-500/25 flex items-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Syncing to MongoDB...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes to Profile</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
