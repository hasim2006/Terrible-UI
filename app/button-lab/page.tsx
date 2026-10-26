'use client';

import React, { useState } from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MousePointerClick, AlertCircle, Download, Check, X, 
  RotateCw, Volume2, ArrowUp, Zap, DollarSign, Sparkles,
  HelpCircle, Trash2, FileText, Lock
} from 'lucide-react';

export default function ButtonLab() {
  const { incrementBadDecisions, addNotification, playUiSound, trackButtonLabClick } = useTerrible();

  // Button specific states
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'failed'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'nevermind'>('idle');
  
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);

  const [acceptPos, setAcceptPos] = useState({ x: 0, y: 0 });
  const [isSwapped, setIsSwapped] = useState(false);

  const [isFlipped, setIsFlipped] = useState(false);
  const [isBlinded, setIsBlinded] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [schrodingerText, setSchrodingerText] = useState('NORMAL BUTTON');

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [termsScrolled, setTermsScrolled] = useState(false);

  const handleButtonClick = (buttonId: string, label: string, action?: () => void) => {
    playUiSound('click');
    incrementBadDecisions(1, `button_${buttonId}`);
    trackButtonLabClick(buttonId);
    if (action) action();
  };

  // Button 5: Download
  const handleDownload = () => {
    handleButtonClick('download', 'DOWNLOAD');
    setDownloadState('loading');
    setDownloadProgress(0);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 99) {
        clearInterval(interval);
        setDownloadProgress(99);
        setTimeout(() => {
          setDownloadState('failed');
          playUiSound('error');
          addNotification("DOWNLOAD FAILED", "Download failed because you clicked Download.", "error");
        }, 1000);
      } else {
        setDownloadProgress(current);
        playUiSound('loading');
      }
    }, 300);
  };

  // Button 6: Save
  const handleSave = () => {
    handleButtonClick('save', 'SAVE');
    setSaveState('saving');
    setTimeout(() => {
      setSaveState('saved');
      setTimeout(() => {
        setSaveState('nevermind');
        playUiSound('error');
        addNotification("SAVE ERROR", "Saved. Actually... Never mind.", "warning");
      }, 1500);
    }, 1200);
  };

  // Button 17: Refresh Screen (180deg flip)
  const handleFlipScreen = () => {
    handleButtonClick('refresh', 'REFRESH');
    setIsFlipped(true);
    addNotification("SCREEN FLIPPED", "Screen rotated 180 degrees.", "warning");
    setTimeout(() => {
      setIsFlipped(false);
    }, 2500);
  };

  // Button 22: Blinding Light
  const handleBlindingLight = () => {
    handleButtonClick('blind', 'LIGHT THEME');
    setIsBlinded(true);
    setTimeout(() => {
      setIsBlinded(false);
    }, 1000);
  };

  return (
    <div className={`space-y-12 transition-transform duration-700 ${isFlipped ? 'rotate-180' : ''}`}>
      {/* Flash overlay for blinding light */}
      {isBlinded && (
        <div className="fixed inset-0 z-50 bg-white transition-opacity duration-300 pointer-events-none" />
      )}

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-mono text-xs font-semibold">
          <MousePointerClick className="w-3.5 h-3.5" /> 25+ TERRIBLE BUTTONS
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-mono text-white">
          THE BUTTON LAB
        </h1>
        <p className="text-sm text-gray-400 font-sans leading-relaxed">
          Every button below demonstrates a distinct bad UX anti-pattern. Click at your own risk.
        </p>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. SUBMIT */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Inert Control</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: SUBMIT</h3>
            <p className="text-xs text-gray-400 mt-1">Visually standard submit button. Behavior: does absolutely nothing.</p>
          </div>
          <button
            onClick={() => handleButtonClick('submit_inert', 'SUBMIT', () => {
              addNotification("NOTICE", "Button clicked. Nothing happened.", "info");
            })}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs transition-colors"
          >
            SUBMIT
          </button>
        </div>

        {/* 2. CANCEL */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Inverted Intent</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: CANCEL</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: submits form data and opens confirmation dialog.</p>
          </div>
          <button
            onClick={() => handleButtonClick('cancel_submits', 'CANCEL', () => {
              addNotification("CONFIRMATION", "Form submitted via Cancel button!", "warning");
            })}
            className="w-full py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-mono font-bold text-xs transition-colors"
          >
            CANCEL
          </button>
        </div>

        {/* 3. CLOSE */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Infinite Modals</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: CLOSE</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: opens another popup modal instead of closing.</p>
          </div>
          <button
            onClick={() => handleButtonClick('close_opens', 'CLOSE', () => setActiveModal('close_modal'))}
            className="w-full py-3 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 font-mono font-bold text-xs hover:bg-red-600/30 transition-colors"
          >
            CLOSE
          </button>
        </div>

        {/* 4. DELETE */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Confusing Dialog</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: DELETE</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: asks &ldquo;Are you sure you want to cancel?&rdquo;</p>
          </div>
          <button
            onClick={() => handleButtonClick('delete_confusing', 'DELETE', () => setActiveModal('delete_modal'))}
            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> DELETE
          </button>
        </div>

        {/* 5. DOWNLOAD */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Self-Defeating Download</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: DOWNLOAD</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: fake loading 99% then fails because you clicked Download.</p>
          </div>
          <button
            onClick={handleDownload}
            disabled={downloadState === 'loading'}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" /> 
            {downloadState === 'idle' && 'DOWNLOAD'}
            {downloadState === 'loading' && `LOADING ${downloadProgress}%`}
            {downloadState === 'failed' && 'DOWNLOAD FAILED'}
          </button>
        </div>

        {/* 6. SAVE */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Regretful Save</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: SAVE</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: Saving... Saved. Actually... Never mind.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs transition-colors"
          >
            {saveState === 'idle' && 'SAVE'}
            {saveState === 'saving' && 'SAVING...'}
            {saveState === 'saved' && 'SAVED!'}
            {saveState === 'nevermind' && 'NEVER MIND.'}
          </button>
        </div>

        {/* 7. YES */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4 overflow-hidden">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Expanding Control</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: YES</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: gets larger every time it is clicked.</p>
          </div>
          <div className="flex items-center justify-center p-4">
            <button
              onClick={() => {
                handleButtonClick('yes_expands', 'YES');
                setYesScale(prev => Math.min(prev + 0.3, 3));
              }}
              style={{ transform: `scale(${yesScale})` }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs transition-transform duration-200"
            >
              YES
            </button>
          </div>
        </div>

        {/* 8. NO */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Shrinking Control</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: NO</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: gets smaller every time it is clicked.</p>
          </div>
          <div className="flex items-center justify-center p-4">
            <button
              onClick={() => {
                handleButtonClick('no_shrinks', 'NO');
                setNoScale(prev => Math.max(prev - 0.2, 0.2));
              }}
              style={{ transform: `scale(${noScale})` }}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-mono font-bold text-xs transition-transform duration-200"
            >
              NO
            </button>
          </div>
        </div>

        {/* 9. ACCEPT */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Elusive Target</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: ACCEPT</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: moves away from cursor when hovered.</p>
          </div>
          <motion.button
            animate={{ x: acceptPos.x, y: acceptPos.y }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onMouseEnter={() => {
              playUiSound('flee');
              setAcceptPos({ x: (Math.random() - 0.5) * 160, y: (Math.random() - 0.5) * 80 });
            }}
            onClick={() => handleButtonClick('accept_flees', 'ACCEPT')}
            className="w-full py-3 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs"
          >
            ACCEPT
          </motion.button>
        </div>

        {/* 10. EMERGENCY */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: False Emergency</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: EMERGENCY</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: bright warning button that does absolutely nothing.</p>
          </div>
          <button
            onClick={() => handleButtonClick('emergency_inert', 'EMERGENCY', () => {
              addNotification("EMERGENCY STATUS", "Emergency button pressed. No emergency detected.", "warning");
            })}
            className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-mono font-extrabold text-xs transition-colors animate-pulse"
          >
            EMERGENCY
          </button>
        </div>

        {/* 11. EXIT */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Confusing Exit</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: EXIT</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: asks &ldquo;Are you sure you want to continue?&rdquo;</p>
          </div>
          <button
            onClick={() => handleButtonClick('exit_confusing', 'EXIT', () => setActiveModal('exit_modal'))}
            className="w-full py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-mono font-bold text-xs transition-colors"
          >
            EXIT
          </button>
        </div>

        {/* 12. CONTINUE */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Disorienting Navigation</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: CONTINUE</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: actually exits the section and scrolls to top.</p>
          </div>
          <button
            onClick={() => handleButtonClick('continue_scrolls', 'CONTINUE', () => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              addNotification("NAVIGATION", "Scrolled to top.", "info");
            })}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs transition-colors"
          >
            CONTINUE
          </button>
        </div>

        {/* 13. AGREE TO TERMS */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Forced Micro Scroll</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">TERMS & CONDITIONS</h3>
            <p className="text-xs text-gray-400 mt-1">Must scroll through tiny box to enable button.</p>
          </div>
          <div 
            onScroll={(e) => {
              const target = e.currentTarget;
              if (target.scrollTop + target.clientHeight >= target.scrollHeight - 5) {
                setTermsScrolled(true);
              }
            }}
            className="h-20 overflow-y-auto p-2 bg-black/40 border border-white/10 rounded-xl text-[10px] font-mono text-gray-400 space-y-2"
          >
            <p>Section 1: You agree that all UI decisions are intentionally terrible.</p>
            <p>Section 2: You acknowledge that buttons may move without warning.</p>
            <p>Section 3: You waive the right to a clean user interface.</p>
            <p>Section 4: Keep scrolling to unlock the agree button...</p>
            <p className="font-bold text-emerald-400">Section 5: Scroll complete! You may now agree.</p>
          </div>
          <button
            disabled={!termsScrolled}
            onClick={() => handleButtonClick('agree_terms', 'AGREE', () => {
              addNotification("TERMS AGREED", "You agreed to suffer.", "success");
            })}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-mono font-bold text-xs transition-colors"
          >
            I AGREE TO TERMS
          </button>
        </div>

        {/* 14. SWAP CONFIRM & CANCEL */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Dynamic Positional Swap</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">CONFIRM & CANCEL</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: buttons swap places whenever hovered.</p>
          </div>
          <div className="flex gap-2">
            <button
              onMouseEnter={() => setIsSwapped(!isSwapped)}
              onClick={() => handleButtonClick('swap_1', isSwapped ? 'CANCEL' : 'CONFIRM')}
              className={`flex-1 py-3 rounded-xl font-mono font-bold text-xs text-white transition-colors ${
                isSwapped ? 'bg-gray-700' : 'bg-purple-600'
              }`}
            >
              {isSwapped ? 'CANCEL' : 'CONFIRM'}
            </button>
            <button
              onMouseEnter={() => setIsSwapped(!isSwapped)}
              onClick={() => handleButtonClick('swap_2', isSwapped ? 'CONFIRM' : 'CANCEL')}
              className={`flex-1 py-3 rounded-xl font-mono font-bold text-xs text-white transition-colors ${
                isSwapped ? 'bg-purple-600' : 'bg-gray-700'
              }`}
            >
              {isSwapped ? 'CONFIRM' : 'CANCEL'}
            </button>
          </div>
        </div>

        {/* 15. REFRESH PAGE (180deg flip) */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Rotational Disorientation</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BUTTON: REFRESH</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: rotates the viewport 180 degrees.</p>
          </div>
          <button
            onClick={handleFlipScreen}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-emerald-600 text-white font-mono font-bold text-xs flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" /> REFRESH SCREEN
          </button>
        </div>

        {/* 16. SCROLL TO TOP (Scrolls to bottom) */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Inverted Scrolling</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">BACK TO TOP</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: scrolls directly to the bottom of the document.</p>
          </div>
          <button
            onClick={() => handleButtonClick('back_to_top', 'BACK TO TOP', () => {
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
              addNotification("SCROLLED", "Sent to bottom of page.", "info");
            })}
            className="w-full py-3 rounded-xl bg-purple-950 text-purple-300 border border-purple-500/40 font-mono font-bold text-xs flex items-center justify-center gap-2"
          >
            <ArrowUp className="w-4 h-4" /> BACK TO TOP
          </button>
        </div>

        {/* 17. DO NOT PRESS */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Overwhelming Party</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">DO NOT PRESS</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: triggers celebratory party audio fanfare.</p>
          </div>
          <button
            onClick={() => handleButtonClick('party_button', 'PARTY', () => {
              playUiSound('achievement');
              addNotification("PARTY MODE", "You pressed the forbidden button!", "success");
            })}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 text-black font-mono font-black text-xs shadow-lg"
          >
            DO NOT PRESS!
          </button>
        </div>

        {/* 18. LIGHT THEME (Blinding light) */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Flashbang</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">LIGHT THEME</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: temporarily blinds user with pure white screen.</p>
          </div>
          <button
            onClick={handleBlindingLight}
            className="w-full py-3 rounded-xl bg-white text-black font-mono font-bold text-xs hover:bg-gray-200 transition-colors"
          >
            LIGHT THEME
          </button>
        </div>

        {/* 19. PAY $0.00 */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Hidden Tip Addition</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">PAY $0.00 NOW</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: processes receipt for $0.00 + $50.00 default tip.</p>
          </div>
          <button
            onClick={() => handleButtonClick('pay_zero', 'PAY', () => {
              addNotification("RECEIPT GENERATED", "Charged $0.00 + $50.00 mandatory tip. Total: $50.00", "error");
            })}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2"
          >
            <DollarSign className="w-4 h-4" /> PAY NOW ($0.00)
          </button>
        </div>

        {/* 20. SPIN INFINITELY */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Infinite Rotation</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">SPIN ME</h3>
            <p className="text-xs text-gray-400 mt-1">Behavior: button spins indefinitely once clicked.</p>
          </div>
          <button
            onClick={() => {
              handleButtonClick('spin_button', 'SPIN');
              setIsSpinning(!isSpinning);
            }}
            className={`w-full py-3 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs ${isSpinning ? 'animate-spin' : ''}`}
          >
            {isSpinning ? 'SPINNING FOREVER' : 'CLICK TO SPIN'}
          </button>
        </div>

        {/* 21. SCHRÖDINGER'S BUTTON */}
        <div className="p-6 rounded-3xl glass-card border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-gray-400 uppercase">Anti-Pattern: Quantum Observer</span>
            <h3 className="text-lg font-bold text-white font-mono mt-1">SCHRÖDINGER&apos;S BUTTON</h3>
            <p className="text-xs text-gray-400 mt-1">State changes only when your mouse leaves the element.</p>
          </div>
          <button
            onMouseLeave={() => {
              const states = ['DISABLED', 'SUBMITTED', 'REJECTED', 'UNKNOWN', 'SCHRÖDINGER'];
              const next = states[Math.floor(Math.random() * states.length)];
              setSchrodingerText(next);
            }}
            onClick={() => handleButtonClick('schrodinger', schrodingerText)}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs"
          >
            STATE: {schrodingerText}
          </button>
        </div>

      </div>

      {/* Modals for Button Lab */}
      <AnimatePresence>
        {activeModal === 'close_modal' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="max-w-md w-full p-6 rounded-2xl glass-panel border border-red-500/40 text-center space-y-4">
              <h3 className="text-lg font-bold font-mono text-white">ANOTHER MODAL OPENED</h3>
              <p className="text-xs text-gray-300">You clicked CLOSE, so we opened this modal to ask why you want to close.</p>
              <button
                onClick={() => {
                  playUiSound('click');
                  setActiveModal(null);
                }}
                className="w-full py-2.5 rounded-xl bg-red-600 text-white font-mono text-xs font-bold"
              >
                CLOSE THIS MODAL TOO
              </button>
            </div>
          </div>
        )}

        {activeModal === 'delete_modal' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="max-w-md w-full p-6 rounded-2xl glass-panel border border-yellow-500/40 text-center space-y-4">
              <h3 className="text-lg font-bold font-mono text-white">CONFIRM CANCEL</h3>
              <p className="text-xs text-gray-300">Are you sure you want to cancel deleting?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    playUiSound('click');
                    setActiveModal(null);
                    addNotification("ACTION", "Cancelled cancellation.", "info");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold"
                >
                  YES (CANCEL)
                </button>
                <button
                  onClick={() => {
                    playUiSound('click');
                    setActiveModal(null);
                    addNotification("ACTION", "Proceeded anyway.", "warning");
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-gray-700 text-white font-mono text-xs font-bold"
                >
                  NO (CONTINUE)
                </button>
              </div>
            </div>
          </div>
        )}

        {activeModal === 'exit_modal' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="max-w-md w-full p-6 rounded-2xl glass-panel border border-purple-500/40 text-center space-y-4">
              <h3 className="text-lg font-bold font-mono text-white">CONFIRMATION</h3>
              <p className="text-xs text-gray-300">Are you sure you want to continue?</p>
              <button
                onClick={() => {
                  playUiSound('click');
                  setActiveModal(null);
                  addNotification("EXIT", "Exited modal.", "info");
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold"
              >
                CONTINUE TO EXIT
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
