'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTerrible } from '@/context/TerribleContext';
import { motion } from 'framer-motion';
import { Key, AlertTriangle, ShieldAlert, ArrowLeft, RefreshCw, Terminal } from 'lucide-react';

export default function SecretPage() {
  const { incrementBadDecisions, unlockAchievement, addNotification, playUiSound } = useTerrible();

  const [matrixText, setMatrixText] = useState<string[]>([]);

  useEffect(() => {
    unlockAchievement('YOU_FOUND_THIS');
    playUiSound('secret');

    // Matrix background lines simulation
    const lines = [
      "01001001 01001110 01010100 01000101 01001110 01010100 01001001 01001111 01001110 01000001 01001100",
      "CRITICAL USABILITY BREACH DETECTED AT PROTOCOL 0x7F",
      "REASON FOR EXISTENCE: ENTERTAINMENT AND CHAOS",
      "ALL YOUR BUTTONS ARE BELONG TO US",
      "SYSTEM STATUS: INTENTIONALLY BROKEN YET PERFECTLY FUNCTIONAL",
    ];
    setMatrixText(lines);
  }, [unlockAchievement, playUiSound]);

  const handleEraseEvidence = () => {
    playUiSound('error');
    incrementBadDecisions(50, 'erase_evidence');
    addNotification("EVIDENCE ERASED", "Failed to erase evidence. Added +50 Bad Decisions instead.", "error");
  };

  const handleReturnToNormal = () => {
    playUiSound('click');
    addNotification("NORMAL MODE ERROR", "There is no normal mode.", "warning");
    incrementBadDecisions(5, 'return_to_normal');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 text-center relative overflow-hidden">
      {/* Background Matrix Terminal Effect */}
      <div className="absolute inset-0 opacity-10 font-mono text-[10px] text-emerald-400 text-left overflow-hidden pointer-events-none p-4 select-none">
        {matrixText.map((line, idx) => (
          <div key={idx} className="animate-pulse">{line}</div>
        ))}
      </div>

      {/* Header */}
      <div className="space-y-4 pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
          <Key className="w-3.5 h-3.5" /> CLASSIFIED ROUTE
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-mono text-emerald-400 glow-green tracking-wider">
          YOU WEREN&apos;T SUPPOSED TO FIND THIS.
        </h1>
        <p className="text-sm text-gray-400 font-sans max-w-xl mx-auto">
          You have breached the confidential core of Terrible UI. Every click here carries severe anti-usability consequences.
        </p>
      </div>

      {/* Strange Buttons Container */}
      <div className="p-10 rounded-3xl glass-panel border border-emerald-500/30 shadow-[0_0_50px_rgba(34,197,94,0.15)] max-w-2xl mx-auto space-y-6">
        <div className="p-4 rounded-2xl bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 w-fit mx-auto animate-bounce">
          <Terminal className="w-8 h-8" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
          
          <Link
            href="/"
            onClick={() => {
              playUiSound('click');
              incrementBadDecisions(1, 'secret_go_back');
            }}
            className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/50 text-gray-200 hover:text-emerald-300 font-bold transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> GO BACK
          </Link>

          <button
            onClick={() => {
              playUiSound('click');
              incrementBadDecisions(10, 'secret_do_not_click');
              addNotification("CLASSIFIED ALERT", "You clicked DO NOT CLICK inside the secret route!", "warning");
            }}
            className="p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 hover:bg-red-900/60 font-bold transition-all"
          >
            DO NOT CLICK
          </button>

          <button
            onClick={handleEraseEvidence}
            className="p-4 rounded-2xl bg-yellow-950/60 border border-yellow-500/40 text-yellow-400 hover:bg-yellow-900/60 font-bold transition-all"
          >
            ERASE EVIDENCE (+50)
          </button>

          <button
            onClick={handleReturnToNormal}
            className="p-4 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-purple-300 hover:bg-purple-900/60 font-bold transition-all"
          >
            RETURN TO NORMAL
          </button>

        </div>
      </div>
    </div>
  );
}
