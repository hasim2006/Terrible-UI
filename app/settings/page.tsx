'use client';

import React from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { motion } from 'framer-motion';
import { Settings, Sliders, Moon, Sun, AlertTriangle, RefreshCw, Zap, Sparkles } from 'lucide-react';

export default function TerribleSettingsPage() {
  const { settings, updateSettings, incrementBadDecisions, addNotification, playUiSound, resetProgress, unlockAchievement } = useTerrible();

  const handleModeChange = (newMode: typeof settings.mode) => {
    playUiSound('click');
    incrementBadDecisions(2, 'mode_change');
    unlockAchievement('LIGHT_SWITCHER');

    if (newMode === 'light') {
      addNotification("DARKNESS INCREASED", "Dark Mode = OFF. Result: Darkness increased.", "warning");
      updateSettings({ mode: 'worse' });
    } else if (newMode === 'worse') {
      addNotification("WORSE MODE ACTIVATED", "Things just got significantly worse.", "error");
      updateSettings({ mode: 'worse' });
    } else if (newMode === 'absolutely-worse') {
      addNotification("ABSOLUTELY WORSE", "Maximum chaos enabled across all systems.", "error");
      updateSettings({ mode: 'absolutely-worse' });
    } else {
      updateSettings({ mode: 'dark' });
    }
  };

  const handleConfusionChange = (val: number) => {
    playUiSound('click');
    incrementBadDecisions(1, 'confusion_change');
    if (val < 50) {
      addNotification("CONFUSION OVERRIDE", "Confusion set to LOW. Result: Confusion set to MAXIMUM.", "warning");
      updateSettings({ confusionLevel: 100 });
    } else {
      updateSettings({ confusionLevel: val });
    }
  };

  const handleAnimationChange = (val: number) => {
    playUiSound('click');
    incrementBadDecisions(1, 'animation_change');
    if (val === 0) {
      addNotification("ANIMATION OVERRIDE", "Animation set to 0%. Result: Animation increased to 100%.", "info");
      updateSettings({ animationIntensity: 100 });
    } else {
      updateSettings({ animationIntensity: val });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs font-semibold">
          <Settings className="w-3.5 h-3.5" /> DISOBEYING CONTROLS
        </div>
        <h1 className="text-4xl font-extrabold font-mono text-white">TERRIBLE SETTINGS</h1>
        <p className="text-xs text-gray-400 font-sans">
          Configure system preferences. Controls will actively override your intent.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-8">
        
        {/* Section 1: Theme Mode */}
        <div className="space-y-3 border-b border-white/10 pb-6">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            APPEARANCE MODE
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <button
              onClick={() => handleModeChange('dark')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                settings.mode === 'dark'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <Moon className="w-5 h-5" /> Dark Mode
            </button>

            <button
              onClick={() => handleModeChange('light')}
              className="p-3 rounded-xl border bg-white/5 text-gray-400 border-white/10 hover:text-white flex flex-col items-center gap-2 transition-all"
            >
              <Sun className="w-5 h-5" /> Light Mode
            </button>

            <button
              onClick={() => handleModeChange('worse')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                settings.mode === 'worse'
                  ? 'bg-yellow-600 text-black border-yellow-500 font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-5 h-5" /> Worse Mode
            </button>

            <button
              onClick={() => handleModeChange('absolutely-worse')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                settings.mode === 'absolutely-worse'
                  ? 'bg-red-600 text-white border-red-500 font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <Zap className="w-5 h-5" /> Absolutely Worse
            </button>
          </div>
        </div>

        {/* Section 2: Sliders */}
        <div className="space-y-6">
          
          {/* Slider 1: Confusion Level */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-300">CONFUSION LEVEL</span>
              <span className="text-purple-400 font-bold">{settings.confusionLevel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.confusionLevel}
              onChange={(e) => handleConfusionChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <span className="text-[10px] font-mono text-gray-500">
              (Setting below 50% automatically overrides to 100%)
            </span>
          </div>

          {/* Slider 2: Button Randomness */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-300">BUTTON RANDOMNESS</span>
              <span className="text-emerald-400 font-bold">{settings.buttonRandomness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.buttonRandomness}
              onChange={(e) => updateSettings({ buttonRandomness: parseInt(e.target.value, 10) })}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Slider 3: Animation Intensity */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-300">ANIMATION INTENSITY</span>
              <span className="text-yellow-400 font-bold">{settings.animationIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.animationIntensity}
              onChange={(e) => handleAnimationChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
            />
            <span className="text-[10px] font-mono text-gray-500">
              (Setting to 0% resets to 100%)
            </span>
          </div>

          {/* Slider 4: User Happiness */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-gray-300">USER HAPPINESS</span>
              <span className="text-red-400 font-bold">{settings.userHappiness}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.userHappiness}
              onChange={(e) => {
                playUiSound('click');
                addNotification("OVERRIDE", "Happiness level strictly locked at 12%.", "error");
                updateSettings({ userHappiness: 12 });
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
          </div>

        </div>

        {/* Section 3: Danger Zone */}
        <div className="border-t border-white/10 pt-6 space-y-4">
          <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
            DANGER ZONE
          </h3>
          <button
            onClick={() => {
              playUiSound('click');
              resetProgress();
            }}
            className="w-full py-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 font-mono text-xs font-bold hover:bg-red-900/60 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> RESET ALL BAD DECISIONS PROGRESS
          </button>
        </div>

      </div>
    </div>
  );
}
