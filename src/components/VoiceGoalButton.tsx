'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Loader2, Volume2, AlertTriangle, Send, X, Sparkles, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceGoalButtonProps {
  onVoiceGoalCaptured: (transcript: string) => void;
}

const sampleVoiceGoals = [
  "Prepare presentation slides and rehearse demo for Monday morning team review",
  "Complete Calculus assignment 4 and review formulas before 9pm tomorrow",
  "Review microservices security architecture doc and submit feedback by Friday"
];

export default function VoiceGoalButton({ onVoiceGoalCaptured }: VoiceGoalButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage("Your browser (e.g. Brave/Firefox) restricts native Speech API access.");
      setShowFallbackModal(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        toast.loading('🎙️ Listening... Speak your goal clearly!', { id: 'voice-toast' });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        toast.dismiss('voice-toast');
        toast.success(`🎙️ Captured: "${transcript}"`);
        setIsRecording(false);
        onVoiceGoalCaptured(transcript);
      };

      recognition.onerror = (event: any) => {
        toast.dismiss('voice-toast');
        setIsRecording(false);
        // Brave browser shields or denied permissions trigger network / not-allowed errors
        if (event.error === 'not-allowed') {
          setErrorMessage("Microphone permission was blocked by browser shields.");
        } else if (event.error === 'network' || event.error === 'service-not-allowed') {
          setErrorMessage("Browser privacy shields (like Brave Shields) blocked Google Speech API servers.");
        } else {
          setErrorMessage(`Voice capture encountered an error (${event.error || 'timeout'}).`);
        }
        setShowFallbackModal(true);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (err: any) {
      setErrorMessage("Speech audio stream could not be initialized.");
      setShowFallbackModal(true);
    }
  };

  const handleSimulateSubmit = (text: string) => {
    if (!text.trim()) return;
    setShowFallbackModal(false);
    toast.success(`🎙️ Audio Stream Simulated: "${text}"`);
    onVoiceGoalCaptured(text);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={startRecording}
        disabled={isRecording}
        className={`flex items-center space-x-2 px-4 py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer border ${
          isRecording
            ? 'bg-red-600/30 border-red-500 text-red-300 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]'
            : 'bg-purple-950/60 hover:bg-purple-900/60 border-purple-500/40 text-purple-200 shadow-[0_0_15px_rgba(157,78,221,0.3)]'
        }`}
      >
        {isRecording ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-red-400" />
            <span>LISTENING...</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-purple-400" />
            <span>🎙️ VOICE GOAL</span>
          </>
        )}
      </motion.button>

      {/* Interactive Voice Stream HUD / Fallback Modal */}
      <AnimatePresence>
        {showFallbackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-md w-full glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-2xl space-y-5 relative bg-[#0d0d14]"
            >
              <button
                onClick={() => setShowFallbackModal(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base tracking-tight">Voice Capture HUD</h3>
                  <p className="text-[11px] text-gray-400 font-mono">Audio Ingestion & Simulation Portal</p>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-amber-950/40 border border-amber-500/30 p-3.5 rounded-xl flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-200/90 leading-relaxed">
                    <strong>Browser Notice:</strong> {errorMessage} You can simulate audio ingestion below or record real Voice Notes directly to our WhatsApp bot.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
                  Select a Sample Voice Transcript to Decompose:
                </label>
                <div className="space-y-2">
                  {sampleVoiceGoals.map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => handleSimulateSubmit(sample)}
                      className="w-full text-left p-3 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/20 text-xs text-gray-200 transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="line-clamp-2">{sample}</span>
                      <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
                  Or Type Custom Audio Transcript:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="e.g. Finish chemistry project by tomorrow 5pm..."
                    className="flex-1 bg-black/60 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={() => handleSimulateSubmit(customInput)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1 cursor-pointer transition-all"
                  >
                    <span>Simulate</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex items-center space-x-2 text-[11px] text-gray-400 font-mono">
                <Smartphone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Tip: Send live voice notes to WhatsApp <strong className="text-white">+1 415 523 8886</strong> for full Whisper audio parsing!</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
