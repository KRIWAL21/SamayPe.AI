'use client';

import React, { useState, useEffect } from 'react';
import { CalendarDays, Sparkles, Clock, ShieldCheck, Plus, CheckCircle2, Circle, ChevronLeft, ChevronRight, Flag, Trash2, Calendar as CalendarIcon, Zap, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, Priority, RiskLevel } from '@/lib/types';
import toast from 'react-hot-toast';

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'URGENT': return 'text-red-400 bg-red-500/10 border-red-500/30';
    case 'HIGH': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
    default: return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  }
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeDateOffset, setActiveDateOffset] = useState(0); // 0 = start from today
  const [addingTaskForDate, setAddingTaskForDate] = useState<string | null>(null);
  
  // Quick Add State
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<Priority>(Priority.MEDIUM);
  const [newTime, setNewTime] = useState('09:00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      let userId = 'demo-user';
      if (typeof window !== 'undefined') {
        const uStr = localStorage.getItem('samaype_auth_user');
        if (uStr) {
          try {
            const u = JSON.parse(uStr);
            if (u?.id) userId = u.id;
          } catch (e) {}
        }
      }
      const res = await fetch(`/api/tasks?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      if (data.success && data.tasks) {
        setTasks(data.tasks);
      }
    } catch (e) {
      console.error('Failed to fetch tasks for calendar', e);
    }
  };

  useEffect(() => {
    fetchTasks();
    window.addEventListener('tasksUpdated', fetchTasks);
    return () => window.removeEventListener('tasksUpdated', fetchTasks);
  }, []);

  const handleToggleCompleted = async (task: Task) => {
    try {
      const newStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, status: newStatus })
      });
      if (res.ok) {
        toast.success(newStatus === 'COMPLETED' ? 'Commitment completed! 🎉' : 'Commitment reopened');
        fetchTasks();
      }
    } catch (e) {
      toast.error('Failed to update commitment');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Commitment deleted');
        fetchTasks();
      }
    } catch (e) {
      toast.error('Failed to delete commitment');
    }
  };

  const handleCreateFutureTask = async (dateStr: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    const toastId = toast.loading('Scheduling future commitment in MongoDB...');

    // Combine date and time
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, mins] = newTime.split(':').map(Number);
    const targetDate = new Date(year, month - 1, day, hours, mins);

    let currentUserId = 'demo-user';
    if (typeof window !== 'undefined') {
      const uStr = localStorage.getItem('samaype_auth_user');
      if (uStr) {
        try {
          const u = JSON.parse(uStr);
          if (u?.id) currentUserId = u.id;
        } catch (e) {}
      }
    }

    const newTaskPayload = {
      id: `task-cal-${Date.now()}`,
      userId: currentUserId,
      title: newTitle,
      description: `Scheduled via Upcoming Calendar View for ${targetDate.toLocaleDateString()}`,
      deadline: targetDate.toISOString(),
      dueDate: targetDate.toISOString(),
      priority: newPriority,
      status: 'TODO',
      category: 'Future Event',
      riskLevel: RiskLevel.LOW,
      riskScore: 0.1,
      estimatedMinutes: 60,
      subtasks: []
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskPayload)
      });
      if (res.ok) {
        toast.success('Future event added to timeline!', { id: toastId });
        setNewTitle('');
        setAddingTaskForDate(null);
        fetchTasks();
      } else {
        toast.error('Failed to add future event', { id: toastId });
      }
    } catch (err) {
      toast.error('Error saving future event', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate 14 upcoming days
  const upcomingDays = Array.from({ length: 14 }).map((_, idx) => {
    const date = new Date();
    date.setDate(date.getDate() + idx + activeDateOffset);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    
    let relativeLabel = '';
    if (idx + activeDateOffset === 0) relativeLabel = 'Today';
    else if (idx + activeDateOffset === 1) relativeLabel = 'Tomorrow';

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const dayShort = date.toLocaleDateString('en-US', { weekday: 'short' });
    const monthDay = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

    return {
      date,
      dateStr,
      relativeLabel,
      dayName,
      dayShort,
      monthDay,
      dayNumber: date.getDate()
    };
  });

  const currentMonthHeader = upcomingDays[0].date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 text-white pb-24">
      {/* Top Header Bar (Todoist / ClickUp Hybrid) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent pointer-events-none" />
        
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 mb-1.5">
            <CalendarIcon className="w-3.5 h-3.5 animate-pulse" />
            <span>SAMAYPE.AI // UPCOMING TIMELINE</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Upcoming</h1>
            <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-sm font-mono text-gray-300 font-bold">
              {currentMonthHeader}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            Schedule future commitments, meetings, and deadlines directly onto your timeline.
          </p>
        </div>

        <div className="flex items-center space-x-2 relative z-10">
          <button
            onClick={() => setActiveDateOffset(Math.max(0, activeDateOffset - 7))}
            disabled={activeDateOffset === 0}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-30 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveDateOffset(0)}
            className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-xs font-bold text-purple-300 transition-all cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setActiveDateOffset(activeDateOffset + 7)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Week Strip */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 glass-panel p-4 rounded-2xl border border-white/10 overflow-x-auto">
        {upcomingDays.slice(0, 7).map((day, idx) => {
          const isToday = idx + activeDateOffset === 0;
          const taskCount = tasks.filter(t => {
            if (t.status === 'COMPLETED') return false;
            const tDate = (t as any).deadline || (t as any).dueDate;
            return tDate && tDate.startsWith(day.dateStr);
          }).length;

          return (
            <a
              key={day.dateStr}
              href={`#date-${day.dateStr}`}
              className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                isToday
                  ? 'bg-gradient-to-b from-purple-600 to-blue-600 border-purple-400 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
              }`}
            >
              <span className="text-[11px] font-mono uppercase font-bold opacity-80">{day.dayShort}</span>
              <span className="text-lg sm:text-xl font-black mt-1">{day.dayNumber}</span>
              {taskCount > 0 && (
                <span className={`mt-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isToday ? 'bg-white/30 text-white' : 'bg-purple-500/30 text-purple-300'
                }`}>
                  {taskCount} {taskCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </a>
          );
        })}
      </div>

      {/* Vertical Timeline View (Todoist Upcoming Style) */}
      <div className="space-y-10 max-w-5xl mx-auto">
        {upcomingDays.map((day) => {
          // Find tasks for this date
          const dayTasks = tasks.filter(t => {
            const tDate = (t as any).deadline || (t as any).dueDate;
            return tDate && tDate.startsWith(day.dateStr);
          });

          return (
            <div key={day.dateStr} id={`date-${day.dateStr}`} className="scroll-mt-24 space-y-3">
              {/* Date Header Row */}
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span className="text-base sm:text-lg font-extrabold text-white">
                    {day.monthDay}
                  </span>
                  {day.relativeLabel && (
                    <span className="text-xs sm:text-sm font-bold text-purple-400">
                      · {day.relativeLabel}
                    </span>
                  )}
                  <span className="text-xs sm:text-sm text-gray-400">
                    · {day.dayName}
                  </span>
                </div>
                
                <span className="text-xs font-mono text-gray-500">
                  {dayTasks.length} {dayTasks.length === 1 ? 'commitment' : 'commitments'}
                </span>
              </div>

              {/* Tasks List for this date */}
              <div className="space-y-2">
                {dayTasks.map(task => {
                  const isDone = task.status === 'COMPLETED';
                  const timeFormatted = new Date((task as any).deadline || (task as any).dueDate || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <motion.div
                      key={task.id}
                      whileHover={{ scale: 1.005 }}
                      className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${
                        isDone
                          ? 'bg-black/30 border-gray-900 opacity-60'
                          : 'glass-panel border-white/10 hover:border-purple-500/40 shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                        <button
                          onClick={() => handleToggleCompleted(task)}
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                            isDone
                              ? 'bg-green-500 border-green-500 text-black'
                              : 'border-gray-600 hover:border-purple-400'
                          }`}
                        >
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-bold truncate ${isDone ? 'line-through text-gray-500' : 'text-white'}`}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-400 truncate mt-0.5">{task.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 flex-shrink-0 pl-3">
                        <span className="flex items-center space-x-1 text-xs font-mono text-gray-400 bg-white/5 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3 h-3 text-purple-400" />
                          <span>{timeFormatted}</span>
                        </span>

                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Todoist Style "+ Add Task" Button or Inline Form */}
              {addingTaskForDate === day.dateStr ? (
                <motion.form
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={(e) => handleCreateFutureTask(day.dateStr, e)}
                  className="glass-panel p-4 rounded-2xl border border-purple-500/40 space-y-4 shadow-xl mt-2"
                >
                  <div className="flex items-center space-x-2 text-xs font-mono font-bold text-purple-300">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>NEW COMMITMENT FOR {day.monthDay.toUpperCase()}</span>
                  </div>

                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Event title or task description (e.g., Hackathon Final Pitch Review)..."
                    autoFocus
                    className="w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                    required
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as Priority)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-gray-300 focus:outline-none focus:border-purple-500 cursor-pointer"
                      >
                        <option value={Priority.URGENT} className="bg-[#13161f]">Priority: URGENT</option>
                        <option value={Priority.HIGH} className="bg-[#13161f]">Priority: HIGH</option>
                        <option value={Priority.MEDIUM} className="bg-[#13161f]">Priority: MEDIUM</option>
                        <option value={Priority.LOW} className="bg-[#13161f]">Priority: LOW</option>
                      </select>

                      <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono text-gray-300">
                        <Clock className="w-3.5 h-3.5 text-purple-400" />
                        <input
                          type="time"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                          className="bg-transparent focus:outline-none text-white cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAddingTaskForDate(null);
                          setNewTitle('');
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || !newTitle.trim()}
                        className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-95 text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? 'Saving...' : 'Add Event to Timeline'}
                      </button>
                    </div>
                  </div>
                </motion.form>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAddingTaskForDate(day.dateStr);
                    setNewTitle('');
                  }}
                  className="group flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-purple-400 py-2 px-3 rounded-xl hover:bg-purple-500/10 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
                  <span>Add task / event</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
