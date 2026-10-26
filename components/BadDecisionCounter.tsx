'use client';

import React, { useState } from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { AlertCircle, Skull, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BadDecisionCounter: React.FC = () => {
  const { badDecisions, incrementBadDecisions, playUiSound, addNotification } = useTerrible();
  const [clickCount, setClickCount] = useState(0);

  const formattedCount = String(badDecisions).padStart(6, '0');

  const handleCounterClick = () => {
    const nextClicks = clickCount + 1;
    setClickCount(nextClicks);
    incrementBadDecisions(1, 'counter');
    playUiSound('click');

    if (nextClicks === 5) {
      addNotification("COUNTER EASTER EGG", "Why are you clicking the counter? It counts bad decisions, not good ones!", "warning");
      playUiSound('secret');
      setClickCount(0);
    }
  };

  const getMilestoneBadge = () => {
    if (badDecisions >= 250) return { label: "CRITICAL FAILURE", color: "text-red-400 bg-red-950/60 border-red-500/40" };
    if (badDecisions >= 100) return { label: "OFFICIALLY BAD", color: "text-purple-400 bg-purple-950/60 border-purple-500/40" };
    if (badDecisions >= 50) return { label: "QUESTIONABLE", color: "text-yellow-400 bg-yellow-950/60 border-yellow-500/40" };
    return { label: "BEGINNER", color: "text-emerald-400 bg-emerald-950/60 border-emerald-500/40" };
  };

  const badge = getMilestoneBadge();

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <button
        onClick={handleCounterClick}
        title="Clicking this is a bad decision."
        className="group relative flex items-center gap-3 px-4 py-2.5 rounded-2xl glass-panel border border-purple-500/30 hover:border-purple-400/80 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden"
      >
        {/* Glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-fuchsia-600/10 to-emerald-600/10 group-hover:opacity-100 opacity-50 transition-opacity" />

        <div className="relative flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 group-hover:rotate-12 transition-transform">
            <Skull className="w-5 h-5 animate-pulse" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase flex items-center gap-1">
              BAD DECISIONS
              <Sparkles className="w-3 h-3 text-purple-400" />
            </span>
            <span className="font-mono text-xl font-bold tracking-wider text-white glow-purple">
              {formattedCount}
            </span>
          </div>
        </div>

        {/* Milestone Pill */}
        <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
          {badge.label}
        </span>
      </button>
    </motion.div>
  );
};
