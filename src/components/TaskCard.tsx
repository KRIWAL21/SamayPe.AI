'use client';

import React, { useState } from 'react';
import { Task, Priority, RiskLevel } from '@/lib/types';
import { Clock, CheckCircle2, Sparkles, Trash2, Edit2, Check, X, ChevronDown, ChevronUp, Zap, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
  onReschedule?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onRename?: (taskId: string, newTitle: string) => void;
}

export default function TaskCard({ task, onToggleSubtask, onReschedule, onDelete, onRename }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const priorityColors: Record<Priority, { badge: string, borderLeft: string, glow: string }> = {
    [Priority.URGENT]: { badge: 'bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]', borderLeft: 'border-l-red-500', glow: 'hover:border-red-500/60' },
    [Priority.HIGH]: { badge: 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_10px_rgba(249,115,22,0.3)]', borderLeft: 'border-l-orange-500', glow: 'hover:border-orange-500/60' },
    [Priority.MEDIUM]: { badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]', borderLeft: 'border-l-cyan-400', glow: 'hover:border-cyan-400/60' },
    [Priority.LOW]: { badge: 'bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]', borderLeft: 'border-l-green-500', glow: 'hover:border-green-500/60' },
  };

  const riskBadges: Record<RiskLevel, { text: string, color: string }> = {
    [RiskLevel.CRITICAL]: { text: '🚨 CRITICAL DRIFT', color: 'text-red-400 bg-red-950/60 border-red-500 animate-pulse' },
    [RiskLevel.HIGH]: { text: '⚠️ HIGH RISK', color: 'text-orange-400 bg-orange-950/60 border-orange-500' },
    [RiskLevel.MEDIUM]: { text: '⚡ MODERATE', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500' },
    [RiskLevel.LOW]: { text: '✅ SYNCHRONIZED', color: 'text-green-400 bg-green-950/60 border-green-500' },
  };

  const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
  const totalSubtasks = (task.subtasks || []).length;
  const progressPct = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const style = priorityColors[task.priority] || priorityColors[Priority.MEDIUM];
  const risk = riskBadges[task.riskLevel] || riskBadges[RiskLevel.LOW];

  const handleSaveRename = () => {
    if (editedTitle.trim() && editedTitle !== task.title) {
      onRename?.(task.id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`glass-card rounded-2xl p-6 transition-all border-l-4 ${style.borderLeft} relative overflow-hidden`}
    >
      {/* Anime Cyber Watermark Accent */}
      <div className="absolute right-3 top-2 text-[48px] font-black text-white/[0.02] pointer-events-none select-none tracking-tighter">
        {task.priority === Priority.URGENT ? 'S-CLASS' : 'SYSTEM'}
      </div>

      <div className="flex items-start justify-between gap-4 relative z-10">
        <div className="flex-1 pr-2">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2 mb-3">
            <span className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${style.badge}`}>
              {task.priority}
            </span>
            <span className={`px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${risk.color}`}>
              {risk.text}
            </span>
            <span className="text-xs font-mono text-purple-300 px-3 py-1 rounded-md bg-purple-900/30 border border-purple-500/30">
              ⚡ {task.category}
            </span>
          </div>

          {/* Title / Editing Mode */}
          {isEditing ? (
            <div className="flex items-center space-x-2 mt-1">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="flex-1 bg-black/80 border border-cyan-400 rounded-xl px-3.5 py-2 text-white font-bold text-base focus:outline-none shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
              />
              <button
                onClick={handleSaveRename}
                className="p-2.5 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold transition-all"
                title="Save Title"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditedTitle(task.title); }}
                className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <h3 className="text-xl font-extrabold text-white tracking-tight mt-1 flex items-center space-x-2">
              <span>{task.title}</span>
            </h3>
          )}

          <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">{task.description}</p>
        </div>

        {/* Action Buttons: Rename & Delete */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 relative z-10">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-transparent hover:border-cyan-500/40 transition-all"
            title="Rename Commitment"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-transparent hover:border-red-500/40 transition-all"
              title="Delete Commitment"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar & Deadline Countdown */}
      <div className="mt-5 pt-4 border-t border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-gray-300">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>TARGET DEADLINE: <strong className="text-white font-bold">{new Date(task.deadline).toLocaleDateString()}</strong></span>
        </div>

        <div className="flex items-center space-x-3 sm:w-1/2">
          <div className="flex-1 bg-black/60 rounded-full h-2.5 overflow-hidden border border-purple-500/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(0,240,255,0.6)]"
            />
          </div>
          <span className="text-xs font-mono font-black text-cyan-400 min-w-[36px] text-right">{progressPct}%</span>
        </div>
      </div>

      {/* Dropdown Toggle Bar for Subtasks & AI Diagnostics */}
      <div className="mt-5 pt-3 border-t border-purple-500/20 relative z-10">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            expanded 
              ? 'bg-purple-900/40 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
              : 'bg-white/[0.03] hover:bg-purple-600/20 text-gray-300 hover:text-white border border-purple-500/30'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <Zap className={`w-4 h-4 ${expanded ? 'text-cyan-400 animate-pulse' : 'text-purple-400'}`} />
            <span>SUBTASK ROADMAP &amp; AI DIAGNOSTICS</span>
            <span className="px-2 py-0.5 rounded bg-black/50 text-cyan-400 border border-cyan-500/30">
              {completedSubtasks}/{totalSubtasks} STEPS
            </span>
          </div>
          <div className="flex items-center space-x-1 text-purple-300">
            <span>{expanded ? 'COLLAPSE' : 'EXPAND ROADMAP'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {/* Expandable Dropdown Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden space-y-4 pt-4"
            >
              {/* AI Recommendation Alert inside Dropdown */}
              {task.aiRecommendation && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/80 via-blue-950/60 to-black border border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.15)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 text-xs text-cyan-200">
                    <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex-shrink-0">
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-white uppercase text-[11px] block text-cyan-400">AI AGENT ADVICE //</span>
                      <span>{task.aiRecommendation}</span>
                    </div>
                  </div>
                  {onReschedule && (
                    <button 
                      onClick={() => onReschedule(task.id)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-90 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all flex-shrink-0 flex items-center justify-center space-x-1.5"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>TRIGGER AUTO-FIX ✨</span>
                    </button>
                  )}
                </div>
              )}

              {/* Interactive Checklist */}
              <div className="space-y-2 bg-black/40 p-3 rounded-xl border border-purple-500/20">
                <div className="text-[11px] font-mono font-bold text-gray-400 uppercase tracking-widest pb-1 border-b border-white/10 flex items-center justify-between">
                  <span>ACTION CHECKLIST</span>
                  <span className="text-cyan-400">CLICK TO CHECK / UNCHECK</span>
                </div>
                {(task.subtasks || []).map((st, idx) => (
                  <div
                    key={st.id}
                    onClick={() => onToggleSubtask?.(task.id, st.id)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-purple-600/20 border border-white/[0.08] hover:border-cyan-500/50 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all flex-shrink-0 ${
                        st.completed 
                          ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_10px_rgba(0,240,255,0.8)] font-bold' 
                          : 'border-purple-500/60 bg-black/60 group-hover:border-cyan-400'
                      }`}>
                        {st.completed && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${st.completed ? 'line-through text-gray-500 font-mono' : 'text-gray-100 group-hover:text-cyan-300'}`}>
                        <span className="font-mono text-xs text-purple-400 mr-2">[{idx + 1}]</span>
                        {st.title}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-cyan-300 bg-black/60 px-2.5 py-1 rounded-md border border-purple-500/30 flex-shrink-0 ml-2">
                      ~{st.estimatedMinutes}m
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
