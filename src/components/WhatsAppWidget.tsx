'use client';

import React, { useState } from 'react';
import { MessageCircle, QrCode, Sparkles, CheckCircle2, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function WhatsAppWidget() {
  const [showQR, setShowQR] = useState(false);
  const [connected, setConnected] = useState(false);

  const whatsappDeepLink = "https://wa.me/14155238886?text=join%20samaype-ai";

  const handleConnect = () => {
    window.open(whatsappDeepLink, '_blank');
    setConnected(true);
    toast.success('💬 Launched WhatsApp Sandbox! Send the join message to activate.');
  };

  const handleSimulateAlert = async () => {
    const toastId = toast.loading('⚡ Dispatching test intervention & persisting emergency task...');
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '🚨 EMERGENCY: Fix Cloud Run Container OOM Crash',
          description: 'Received WhatsApp alert: Memory spike detected on serverless instance. Immediate debugging required.',
          category: 'DevOps Alert',
          priority: 'URGENT',
          status: 'TODO',
          deadline: new Date(Date.now() + 1000 * 60 * 120).toISOString(),
          riskScore: 0.95,
          riskLevel: 'CRITICAL',
          aiRecommendation: '🚨 CRITICAL INTERVENTION: Drop lower priority meetings. Allocate immediate 2-hour debugging block.',
          subtasks: [
            { id: `wa-1`, title: 'Inspect Google Cloud Logs for OOM exit code', estimatedMinutes: 20, completed: false },
            { id: `wa-2`, title: 'Increase container memory allocation to 2Gi', estimatedMinutes: 15, completed: false },
            { id: `wa-3`, title: 'Redeploy revision and verify webhook stability', estimatedMinutes: 25, completed: false }
          ]
        })
      });
      window.dispatchEvent(new Event('tasksUpdated'));
      toast.success('📱 WhatsApp Alert Processed! Emergency task added to Dashboard live.', { id: toastId });
    } catch (e) {
      toast.error('Failed to dispatch alert', { id: toastId });
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-black/40 to-purple-950/20 relative overflow-hidden shadow-xl">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4 max-w-xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-600/30 flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-white fill-white animate-pulse" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Multi-Channel Intervention Live</span>
              {connected && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Synced</span>
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight mt-1">Get the App on WhatsApp 💬</h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">
              No need to download or juggle separate apps! Schedule tasks, add events, check your daily planner, diagnose deadline risks, and ask AI anything—all on the go via the SamayPe AI WhatsApp Bot Companion.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <button
            onClick={() => setShowQR(!showQR)}
            className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-400" />
            <span>{showQR ? 'Hide QR' : 'Scan QR Code'}</span>
          </button>

          <button
            onClick={handleConnect}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Open WhatsApp Bot</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable QR Code Box */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
          >
            <div className="flex items-center space-x-6">
              {/* Simulated QR Code Visual Box */}
              <div className="w-32 h-32 rounded-2xl bg-white p-3 shadow-xl flex items-center justify-center border-4 border-emerald-500/40 relative group">
                <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col items-center justify-center p-2 text-center border border-gray-200">
                  <QrCode className="w-12 h-12 text-emerald-400 mb-1" />
                  <span className="text-[9px] font-mono font-bold text-white tracking-tighter">SCAN TO JOIN</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-300">
                <div className="font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Twilio Official Sandbox Integration</span>
                </div>
                <p>1. Open your smartphone camera or WhatsApp scanner.</p>
                <p>2. Send the pre-filled text: <code className="bg-black/60 px-2 py-0.5 rounded text-emerald-300 font-mono">join samaype-ai</code></p>
                <p>3. Your autonomous agent will immediately greet you!</p>
              </div>
            </div>

            <button
              onClick={handleSimulateAlert}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Simulate Test Alert 📱</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
