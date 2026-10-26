'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useTerrible } from '@/context/TerribleContext';
import { useEasterEggs } from '@/hooks/useEasterEggs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Sparkles, ShieldAlert, MousePointerClick, 
  Layers, Bot, LayoutDashboard, Settings, Key, ArrowRight,
  RefreshCw, CheckCircle2, Zap, Target, Wind
} from 'lucide-react';

export default function Home() {
  const { incrementBadDecisions, addNotification, playUiSound, incrementStatusClicks } = useTerrible();
  useEasterEggs(); // Keyboard shortcuts & Konami code listener

  // DO NOT CLICK button state
  const [doNotClickStep, setDoNotClickStep] = useState(0);
  const [doNotClickPos, setDoNotClickPos] = useState({ x: 0, y: 0 });
  const [doNotClickText, setDoNotClickText] = useState('DO NOT CLICK');
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [holdingTimer, setHoldingTimer] = useState<NodeJS.Timeout | null>(null);

  // Status panel custom values
  const [uxStatus, setUxStatus] = useState('CRITICAL');
  const [buttonStability, setButtonStability] = useState('31%');
  const [userHappiness, setUserHappiness] = useState('12%');
  const [confusion, setConfusion] = useState('94%');
  const [devConfidence, setDevConfidence] = useState('99%');

  const textsSequence = [
    'DO NOT CLICK',
    "I SAID DON'T.",
    'Seriously?',
    'Why?',
    'Fine. Click me.',
    'You win.',
  ];

  // Mouse hover flee logic
  const handleDoNotClickHover = () => {
    if (Math.random() > 0.3) {
      const randomX = (Math.random() - 0.5) * 200;
      const randomY = (Math.random() - 0.5) * 150;
      setDoNotClickPos({ x: randomX, y: randomY });
      playUiSound('flee');
    }
  };

  const handleDoNotClick = () => {
    playUiSound('click');
    const nextStep = doNotClickStep + 1;
    setDoNotClickStep(nextStep);
    incrementBadDecisions(1, 'do_not_click');

    // Text update
    const nextText = textsSequence[Math.min(nextStep, textsSequence.length - 1)];
    setDoNotClickText(nextText);

    // Random movement on click
    const randomX = (Math.random() - 0.5) * 300;
    const randomY = (Math.random() - 0.5) * 200;
    setDoNotClickPos({ x: randomX, y: randomY });

    if (nextStep === 3) {
      addNotification("WARNING", "You were explicitly told not to click.", "warning");
    }

    if (nextStep >= 5) {
      setShowWinnerModal(true);
      playUiSound('achievement');
    }
  };

  // Hold button Easter egg (holding for 5 seconds)
  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      addNotification("PATIENCE EASTER EGG", "You held the button for 5 seconds! Ultimate patience achieved.", "success");
      incrementBadDecisions(10, 'hold_button');
      playUiSound('secret');
    }, 5000);
    setHoldingTimer(timer);
  };

  const handleMouseUp = () => {
    if (holdingTimer) {
      clearTimeout(holdingTimer);
      setHoldingTimer(null);
    }
  };

  const handleClickMeInstead = () => {
    playUiSound('click');
    incrementBadDecisions(3, 'click_me_instead');
    addNotification("INVERTED ACTION", "You clicked 'CLICK ME INSTEAD'. Additional bad decisions granted.", "info");
    // Teleport the other button further away!
    setDoNotClickPos({ x: (Math.random() - 0.5) * 400, y: (Math.random() - 0.5) * 300 });
  };

  const handleStatusPanelClick = (type: string) => {
    playUiSound('click');
    incrementStatusClicks();
    incrementBadDecisions(1, 'status_click');

    switch (type) {
      case 'ux':
        setUxStatus(prev => prev === 'CRITICAL' ? 'OVERRIDE: STABLE' : 'CRITICAL');
        break;
      case 'stability':
        setButtonStability(prev => prev === '31%' ? '3.1%' : '31%');
        break;
      case 'happiness':
        setUserHappiness(prev => prev === '12%' ? '0%' : '12%');
        break;
      case 'confusion':
        setConfusion(prev => prev === '94%' ? '100%' : '94%');
        break;
      case 'dev':
        setDevConfidence(prev => prev === '99%' ? '100% UNCERTAIN' : '99%');
        break;
    }
  };

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 flex flex-col items-center text-center overflow-hidden">
        {/* Background glow ambient circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Floating Cards around Hero */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="hidden xl:block absolute top-10 left-4 p-4 rounded-2xl glass-card border border-purple-500/20 max-w-xs text-left"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold mb-1">
            <Zap className="w-4 h-4" /> INTENTIONAL ANTI-PATTERNS
          </div>
          <p className="text-xs text-gray-400">
            Buttons that flee, forms with impossible criteria, and modals inside modals.
          </p>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="hidden xl:block absolute bottom-10 right-4 p-4 rounded-2xl glass-card border border-emerald-500/20 max-w-xs text-left"
        >
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold mb-1">
            <ShieldAlert className="w-4 h-4" /> 10/10 ENGINEERING
          </div>
          <p className="text-xs text-gray-400">
            Zero technical flaws, 100% responsiveness, accessibility compliant anti-UX.
          </p>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          INTERNET&apos;S LEAST INTUITIVE EXPERIENCE
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-white mb-4 glow-purple font-mono"
        >
          TERRIBLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-emerald-400">UI</span>
        </motion.h1>

        {/* Secondary Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-gray-200 mb-6 font-sans"
        >
          Beautifully designed. Horribly usable.
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-base sm:text-lg text-gray-400 mb-10 font-sans italic"
        >
          &ldquo;Welcome to the internet&apos;s least intuitive interface. Every bad decision was intentional.&rdquo;
        </motion.p>

        {/* CTAs Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-6 relative z-10 min-h-[80px]"
        >
          {/* Fleeing DO NOT CLICK Button */}
          <motion.div
            animate={{ x: doNotClickPos.x, y: doNotClickPos.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onMouseEnter={handleDoNotClickHover}
          >
            <button
              onClick={handleDoNotClick}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 via-purple-600 to-red-600 text-white font-mono font-extrabold text-sm tracking-wider shadow-[0_0_30px_rgba(239,68,68,0.4)] hover:shadow-[0_0_40px_rgba(239,68,68,0.7)] transition-all cursor-pointer select-none"
            >
              {doNotClickText}
            </button>
          </motion.div>

          {/* CLICK ME INSTEAD Button */}
          <button
            onClick={handleClickMeInstead}
            className="px-8 py-4 rounded-2xl glass-panel border border-emerald-500/40 text-emerald-400 font-mono font-extrabold text-sm tracking-wider hover:bg-emerald-500/10 hover:border-emerald-400 shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all cursor-pointer"
          >
            CLICK ME INSTEAD
          </button>
        </motion.div>

        {/* System Status Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 max-w-xl w-full p-6 rounded-3xl glass-panel border border-white/10 shadow-2xl text-left space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" /> SYSTEM STATUS
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-500/30 animate-pulse">
              LIVE DIAGNOSTICS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div 
              onClick={() => handleStatusPanelClick('ux')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5"
            >
              <div className="text-gray-400 text-[10px]">UX STATUS</div>
              <div className="font-bold text-red-400 text-sm mt-1">{uxStatus}</div>
            </div>

            <div 
              onClick={() => handleStatusPanelClick('stability')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5"
            >
              <div className="text-gray-400 text-[10px]">BUTTON STABILITY</div>
              <div className="font-bold text-yellow-400 text-sm mt-1">{buttonStability}</div>
            </div>

            <div 
              onClick={() => handleStatusPanelClick('happiness')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5"
            >
              <div className="text-gray-400 text-[10px]">USER HAPPINESS</div>
              <div className="font-bold text-purple-400 text-sm mt-1">{userHappiness}</div>
            </div>

            <div 
              onClick={() => handleStatusPanelClick('confusion')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5"
            >
              <div className="text-gray-400 text-[10px]">CONFUSION LEVEL</div>
              <div className="font-bold text-emerald-400 text-sm mt-1">{confusion}</div>
            </div>

            <div 
              onClick={() => handleStatusPanelClick('dev')}
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5 col-span-2 sm:col-span-2"
            >
              <div className="text-gray-400 text-[10px]">DEVELOPER CONFIDENCE</div>
              <div className="font-bold text-blue-400 text-sm mt-1">{devConfidence}</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Navigation Cards Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold font-mono text-white">INTERACTIVE SECTIONS</h2>
          <p className="text-sm text-gray-400">Explore our curated collection of intentional design disasters.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/pop-the-balloon"
            onClick={() => incrementBadDecisions(1, 'card_balloon')}
            className="group p-6 rounded-3xl glass-card glass-card-hover border border-fuchsia-500/30 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-fuchsia-950/20 via-purple-950/10 to-transparent"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 w-fit group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 animate-pulse" />
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40">
                  NEW GAME 🎈
                </span>
              </div>
              <h3 className="text-xl font-bold font-mono text-white group-hover:text-fuchsia-300 transition-colors flex items-center gap-2">
                POP THE BALLOON
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                A balloon-popping mini-game where the balloon detects your cursor proximity and absolutely refuses to be popped through evasions, fake pops, and panic feints.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-fuchsia-400 font-bold group-hover:translate-x-1 transition-transform">
              CHASE THE BALLOON <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/button-lab"
            onClick={() => incrementBadDecisions(1, 'card_button_lab')}
            className="group p-6 rounded-3xl glass-card glass-card-hover border border-purple-500/20 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 w-fit group-hover:scale-110 transition-transform">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white group-hover:text-purple-300 transition-colors">
                BUTTON LAB
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Over 25+ terrible buttons demonstrating distinct bad UX principles: fleeing buttons, fake downloads, self-resizing controls, and Schrödingers buttons.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-purple-400 font-bold group-hover:translate-x-1 transition-transform">
              EXPLORE BUTTONS <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/form"
            onClick={() => incrementBadDecisions(1, 'card_form')}
            className="group p-6 rounded-3xl glass-card glass-card-hover border border-emerald-500/20 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 w-fit group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white group-hover:text-emerald-300 transition-colors">
                THE SIMPLE FORM
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                A simple 10-field form with ridiculous validation rules (&ldquo;Email is suspiciously valid&rdquo;, &ldquo;Password lacks emotional strength&rdquo;) and dynamic submit buttons.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
              ATTEMPT REGISTRATION <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/popup-hell"
            onClick={() => incrementBadDecisions(1, 'card_popup')}
            className="group p-6 rounded-3xl glass-card glass-card-hover border border-yellow-500/20 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-yellow-500/20 text-yellow-400 w-fit group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white group-hover:text-yellow-300 transition-colors">
                POPUP HELL
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Click OPEN DASHBOARD to trigger a 5-layer sequential nested modal confirmation labyrinth designed to make you question your choices.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-yellow-400 font-bold group-hover:translate-x-1 transition-transform">
              ENTER POPUP HELL <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/badgpt"
            onClick={() => incrementBadDecisions(1, 'card_badgpt')}
            className="group p-6 rounded-3xl glass-card glass-card-hover border border-fuchsia-500/20 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 w-fit group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white group-hover:text-fuchsia-300 transition-colors">
                BADGPT AI
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Our cutting-edge artificial intelligence chatbot that responds to every user inquiry with 35+ unhelpful, sarcastic, and hilarious responses.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-fuchsia-400 font-bold group-hover:translate-x-1 transition-transform">
              TALK TO BADGPT <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/dashboard"
            onClick={() => incrementBadDecisions(1, 'card_dashboard')}
            className="group p-6 rounded-3xl glass-card glass-card-hover border border-blue-500/20 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 w-fit group-hover:scale-110 transition-transform">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white group-hover:text-blue-300 transition-colors">
                DASHBOARD
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Real-time fake analytics showing your User Happiness steadily declining from 87% down to 12% alongside terrible decision telemetry.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
              VIEW ANALYTICS <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/settings"
            onClick={() => incrementBadDecisions(1, 'card_settings')}
            className="group p-6 rounded-3xl glass-card glass-card-hover border border-red-500/20 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 w-fit group-hover:scale-110 transition-transform">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white group-hover:text-red-300 transition-colors">
                TERRIBLE SETTINGS
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                Controls that actively disobey user input. Setting confusion to LOW sets it to MAXIMUM. Turning dark mode OFF makes it darker.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-red-400 font-bold group-hover:translate-x-1 transition-transform">
              CONFIGURE SETTINGS <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </section>

      {/* Winner Modal for DO NOT CLICK button */}
      <AnimatePresence>
        {showWinnerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-3xl glass-panel border border-purple-500/50 shadow-2xl text-center space-y-6"
            >
              <div className="p-4 rounded-2xl bg-purple-500/20 text-purple-400 w-fit mx-auto border border-purple-500/30 animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold font-mono text-white">YOU CLICKED IT!</h3>
                <p className="text-xs text-gray-300 font-sans">
                  Persistence payed off! You overcame a fleeing button and 5 text changes. Your reward is 10 extra Bad Decisions.
                </p>
              </div>
              <button
                onClick={() => {
                  playUiSound('click');
                  setShowWinnerModal(false);
                  setDoNotClickStep(0);
                  setDoNotClickText('DO NOT CLICK');
                  setDoNotClickPos({ x: 0, y: 0 });
                }}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold hover:bg-purple-500 transition-colors"
              >
                RESET BUTTON & CONTINUE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
