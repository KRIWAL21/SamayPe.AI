'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Terminal, Smartphone, Zap, AlertTriangle, ShieldCheck, X, ChevronRight, Activity, Flame, Cpu } from 'lucide-react';
import { Task } from '@/lib/types';
import toast from 'react-hot-toast';

interface JudgeEvaluationHUDProps {
  onInjectScenario: (scenarioType: 'burnout' | 'hackathon') => void;
}

export default function JudgeEvaluationHUD({ onInjectScenario }: JudgeEvaluationHUDProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'whatsapp' | 'scenarios'>('scenarios');

  const handleSimulate = (type: 'burnout' | 'hackathon') => {
    onInjectScenario(type);
    toast.success(
      type === 'burnout' 
        ? '🚨 Simulated Critical Burnout Drift! Check dashboard queue.' 
        : '⚡ Simulated Hackathon Submission Crunch!'
    );
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-6 right-3 md:right-6 z-50 flex items-center space-x-3 bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 p-[2px] rounded-full shadow-[0_0_25px_rgba(0,240,255,0.6)] cursor-pointer group"
      >
        <div className="bg-[#05050a] px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full flex items-center space-x-2">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-mono font-black text-[10px] sm:text-xs uppercase tracking-widest bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            <span className="sm:hidden">⚡ JUDGE TOUR</span>
            <span className="hidden sm:inline">⚡ Judge Evaluation Tour // AI HUD</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
        </div>
      </motion.button>

      {/* Cyber Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-full sm:w-[480px] h-full sm:h-[90vh] bg-[#090914] border-l border-cyan-500/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col sm:rounded-l-3xl overflow-hidden relative"
            >
              {/* Top Mecha Header */}
              <div className="p-6 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-purple-950/20 to-transparent flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-8 bg-gradient-to-b from-cyan-400 to-purple-600 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
                  <div>
                    <h3 className="font-mono font-black text-base text-white uppercase tracking-wider flex items-center space-x-2">
                      <span>Vibe2Ship Evaluation Tour</span>
                    </h3>
                    <p className="text-xs font-mono text-cyan-400/80">GEMINI 2.5 AGENTIC CO-PILOT ACTIVE</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-gray-800 bg-black/40 font-mono text-xs font-bold">
                <button
                  onClick={() => setActiveTab('scenarios')}
                  className={`flex-1 py-3.5 text-center uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === 'scenarios' 
                      ? 'border-cyan-400 text-cyan-400 bg-cyan-500/10' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  ⚡ 1-Click Scenarios
                </button>
                <button
                  onClick={() => setActiveTab('whatsapp')}
                  className={`flex-1 py-3.5 text-center uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === 'whatsapp' 
                      ? 'border-green-400 text-green-400 bg-green-500/10' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  📱 WhatsApp Test
                </button>
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`flex-1 py-3.5 text-center uppercase tracking-wider border-b-2 transition-all ${
                    activeTab === 'telemetry' 
                      ? 'border-purple-400 text-purple-400 bg-purple-500/10' 
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  📡 Telemetry
                </button>
              </div>

              {/* Drawer Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === 'scenarios' && (
                  <div className="space-y-4">
                    <div className="bg-purple-950/30 border border-purple-500/30 p-4 rounded-2xl">
                      <h4 className="text-sm font-bold text-purple-300 uppercase tracking-wide flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>Instant Hackathon Demonstration</span>
                      </h4>
                      <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                        Don't have time to manually type out goals? Click any button below to instantly trigger our cognitive agent and inject real-time AI evaluated deadlines right into your feed.
                      </p>
                    </div>

                    <button
                      onClick={() => handleSimulate('burnout')}
                      className="w-full text-left bg-gradient-to-r from-red-950/60 to-purple-950/40 hover:from-red-900/60 hover:to-purple-900/40 border border-red-500/40 p-5 rounded-2xl transition-all group relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                            🚨 SIMULATE BURNOUT DRIFT
                          </span>
                          <h5 className="font-bold text-white text-base">Inject Critical Overload Emergency</h5>
                          <p className="text-xs text-gray-300">
                            Spawns 3 high-risk deadlines due tonight. Demonstrates Gemini's automatic risk escalation and Proactive Auto-Fix intervention button.
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-red-400 group-hover:translate-x-1 transition-transform mt-2" />
                      </div>
                    </button>

                    <button
                      onClick={() => handleSimulate('hackathon')}
                      className="w-full text-left bg-gradient-to-r from-cyan-950/60 to-blue-950/40 hover:from-cyan-900/60 hover:to-blue-900/40 border border-cyan-500/40 p-5 rounded-2xl transition-all group relative overflow-hidden"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            🏆 SIMULATE HACKATHON CRUNCH
                          </span>
                          <h5 className="font-bold text-white text-base">Inject Hackathon Pitch Goal</h5>
                          <p className="text-xs text-gray-300">
                            Spawns a structured Vibe2Ship Hackathon submission goal with 5 pre-decomposed subtasks ready for multi-agent completion.
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:translate-x-1 transition-transform mt-2" />
                      </div>
                    </button>
                  </div>
                )}

                {activeTab === 'whatsapp' && (
                  <div className="space-y-5">
                    <div className="bg-green-950/30 border border-green-500/30 p-4 rounded-2xl">
                      <h4 className="text-sm font-bold text-green-400 uppercase tracking-wide flex items-center space-x-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Live Bi-Directional WhatsApp Sandbox</span>
                      </h4>
                      <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                        Test our bi-directional Twilio Webhook integration directly from your own mobile phone in 15 seconds!
                      </p>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold font-mono">1</div>
                        <div>
                          <p className="text-xs text-gray-400">Save Twilio Sandbox Number:</p>
                          <p className="font-mono font-bold text-white text-sm">+1 (415) 523-8886</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold font-mono">2</div>
                        <div>
                          <p className="text-xs text-gray-400">Send WhatsApp Message:</p>
                          <p className="font-mono font-bold text-cyan-400 text-sm">join samaype-ai</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold font-mono">3</div>
                        <div>
                          <p className="text-xs text-gray-400">Test Interactive Menu & AI Decomposer:</p>
                          <p className="font-mono font-bold text-white text-sm">Text <span className="text-yellow-400">'menu'</span> or <span className="text-yellow-400">'I have an exam tomorrow'</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/60 p-4 rounded-xl border border-gray-800 font-mono text-xs text-gray-400">
                      💡 Note: Our webhook server at <code className="text-cyan-400">/api/whatsapp</code> supports multi-channel text commands, audio voice notes, and image screenshots!
                    </div>
                  </div>
                )}

                {activeTab === 'telemetry' && (
                  <div className="space-y-4 font-mono">
                    <div className="bg-purple-950/30 border border-purple-500/30 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <div className="text-xs text-gray-400">COGNITIVE ENGINE</div>
                        <div className="font-bold text-white text-sm">Gemini 2.5 Flash Autonomous</div>
                      </div>
                      <div className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full text-xs font-bold">
                        ONLINE // 99.8%
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="glass-card p-4 rounded-xl border border-gray-800">
                        <div className="text-[10px] text-gray-400">AVG DECOMPOSITION LATENCY</div>
                        <div className="text-xl font-black text-cyan-400 mt-1">1.24s</div>
                      </div>
                      <div className="glass-card p-4 rounded-xl border border-gray-800">
                        <div className="text-[10px] text-gray-400">COGNITIVE THREADS</div>
                        <div className="text-xl font-black text-purple-400 mt-1">4 DOMAINS</div>
                      </div>
                      <div className="glass-card p-4 rounded-xl border border-gray-800">
                        <div className="text-[10px] text-gray-400">WHATSAPP WEBHOOK PIPELINE</div>
                        <div className="text-xl font-black text-green-400 mt-1">ACTIVE</div>
                      </div>
                      <div className="glass-card p-4 rounded-xl border border-gray-800">
                        <div className="text-[10px] text-gray-400">AUTO-FIX REALIGNMENTS</div>
                        <div className="text-xl font-black text-orange-400 mt-1">READY</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-gray-800 bg-black/60 text-center font-mono text-xs text-gray-400">
                SamayPe AI // Vibe2Ship Hackathon 2026 Submission
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
