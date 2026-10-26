'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTerrible } from '@/context/TerribleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, AlertTriangle, RefreshCw, Sparkles, ArrowRight, X } from 'lucide-react';

export default function PopupHell() {
  const router = useRouter();
  const { incrementBadDecisions, addNotification, playUiSound, unlockAchievement } = useTerrible();

  const [modalStage, setModalStage] = useState<number>(0);
  const [fakeLoadingPercent, setFakeLoadingPercent] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState<'idle' | 'loading' | 'failed' | 'complete'>('idle');

  // ESC escape hatch listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalStage > 0) {
        playUiSound('click');
        setModalStage(0);
        addNotification("ESCAPE HATCH", "Keyboard ESC pressed! Escaped Popup Hell.", "info");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalStage, playUiSound, addNotification]);

  const handleNextStage = () => {
    playUiSound('modal');
    incrementBadDecisions(1, `popup_stage_${modalStage}`);
    const next = modalStage + 1;

    if (next === 5) {
      setModalStage(5);
      triggerFakeLoading();
    } else {
      setModalStage(next);
    }
  };

  const triggerFakeLoading = () => {
    setLoadingStatus('loading');
    const steps = [1, 8, 23, 47, 71, 89, 98, 99, 99, 98, 100];
    let idx = 0;

    const interval = setInterval(() => {
      if (idx < steps.length) {
        setFakeLoadingPercent(steps[idx]);
        playUiSound('loading');
        idx += 1;
      } else {
        clearInterval(interval);
        setLoadingStatus('failed');
        playUiSound('error');
      }
    }, 400);
  };

  const handleFinalSuccess = () => {
    playUiSound('achievement');
    unlockAchievement('POPUP_SURVIVOR');
    addNotification("ACHIEVEMENT UNLOCKED", "Survived Popup Hell! Redirecting to Dashboard...", "success");
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 text-center">
      {/* Title */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-mono text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" /> MODAL LABYRINTH
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-mono text-white">POPUP HELL</h1>
        <p className="text-sm text-gray-400 font-sans max-w-xl mx-auto">
          Click the button below to attempt opening the Dashboard. Be prepared for infinite confirmation prompts.
        </p>
      </div>

      {/* Main Trigger Button */}
      <div className="p-12 rounded-3xl glass-panel border border-white/10 shadow-2xl flex flex-col items-center justify-center space-y-6">
        <div className="p-4 rounded-2xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse">
          <Layers className="w-10 h-10" />
        </div>
        <button
          onClick={() => {
            playUiSound('click');
            setModalStage(1);
          }}
          className="px-10 py-5 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-purple-600 text-black font-mono font-extrabold text-base tracking-wider shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:scale-105 transition-transform cursor-pointer"
        >
          OPEN DASHBOARD
        </button>
        <span className="text-[10px] font-mono text-gray-500">
          (Press ESC anytime to escape the modal loop)
        </span>
      </div>

      {/* Modal Stage Sequence */}
      <AnimatePresence>
        {/* Stage 1 */}
        {modalStage === 1 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-3xl glass-panel border border-purple-500/40 text-center space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setModalStage(0)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold font-mono text-white">STAGE 1 / 5</h3>
              <p className="text-sm text-gray-200 font-sans">Are you sure you want to open the dashboard?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleNextStage}
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs hover:bg-purple-500"
                >
                  YES
                </button>
                <button
                  onClick={() => setModalStage(0)}
                  className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-mono font-bold text-xs hover:bg-gray-700"
                >
                  NO
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Stage 2 */}
        {modalStage === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-3xl glass-panel border border-yellow-500/40 text-center space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setModalStage(0)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold font-mono text-white">STAGE 2 / 5</h3>
              <p className="text-sm text-gray-200 font-sans">Are you really sure?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleNextStage}
                  className="flex-1 py-3 rounded-xl bg-yellow-600 text-black font-mono font-extrabold text-xs hover:bg-yellow-500"
                >
                  YES
                </button>
                <button
                  onClick={() => setModalStage(0)}
                  className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-mono font-bold text-xs hover:bg-gray-700"
                >
                  NO
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Stage 3 */}
        {modalStage === 3 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-3xl glass-panel border border-emerald-500/40 text-center space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setModalStage(0)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold font-mono text-white">STAGE 3 / 5</h3>
              <p className="text-sm text-gray-200 font-sans">Have you considered going back?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleNextStage}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs hover:bg-emerald-500"
                >
                  CONTINUE
                </button>
                <button
                  onClick={() => setModalStage(0)}
                  className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-300 font-mono font-bold text-xs hover:bg-gray-700"
                >
                  CANCEL
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Stage 4 */}
        {modalStage === 4 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-3xl glass-panel border border-fuchsia-500/40 text-center space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setModalStage(0)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold font-mono text-white">STAGE 4 / 5</h3>
              <p className="text-sm text-gray-200 font-sans">Why are you doing this?</p>
              <div className="flex gap-3">
                <button
                  onClick={handleNextStage}
                  className="flex-1 py-3 rounded-xl bg-fuchsia-600 text-white font-mono font-bold text-xs hover:bg-fuchsia-500"
                >
                  I DON&apos;T KNOW
                </button>
                <button
                  onClick={handleNextStage}
                  className="flex-1 py-3 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs hover:bg-purple-500"
                >
                  CONTINUE
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Stage 5: Fake Loading & Failure */}
        {modalStage === 5 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-3xl glass-panel border border-red-500/40 text-center space-y-6 shadow-2xl"
            >
              {loadingStatus === 'loading' && (
                <>
                  <h3 className="text-xl font-bold font-mono text-white">LOADING DASHBOARD...</h3>
                  <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      style={{ width: `${fakeLoadingPercent}%` }}
                      className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-200"
                    />
                  </div>
                  <p className="text-2xl font-mono font-extrabold text-purple-400">
                    {fakeLoadingPercent}%
                  </p>
                </>
              )}

              {loadingStatus === 'failed' && (
                <>
                  <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 w-fit mx-auto border border-red-500/30">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold font-mono text-white">
                    LOADING FAILED SUCCESSFULLY
                  </h3>
                  <p className="text-xs text-gray-300 font-sans">
                    The dashboard failed to load because you successfully completed all 5 stages of Popup Hell.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={triggerFakeLoading}
                      className="flex-1 py-3 rounded-xl bg-gray-800 text-gray-200 font-mono font-bold text-xs hover:bg-gray-700 flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> TRY AGAIN
                    </button>
                    <button
                      onClick={handleFinalSuccess}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs hover:bg-emerald-500 flex items-center justify-center gap-2"
                    >
                      PROCEED <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
