'use client';

import React, { useState } from 'react';
import { Users, Trophy, Flame, Sparkles, Zap, Heart, MessageCircle, ArrowUpRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const initialLeaderboard = [
  { rank: 1, name: 'KRIWAL21 (You)', project: 'SamayPe AI — Deadline Guardian', points: 1450, streak: 14, badge: '🏆 Hackathon Leader', avatar: '⚡' },
  { rank: 2, name: 'Alex_Dev', project: 'Neural Code Analyzer', points: 1320, streak: 12, badge: '🔥 Flow State', avatar: '🧠' },
  { rank: 3, name: 'Sanya_M', project: 'Crypto Portfolio Autonomous Bot', points: 1280, streak: 10, badge: '🚀 Shipping Velocity', avatar: '💎' },
  { rank: 4, name: 'Rohan_Code', project: 'AI Medical Document Summarizer', points: 1150, streak: 9, badge: '⚡ Consistent Grinder', avatar: '🏥' },
  { rank: 5, name: 'Priya_Tech', project: 'Voice-First Recipe Agent', points: 980, streak: 7, badge: '🌟 Rising Star', avatar: '🍳' },
];

const liveFeed = [
  { id: '1', user: 'Alex_Dev', action: 'decomposed an XGBoost ML pipeline into 5 DAG nodes ✨', time: '2 mins ago' },
  { id: '2', user: 'Sanya_M', action: 'autonomously resolved a schedule conflict via WhatsApp alert 💬', time: '14 mins ago' },
  { id: '3', user: 'Rohan_Code', action: 'achieved a 9-day on-time deadline completion streak 🔥', time: '1 hour ago' },
];

export default function CommunityPage() {
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);

  const handleCheer = (name: string) => {
    toast.success(`🚀 Energy boost sent to ${name}! Your community karma +10.`);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border border-cyan-500/20 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
            <Users className="w-4 h-4 animate-pulse" />
            <span>Vibe2Ship Hackathon Arena</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Accountability Leaderboard</h1>
          <p className="text-sm text-gray-400 mt-1">
            Compare autonomous focus points, streak momentum, and live execution velocity against fellow hackathon builders.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-purple-950/60 border border-cyan-500/30 flex items-center space-x-3 flex-shrink-0">
          <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0 animate-bounce" />
          <div>
            <div className="text-xs text-gray-400">Your Current Standing</div>
            <div className="text-xl font-bold text-white">#1 <span className="text-xs text-cyan-400">Top 1% Velocity</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaderboard Table */}
        <div className="glass-card lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span>Live Sprint Standings</span>
          </h2>

          <div className="space-y-3">
            {leaderboard.map((item, idx) => {
              const isUser = item.rank === 1;
              return (
                <motion.div
                  key={item.rank}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isUser 
                      ? 'border-purple-500/60 bg-gradient-to-r from-purple-900/30 via-blue-900/20 to-transparent shadow-lg shadow-purple-900/10' 
                      : 'border-gray-800/80 bg-white/[0.01] hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm ${
                      item.rank === 1 ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/30' :
                      item.rank === 2 ? 'bg-gray-300 text-black' :
                      item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-400'
                    }`}>
                      #{item.rank}
                    </span>

                    <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-lg shadow-inner">
                      {item.avatar}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-sm font-bold text-white">{item.name}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.project}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-extrabold text-white font-mono">{item.points}</div>
                      <div className="text-[10px] text-gray-400 flex items-center justify-end space-x-1">
                        <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
                        <span>{item.streak}d streak</span>
                      </div>
                    </div>

                    {!isUser && (
                      <button
                        onClick={() => handleCheer(item.name)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-purple-600/20 text-gray-400 hover:text-purple-300 border border-white/5 hover:border-purple-500/30 transition-all cursor-pointer"
                        title="Send virtual cheer boost"
                      >
                        <Zap className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Ticker Feed */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gray-800 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin-slow" />
                <span>Live Arena Telemetry</span>
              </h2>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            </div>

            <div className="space-y-4">
              {liveFeed.map((feed) => (
                <div key={feed.id} className="p-4 rounded-2xl bg-black/40 border border-gray-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-purple-300">{feed.user}</strong>
                    <span className="text-gray-500 text-[10px]">{feed.time}</span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">{feed.action}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 text-center mt-6">
            <p className="text-xs text-gray-300 font-medium">
              💡 Complete tasks on time to earn +50 focus points and climb the Vibe2Ship leaderboard!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
