'use client';

import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export default function VoiceButton({ onTranscript, className = '' }: VoiceButtonProps) {
  const [recording, setRecording] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice input is not supported in this browser. Please try Chrome.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Optimized for Indian English accent

    recognition.onstart = () => {
      setRecording(true);
      toast('Listening... speak your task now 🎤', { icon: '🔴' });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice Transcript:', transcript);
      setRecording(false);
      onTranscript(transcript);
      toast.success(`Heard: "${transcript}"`);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech Recognition Error:', event.error);
      setRecording(false);
      toast.error('Could not hear voice. Please try again.');
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
  };

  return (
    <button
      type="button"
      onClick={startListening}
      disabled={recording}
      className={`p-3 rounded-xl transition-all relative flex items-center justify-center ${
        recording 
          ? 'bg-red-500 text-white pulse-recording shadow-lg shadow-red-500/50' 
          : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 hover:border-purple-500/50'
      } ${className}`}
      title="Speak your task"
    >
      {recording ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
    </button>
  );
}
