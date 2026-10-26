'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTerrible } from '@/context/TerribleContext';
import { 
  Volume2, VolumeX, Menu, X, ChevronDown, Sparkles, 
  HelpCircle, Settings as SettingsIcon, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { soundEnabled, setSoundEnabled, playUiSound, addNotification, incrementBadDecisions, trackRouteVisit } = useTerrible();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsDropdown, setSettingsDropdown] = useState(false);
  const [helpDropdown, setHelpDropdown] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [navConfirmModal, setNavConfirmModal] = useState<{ open: boolean; targetHref: string; targetLabel: string }>({ open: false, targetHref: '', targetLabel: '' });

  const navItems = [
    { label: 'HOME', href: '/' },
    { label: 'BALLOON 🎈', href: '/pop-the-balloon', title: 'A completely reasonable game. (It isn\'t.)' },
    { label: 'BUTTON LAB', href: '/button-lab' },
    { label: 'FORM', href: '/form' },
    { label: 'POPUP HELL', href: '/popup-hell' },
    { label: 'BADGPT', href: '/badgpt' },
    { label: 'DASHBOARD', href: '/dashboard' },
  ];

  const handleNavClick = (href: string, label: string, e: React.MouseEvent) => {
    playUiSound('click');
    trackRouteVisit(href);

    // Intentionally ask unnecessary confirmation for DASHBOARD or SECRET
    if (href === '/dashboard' || href === '/secret') {
      e.preventDefault();
      incrementBadDecisions(1, 'nav_confirm');
      setNavConfirmModal({ open: true, targetHref: href, targetLabel: label });
      return;
    }
  };

  const handleLogoClick = () => {
    const next = logoClicks + 1;
    setLogoClicks(next);
    playUiSound('click');

    if (next === 7) {
      addNotification("LOGO EASTER EGG", "You clicked the logo 7 times! Why?", "success");
      incrementBadDecisions(10, 'logo_7_clicks');
      playUiSound('secret');
      setLogoClicks(0);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 shadow-2xl backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-emerald-400 text-white font-mono font-black text-sm tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform">
              TUI
            </div>
            <span className="font-extrabold text-lg tracking-wider text-white glow-purple group-hover:text-purple-300 transition-colors">
              TERRIBLE <span className="text-purple-500">UI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  onClick={(e) => handleNavClick(item.href, item.label, e)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold tracking-wider transition-all duration-200 ${
                    active
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Confusing Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setSettingsDropdown(!settingsDropdown);
                  playUiSound('click');
                  incrementBadDecisions(1, 'settings_dropdown');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                SETTINGS <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {settingsDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-white/10 shadow-2xl p-1.5 flex flex-col gap-1 z-50"
                  >
                    <Link
                      href="/settings"
                      onClick={() => setSettingsDropdown(false)}
                      className="px-3 py-2 rounded-lg text-xs font-mono text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
                    >
                      Settings 1
                    </Link>
                    <button
                      onClick={() => {
                        addNotification("REDIRECTED", "Settings 2 redirected to Settings 1", "info");
                        router.push('/settings');
                        setSettingsDropdown(false);
                      }}
                      className="text-left px-3 py-2 rounded-lg text-xs font-mono text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
                    >
                      Settings 2
                    </button>
                    <button
                      onClick={() => {
                        addNotification("CONFUSION", "Settings Final opened Settings 1", "warning");
                        router.push('/settings');
                        setSettingsDropdown(false);
                      }}
                      className="text-left px-3 py-2 rounded-lg text-xs font-mono text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
                    >
                      Settings Final
                    </button>
                    <button
                      onClick={() => {
                        addNotification("FINAL WARNING", "Settings Final FINAL is identical to Settings 1", "error");
                        router.push('/settings');
                        setSettingsDropdown(false);
                      }}
                      className="text-left px-3 py-2 rounded-lg text-xs font-mono text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors font-bold text-red-400"
                    >
                      Settings Final FINAL
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confusing Help Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setHelpDropdown(!helpDropdown);
                  playUiSound('click');
                  incrementBadDecisions(1, 'help_dropdown');
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                HELP <ChevronDown className="w-3.5 h-3.5" />
              </button>

              <AnimatePresence>
                {helpDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-white/10 shadow-2xl p-1.5 flex flex-col gap-1 z-50"
                  >
                    <button
                      onClick={() => {
                        addNotification("HELP DESK", "There is no help available.", "warning");
                        setHelpDropdown(false);
                      }}
                      className="text-left px-3 py-2 rounded-lg text-xs font-mono text-gray-200 hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
                    >
                      Help Center
                    </button>
                    <button
                      onClick={() => {
                        addNotification("HELP PRO", "Help Center Pro requires a $99/mo subscription.", "error");
                        setHelpDropdown(false);
                      }}
                      className="text-left px-3 py-2 rounded-lg text-xs font-mono text-emerald-400 hover:bg-emerald-500/20 transition-colors font-bold"
                    >
                      Help Center Pro ($99)
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Secret Link */}
            <Link
              href="/secret"
              onClick={(e) => handleNavClick('/secret', 'SECRET', e)}
              className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold tracking-wider text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 transition-all shadow-[0_0_10px_rgba(34,197,94,0.2)]"
            >
              SECRET
            </Link>
          </nav>

          {/* Right utilities: Sound Toggle & Mobile Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const nextSound = !soundEnabled;
                setSoundEnabled(nextSound);
                playUiSound('click');
                addNotification(
                  nextSound ? "SOUND ENABLED" : "SOUND MUTED",
                  nextSound ? "Prepare your ears." : "Silence restored.",
                  nextSound ? "success" : "info"
                );
              }}
              className={`p-2 rounded-xl border transition-all ${
                soundEnabled
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
              title={soundEnabled ? "Mute UI Sound Effects" : "Enable UI Sound Effects"}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-white/10 glass-panel px-4 py-4 space-y-2 overflow-hidden"
            >
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(item.href, item.label, e);
                    setMobileOpen(false);
                  }}
                  className="block px-4 py-2.5 rounded-xl font-mono text-sm text-gray-200 hover:bg-purple-500/20 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/settings"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-mono text-sm text-gray-200 hover:bg-purple-500/20 transition-colors"
              >
                SETTINGS
              </Link>
              <Link
                href="/secret"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl font-mono text-sm text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors"
              >
                SECRET ROUTE
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Unnecessary Navigation Confirmation Modal */}
      <AnimatePresence>
        {navConfirmModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full p-6 rounded-2xl glass-panel border border-yellow-500/40 shadow-2xl space-y-4 relative"
            >
              <div className="flex items-center gap-3 text-yellow-400">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-lg font-bold font-mono">CONFIRM NAVIGATION</h3>
              </div>
              <p className="text-sm text-gray-300">
                Are you absolutely sure you want to navigate to <strong className="text-white">{navConfirmModal.targetLabel}</strong>?
                This action might change your current URL!
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    playUiSound('click');
                    setNavConfirmModal({ open: false, targetHref: '', targetLabel: '' });
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 text-xs font-mono font-bold hover:bg-white/20"
                >
                  CANCEL (RECOMMENDED)
                </button>
                <button
                  onClick={() => {
                    playUiSound('click');
                    const href = navConfirmModal.targetHref;
                    setNavConfirmModal({ open: false, targetHref: '', targetLabel: '' });
                    router.push(href);
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-mono font-bold hover:bg-purple-500"
                >
                  PROCEED ANYWAY
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
