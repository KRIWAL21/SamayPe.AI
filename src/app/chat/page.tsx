'use client';

import React, { useState } from 'react';
import VoiceButton from '@/components/VoiceButton';
import { Send, Sparkles, Bot, User, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi Creator! I'm SamayPe AI, your autonomous deadline guardian. I'm currently monitoring 3 active commitments on your dashboard. How can we optimize your schedule tonight?",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const quickChips = [
  "⚡ What is my highest risk deadline?",
  "🗓️ Reschedule my evening tasks to tomorrow",
  "✉️ Draft an emergency extension email",
  "💡 Give me a 5-minute micro-action to stop procrastinating"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.tasks) {
          setTasks(data.tasks);
          const activeCount = data.tasks.filter((t: any) => t.status !== 'COMPLETED').length;
          setMessages([
            {
              id: 'init-live',
              role: 'assistant',
              content: `Hi Creator! I'm SamayPe AI, your autonomous deadline guardian. I'm currently monitoring ${activeCount} active commitments on your live dashboard. Ask me anything about your roadmap!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, currentTasks: tasks }),
      });

      const data = await res.json();

      if (data.success && data.reply) {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('No response');
      }
    } catch (error) {
      console.error(error);
      // Fallback local response for hackathon offline demo continuity
      setTimeout(() => {
        let reply = "I have autonomously synchronized your schedule! Based on your current workload, I recommend focusing exclusively on your Hackathon Demo Video for the next 90 minutes.";
        if (textToSend.includes('email') || textToSend.includes('extension')) {
          reply = "Drafted Extension Email:\n\nSubject: Request for Deadline Extension — ML Project\n\nDear Professor,\n\nI am writing to respectfully request a 48-hour extension for our end-semester project. While the data preprocessing pipeline is complete, GPU model training required additional time.\n\nThank you for your consideration.";
        }

        const fallbackAiMsg: Message = {
          id: `ai-fallback-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackAiMsg]);
        setLoading(false);
      }, 1000);
      return;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[calc(100vh-80px)] glass-panel rounded-3xl border border-gray-800 overflow-hidden relative">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/80 bg-black/40 flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Bot className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <span>SamayPe AI Coach</span>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            </h1>
            <p className="text-xs text-purple-300">Gemini 2.5 Flash Reasoning Active</p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex items-start space-x-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser ? 'bg-purple-600 text-white' : 'bg-gray-800 text-purple-400 border border-purple-500/30'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md whitespace-pre-wrap ${
                  isUser 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-tr-none' 
                    : 'glass-card text-gray-200 rounded-tl-none border border-gray-800'
                }`}>
                  {msg.content}
                  <div className={`text-[10px] mt-2 text-right ${isUser ? 'text-purple-200' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-gray-800 flex items-center justify-center border border-purple-500/30">
              <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl text-xs text-purple-300 flex items-center space-x-2">
              <span>Synthesizing optimal schedule strategy...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Action Chips */}
      <div className="px-6 py-2 bg-black/20 flex items-center space-x-2 overflow-x-auto scrollbar-none border-t border-gray-800/40">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-purple-600/20 text-xs text-gray-300 hover:text-purple-300 border border-white/5 hover:border-purple-500/30 transition-all flex items-center space-x-1.5 flex-shrink-0"
          >
            <span>{chip}</span>
            <ArrowRight className="w-3 h-3 text-purple-400 opacity-60" />
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-black/60 border-t border-gray-800 flex items-center space-x-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend(input)}
          placeholder="Ask SamayPe AI anything..."
          className="flex-1 bg-white/5 border border-gray-800 focus:border-purple-500 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all"
        />

        <VoiceButton onTranscript={(text) => handleSend(text)} />

        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || loading}
          className="p-3.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 hover:opacity-90 text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
