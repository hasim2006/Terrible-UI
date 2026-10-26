'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Achievement, INITIAL_ACHIEVEMENTS } from '@/lib/achievements';
import { playSound } from '@/lib/sound';

export interface TerribleNotification {
  id: string;
  title: string;
  message?: string;
  type?: 'warning' | 'error' | 'info' | 'success';
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export interface TerribleSettingsState {
  mode: 'dark' | 'light' | 'worse' | 'absolutely-worse';
  confusionLevel: number; // 0 to 100
  buttonRandomness: number; // 0 to 100
  popupFrequency: number; // 0 to 100
  animationIntensity: number; // 0 to 100
  userHappiness: number; // 0 to 100
}

interface TerribleContextType {
  badDecisions: number;
  incrementBadDecisions: (amount?: number, source?: string) => void;
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  latestAchievement: Achievement | null;
  dismissAchievement: () => void;
  notifications: TerribleNotification[];
  addNotification: (title: string, message?: string, type?: TerribleNotification['type']) => void;
  dismissNotification: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playUiSound: (type: 'click' | 'error' | 'success' | 'modal' | 'achievement' | 'loading' | 'flee' | 'secret' | 'balloon_panic' | 'balloon_escape' | 'balloon_near_miss' | 'balloon_fake_pop' | 'balloon_fear_max' | 'balloon_fail') => void;
  settings: TerribleSettingsState;
  updateSettings: (newSettings: Partial<TerribleSettingsState>) => void;
  resetProgress: () => void;
  visitedRoutes: string[];
  trackRouteVisit: (route: string) => void;
  closeBadGptAttempts: number;
  incrementCloseBadGpt: () => void;
  statusClicks: number;
  incrementStatusClicks: () => void;
  buttonLabClicks: Set<string>;
  trackButtonLabClick: (buttonId: string) => void;
}

const TerribleContext = createContext<TerribleContextType | undefined>(undefined);

const RANDOM_MESSAGES = [
  "Something happened.",
  "Something else happened.",
  "Please ignore this notification.",
  "Congratulations. You did nothing.",
  "Your mouse movement has been recorded.",
  "Your browser looks tired.",
  "Important notification: this notification is not important.",
  "Everything is under control.",
  "The control is no longer under control.",
  "A unknown variable was incremented.",
  "Warning: UX stability degraded by 0.4%",
  "System: User confusion level acceptable."
];

export const TerribleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [badDecisions, setBadDecisions] = useState<number>(42);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [latestAchievement, setLatestAchievement] = useState<Achievement | null>(null);
  const [notifications, setNotifications] = useState<TerribleNotification[]>([]);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(false);
  const [visitedRoutes, setVisitedRoutes] = useState<string[]>([]);
  const [closeBadGptAttempts, setCloseBadGptAttempts] = useState<number>(0);
  const [statusClicks, setStatusClicks] = useState<number>(0);
  const [buttonLabClicks, setButtonLabClicks] = useState<Set<string>>(new Set());

  const [settings, setSettings] = useState<TerribleSettingsState>({
    mode: 'dark',
    confusionLevel: 94,
    buttonRandomness: 80,
    popupFrequency: 60,
    animationIntensity: 100,
    userHappiness: 12,
  });

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedDecisions = localStorage.getItem('terrible_bad_decisions');
      if (savedDecisions !== null) {
        setBadDecisions(parseInt(savedDecisions, 10) || 42);
      }

      const savedAchievements = localStorage.getItem('terrible_achievements');
      if (savedAchievements !== null) {
        const parsed: Achievement[] = JSON.parse(savedAchievements);
        setAchievements(INITIAL_ACHIEVEMENTS.map(initial => {
          const found = parsed.find(p => p.id === initial.id);
          return found ? { ...initial, unlocked: found.unlocked, unlockedAt: found.unlockedAt } : initial;
        }));
      }

      const savedSound = localStorage.getItem('terrible_sound');
      if (savedSound !== null) {
        setSoundEnabledState(savedSound === 'true');
      }

