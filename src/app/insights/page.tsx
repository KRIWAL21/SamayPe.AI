'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Sparkles, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Task } from '@/lib/types';

export default function InsightsPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
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
        if (data.success && data.tasks) setTasks(data.tasks);
      } catch (e) {
        console.error('Failed to fetch tasks for insights', e);
      }
    };
    fetchTasks();
  }, []);

  // Compute real stats
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED');
  const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? ((completedTasks.length / totalTasks) * 100).toFixed(1) : '0';
  const criticalCount = tasks.filter(t => t.riskLevel === 'CRITICAL' || t.riskLevel === 'HIGH').length;

  // Build category distribution from real data
  const categoryMap: Record<string, number> = {};
  tasks.forEach(t => {
    const cat = t.category || 'Uncategorized';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });
  const categoryColors = ['#7c3aed', '#3b82f6', '#06b6d4', '#10b981', '#f97316', '#ef4444'];
  const categoryDistribution = Object.entries(categoryMap).map(([name, count], idx) => ({
    name,
    value: totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0,
    color: categoryColors[idx % categoryColors.length],
  }));

  // Build completion trend from subtask data
  const completionTrend = (() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const trend: { day: string; completed: number; active: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay()];

      // Count tasks created/updated on this day
      const dayStr = date.toISOString().split('T')[0];
      const completedOnDay = tasks.filter(t => t.status === 'COMPLETED' && t.updatedAt.startsWith(dayStr)).length;
      const activeOnDay = tasks.filter(t => t.status !== 'COMPLETED' && t.createdAt.startsWith(dayStr)).length;

      trend.push({ day: dayName, completed: completedOnDay, active: activeOnDay });
    }
    return trend;
  })();

  // Determine peak hours from task data
  const peakHours = (() => {
    const hourCounts: Record<number, number> = {};
    tasks.forEach(t => {
      const hour = new Date(t.updatedAt || t.createdAt).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    const sorted = Object.entries(hourCounts).sort((a, b) => Number(b[1]) - Number(a[1]));
    if (sorted.length >= 2) {
      const h1 = Number(sorted[0][0]);
      const h2 = Number(sorted[1][0]);
      const start = Math.min(h1, h2);
      const end = Math.max(h1, h2);
      return `${start > 12 ? start - 12 : start} ${start >= 12 ? 'PM' : 'AM'} and ${end > 12 ? end - 12 : end} ${end >= 12 ? 'PM' : 'AM'}`;
    }
    return 'Not enough data yet';
  })();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border border-purple-500/20">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-2">
            <BarChart3 className="w-4 h-4" />
            <span>Productivity Telemetry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Analytics & Insights</h1>
          <p className="text-sm text-gray-400 mt-1">
            Real-time behavioral diagnostics computed from your {totalTasks} tracked tasks.
          </p>
        </div>
      </div>

      {/* AI Executive Report Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-blue-950/60 to-black border border-purple-500/40 shadow-2xl relative overflow-hidden">
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-2xl bg-purple-600 text-white shadow-lg shadow-purple-600/40 flex-shrink-0">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-300">Live Analytics Report</span>
            <h3 className="text-xl font-bold text-white mt-1">
              {Number(completionRate) > 50 ? 'Strong Execution Velocity' : 'Room for Improvement'}
            </h3>
            <p className="text-sm text-gray-300 mt-2 leading-relaxed">
              Your task completion rate is <strong className={Number(completionRate) > 50 ? 'text-green-400' : 'text-yellow-400'}>{completionRate}%</strong> across {totalTasks} total tasks.
              {criticalCount > 0 && <> You have <strong className="text-red-400">{criticalCount} high-risk deadlines</strong> requiring intervention.</>}
              {' '}Your peak activity hours are around <strong className="text-cyan-400">{peakHours}</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Completion Trend */}
        <div className="glass-card lg:col-span-2 p-6 sm:p-8 rounded-3xl border border-gray-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white">7-Day Activity</h3>
                <p className="text-xs text-gray-400 mt-0.5">Tasks completed and created by day</p>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <span className="flex items-center space-x-1.5 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />
                  <span>Completed</span>
                </span>
                <span className="flex items-center space-x-1.5 text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  <span>Created</span>
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={completionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#4b5563" fontSize={12} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={12} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#13131a', border: '1px solid #374151', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorComp)" />
                  <Area type="monotone" dataKey="active" stroke="#3b82f6" strokeWidth={2} fillOpacity={0.1} fill="#3b82f6" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Chart: Category Distribution */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Commitment Allocation</h3>
            <p className="text-xs text-gray-400 mt-0.5">Workload by category (from real tasks)</p>

            <div className="h-48 w-full mt-4 flex items-center justify-center">
              {categoryDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#13131a', border: '1px solid #374151', borderRadius: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-xs">No tasks yet</p>
              )}
            </div>

            <div className="space-y-2 mt-4">
              {categoryDistribution.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="flex items-center space-x-2 text-gray-300 font-medium">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: cat.color }} />
                    <span>{cat.name}</span>
                  </span>
                  <span className="font-mono text-gray-400">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{totalTasks}</div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-extrabold text-green-400">{completedTasks.length}</div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border border-gray-800">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-blue-400">{activeTasks.length}</div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-2xl border border-red-500/20 bg-red-950/10">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-300">At Risk</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-red-400">{criticalCount}</div>
        </motion.div>
      </div>
    </div>
  );
}
