'use client';

import React, { useState } from 'react';
import { Task, Priority, RiskLevel } from '@/lib/types';
import { Clock, CheckCircle2, Sparkles, Trash2, Edit2, Check, X, ChevronDown, ChevronUp, Zap, Calendar, Circle } from 'lucide-react';
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

  const priorityColors: Record<Priority, { badge: string, borderLeft: string, checkbox: string }> = {
    [Priority.URGENT]: { badge: 'bg-red-500/15 text-red-400 border-red-500/40 font-bold', borderLeft: 'border-l-red-500', checkbox: 'border-red-500 hover:bg-red-500/20 text-red-500' },
    [Priority.HIGH]: { badge: 'bg-orange-500/15 text-orange-400 border-orange-500/40 font-bold', borderLeft: 'border-l-orange-500', checkbox: 'border-orange-500 hover:bg-orange-500/20 text-orange-500' },
    [Priority.MEDIUM]: { badge: 'bg-blue-500/15 text-blue-400 border-blue-500/40 font-semibold', borderLeft: 'border-l-blue-500', checkbox: 'border-blue-400 hover:bg-blue-500/20 text-blue-400' },
    [Priority.LOW]: { badge: 'bg-green-500/15 text-green-400 border-green-500/40 font-semibold', borderLeft: 'border-l-green-500', checkbox: 'border-green-500 hover:bg-green-500/20 text-green-500' },
  };

  const riskBadges: Record<RiskLevel, { text: string, color: string }> = {
    [RiskLevel.CRITICAL]: { text: '🚨 CRITICAL DRIFT', color: 'text-red-400 bg-red-950/80 border-red-500/60 font-black animate-pulse' },
    [RiskLevel.HIGH]: { text: '⚠️ AT RISK', color: 'text-orange-400 bg-orange-950/60 border-orange-500/60 font-bold' },
    [RiskLevel.MEDIUM]: { text: '⚡ ON TRACK', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/60 font-semibold' },
    [RiskLevel.LOW]: { text: '✅ OPTIMIZED', color: 'text-green-400 bg-green-950/60 border-green-500/60 font-semibold' },
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

  const handleQuickCompleteTask = () => {
    // If there are subtasks, toggle the uncompleted ones
    if (task.subtasks && task.subtasks.length > 0) {
      const firstUncompleted = task.subtasks.find(st => !st.completed);
      if (firstUncompleted) {
        onToggleSubtask?.(task.id, firstUncompleted.id);
      } else {
        onToggleSubtask?.(task.id, task.subtasks[0].id);
      }
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={`glass-card rounded-2xl p-5 transition-all border-l-4 ${style.borderLeft} relative overflow-hidden group hover:border-purple-500/60`}
    >
      <div className="flex items-start justify-between gap-4 relative z-10">
        
        {/* Left Side: Todoist Circle Checkbox + Title */}
        <div className="flex items-start space-x-3.5 flex-1 pr-2">
          <button
            onClick={handleQuickCompleteTask}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
              progressPct === 100 ? 'bg-green-500 border-green-500 text-black' : style.checkbox
            }`}
            title="Complete step / mark task"
          >
            {progressPct === 100 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : null}
          </button>

          <div className="flex-1 min-w-0">
            {/* ClickUp Style Tags Row */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-1.5 mb-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${style.badge}`}>
                {task.priority}
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${risk.color}`}>
                {risk.text}
              </span>
              <span className="text-[10px] font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/30">
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
                  className="flex-1 bg-black/80 border border-cyan-400 rounded-xl px-3 py-1.5 text-white font-bold text-sm focus:outline-none"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                />
                <button
                  onClick={handleSaveRename}
                  className="p-2 rounded-lg bg-green-500 hover:bg-green-400 text-black font-bold transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setIsEditing(false); setEditedTitle(task.title); }}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <h3 className={`text-base font-bold tracking-tight mt-0.5 transition-all ${progressPct === 100 ? 'line-through text-gray-500' : 'text-white'}`}>
                {task.title}
              </h3>
            )}

            <p className="text-xs text-gray-400 mt-1 line-clamp-1">{task.description}</p>
          </div>
        </div>

        {/* Action Buttons: Rename & Delete */}
        <div className="flex items-center space-x-1 flex-shrink-0 relative z-10 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-all cursor-pointer"
            title="Rename Commitment"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
              title="Delete Commitment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Todoist Style Progress Bar & Deadline Info */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>Due: <strong className="text-gray-200">{new Date(task.deadline).toLocaleDateString()}</strong></span>
        </div>

        <div className="flex items-center space-x-2.5">
          <div className="w-24 bg-white/10 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
            />
          </div>
          <span className="text-[11px] font-bold text-cyan-400">{progressPct}%</span>
        </div>
      </div>

      {/* ClickUp Style Expandable Roadmap Toggle */}
      <div className="mt-3.5 pt-2.5 border-t border-white/10">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
            expanded 
              ? 'bg-purple-950/60 text-cyan-300 border border-purple-500/50' 
              : 'bg-white/[0.03] hover:bg-white/10 text-gray-400 hover:text-white border border-transparent'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Zap className={`w-3.5 h-3.5 ${expanded ? 'text-cyan-400 animate-pulse' : 'text-purple-400'}`} />
            <span>SUBTASK ROADMAP ({completedSubtasks}/{totalSubtasks})</span>
          </div>
          <div className="flex items-center space-x-1 text-[11px] text-purple-400 font-bold">
            <span>{expanded ? 'COLLAPSE' : 'EXPAND'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>
        </button>

        {/* Expandable Subtask Checklist */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden space-y-3 pt-3"
            >
              {/* AI Recommendation Box */}
              {task.aiRecommendation && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-950/90 to-blue-950/70 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2.5 text-cyan-200">
                    <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
                    <div>
                      <span className="font-mono font-bold text-cyan-400 uppercase text-[10px] block">AI 2.5 RECOMMENDATION //</span>
                      <span>{task.aiRecommendation}</span>
                    </div>
                  </div>
                  {onReschedule && (
                    <button 
                      onClick={() => onReschedule(task.id)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md transition-all flex items-center space-x-1 cursor-pointer flex-shrink-0"
                    >
                      <Zap className="w-3 h-3" />
                      <span>AI AUTO-FIX</span>
                    </button>
                  )}
                </div>
              )}

              {/* Todoist Interactive Subtask Checklist */}
              <div className="space-y-1.5 bg-black/50 p-2.5 rounded-xl border border-white/10">
                <div className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest pb-1 border-b border-white/10 flex items-center justify-between px-1">
                  <span>CHECKLIST ITEMS</span>
                  <span className="text-cyan-400">CLICK TO COMPLETE</span>
                </div>
                {(task.subtasks || []).map((st, idx) => (
                  <div
                    key={st.id}
                    onClick={() => onToggleSubtask?.(task.id, st.id)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] hover:bg-purple-600/20 border border-white/5 hover:border-cyan-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all flex-shrink-0 ${
                        st.completed 
                          ? 'bg-cyan-500 border-cyan-400 text-black font-bold' 
                          : 'border-purple-400/60 bg-transparent group-hover:border-cyan-400'
                      }`}>
                        {st.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-medium transition-colors ${st.completed ? 'line-through text-gray-500 font-mono' : 'text-gray-200 group-hover:text-cyan-300'}`}>
                        <span className="font-mono text-[10px] text-purple-400 mr-2">{idx + 1}.</span>
                        {st.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 bg-white/5 px-2 py-0.5 rounded border border-white/10 flex-shrink-0 ml-2">
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
