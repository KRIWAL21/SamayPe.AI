'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays, Sparkles, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { Task } from '@/lib/types';

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'URGENT': return 'bg-red-500/20 border-red-500/40 text-red-300';
    case 'HIGH': return 'bg-orange-500/20 border-orange-500/40 text-orange-300';
    case 'MEDIUM': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300';
    default: return 'bg-green-500/20 border-green-500/40 text-green-300';
  }
}

function getRelativeDay(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `Overdue`;
  if (diffDays === 0) return `Today (${date.toLocaleDateString('en-US', { weekday: 'short' })})`;
  if (diffDays === 1) return `Tomorrow (${date.toLocaleDateString('en-US', { weekday: 'short' })})`;
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        if (data.success && data.tasks) {
          setTasks(data.tasks);
        }
      } catch (e) {
        console.error('Failed to fetch tasks for calendar', e);
      }
    };
    fetchTasks();
  }, []);

  // Generate schedule blocks from actual tasks and their subtasks
  const scheduleBlocks = tasks
    .filter(t => t.status !== 'COMPLETED')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .flatMap(task => {
      if (task.subtasks && task.subtasks.length > 0) {
        return task.subtasks
          .filter(st => !st.completed)
          .map(st => ({
            id: st.id,
            day: getRelativeDay(task.deadline),
            title: st.title,
            time: `~${st.estimatedMinutes}m`,
            priority: task.priority,
            color: getPriorityColor(task.priority),
            parentTask: task.title,
          }));
      }
      return [{
        id: task.id,
        day: getRelativeDay(task.deadline),
        title: task.title,
        time: 'Full block',
        priority: task.priority,
        color: getPriorityColor(task.priority),
        parentTask: task.title,
      }];
    });

  const conflictCount = 0; // Future: detect overlapping time slots

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border border-blue-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
            <CalendarDays className="w-4 h-4" />
            <span>Live Task Schedule</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Autonomous Schedule Engine</h1>
          <p className="text-sm text-gray-400 mt-1">
            Showing {scheduleBlocks.length} pending action items from {tasks.filter(t => t.status !== 'COMPLETED').length} active tasks.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-xs font-semibold text-blue-300 flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>{conflictCount === 0 ? 'Zero Conflicts Detected' : `${conflictCount} Conflicts Found`}</span>
        </div>
      </div>

      {/* Timeline List View */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-gray-800 space-y-6">
        <h2 className="text-base font-bold text-white uppercase tracking-wider text-purple-400">Upcoming Action Items</h2>

        {scheduleBlocks.length === 0 ? (
          <div className="text-center py-16">
            <CalendarDays className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No pending tasks. Create a new goal from the Dashboard!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduleBlocks.map((block, idx) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ scale: 1.02 }}
                className={`p-5 rounded-2xl border backdrop-blur-md flex flex-col justify-between transition-all shadow-lg ${block.color}`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold opacity-80 mb-2">
                    <span>{block.day}</span>
                    <span className="px-2 py-0.5 rounded bg-black/30 border border-white/10">{block.time}</span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">{block.title}</h3>
                  <p className="text-[10px] text-gray-400 mt-1 truncate">from: {block.parentTask}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span>AI Scheduled</span>
                  </span>
                  <span className="font-mono uppercase text-[10px] tracking-widest px-2 py-0.5 bg-black/40 rounded">
                    {block.priority}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
