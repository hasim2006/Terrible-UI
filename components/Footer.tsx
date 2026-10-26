'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTerrible } from '@/context/TerribleContext';
import { Sparkles, Heart, AlertTriangle, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { addNotification, incrementBadDecisions, playUiSound } = useTerrible();
  const [copyrightClicks, setCopyrightClicks] = useState(0);

  const handleCopyrightClick = () => {
    const next = copyrightClicks + 1;
    setCopyrightClicks(next);
    playUiSound('click');

    if (next === 3) {
      addNotification("COPYRIGHT EASTER EGG", "All terrible choices reserved © 2026. Do not copy our mistakes.", "info");
      incrementBadDecisions(3, 'copyright_clicks');
      playUiSound('secret');
      setCopyrightClicks(0);
    }
  };

  const handleFooterDoubleClick = () => {
    addNotification("FOOTER DOUBLE-CLICK", "You double-clicked the footer! Extra confusion granted.", "warning");
    incrementBadDecisions(5, 'footer_double_click');
    playUiSound('secret');
  };

  return (
    <footer
      onDoubleClick={handleFooterDoubleClick}
      className="w-full border-t border-white/10 glass-panel mt-20 py-12 relative overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-white text-lg tracking-wider">
              TERRIBLE <span className="text-purple-500">UI</span>
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              v1.0.0 (UX: CRITICAL)
            </span>
          </div>
          <p className="text-xs text-gray-400 font-sans max-w-sm">
            Beautifully designed. Horribly usable. Every single design flaw is 100% intentional.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-gray-400">
          <Link href="/button-lab" className="hover:text-purple-400 transition-colors">BUTTON LAB</Link>
          <Link href="/form" className="hover:text-purple-400 transition-colors">SIMPLE FORM</Link>
          <Link href="/popup-hell" className="hover:text-purple-400 transition-colors">POPUP HELL</Link>
          <Link href="/badgpt" className="hover:text-purple-400 transition-colors">BADGPT</Link>
          <Link href="/dashboard" className="hover:text-purple-400 transition-colors">DASHBOARD</Link>
          <Link href="/secret" className="hover:text-emerald-400 transition-colors font-bold">SECRET</Link>
        </div>

        {/* Copyright */}
        <div
          onClick={handleCopyrightClick}
          className="text-xs font-mono text-gray-500 cursor-pointer hover:text-gray-300 transition-colors text-center md:text-right"
          title="Triple click for copyright warning"
        >
          <p>© 2026 Terrible UI Consortium.</p>
          <p className="text-[10px] text-gray-600">Built with intentional pain.</p>
        </div>
      </div>
    </footer>
  );
};
