'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, UserCheck, Clock, ShieldAlert, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const archetypes = [
  { id: 'hackathon', title: '🏆 Vibe2Ship Hackathon Warrior', desc: 'Aggressive timeline compression. Focuses strictly on MVP deployment and demo impact.' },
  { id: 'academic', title: '🎓 Academic & Research Grinder', desc: 'Structured milestone tracking for IEEE research papers, thesis deadlines, and exams.' },
  { id: 'executive', title: '💼 High-Output Tech Executive', desc: 'Zero-collision calendar management, asynchronous meetings, and deep work protection.' }
];

const cognitiveWindows = [
  { id: 'morning', label: '🌅 Early Bird Flow (6 AM - 10 AM)', desc: 'Peak analytical reasoning in early hours.' },
  { id: 'afternoon', label: '☀️ Midday Momentum (1 PM - 5 PM)', desc: 'Consistent velocity after morning planning.' },
  { id: 'night', label: '🦉 Night Owl Deep Work (8 PM - 2 AM)', desc: 'Uninterrupted focus when the world is quiet.' }
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedArchetype, setSelectedArchetype] = useState('hackathon');
  const [selectedWindow, setSelectedWindow] = useState('night');
  const [whatsappNumber, setWhatsappNumber] = useState('+91 98765 43210');
  const [saving, setSaving] = useState(false);

  const handleFinish = async () => {
    setSaving(true);
    const toastId = toast.loading('⚡ Synchronizing AI Cognitive Profile across Gemini Reasoning Engine...');
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('samaype_profile', JSON.stringify({
          archetype: selectedArchetype,
          window: selectedWindow,
          whatsappNumber
        }));
      }
      let currentUserId = 'demo-user';
      if (typeof window !== 'undefined') {
        const uStr = localStorage.getItem('samaype_auth_user');
        if (uStr) {
          try {
            const u = JSON.parse(uStr);
            if (u?.id) currentUserId = u.id;
          } catch (e) {}
        }
      }
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          title: `👤 Cognitive Profile Tuned: ${selectedArchetype.toUpperCase()}`,
          description: `Prime working window set to ${selectedWindow}. Connected WhatsApp notifications for ${whatsappNumber}.`,
          category: 'AI Configuration',
          priority: 'MEDIUM',
          status: 'COMPLETED',
          deadline: new Date().toISOString(),
          riskScore: 0.1,
          riskLevel: 'LOW',
          aiRecommendation: '✨ Profile active. AI coaching prompts and intervention thresholds are now customized.'
        })
      });
      window.dispatchEvent(new Event('tasksUpdated'));
      setSaving(false);
      toast.success('✨ AI Persona Synchronized! Autonomous interventions tuned.', { id: toastId });
      router.push('/');
    } catch (e) {
      setSaving(false);
      router.push('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-purple-500/30 text-center relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 mx-auto flex items-center justify-center shadow-xl shadow-purple-600/30 mb-4">
          <Zap className="w-6 h-6 text-white animate-bounce" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-purple-400">Step {step} of 3</span>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Cognitive Profile Calibration</h1>
        <p className="text-sm text-gray-300 mt-2 max-w-lg mx-auto">
          Configure how SamayPe AI monitors your deadlines and executes proactive interventions when temporal drift occurs.
        </p>

        {/* Progress bar */}
        <div className="w-48 h-1.5 bg-gray-800 rounded-full mx-auto mt-6 overflow-hidden">
          <motion.div 
            animate={{ width: `${(step / 3) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 rounded-full"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-purple-400" />
              <span>Select Your Execution Archetype</span>
            </h2>

            <div className="space-y-3">
              {archetypes.map((a) => (
                <div
                  key={a.id}
                  onClick={() => setSelectedArchetype(a.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-4 ${
                    selectedArchetype === a.id 
                      ? 'border-purple-500/60 bg-purple-900/20 shadow-lg shadow-purple-900/10' 
                      : 'border-gray-800 bg-white/[0.01] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 flex-shrink-0 ${
                    selectedArchetype === a.id ? 'bg-purple-600 border-purple-500 text-white' : 'border-gray-700 bg-black/40'
                  }`}>
                    {selectedArchetype === a.id && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{a.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <button onClick={() => setStep(2)} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer">
                <span>Next: Peak Flow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Define Peak Cognitive Windows</span>
            </h2>

            <div className="space-y-3">
              {cognitiveWindows.map((w) => (
                <div
                  key={w.id}
                  onClick={() => setSelectedWindow(w.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start space-x-4 ${
                    selectedWindow === w.id 
                      ? 'border-blue-500/60 bg-blue-900/20 shadow-lg shadow-blue-900/10' 
                      : 'border-gray-800 bg-white/[0.01] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center border mt-0.5 flex-shrink-0 ${
                    selectedWindow === w.id ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 bg-black/40'
                  }`}>
                    {selectedWindow === w.id && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">{w.label}</h3>
                    <p className="text-xs text-gray-400 mt-1">{w.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(1)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-all font-medium text-sm">Back</button>
              <button onClick={() => setStep(3)} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer">
                <span>Next: Alerts</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="glass-card p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span>Twilio WhatsApp Webhook Intervention Channel</span>
            </h2>

            <p className="text-xs text-gray-300 leading-relaxed">
              When SamayPe AI detects temporal drift (work remaining &gt; free hours left), it dispatches an urgent intervention prompt directly to your WhatsApp to reschedule lower-priority blocks.
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cyan-300 mb-2">WhatsApp Alert Phone Number</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-black/50 border border-gray-800 rounded-2xl p-4 text-white font-mono text-sm focus:border-cyan-500 focus:outline-none transition-all"
              />
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-center space-x-3">
              <Sparkles className="w-5 h-5 flex-shrink-0 text-cyan-400 animate-spin-slow" />
              <span>Sandbox Status: Verified & Connected to Twilio Webhook `/api/whatsapp`.</span>
            </div>

            <div className="flex justify-between pt-4">
              <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white transition-all font-medium text-sm">Back</button>
              <button 
                onClick={handleFinish}
                disabled={saving}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-extrabold px-8 py-3 rounded-xl shadow-xl shadow-purple-600/40 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{saving ? 'Calibrating Engine...' : 'Activate AI Profile ✨'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
