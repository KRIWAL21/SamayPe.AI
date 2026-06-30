'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Terminal, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface AgenticThinkingModalProps {
  isOpen: boolean;
  title?: string;
  onComplete: () => void;
}

const THINKING_STEPS = [
  { step: '[Cognitive Analysis]', desc: 'Scanning natural language input & extracting temporal vectors...' },
  { step: '[Temporal Mapping]', desc: 'Cross-referencing deadlines against 4 circadian energy curves...' },
  { step: '[Risk Diagnostics]', desc: 'Evaluating historic execution velocity & drift likelihood...' },
  { step: '[Multi-Agent Synthesis]', desc: 'Generating structured sub-milestones via Gemini 2.5 Flash...' }
];

export default function AgenticThinkingModal({ isOpen, title = 'Autonomous Cognitive Decomposition', onComplete }: AgenticThinkingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      return;
    }

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < THINKING_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 600);
          return prev;
        }
      });
    }, 650);

    return () => clearInterval(timer);
  }, [isOpen, onComplete]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-lg glass-panel border border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.3)] relative overflow-hidden"
          >
            {/* Background mecha glow */}
            <div className="absolute right-0 top-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-800">
              <div className="p-3 bg-cyan-500/20 rounded-2xl border border-cyan-500/40">
                <Cpu className="w-6 h-6 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
                  GEMINI 2.5 AGENTIC PIPELINE
                </span>
                <h3 className="text-xl font-black text-white font-mono">{title}</h3>
              </div>
            </div>

            {/* Streaming Logs */}
            <div className="space-y-4 font-mono text-xs">
              {THINKING_STEPS.map((item, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;
                const isPending = idx > currentStep;

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isPending ? 0.3 : 1, x: 0 }}
                    className={`p-3.5 rounded-xl border flex items-start space-x-3 transition-all ${
                      isCurrent
                        ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.2)] text-white'
                        : isDone
                        ? 'bg-green-950/20 border-green-500/30 text-green-300'
                        : 'bg-black/30 border-gray-800 text-gray-500'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      ) : isCurrent ? (
                        <Sparkles className="w-4 h-4 text-cyan-400 animate-bounce" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold">{item.step}</div>
                      <div className="text-gray-300 text-[11px] mt-0.5">{item.desc}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer status */}
            <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between font-mono text-[11px] text-gray-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Synchronizing neural evaluation...</span>
              </span>
              <span className="text-purple-400 font-bold">4-Domain Matrix</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
