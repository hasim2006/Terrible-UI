'use client';

import { useEffect, useState, useRef } from 'react';
import { useTerrible } from '@/context/TerribleContext';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function useEasterEggs() {
  const { unlockAchievement, addNotification, incrementBadDecisions, playUiSound } = useTerrible();
  const [typedBuffer, setTypedBuffer] = useState<string>('');
  const konamiIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Konami Code
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expectedKey = KONAMI_CODE[konamiIndex.current];

      if (key === expectedKey || key === expectedKey.toLowerCase()) {
        konamiIndex.current += 1;
        if (konamiIndex.current === KONAMI_CODE.length) {
          unlockAchievement('KONAMI_MASTER');
          addNotification('CHEAT CODE ACTIVATED', 'Konami code entered! Usability decreased by 40%.', 'success');
          incrementBadDecisions(10, 'konami');
          playUiSound('secret');
          konamiIndex.current = 0;
        }
      } else {
        konamiIndex.current = 0;
      }

      // 2. Typing listener ("terrible", "badui")
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        setTypedBuffer(prev => {
          const next = (prev + e.key.toLowerCase()).slice(-20);
          if (next.includes('terrible')) {
            addNotification('EASTER EGG UNLOCKED', 'You typed "terrible"! The UI acknowledges your wisdom.', 'warning');
            incrementBadDecisions(5, 'typed_terrible');
            playUiSound('secret');
            return '';
          }
          if (next.includes('badui')) {
            addNotification('EASTER EGG UNLOCKED', 'You typed "badui"! Searching for usability...', 'info');
            incrementBadDecisions(5, 'typed_badui');
            playUiSound('secret');
            return '';
          }
          return next;
        });
      }

      // 3. Hidden shortcut: Alt + Shift + X
      if (e.altKey && e.shiftKey && (e.key === 'X' || e.key === 'x')) {
        e.preventDefault();
        addNotification('SECRET SHORTCUT', 'You pressed Alt+Shift+X! Why would you know that?', 'error');
        incrementBadDecisions(15, 'secret_shortcut');
        playUiSound('secret');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlockAchievement, addNotification, incrementBadDecisions, playUiSound]);

  return { typedBuffer };
}