      const savedSettings = localStorage.getItem('terrible_settings');
      if (savedSettings !== null) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, []);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    try {
      localStorage.setItem('terrible_sound', String(enabled));
    } catch {}
  };

  const playUiSound = useCallback((type: 'click' | 'error' | 'success' | 'modal' | 'achievement' | 'loading' | 'flee' | 'secret' | 'balloon_panic' | 'balloon_escape' | 'balloon_near_miss' | 'balloon_fake_pop' | 'balloon_fear_max' | 'balloon_fail') => {
    playSound(type, soundEnabled);
  }, [soundEnabled]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => {
      const updated = prev.map(a => {
        if (a.id === id && !a.unlocked) {
          const unlockedItem = { ...a, unlocked: true, unlockedAt: new Date().toLocaleTimeString() };
          setLatestAchievement(unlockedItem);
          playUiSound('achievement');
          return unlockedItem;
        }
        return a;
      });

      try {
        localStorage.setItem('terrible_achievements', JSON.stringify(updated));
      } catch {}

      return updated;
    });
  }, [playUiSound]);

  const addNotification = useCallback((title: string, message?: string, type: TerribleNotification['type'] = 'info') => {
    const corners: TerribleNotification['corner'][] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    const corner = corners[Math.floor(Math.random() * corners.length)];
    const id = Math.random().toString(36).substring(2, 9);
    
    const newNotif: TerribleNotification = { id, title, message, type, corner };
    setNotifications(prev => [...prev.slice(-4), newNotif]); // keep max 5

    // Auto dismiss after 5s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const dismissAchievement = useCallback(() => {
    setLatestAchievement(null);
  }, []);

  const incrementBadDecisions = useCallback((amount = 1, source?: string) => {
    setBadDecisions(prev => {
      const next = prev + amount;
      try {
        localStorage.setItem('terrible_bad_decisions', next.toString());
      } catch {}

      // Unlock achievements based on count milestones
      if (next >= 1) unlockAchievement('FIRST_MISTAKE');
      if (next >= 50) unlockAchievement('STILL_HERE');
      if (next >= 100) {
        unlockAchievement('CERTIFIED_UI_VICTIM');
        addNotification("Milestone: 100 Bad Decisions", "You are now officially part of the UI.", "warning");
      }
      if (next >= 250) {
        unlockAchievement('TERRIBLE_DECISION_MAKER');
        addNotification("Milestone: 250 Bad Decisions", "Please seek professional help.", "error");
      }

      // Check milestones notifications
      if (next === 10) addNotification("Milestone 10", "You're learning.", "info");
      if (next === 25) addNotification("Milestone 25", "This is concerning.", "warning");
      if (next === 50) addNotification("Milestone 50", "You have made questionable choices.", "warning");

      return next;
    });

    if (source) {
      playUiSound('click');
    }
  }, [unlockAchievement, addNotification, playUiSound]);

  const updateSettings = useCallback((newSettings: Partial<TerribleSettingsState>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('terrible_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const trackRouteVisit = useCallback((route: string) => {
    setVisitedRoutes(prev => {
      if (!prev.includes(route)) {
        const next = [...prev, route];
        if (next.length >= 5) {
          unlockAchievement('UI_EXPLORER');
        }
        return next;
      }
      return prev;
    });
  }, [unlockAchievement]);

  const incrementCloseBadGpt = useCallback(() => {
    setCloseBadGptAttempts(prev => {
      const next = prev + 1;
      if (next >= 3) {
        unlockAchievement('FINAL_BOSS');
        addNotification("BadGPT Alert", "You cannot escape BadGPT.", "error");
      }
      return next;
    });
  }, [unlockAchievement, addNotification]);

  const incrementStatusClicks = useCallback(() => {
    setStatusClicks(prev => {
      const next = prev + 1;
      if (next >= 3) {
        unlockAchievement('STATUS_GLITCHER');
      }
      return next;
    });
  }, [unlockAchievement]);

  const trackButtonLabClick = useCallback((buttonId: string) => {
    setButtonLabClicks(prev => {
      const next = new Set(prev);
      next.add(buttonId);
      if (next.size >= 10) {
        unlockAchievement('BUTTON_VICTIM');
      }
      return next;
    });
  }, [unlockAchievement]);

  const resetProgress = useCallback(() => {
    setBadDecisions(0);
    setAchievements(INITIAL_ACHIEVEMENTS);
    try {
      localStorage.removeItem('terrible_bad_decisions');
      localStorage.removeItem('terrible_achievements');
    } catch {}
    addNotification("Progress Cleared", "Or was it?", "info");
  }, [addNotification]);

  // Periodic random toast engine
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.65) {
        const randomMsg = RANDOM_MESSAGES[Math.floor(Math.random() * RANDOM_MESSAGES.length)];
        const types: TerribleNotification['type'][] = ['info', 'warning', 'error', 'success'];
        const type = types[Math.floor(Math.random() * types.length)];
        addNotification("SYSTEM NOTIFICATION", randomMsg, type);
      }
    }, 18000);

    return () => clearInterval(interval);
  }, [addNotification]);

  return (
    <TerribleContext.Provider
      value={{
        badDecisions,
        incrementBadDecisions,
        achievements,
        unlockAchievement,
        latestAchievement,
        dismissAchievement,
        notifications,
        addNotification,
        dismissNotification,
        soundEnabled,
        setSoundEnabled,
        playUiSound,
        settings,
        updateSettings,
        resetProgress,
        visitedRoutes,
        trackRouteVisit,
        closeBadGptAttempts,
        incrementCloseBadGpt,
        statusClicks,
        incrementStatusClicks,
        buttonLabClicks,
        trackButtonLabClick,
      }}
    >
      {children}
    </TerribleContext.Provider>
  );
};

export const useTerrible = () => {
  const context = useContext(TerribleContext);
  if (!context) {
    throw new Error('useTerrible must be used within a TerribleProvider');
  }
  return context;
};
