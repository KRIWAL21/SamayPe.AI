'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TaskCard from '@/components/TaskCard';
import AddTaskModal from '@/components/AddTaskModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import JudgeEvaluationHUD from '@/components/JudgeEvaluationHUD';
import AgenticThinkingModal from '@/components/AgenticThinkingModal';
import VoiceGoalButton from '@/components/VoiceGoalButton';
import ThemeToggle from '@/components/ThemeToggle';
import { Task, Priority, RiskLevel } from '@/lib/types';
import { Plus, Sparkles, Flame, CheckCircle2, AlertOctagon, TrendingUp, Calendar, Zap, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function getHeaderTitle(userName?: string): string {
  const hour = new Date().getHours();
  const name = userName || 'Creator';
  if (hour >= 5 && hour < 12) return `Good morning, ${name} 🌅`;
  if (hour >= 12 && hour < 17) return `Good afternoon, ${name} ☀️`;
  return `Good evening, ${name} 🌙`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'HIGH_RISK' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [thinkingTitle, setThinkingTitle] = useState('Autonomous Cognitive Decomposition');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      if (data.success && data.tasks) {
        setTasks(data.tasks);
      }
    } catch (e) {
      console.error('Failed to fetch tasks', e);
    }
  };

  useEffect(() => {
    const checkUser = () => {
      const user = localStorage.getItem('samaype_auth_user');
      if (!user) {
        router.push('/login');
        return;
      }
      try {
        const parsed = JSON.parse(user);
        setUserName(parsed.name || parsed.email?.split('@')[0] || 'Creator');
      } catch (e) {}
    };

    checkUser();
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    const handleUpdate = () => fetchTasks();
    const handleStorage = () => checkUser();
    window.addEventListener('tasksUpdated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      clearInterval(interval);
      window.removeEventListener('tasksUpdated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [router]);

  const handleToggleSubtask = async (taskId: string, subtaskId: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const updatedSubtasks = targetTask.subtasks.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    const allDone = updatedSubtasks.every(st => st.completed);
    const updatedTask = {
      ...targetTask,
      subtasks: updatedSubtasks,
      status: allDone ? 'COMPLETED' : 'IN_PROGRESS'
    } as any;

    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    toast.success('Subtask progress synced across DB!');

    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
    } catch (e) {}
  };

  const handleReschedule = (taskId: string) => {
    setThinkingTitle('Proactive Auto-Fix Rescheduling');
    setPendingAction(() => async () => {
      const toastId = toast.loading('🤖 Realigning deadline against circadian energy curves...');
      try {
        const res = await fetch('/api/reschedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId })
        });
        const data = await res.json();
        if (data.success && data.task) {
          setTasks(prev => prev.map(t => t.id === taskId ? data.task : t));
          toast.success('Schedule autonomously optimized & persisted!', { id: toastId });
        } else {
          throw new Error(data.error || 'Failed');
        }
      } catch (e: any) {
        toast.error('Failed to auto-reschedule task', { id: toastId });
      }
    });
    setThinkingOpen(true);
  };

  const handleTaskCreated = (newTask: Task) => {
    setThinkingTitle('Autonomous Goal Decomposition');
    setPendingAction(() => () => {
      setTasks(prev => [newTask, ...prev]);
      fetchTasks();
    });
    setThinkingOpen(true);
  };

  const handleVoiceGoalCaptured = async (transcript: string) => {
    setThinkingTitle('Voice Goal Parsing & Decomposition');
    setThinkingOpen(true);
    setPendingAction(() => async () => {
      try {
        const res = await fetch('/api/decompose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: transcript, description: 'Captured via Voice Command HUD' })
        });
        const data = await res.json();
        if (data.success && data.task) {
          await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data.task)
          });
          setTasks(prev => [data.task, ...prev]);
          toast.success('Voice goal decomposed & scheduled!');
        }
      } catch (e) {
        toast.error('Failed to process voice goal.');
      }
    });
  };

  const handleInjectScenario = async (scenarioType: 'burnout' | 'hackathon') => {
    setThinkingTitle(scenarioType === 'burnout' ? 'Simulating Burnout Risk Drift' : 'Decomposing Hackathon Submission');
    setThinkingOpen(true);
    setPendingAction(() => async () => {
      const simulatedTasks: any[] = scenarioType === 'burnout' ? [
        {
          id: `sim-b1-${Date.now()}`,
          title: 'Advanced Machine Learning Project Submission',
          description: 'Emergency overload injection',
          priority: Priority.URGENT,
          riskLevel: RiskLevel.CRITICAL,
          deadline: new Date(Date.now() + 3600000).toISOString(),
          dueDate: new Date(Date.now() + 3600000).toISOString(),
          estimatedMinutes: 240,
          status: 'PENDING' as any,
          subtasks: [
            { id: 'st1', title: 'Train Transformer model weights', estimatedMinutes: 120, completed: false },
            { id: 'st2', title: 'Compile latex evaluation report', estimatedMinutes: 120, completed: false }
          ],
          aiRecommendation: '🚨 CRITICAL OVERLOAD: Defer Latex report to tomorrow morning when cognitive energy peak returns.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: `sim-b2-${Date.now()}`,
          title: 'Operating Systems Kernel Patch Debugging',
          description: 'High risk kernel deadlock bug',
          priority: Priority.HIGH,
          riskLevel: RiskLevel.HIGH,
          deadline: new Date(Date.now() + 7200000).toISOString(),
          dueDate: new Date(Date.now() + 7200000).toISOString(),
          estimatedMinutes: 180,
          status: 'PENDING' as any,
          subtasks: [{ id: 'st1', title: 'Inspect mutex lock traces', estimatedMinutes: 180, completed: false }],
          aiRecommendation: 'Break into 25m Pomodoro intervals to prevent mental fatigue.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ] : [
        {
          id: `sim-h1-${Date.now()}`,
          title: 'Submit Vibe2Ship AI Hackathon Pitch & Demo Deck',
          description: 'Final submission countdown',
          priority: Priority.URGENT,
          riskLevel: RiskLevel.CRITICAL,
          deadline: new Date(Date.now() + 18000000).toISOString(),
          dueDate: new Date(Date.now() + 18000000).toISOString(),
          estimatedMinutes: 120,
          status: 'PENDING' as any,
          subtasks: [
            { id: 'st1', title: 'Record 2-minute Loom walkthrough video', estimatedMinutes: 30, completed: true },
            { id: 'st2', title: 'Test Twilio WhatsApp interactive menu', estimatedMinutes: 15, completed: true },
            { id: 'st3', title: 'Verify Judge Demo bypass credentials', estimatedMinutes: 10, completed: true },
            { id: 'st4', title: 'Push final clean commit to GitHub main', estimatedMinutes: 10, completed: true },
            { id: 'st5', title: 'Submit BlockseBlock submission portal link', estimatedMinutes: 15, completed: false }
          ],
          aiRecommendation: '🎯 YOU ARE ON TRACK! Complete step 5 right now to secure early evaluation.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      for (const t of simulatedTasks) {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(t)
        });
      }
      fetchTasks();
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.success('Commitment deleted!');
    try {
      await fetch(`/api/tasks?id=${taskId}`, { method: 'DELETE' });
    } catch (e) {}
  };

  const handleRenameTask = async (taskId: string, newTitle: string) => {
    const target = tasks.find(t => t.id === taskId);
    if (!target) return;
    const updated = { ...target, title: newTitle, updatedAt: new Date().toISOString() };
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    toast.success('Title updated!');
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {}
  };

  const dueTodayCount = tasks.filter(t => t.status !== 'COMPLETED').length;
  const criticalCount = tasks.filter(t => t.riskLevel === RiskLevel.CRITICAL || t.riskLevel === RiskLevel.HIGH).length;

  // Compute real stats from task data
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const totalTasks = tasks.length;
  const velocityPct = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Calculate streak: count consecutive completed tasks from most recent
  const sortedByUpdate = [...tasks].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  let streakCount = 0;
  for (const t of sortedByUpdate) {
    if (t.status === 'COMPLETED') streakCount++;
    else break;
  }

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
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>AI SUPER AGENT // DEADLINE GUARDIAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <span>{getHeaderTitle(userName)}</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
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

      <WhatsAppWidget />

      {/* Analytics & Health Cards (ClickUp / Todoist Sleek Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-red-500 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">High Risk Drift</div>
            <div className="text-3xl font-black text-red-400 font-mono mt-1">{criticalCount}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Immediate intervention needed</div>
          </div>
          <AlertOctagon className="w-8 h-8 text-red-400/30 animate-pulse" />
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-purple-500 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Velocity Streak</div>
            <div className="text-3xl font-black text-white font-mono mt-1">{streakCount} <span className="text-xs font-normal text-purple-400">SYNCED</span></div>
            <div className="text-[11px] text-gray-400 mt-0.5">Consecutive AI milestones</div>
          </div>
          <Flame className="w-8 h-8 text-orange-400/30" />
        </div>

        <div className="glass-card p-5 rounded-2xl border-l-4 border-l-cyan-400 flex items-center justify-between">
          <div>
            <div className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">Synchronization</div>
            <div className="text-3xl font-black text-cyan-400 font-mono mt-1">{velocityPct}%</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{completedTasks.length} of {totalTasks} cleared</div>
          </div>
          <TrendingUp className="w-8 h-8 text-cyan-400/30" />
        </div>
      </div>

      {/* Executive Action Summary (Inbox is separate at /inbox) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-2 h-5 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full" />
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider font-mono">
              Immediate Execution Priority
            </h2>
            <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">
              TOP FOCUS
            </span>
          </div>

          <Link href="/inbox">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <span>View Full Execution Inbox ({tasks.length}) →</span>
            </motion.button>
          </Link>
        </div>

        {tasks.filter(t => t.status !== 'COMPLETED').slice(0, 3).length === 0 ? (
          <div className="glass-card p-10 rounded-2xl text-center space-y-3 border border-dashed border-white/15">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto text-xl">
              ⚡
            </div>
            <h3 className="text-base font-bold text-white">All Active Priorities Cleared!</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Your execution queue is clean. Check the Execution Inbox or decompose a new objective.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {tasks.filter(t => t.status !== 'COMPLETED').slice(0, 3).map((task) => (
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

      <AgenticThinkingModal
        isOpen={thinkingOpen}
        title={thinkingTitle}
        onComplete={() => {
          setThinkingOpen(false);
          if (pendingAction) {
            pendingAction();
            setPendingAction(null);
          }
        }}
      />

      <JudgeEvaluationHUD onInjectScenario={handleInjectScenario} />
    </div>
  );
}
