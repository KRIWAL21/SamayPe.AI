'use client';

import React, { useState } from 'react';
import { Flame, Check, Sparkles, Plus, Trophy, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Habit {
  id: string;
  title: string;
  category: string;
  streak: number;
  completedToday: boolean;
  dots: boolean[]; // Last 7 days
}

const initialHabits: Habit[] = [
  { id: '1', title: 'Revise LangChain & LLM Agentic Notes', category: 'AI Architecture', streak: 12, completedToday: false, dots: [true, true, true, false, true, true, false] },
  { id: '2', title: 'Revise Machine Learning Core Algorithms', category: 'AI & ML', streak: 9, completedToday: true, dots: [true, true, true, true, false, true, true] },
  { id: '3', title: 'Deep Work Focus (No Phone)', category: 'Productivity', streak: 14, completedToday: true, dots: [true, true, true, true, true, true, true] },
  { id: '4', title: 'Morning Physical Exercise', category: 'Health', streak: 8, completedToday: false, dots: [true, true, false, true, true, true, false] },
  { id: '5', title: 'Read 20 Pages of Tech Literature', category: 'Growth', streak: 22, completedToday: true, dots: [true, true, true, true, true, true, true] },
  { id: '6', title: 'Evening Daily Planning Review', category: 'Mindset', streak: 5, completedToday: false, dots: [false, true, true, true, true, false, false] },
];

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  React.useEffect(() => {
    const saved = localStorage.getItem('samaype_user_habits');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(h => h.title?.includes('LangChain'))) {
          setHabits(parsed);
        } else {
          localStorage.setItem('samaype_user_habits', JSON.stringify(initialHabits));
        }
      } catch (e) {
        localStorage.setItem('samaype_user_habits', JSON.stringify(initialHabits));
      }
    }
  }, []);

  const toggleHabit = (id: string) => {
    const target = habits.find(h => h.id === id);
    if (!target) return;
    const nextDone = !target.completedToday;
    toast.success(nextDone ? `🔥 +1 Streak! Keep going!` : 'Habit unchecked.');
    setHabits(prev => {
      const updated = prev.map(h => {
        if (h.id !== id) return h;
        return {
          ...h,
          completedToday: nextDone,
          streak: nextDone ? h.streak + 1 : Math.max(0, h.streak - 1),
          dots: [...h.dots.slice(1), nextDone]
        };
      });
      localStorage.setItem('samaype_user_habits', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border border-orange-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-orange-400 mb-2">
            <Flame className="w-4 h-4 animate-bounce" />
            <span>Habit & Momentum Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Consistency Streaks</h1>
          <p className="text-sm text-gray-400 mt-1">
            Build discipline. SamayPe AI correlates your daily routines with deadline success rates.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-950/60 to-purple-950/60 border border-orange-500/30 flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-orange-400 flex-shrink-0" />
          <div>
            <div className="text-xs text-gray-400">Total Momentum</div>
            <div className="text-xl font-bold text-white">49 <span className="text-xs text-orange-400">🔥 streak points</span></div>
          </div>
        </div>
      </div>

      {/* AI Coaching Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-950/40 via-purple-950/30 to-black/40 border border-orange-500/30 shadow-xl flex items-center space-x-4">
        <Sparkles className="w-6 h-6 text-orange-400 flex-shrink-0 animate-spin-slow" />
        <p className="text-sm text-gray-200">
          💡 <strong className="text-orange-300">AI Pattern Detection:</strong> You have a 98% task completion rate on days when you complete your <strong>&quot;Morning Physical Exercise&quot;</strong> habit. Don&apos;t break the chain tomorrow!
        </p>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map((h, idx) => (
          <motion.div
            key={h.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`glass-card p-6 rounded-3xl border transition-all ${
              h.completedToday ? 'border-orange-500/40 bg-orange-950/10' : 'border-gray-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-gray-400 px-2.5 py-1 rounded-full bg-white/5 border border-white/5">
                  {h.category}
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-3">{h.title}</h3>
              </div>

              <button
                onClick={() => toggleHabit(h.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg cursor-pointer transform active:scale-95 ${
                  h.completedToday 
                    ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-white shadow-orange-500/30' 
                    : 'bg-white/5 hover:bg-white/10 text-gray-500 border border-gray-700'
                }`}
              >
                {h.completedToday ? <Check className="w-6 h-6 stroke-[3]" /> : <Plus className="w-6 h-6" />}
              </button>
            </div>

            {/* Streaks & Mini Graph */}
            <div className="mt-8 pt-4 border-t border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-orange-400 text-sm">
                <Flame className="w-5 h-5 fill-orange-400 animate-pulse" />
                <span>{h.streak} Days Streak</span>
              </div>

              {/* 7 Days Contribution Dots */}
              <div className="flex items-center space-x-1.5">
                {h.dots.map((done, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-md transition-all ${
                      done ? 'bg-orange-500 shadow-sm shadow-orange-500' : 'bg-gray-800 border border-gray-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
