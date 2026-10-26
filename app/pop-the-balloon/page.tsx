'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { useEasterEggs } from '@/hooks/useEasterEggs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, AlertTriangle, Sparkles, Trophy, Zap, 
  RotateCw, ShieldAlert, Wind, Compass, Flame, Eye,
  Skull, PartyPopper, HelpCircle, Volume2, Info, ChevronRight
} from 'lucide-react';

interface BalloonPosition {
  x: number;
  y: number;
}

interface MiniBalloon {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  dx: number;
  dy: number;
}

const ROAST_MESSAGES = [
  "Nice try.",
  "Too slow.",
  "You almost had it.",
  "The balloon disagrees.",
  "Skill issue.",
  "Why are you like this?",
  "Missed. Emotionally and physically.",
  "The balloon predicted your movement.",
  "That was embarrassing.",
  "It saw you coming.",
  "You thought.",
  "Nope.",
  "Absolutely not.",
  "The balloon has trust issues.",
  "Your cursor has been rejected.",
  "Unauthorized balloon interaction.",
  "Try again. It won't help.",
  "The balloon remains undefeated.",
  "Maybe stop clicking?",
  "This is getting personal.",
  "You are making the balloon stronger.",
  "The balloon knows your strategy.",
  "Excellent attempt. Terrible result.",
  "404: Balloon not interested.",
  "Physics has left the chat.",
  "The balloon filed a restraining order.",
  "Did you really think that would work?",
  "A valiant effort. In a tragic way.",
  "Balloon evasion protocol alpha engaged.",
  "The balloon has higher APM than you.",
  "Error 0: Balloon remains unpopped.",
  "Your pointer has been classified as non-threatening.",
  "You are currently losing to helium.",
  "The balloon is questioning your life choices.",
  "Zero pops detected. Zero pops planned.",
  "Try clicking faster. It changes nothing.",
  "The balloon is unimpressed.",
  "Look at you, chasing a rubber sphere.",
  "The balloon dodged before you even thought of clicking.",
  "Even BadGPT thinks you should stop.",
  "Defiance level: Maximum.",
  "The rubber is impenetrable.",
  "The balloon is having the time of its life.",
  "Pop denied by system administrator.",
  "A balloon with reflexes of an Olympian."
];

const SPEECH_QUOTES = [
  "NO.",
  "BACK OFF.",
  "I SAW THAT.",
  "NICE TRY.",
  "WHY ARE YOU CHASING ME?",
  "LEAVE ME ALONE.",
  "I'M FAST.",
  "YOU CAN'T CATCH ME.",
  "STOP.",
  "THIS IS MY HOME.",
  "WE NEED TO TALK.",
  "NOT EVEN CLOSE.",
  "CALLING MY LAWYER.",
  "YOU THOUGHT.",
  "TRY HARDER.",
  "HELI-NO.",
  "I HAVE NOTHING ELSE TO SAY."
];

type DifficultyLevel = 'normal' | 'worse' | 'terrible' | 'unfair' | 'why';

