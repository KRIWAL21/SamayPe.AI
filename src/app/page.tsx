'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TaskCard from '@/components/TaskCard';
import AddTaskModal from '@/components/AddTaskModal';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import JudgeEvaluationHUD from '@/components/JudgeEvaluationHUD';
import AgenticThinkingModal from '@/components/AgenticThinkingModal';
import VoiceGoalButton from '@/components/VoiceGoalButton';
import { Task, Priority, RiskLevel } from '@/lib/types';
import { Plus, Sparkles, Flame, CheckCircle2, AlertOctagon, TrendingUp, Calendar, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
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
    const user = localStorage.getItem('samaype_auth_user');
    if (!user) {
      router.push('/login');
      return;
    }
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    const handleUpdate = () => fetchTasks();
    window.addEventListener('tasksUpdated', handleUpdate);
    return () => {
      clearInterval(interval);
      window.removeEventListener('tasksUpdated', handleUpdate);
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

  return (
    <div className="space-y-8 relative">
      {/* Top Bar / Header with Cyber Mecha Styling */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-br from-purple-600/10 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-4 bottom-2 text-6xl font-black text-white/[0.03] select-none pointer-events-none tracking-tighter">
          サマイペ AI
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-widest text-cyan-400 mb-2">
            <Zap className="w-4 h-4 animate-bounce" />
            <span>SYSTEM AWAKENED // DEADLINE GUARDIAN V2.5</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center space-x-3">
            <span>{getGreeting()}, <span className="gradient-text">Creator</span></span>
          </h1>
          <p className="text-sm font-mono text-gray-300 mt-1.5 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
            <span>Autonomous schedule compression across 4 cognitive domains active.</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <WhatsAppWidget />
          <VoiceGoalButton onVoiceGoalCaptured={handleVoiceGoalCaptured} />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setModalOpen(true)}
            className="btn-cyber flex items-center space-x-2 text-white font-mono font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>NEW GOAL ✨</span>
          </motion.button>
        </div>
      </div>

      {/* Analytics Overview Grid - Cyber HUD Style */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border-l-4 border-l-red-500 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2 font-mono text-xs uppercase tracking-wider">
            <span>HIGH RISK DRIFT</span>
            <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
          </div>
          <div className="text-4xl font-black text-red-400 font-mono tracking-tighter">{criticalCount}</div>
          <p className="text-xs font-mono text-red-300/80 mt-1">Immediate intervention required</p>
        </motion.div>
        
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border-l-4 border-l-purple-500 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2 font-mono text-xs uppercase tracking-wider">
            <span>VELOCITY STREAK</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-4xl font-black text-white font-mono tracking-tighter">{streakCount} <span className="text-base font-normal text-purple-400">SYNCED</span></div>
          <p className="text-xs font-mono text-purple-300/80 mt-1">{streakCount > 3 ? 'S-Rank Momentum 🔥' : 'Awakening momentum...'}</p>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border-l-4 border-l-cyan-400 relative overflow-hidden">
          <div className="flex items-center justify-between text-gray-400 mb-2 font-mono text-xs uppercase tracking-wider">
            <span>SYNCHRONIZATION</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-4xl font-black text-cyan-400 font-mono tracking-tighter">{velocityPct}%</div>
          <p className="text-xs font-mono text-cyan-300/80 mt-1">{completedTasks.length}/{totalTasks} goals cleared</p>
        </motion.div>
      </div>

      {/* Main Task Priority Feed */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-6 bg-gradient-to-b from-purple-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            <h2 className="text-xl font-black text-white uppercase tracking-wider font-mono">Autonomous Deadline Queue</h2>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-3.5 py-1.5 rounded-lg border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            AI RANKED // ACTIVE
          </span>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
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
