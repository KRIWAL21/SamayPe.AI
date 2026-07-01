'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard from '@/components/TaskCard';
import AddTaskModal from '@/components/AddTaskModal';
import VoiceGoalButton from '@/components/VoiceGoalButton';
import ThemeToggle from '@/components/ThemeToggle';
import { Task, Priority, RiskLevel } from '@/lib/types';
import { Plus, Sparkles, CheckCircle2, AlertOctagon, TrendingUp, Zap, Search, Filter, Inbox as InboxIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function InboxPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'HIGH_RISK' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.success && data.tasks) {
        setTasks(data.tasks);
      }
    } catch (e) {
      console.error('Failed to fetch tasks:', e);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Commitment removed');
        fetchTasks();
      }
    } catch (e) {
      toast.error('Failed to remove commitment');
    }
  };

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task || !task.subtasks) return;

      const updatedSubtasks = task.subtasks.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );

      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, subtasks: updatedSubtasks })
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (e) {
      toast.error('Failed to toggle subtask');
    }
  };

  const handleReschedule = async (taskId: string) => {
    const toastId = toast.loading('Autonomous cognitive reschedule in progress...');
    try {
      const res = await fetch('/api/reschedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('AI optimized schedule!', { id: toastId });
        fetchTasks();
      } else {
        toast.error('Reschedule failed', { id: toastId });
      }
    } catch (e) {
      toast.error('Reschedule error', { id: toastId });
    }
  };

  const handleRenameTask = async (taskId: string, newTitle: string) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, title: newTitle })
      });
      if (res.ok) {
        toast.success('Commitment renamed');
        fetchTasks();
      }
    } catch (e) {
      toast.error('Failed to rename task');
    }
  };

  const handleVoiceGoalCaptured = (text: string) => {
    toast.success(`Voice goal captured: "${text}"`);
    fetchTasks();
  };

  const dueTodayCount = tasks.filter(t => t.status !== 'COMPLETED').length;
  const criticalCount = tasks.filter(t => t.riskLevel === RiskLevel.CRITICAL || t.riskLevel === RiskLevel.HIGH).length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'ACTIVE') return t.status !== 'COMPLETED';
    if (activeTab === 'HIGH_RISK') return t.riskLevel === RiskLevel.CRITICAL || t.riskLevel === RiskLevel.HIGH;
    if (activeTab === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="space-y-6 relative pb-16">
      {/* ClickUp Style Workspace Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-purple-500/30 relative overflow-hidden">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400 mb-1">
            <InboxIcon className="w-3.5 h-3.5 animate-pulse" />
            <span>SAMAYPE.AI // EXECUTION INBOX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <span>Commitments & Execution Queue</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <ThemeToggle />
          <VoiceGoalButton onVoiceGoalCaptured={handleVoiceGoalCaptured} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setModalOpen(true)}
            className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl flex items-center space-x-2 shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Commitment</span>
          </motion.button>
        </div>
      </div>

      {/* ClickUp Style Filter & Search Bar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: View Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: 'All Tasks', count: tasks.length },
            { id: 'ACTIVE', label: 'Active', count: dueTodayCount },
            { id: 'HIGH_RISK', label: 'At Risk', count: criticalCount },
            { id: 'COMPLETED', label: 'Done', count: completedTasks.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center space-x-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30' 
                  : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Right: Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search commitments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/10 focus:border-purple-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Todoist Style Section Header */}
      <div>
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-2 h-5 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
              {activeTab === 'ALL' && 'All Active Commitments'}
              {activeTab === 'ACTIVE' && 'Active Execution Queue'}
              {activeTab === 'HIGH_RISK' && 'High Risk Drift Alerts'}
              {activeTab === 'COMPLETED' && 'Archived & Completed Milestones'}
            </h2>
            <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded border border-white/10 text-gray-400">
              {filteredTasks.length} ITEMS
            </span>
          </div>
        </div>

        {/* Task List Rendering */}
        {filteredTasks.length === 0 ? (
          <div className="glass-card p-12 rounded-2xl text-center space-y-3 border border-dashed border-white/15">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto text-xl">
              ✨
            </div>
            <h3 className="text-base font-bold text-white">No commitments found in this view</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {searchQuery ? `No tasks matched "${searchQuery}". Try a different filter or search keyword.` : "You have cleared all tasks in this category! Use '+ New Commitment' to decompose your next goal."}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleSubtask={handleToggleSubtask}
                onReschedule={handleReschedule}
                onDelete={handleDeleteTask}
                onRename={handleRenameTask}
              />
            ))}
          </div>
        )}
      </div>

      <AddTaskModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}
