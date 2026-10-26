'use client';

import React, { useEffect } from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, TrendingDown, Skull, MousePointerClick, 
  Layers, AlertTriangle, Trophy, Sparkles, CheckCircle2, Lock
} from 'lucide-react';

export default function DashboardPage() {
  const { badDecisions, achievements, unlockAchievement } = useTerrible();

  useEffect(() => {
    unlockAchievement('CHART_OBSERVER');
  }, [unlockAchievement]);

  const happinessData = [
    { time: '10 AM', happiness: 87, label: 'Normal Expectations' },
    { time: '11 AM', happiness: 72, label: 'First Fleeing Button' },
    { time: '12 PM', happiness: 54, label: 'Impossible Form Validation' },
    { time: '1 PM', happiness: 31, label: 'Popup Hell Stage 3' },
    { time: '2 PM', happiness: 12, label: 'BadGPT Response' },
  ];

  const totalUnlocked = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-mono text-xs font-semibold">
          <LayoutDashboard className="w-3.5 h-3.5" /> REAL-TIME TELEMETRY
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-mono text-white">ANALYTICS DASHBOARD</h1>
        <p className="text-sm text-gray-400 font-sans">
          Comprehensive data showing your user experience steadily deteriorating.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Card 1: User Happiness */}
        <div className="p-5 rounded-3xl glass-card border border-red-500/30 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">USER HAPPINESS</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-red-400">12%</span>
            <TrendingDown className="w-6 h-6 text-red-400 animate-pulse" />
          </div>
          <span className="text-[9px] font-mono text-red-400 mt-2">CRITICAL DECLINE</span>
        </div>

        {/* Card 2: Bad Decisions */}
        <div className="p-5 rounded-3xl glass-card border border-purple-500/30 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">BAD DECISIONS</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-purple-400">{badDecisions}</span>
            <Skull className="w-6 h-6 text-purple-400" />
          </div>
          <span className="text-[9px] font-mono text-purple-300 mt-2">PERSISTED TELEMETRY</span>
        </div>

        {/* Card 3: Buttons Clicked */}
        <div className="p-5 rounded-3xl glass-card border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">BUTTONS CLICKED</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">174</span>
            <MousePointerClick className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-[9px] font-mono text-emerald-300 mt-2">98% REGRETTED</span>
        </div>

        {/* Card 4: Forms Failed */}
        <div className="p-5 rounded-3xl glass-card border border-yellow-500/30 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">FORMS FAILED</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-yellow-400">31</span>
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
          </div>
          <span className="text-[9px] font-mono text-yellow-300 mt-2">VALIDATION REJECTED</span>
        </div>

        {/* Card 5: Popups Survived */}
        <div className="p-5 rounded-3xl glass-card border border-fuchsia-500/30 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">POPUPS SURVIVED</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-fuchsia-400">67</span>
            <Layers className="w-6 h-6 text-fuchsia-400" />
          </div>
          <span className="text-[9px] font-mono text-fuchsia-300 mt-2">MODAL LABYRINTH</span>
        </div>

        {/* Card 6: Confusion */}
        <div className="p-5 rounded-3xl glass-card border border-blue-500/30 flex flex-col justify-between">
          <span className="text-[10px] font-mono text-gray-400 uppercase">CONFUSION</span>
          <div className="flex items-center justify-between mt-2">
            <span className="text-3xl font-extrabold font-mono text-blue-400">97%</span>
            <Sparkles className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-[9px] font-mono text-blue-300 mt-2">OPTIMAL STATE</span>
        </div>
      </div>

      {/* User Happiness Over Time Chart Section */}
      <div className="p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-400" /> USER HAPPINESS TELEMETRY
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              Graph tracking the rapid decline of user happiness over time.
            </p>
          </div>
          <span className="text-xs font-mono text-red-400 px-3 py-1 rounded-full bg-red-950/60 border border-red-500/30">
            TREND: DISASTROUS
          </span>
        </div>

        {/* Custom Bar Chart Visualization */}
        <div className="h-64 flex items-end justify-between gap-4 pt-8 pb-2 px-4 border-b border-white/10">
          {happinessData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
              <div className="text-[11px] font-mono text-purple-300 font-bold mb-2 group-hover:scale-110 transition-transform">
                {item.happiness}%
              </div>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${item.happiness}%` }}
                transition={{ duration: 1, delay: idx * 0.1 }}
                className="w-full max-w-[60px] rounded-t-xl bg-gradient-to-t from-red-600 via-purple-600 to-fuchsia-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] relative"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
              </motion.div>
              <div className="text-[10px] font-mono text-gray-400 mt-3">{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement System Tracker */}
      <div className="p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold font-mono text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" /> SYSTEM ACHIEVEMENTS
            </h2>
            <p className="text-xs text-gray-400 font-sans">
              Unlocked: {totalUnlocked} / {achievements.length} Bad Decision Milestones
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(ach => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                ach.unlocked
                  ? 'bg-yellow-950/20 border-yellow-500/40 text-white shadow-[0_0_15px_rgba(234,179,8,0.15)]'
                  : 'bg-white/5 border-white/5 text-gray-500 opacity-60'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${ach.unlocked ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-white/5 text-gray-600'}`}>
                {ach.unlocked ? <CheckCircle2 className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-mono font-bold truncate">{ach.title}</h4>
                <p className="text-[11px] font-sans text-gray-400 mt-0.5 leading-snug">{ach.description}</p>
                {ach.unlockedAt && (
                  <span className="text-[9px] font-mono text-yellow-400/80 mt-1 block">
                    Unlocked: {ach.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
