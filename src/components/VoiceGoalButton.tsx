'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Sparkles, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceGoalButtonProps {
  onVoiceGoalCaptured: (transcript: string) => void;
}

export default function VoiceGoalButton({ onVoiceGoalCaptured }: VoiceGoalButtonProps) {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    // Check SpeechRecognition API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Voice Recognition is not supported in this browser. Try Chrome/Edge!');
      return;
    }

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
      toast.error('Voice capture failed or timed out. Please try again.');
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  return (
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
  );
}
