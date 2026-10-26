'use client';

import React from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, Sparkles } from 'lucide-react';

export const AchievementToast: React.FC = () => {
  const { latestAchievement, dismissAchievement } = useTerrible();

  return (
    <AnimatePresence>
      {latestAchievement && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
        >
          <div className="relative p-4 rounded-2xl glass-panel border border-yellow-500/50 bg-gradient-to-r from-yellow-950/80 via-purple-950/80 to-black/90 shadow-[0_0_40px_rgba(234,179,8,0.3)] flex items-center gap-4 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            
            <div className="p-3 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 animate-bounce">
              <Trophy className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest text-yellow-400 uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                ACHIEVEMENT UNLOCKED!
              </div>
              <h3 className="text-base font-extrabold text-white truncate mt-0.5">
                {latestAchievement.title}
              </h3>
              <p className="text-xs text-gray-300 truncate">
                {latestAchievement.description}
              </p>
            </div>

            <button
              onClick={dismissAchievement}
              className="p-1 rounded-lg text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