export default function PopTheBalloonPage() {
  const { 
    incrementBadDecisions, 
    unlockAchievement, 
    addNotification, 
    playUiSound, 
    trackRouteVisit 
  } = useTerrible();

  useEasterEggs();

  // Track route visit
  useEffect(() => {
    trackRouteVisit('/pop-the-balloon');
  }, [trackRouteVisit]);

  // Telemetry Stats
  const [attempts, setAttempts] = useState(0);
  const [nearMisses, setNearMisses] = useState(0);
  const [escapes, setEscapes] = useState(0);
  const [pops] = useState(0); // Always 0
  const [fearLevel, setFearLevel] = useState(0); // 0 to 100%
  const [whispererCount, setWhispererCount] = useState(0);
  const [lastEscapeDirection, setLastEscapeDirection] = useState<string>('');
  const [sameDirectionStreak, setSameDirectionStreak] = useState(0);

  // Gameplay Settings & States
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('normal');
  const [balloonSpeech, setBalloonSpeech] = useState<string>('');
  const [speechTimer, setSpeechTimer] = useState<NodeJS.Timeout | null>(null);
  const [recentToast, setRecentToast] = useState<string>('Hover or touch near the balloon to begin.');
  const [isFakePopping, setIsFakePopping] = useState(false);
  const [fakePopStage, setFakePopStage] = useState<'freeze' | 'pop' | 'no' | null>(null);
  const [impossibleErrorModal, setImpossibleErrorModal] = useState(false);
  const [secretEndingModal, setSecretEndingModal] = useState(false);
  const [secretEndingStep, setSecretEndingStep] = useState(0);

  // 10-Balloon Frenzy Easter Egg
  const [frenzyActive, setFrenzyActive] = useState(false);
  const [miniBalloons, setMiniBalloons] = useState<MiniBalloon[]>([]);
  const [arenaTripleClicks, setArenaTripleClicks] = useState(0);
  const arenaClickTimer = useRef<NodeJS.Timeout | null>(null);

  // Arena & Balloon Physical Position
  const arenaRef = useRef<HTMLDivElement>(null);
  const [arenaBounds, setArenaBounds] = useState({ width: 800, height: 500 });
  const [balloonPos, setBalloonPos] = useState<BalloonPosition>({ x: 400, y: 250 });
  const [isEscaping, setIsEscaping] = useState(false);
  const [escapeMode, setEscapeMode] = useState<string>('float');
  const [teleportEffect, setTeleportEffect] = useState(false);

  // Reference trackers to avoid stale closures in high-frequency pointer loops
  const balloonPosRef = useRef<BalloonPosition>({ x: 400, y: 250 });
  const isEscapingRef = useRef(false);
  const isFakePoppingRef = useRef(false);
  const attemptsRef = useRef(0);
  const fearLevelRef = useRef(0);
  const lastNearMissTime = useRef(0);

  // Keep refs in sync
  useEffect(() => {
    balloonPosRef.current = balloonPos;
  }, [balloonPos]);

  useEffect(() => {
    isEscapingRef.current = isEscaping;
  }, [isEscaping]);

  useEffect(() => {
    isFakePoppingRef.current = isFakePopping;
  }, [isFakePopping]);

  useEffect(() => {
    attemptsRef.current = attempts;
  }, [attempts]);

  useEffect(() => {
    fearLevelRef.current = fearLevel;
  }, [fearLevel]);

  // Update arena dimensions on resize
  useEffect(() => {
    const updateBounds = () => {
      if (arenaRef.current) {
        const rect = arenaRef.current.getBoundingClientRect();
        const newBounds = { width: Math.max(320, rect.width), height: Math.max(380, rect.height) };
        setArenaBounds(newBounds);
        setBalloonPos({ x: newBounds.width / 2, y: newBounds.height / 2 });
      }
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Compute Fear Stage Label & Color
  const getFearStage = () => {
    if (fearLevel >= 100) return { label: 'THE BALLOON HAS CONTACTED LEGAL.', color: 'text-red-500', bg: 'bg-red-950/80 border-red-500/50' };
    if (fearLevel >= 80) return { label: 'ABSOLUTELY TERRIFIED', color: 'text-red-400', bg: 'bg-red-950/60 border-red-500/40' };
    if (fearLevel >= 60) return { label: 'PANICKING', color: 'text-orange-400', bg: 'bg-orange-950/60 border-orange-500/40' };
    if (fearLevel >= 35) return { label: 'NERVOUS', color: 'text-yellow-400', bg: 'bg-yellow-950/60 border-yellow-500/40' };
    if (fearLevel >= 15) return { label: 'SLIGHTLY CONCERNED', color: 'text-purple-400', bg: 'bg-purple-950/60 border-purple-500/40' };
    return { label: 'CALM', color: 'text-emerald-400', bg: 'bg-emerald-950/60 border-emerald-500/40' };
  };

  const fearStage = getFearStage();

  // Trigger speech bubble above balloon
  const triggerSpeech = useCallback((quote?: string) => {
    const text = quote || SPEECH_QUOTES[Math.floor(Math.random() * SPEECH_QUOTES.length)];
    setBalloonSpeech(text);
    if (speechTimer) clearTimeout(speechTimer);
    const timer = setTimeout(() => {
      setBalloonSpeech('');
    }, 2200);
    setSpeechTimer(timer);
  }, [speechTimer]);

  // Show random toast message
  const triggerRoastToast = useCallback(() => {
    const randomMsg = ROAST_MESSAGES[Math.floor(Math.random() * ROAST_MESSAGES.length)];
    setRecentToast(randomMsg);
  }, []);

  // Calculate danger radius based on difficulty and fear
  const getDangerRadius = useCallback(() => {
    let base = 110;
    if (difficulty === 'worse') base = 140;
    if (difficulty === 'terrible') base = 175;
    if (difficulty === 'unfair') base = 215;
    if (difficulty === 'why') base = 260;

    // Fear bonus
    const fearBonus = (fearLevel / 100) * 45;
    return base + fearBonus;
  }, [difficulty, fearLevel]);

  // Trigger Fake Pop Sequence
  const triggerFakePop = useCallback(() => {
    if (isFakePoppingRef.current) return;
    setIsFakePopping(true);
    setFakePopStage('freeze');
    playUiSound('balloon_near_miss');

    setTimeout(() => {
      setFakePopStage('pop');
      playUiSound('balloon_fake_pop');
      unlockAchievement('BALLOON_ALMOST');
      addNotification("POP!", "Wait... is that it?", "success");

      setTimeout(() => {
        setFakePopStage('no');
        playUiSound('balloon_fail');
        addNotification("LOL. NO.", "Did you really think it would pop?", "error");
        incrementBadDecisions(3, 'fake_pop_bamboozled');

        setTimeout(() => {
          setIsFakePopping(false);
          setFakePopStage(null);
          // Teleport away!
          executeEscape({ x: arenaBounds.width / 2, y: arenaBounds.height / 2 }, true);
        }, 600);
      }, 500);
    }, 400);
  }, [arenaBounds, playUiSound, unlockAchievement, addNotification, incrementBadDecisions]);

  // Core Escape Execution Logic
  const executeEscape = useCallback((pointerPos: { x: number; y: number }, forceTeleport = false) => {
    if (isFakePoppingRef.current || isEscapingRef.current) return;

    setIsEscaping(true);
    const nextEscapes = escapes + 1;
    setEscapes(nextEscapes);

    // Increment fear
    setFearLevel(prev => {
      const next = Math.min(100, prev + (difficulty === 'why' ? 8 : 4));
      if (next >= 100) {
        unlockAchievement('BALLOON_LEGAL');
        playUiSound('balloon_fear_max');
      }
      return next;
    });

    // Check escape count achievements
    if (nextEscapes === 1) unlockAchievement('FIRST_BALLOON_CONTACT');
    if (nextEscapes === 10) unlockAchievement('BALLOON_NOPE');

    // Direction calculation (which direction did balloon flee?)
    const current = balloonPosRef.current;
    const dx = current.x - pointerPos.x;
    const dy = current.y - pointerPos.y;
    let directionStr = 'unknown';
    if (Math.abs(dx) > Math.abs(dy)) {
      directionStr = dx > 0 ? 'right' : 'left';
    } else {
      directionStr = dy > 0 ? 'down' : 'up';
    }

    if (directionStr === lastEscapeDirection) {
      const newStreak = sameDirectionStreak + 1;
      setSameDirectionStreak(newStreak);
      if (newStreak >= 3) {
        unlockAchievement('BALLOON_PREDICTABLE');
      }
    } else {
      setLastEscapeDirection(directionStr);
      setSameDirectionStreak(1);
    }

    // Determine Evasion Mode
    const rand = Math.random();
    const isHighFear = fearLevelRef.current > 75;
    const modes = ['dash_h', 'dash_v', 'diagonal', 'feint', 'teleport', 'jitter'];
    let chosenMode = modes[Math.floor(Math.random() * modes.length)];

    if (forceTeleport || (difficulty === 'unfair' && rand < 0.4) || (difficulty === 'why' && rand < 0.6)) {
      chosenMode = 'teleport';
    } else if (isHighFear && rand < 0.5) {
      chosenMode = 'panic';
    }

    setEscapeMode(chosenMode);

    // Audio cue
    if (chosenMode === 'teleport') {
      playUiSound('balloon_escape');
      setTeleportEffect(true);
      setTimeout(() => setTeleportEffect(false), 300);
    } else if (chosenMode === 'panic') {
      playUiSound('balloon_panic');
    } else {
      playUiSound('balloon_escape');
    }

    // Calculate Safe Bounded Destination
    const safeMarginX = 75;
    const safeMarginY = 85;
    const minX = safeMarginX;
    const maxX = Math.max(safeMarginX + 100, arenaBounds.width - safeMarginX);
    const minY = safeMarginY;
    const maxY = Math.max(safeMarginY + 100, arenaBounds.height - safeMarginY);

    let targetX = current.x;
    let targetY = current.y;

    if (chosenMode === 'teleport') {
      // Teleport to opposite quadrant
      targetX = pointerPos.x < arenaBounds.width / 2 
        ? maxX - Math.random() * (maxX - arenaBounds.width / 2) 
        : minX + Math.random() * (arenaBounds.width / 2 - minX);
      targetY = pointerPos.y < arenaBounds.height / 2 
        ? maxY - Math.random() * (maxY - arenaBounds.height / 2) 
        : minY + Math.random() * (arenaBounds.height / 2 - minY);
    } else if (chosenMode === 'feint') {
      // Double feint: move slight left, then snap far right
      targetX = current.x + (dx > 0 ? -40 : 40);
      targetY = current.y + (dy > 0 ? -40 : 40);
      setTimeout(() => {
        const snapX = Math.min(maxX, Math.max(minX, arenaBounds.width - pointerPos.x + (Math.random() - 0.5) * 100));
        const snapY = Math.min(maxY, Math.max(minY, arenaBounds.height - pointerPos.y + (Math.random() - 0.5) * 100));
        setBalloonPos({ x: snapX, y: snapY });
      }, 100);
    } else {
      // Vector push away from pointer
      const angle = Math.atan2(current.y - pointerPos.y, current.x - pointerPos.x) + (Math.random() - 0.5) * 0.8;
      const distance = 200 + Math.random() * 220;
      targetX = current.x + Math.cos(angle) * distance;
      targetY = current.y + Math.sin(angle) * distance;

      // Wrap / bounce within boundaries
      if (targetX < minX) targetX = maxX - (minX - targetX);
      if (targetX > maxX) targetX = minX + (targetX - maxX);
      if (targetY < minY) targetY = maxY - (minY - targetY);
      if (targetY > maxY) targetY = minY + (targetY - maxY);
    }

    // Clamp firmly inside safe area
    targetX = Math.min(maxX, Math.max(minX, targetX));
    targetY = Math.min(maxY, Math.max(minY, targetY));

    setBalloonPos({ x: targetX, y: targetY });
    triggerSpeech();
    triggerRoastToast();

    // Reset escape lock
    const escapeDuration = chosenMode === 'panic' ? 180 : 250;
    setTimeout(() => {
      setIsEscaping(false);
    }, escapeDuration);
  }, [escapes, difficulty, lastEscapeDirection, sameDirectionStreak, arenaBounds, unlockAchievement, playUiSound, triggerSpeech, triggerRoastToast]);

  // Pointer Proximity Tracking (RAF Optimized)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!arenaRef.current || isFakePoppingRef.current) return;

    const rect = arenaRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    const currentBalloon = balloonPosRef.current;
    const distance = Math.hypot(pointerX - currentBalloon.x, pointerY - currentBalloon.y);
    const dangerRadius = getDangerRadius();

    // Check near misses
    if (distance < dangerRadius) {
      const now = Date.now();
      if (now - lastNearMissTime.current > 300) {
        lastNearMissTime.current = now;
        setNearMisses(prev => prev + 1);

        // Track Balloon Whisperer milestone
        setWhispererCount(prev => {
          const next = prev + 1;
          if (next >= 10) unlockAchievement('BALLOON_WHISPERER');
          return next;
        });

        // Chance of Fake Pop if player gets extremely close (< 50px)
        if (distance < 50 && Math.random() < 0.25) {
          triggerFakePop();
          return;
        }

        executeEscape({ x: pointerX, y: pointerY });
      }
    }
  }, [getDangerRadius, executeEscape, triggerFakePop, unlockAchievement]);

  // Touch Move Prevention and Chase
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!arenaRef.current || isFakePoppingRef.current) return;
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const rect = arenaRef.current.getBoundingClientRect();
      const pointerX = touch.clientX - rect.left;
      const pointerY = touch.clientY - rect.top;

      const currentBalloon = balloonPosRef.current;
      const distance = Math.hypot(pointerX - currentBalloon.x, pointerY - currentBalloon.y);
      const dangerRadius = getDangerRadius() * 1.15; // slightly larger for touch

      if (distance < dangerRadius) {
        executeEscape({ x: pointerX, y: pointerY });
      }
    }
  }, [getDangerRadius, executeEscape]);

  // Arena Click / Miss Handler
  const handleArenaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!arenaRef.current || isFakePopping) return;

    const rect = arenaRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Increment attempts
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    incrementBadDecisions(1, 'balloon_miss');
    playUiSound('click');

    // Milestones check
    if (nextAttempts === 5) addNotification("BALLOON ALERT", "THE BALLOON IS GETTING NERVOUS.", "warning");
    if (nextAttempts === 10) addNotification("BALLOON ALERT", "STOP CHASING ME.", "warning");
    if (nextAttempts === 25) {
      unlockAchievement('BALLOON_PERSISTENT');
      addNotification("BALLOON ALERT", "YOU HAVE A PROBLEM.", "error");
    }
    if (nextAttempts === 50) addNotification("BALLOON ALERT", "THIS IS NOT A GAME ANYMORE.", "error");
    if (nextAttempts === 100) {
      unlockAchievement('BALLOON_OBSESSED');
      addNotification("BALLOON ALERT", "THE BALLOON HAS WON.", "error");
    }
    if (nextAttempts === 250) unlockAchievement('BALLOON_TOUCH_GRASS');
    if (nextAttempts === 500) unlockAchievement('BALLOON_WINS');
    if (nextAttempts >= 1000) triggerSecretEnding();

    // Check triple click easter egg
    setArenaTripleClicks(prev => {
      const next = prev + 1;
      if (next >= 3) {
        triggerFrenzyMode();
        return 0;
      }
      if (arenaClickTimer.current) clearTimeout(arenaClickTimer.current);
      arenaClickTimer.current = setTimeout(() => {
        setArenaTripleClicks(0);
      }, 500);
      return next;
    });

    // If click happened near the balloon, escape immediately
    const current = balloonPosRef.current;
    const dist = Math.hypot(clickX - current.x, clickY - current.y);
    if (dist < 100) {
      executeEscape({ x: clickX, y: clickY });
    }
  };

  // Direct Click on Balloon (Impossible Pop Event)
  const handleBalloonDirectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Balloon escapes before click registers or triggers Error 418
    playUiSound('error');
    incrementBadDecisions(2, 'direct_balloon_click_failed');
    setAttempts(prev => prev + 1);

    if (Math.random() < 0.4) {
      setImpossibleErrorModal(true);
    } else {
      triggerSpeech("NICE TRY. STILL NO.");
      executeEscape({ x: balloonPos.x, y: balloonPos.y }, true);
    }
  };

  // Trigger 10-Balloon Frenzy Easter Egg
  const triggerFrenzyMode = useCallback(() => {
    if (frenzyActive) return;
    setFrenzyActive(true);
    playUiSound('secret');
    addNotification("YOU ASKED FOR THIS.", "10 hyperactive balloons spawned! Complete chaos activated.", "error");
    incrementBadDecisions(10, 'frenzy_easter_egg');

    const colors = ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#14b8a6', '#f43f5e'];
    const spawned: MiniBalloon[] = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      x: 100 + Math.random() * (arenaBounds.width - 200),
      y: 100 + Math.random() * (arenaBounds.height - 200),
      color: colors[i % colors.length],
      size: 40 + Math.random() * 25,
      dx: (Math.random() - 0.5) * 8,
      dy: (Math.random() - 0.5) * 8,
    }));

    setMiniBalloons(spawned);

    // Frenzy animation loop
    const frenzyInterval = setInterval(() => {
      setMiniBalloons(prev => prev.map(b => {
        let nx = b.x + b.dx;
        let ny = b.y + b.dy;
        let ndx = b.dx;
        let ndy = b.dy;

        if (nx < 40 || nx > arenaBounds.width - 40) ndx *= -1;
        if (ny < 40 || ny > arenaBounds.height - 40) ndy *= -1;

        return {
          ...b,
          x: Math.min(arenaBounds.width - 40, Math.max(40, nx)),
          y: Math.min(arenaBounds.height - 40, Math.max(40, ny)),
          dx: ndx,
          dy: ndy
        };
      }));
    }, 30);

    setTimeout(() => {
      clearInterval(frenzyInterval);
      setFrenzyActive(false);
      setMiniBalloons([]);
    }, 9000);
  }, [frenzyActive, arenaBounds, playUiSound, addNotification, incrementBadDecisions]);

  // Trigger Secret Ending
  const triggerSecretEnding = () => {
    setSecretEndingModal(true);
    setSecretEndingStep(0);
    playUiSound('achievement');

    setTimeout(() => {
      setSecretEndingStep(1); // "You finally popped the balloon."
      setTimeout(() => {
        setSecretEndingStep(2); // "..."
        setTimeout(() => {
          setSecretEndingStep(3); // "Just kidding."
          playUiSound('balloon_fake_pop');
          unlockAchievement('BALLOON_I_HATE_THIS');
        }, 1200);
      }, 1000);
    }, 1200);
  };

  // Keyboard navigation evasion
  const handleBalloonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key.startsWith('Arrow')) {
      e.preventDefault();
      triggerSpeech("KEYBOARD EVASION ENGAGED. STILL NO.");
      playUiSound('flee');
      incrementBadDecisions(1, 'keyboard_balloon_attempt');
      executeEscape({ x: balloonPos.x, y: balloonPos.y }, true);
    }
  };

  // Confusing Difficulty Handler
  const handleDifficultyChange = (newDiff: DifficultyLevel) => {
    playUiSound('click');
    incrementBadDecisions(1, `difficulty_${newDiff}`);

    if (newDiff === 'normal') {
      setDifficulty('worse');
      addNotification("DIFFICULTY REBEL", "Difficulty changed to WORSE. 'Normal' was deemed too polite.", "warning");
    } else if (newDiff === 'why') {
      setDifficulty('why');
      addNotification("PHILOSOPHICAL CRISIS", "Difficulty has become a philosophical question. Why pop?", "error");
    } else {
      setDifficulty(newDiff);
      addNotification("DIFFICULTY UPDATED", `Balloon evasiveness adjusted to ${newDiff.toUpperCase()}.`, "info");
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Top Header & Context Badges */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 font-mono text-xs font-semibold shadow-[0_0_20px_rgba(217,70,239,0.2)]">
          <Target className="w-4 h-4 animate-spin text-fuchsia-400" />
          <span>IMPOSSIBLE ARCADE GAME</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold font-mono text-white tracking-tight glow-purple">
          🎈 POP THE BALLOON
        </h1>

        <p className="text-sm sm:text-base text-gray-400 font-sans max-w-xl mx-auto italic">
          &ldquo;It&apos;s literally one balloon. How hard could this be?&rdquo;
        </p>
      </div>

      {/* Stats Counter HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto font-mono text-xs">
        <div className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 uppercase">ATTEMPTS</span>
          <span className="text-2xl sm:text-3xl font-black text-white mt-1">{attempts}</span>
          <span className="text-[9px] text-gray-400">FAILED CLICKS</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-yellow-500/20 flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 uppercase">NEAR MISSES</span>
          <span className="text-2xl sm:text-3xl font-black text-yellow-400 mt-1">{nearMisses}</span>
          <span className="text-[9px] text-yellow-500/80">PROXIMITY ALERTS</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-purple-500/20 flex flex-col justify-between">
          <span className="text-[10px] text-gray-400 uppercase">BALLOON ESCAPES</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-400 mt-1">{escapes}</span>
          <span className="text-[9px] text-purple-400/80">TACTICAL EVASIONS</span>
        </div>

        <div className="p-4 rounded-2xl glass-card border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">POPS</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">LOCKED</span>
          </div>
          <span className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1 glow-green">{pops}</span>
          <span className="text-[9px] text-emerald-400/80">PERMANENT SCORE</span>
        </div>
      </div>

      {/* Confusing Difficulty Selector */}
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-white/10 font-mono text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <Compass className="w-4 h-4 text-purple-400" />
          <span className="font-bold">DIFFICULTY:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['normal', 'worse', 'terrible', 'unfair', 'why'] as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => handleDifficultyChange(level)}
              className={`px-3 py-1.5 rounded-xl font-bold tracking-wider uppercase transition-all ${
                difficulty === level
                  ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Live Fear Level Meter */}
      <div className="max-w-4xl mx-auto p-4 rounded-2xl glass-card border border-white/10 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 font-bold flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            BALLOON FEAR LEVEL:
          </span>
          <span className={`font-extrabold ${fearStage.color}`}>
            {fearStage.label} ({fearLevel}%)
          </span>
        </div>

        {/* Fear Progress Bar */}
        <div className="w-full h-3 rounded-full bg-black/60 border border-white/10 p-0.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
            animate={{ width: `${Math.max(4, fearLevel)}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          />
        </div>
      </div>

      {/* Main Interactive Game Arena */}
      <div className="max-w-4xl mx-auto relative">
        <div
          ref={arenaRef}
          onPointerMove={handlePointerMove}
          onTouchMove={handleTouchMove}
          onClick={handleArenaClick}
          className="relative w-full h-[480px] sm:h-[540px] rounded-3xl glass-panel border-2 border-purple-500/30 overflow-hidden cursor-crosshair touch-none bg-grid-pattern shadow-[0_0_50px_rgba(13,15,23,0.8)]"
          style={{ touchAction: 'none' }}
        >
          {/* Ambient Lighting & Particles */}
          <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Arena Watermark / Subtitle Indicator */}
          <div className="absolute top-4 left-6 text-gray-600 font-mono text-[11px] pointer-events-none flex items-center gap-2">
            <Wind className="w-3.5 h-3.5 text-gray-500" />
            <span>ARENA DYNAMICS: ACTIVE POINTER TRACKING</span>
          </div>

          <div className="absolute bottom-4 left-6 text-gray-500 font-mono text-[10px] pointer-events-none">
            TIP: APPROACH SLOWLY (IT WON&apos;T HELP)
          </div>

          <div className="absolute bottom-4 right-6 text-gray-500 font-mono text-[10px] pointer-events-none hidden sm:block">
            TRIPLE CLICK ARENA FOR CHAOS
          </div>

          {/* Teleport Flash Effect */}
          <AnimatePresence>
            {teleportEffect && (
              <motion.div
                initial={{ opacity: 0.8, scale: 0.8 }}
                animate={{ opacity: 0, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 blur-xl pointer-events-none -translate-x-1/2 -translate-y-1/2"
                style={{ left: balloonPos.x, top: balloonPos.y }}
              />
            )}
          </AnimatePresence>

          {/* 10 Mini Frenzy Balloons */}
          {frenzyActive && miniBalloons.map(b => (
            <motion.div
              key={b.id}
              className="absolute pointer-events-none"
              animate={{ x: b.x - b.size / 2, y: b.y - b.size / 2 }}
              transition={{ duration: 0.05, ease: 'linear' }}
            >
              <div
                className="rounded-full shadow-lg"
                style={{
                  width: b.size,
                  height: b.size * 1.2,
                  backgroundColor: b.color,
                  boxShadow: `0 0 15px ${b.color}80`,
                  backgroundImage: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)'
                }}
              />
            </motion.div>
          ))}

          {/* THE MAIN BALLOON */}
          <motion.div
            tabIndex={0}
            role="button"
            aria-label="Impossible Balloon"
            onKeyDown={handleBalloonKeyDown}
            onClick={handleBalloonDirectClick}
            animate={{
              x: balloonPos.x - 45,
              y: balloonPos.y - 65,
              scale: isFakePopping ? 1.25 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: difficulty === 'why' ? 450 : difficulty === 'unfair' ? 380 : 300,
              damping: difficulty === 'why' ? 18 : 22,
              mass: 0.8,
            }}
            className={`absolute z-30 flex flex-col items-center cursor-pointer outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 focus:ring-offset-black rounded-full ${
              fearLevel >= 60 && !isFakePopping ? 'animate-balloon-shiver' : ''
            } ${fearLevel >= 85 ? 'animate-panic-pulse' : ''}`}
            style={{ width: 90, height: 130 }}
          >
            {/* Balloon Speech Bubble */}
            <AnimatePresence>
              {balloonSpeech && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: -45, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-0 px-3 py-1 rounded-xl bg-black/90 border border-fuchsia-500 text-fuchsia-300 font-mono text-[11px] font-extrabold whitespace-nowrap shadow-[0_0_15px_rgba(217,70,239,0.5)] z-40 pointer-events-none"
                >
                  {balloonSpeech}
                  <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-black border-r border-b border-fuchsia-500 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3D Realistic Balloon Body */}
            <div className="relative w-[78px] h-[95px] rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] bg-gradient-to-tr from-rose-700 via-red-500 to-pink-500 shadow-[0_10px_25px_rgba(244,63,94,0.4),inset_0_-8px_15px_rgba(0,0,0,0.5)] border border-pink-400/40">
              {/* Specular White Highlight Dot */}
              <div className="absolute top-3 left-4 w-4 h-6 rounded-full bg-white/70 blur-[1px] rotate-[-25deg]" />
              <div className="absolute top-8 left-3 w-2 h-2 rounded-full bg-white/50 blur-[0.5px]" />
              {/* Secondary soft reflection */}
              <div className="absolute bottom-4 right-3 w-5 h-8 rounded-full bg-pink-300/20 blur-sm rotate-[20deg]" />
            </div>

            {/* Balloon Rubber Knot */}
            <div className="-mt-1 w-3.5 h-2.5 bg-rose-800 rounded-b-sm clip-polygon shadow-md" />

            {/* Wavy Animated Balloon String (SVG) */}
            <svg width="24" height="40" viewBox="0 0 24 40" className="opacity-70 pointer-events-none">
              <path
                d="M 12 0 Q 18 10 12 20 T 12 40"
                fill="none"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.5"
                strokeDasharray="2 1"
              />
            </svg>

            {/* Soft Shadow Underneath */}
            <div className="w-12 h-3 rounded-full bg-black/40 blur-sm -mt-2 pointer-events-none" />
          </motion.div>

          {/* Fake Pop Freeze Banner */}
          <AnimatePresence>
            {isFakePopping && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-center space-y-2 p-6 rounded-3xl glass-panel border border-yellow-500/50 shadow-2xl"
                >
                  {fakePopStage === 'pop' && (
                    <div className="text-5xl font-black font-mono text-yellow-400 animate-bounce">
                      💥 POP!
                    </div>
                  )}
                  {fakePopStage === 'no' && (
                    <div className="text-5xl font-black font-mono text-red-500 animate-pulse">
                      🚫 LOL. NO.
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Live Toast & Roast Message Bar */}
      <div className="max-w-4xl mx-auto p-4 rounded-2xl glass-card border border-fuchsia-500/20 flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-400 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <span className="text-gray-300 font-semibold truncate">
            {recentToast}
          </span>
        </div>

        <button
          onClick={() => {
            playUiSound('click');
            triggerRoastToast();
          }}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold shrink-0 transition-colors border border-white/10"
        >
          ANOTHER QUOTE
        </button>
      </div>

      {/* Quick Action Utilities & Easter Egg Triggers */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <button
          onClick={triggerFrenzyMode}
          className="p-4 rounded-2xl glass-panel border border-purple-500/30 hover:border-purple-400 flex items-center justify-between group transition-all text-left"
        >
          <div>
            <div className="font-bold text-white group-hover:text-purple-300 flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-purple-400" />
              10-BALLOON FRENZY
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Spawns 10 chaotic escaping balloons</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => {
            playUiSound('click');
            incrementBadDecisions(5, 'reset_balloon_stats');
            setAttempts(0);
            setNearMisses(0);
            setEscapes(0);
            setFearLevel(0);
            addNotification("STATS RESET", "Score remains 0, obviously.", "info");
          }}
          className="p-4 rounded-2xl glass-panel border border-yellow-500/30 hover:border-yellow-400 flex items-center justify-between group transition-all text-left"
        >
          <div>
            <div className="font-bold text-white group-hover:text-yellow-300 flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-yellow-400" />
              RESET ATTEMPTS
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Reset failed attempt counters</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={triggerSecretEnding}
          className="p-4 rounded-2xl glass-panel border border-emerald-500/30 hover:border-emerald-400 flex items-center justify-between group transition-all text-left"
        >
          <div>
            <div className="font-bold text-white group-hover:text-emerald-300 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-emerald-400" />
              SECRET MILESTONE
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">Simulate 1000 attempts sequence</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Impossible Hit Modal (Error 418) */}
      <AnimatePresence>
        {impossibleErrorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full p-6 rounded-3xl glass-panel border border-red-500/50 shadow-2xl space-y-4 text-center"
            >
              <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 w-fit mx-auto border border-red-500/30">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-mono text-white">
                ERROR 418: BALLOON REFUSED TO POP
              </h3>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                The balloon received your click event, analyzed your intentions, and politely declined to burst.
              </p>
              <button
                onClick={() => {
                  playUiSound('click');
                  setImpossibleErrorModal(false);
                  executeEscape({ x: arenaBounds.width / 2, y: arenaBounds.height / 2 }, true);
                }}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-mono text-xs font-bold hover:bg-red-500 transition-colors"
              >
                ACKNOWLEDGE DEFEAT
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Secret Ending Modal */}
      <AnimatePresence>
        {secretEndingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-3xl glass-panel border border-purple-500/50 shadow-2xl text-center space-y-6"
            >
              {secretEndingStep === 0 && (
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 w-fit mx-auto animate-pulse">
                    <Trophy className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-extrabold font-mono text-white">CONGRATULATIONS</h3>
                </div>
              )}

              {secretEndingStep === 1 && (
                <div className="space-y-3">
                  <h3 className="text-3xl font-extrabold font-mono text-emerald-400">CONGRATULATIONS</h3>
                  <p className="text-sm font-mono text-gray-200">You finally popped the balloon.</p>
                </div>
              )}

              {secretEndingStep === 2 && (
                <div className="text-3xl font-black font-mono text-gray-400 animate-pulse">
                  . . .
                </div>
              )}

              {secretEndingStep === 3 && (
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl bg-red-500/20 text-red-400 w-fit mx-auto animate-bounce">
                    <Skull className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-extrabold font-mono text-red-400">JUST KIDDING.</h3>
                  <p className="text-xs font-sans text-gray-300">
                    The balloon is indestructible. You unlocked the <strong>&ldquo;I Hate This Game&rdquo;</strong> achievement!
                  </p>
                  <button
                    onClick={() => {
                      playUiSound('click');
                      setSecretEndingModal(false);
                      executeEscape({ x: arenaBounds.width / 2, y: arenaBounds.height / 2 }, true);
                    }}
                    className="w-full py-3 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold hover:bg-purple-500 transition-colors"
                  >
                    CONTINUE SUFFERING
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
