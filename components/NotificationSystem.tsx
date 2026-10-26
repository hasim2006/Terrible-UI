'use client';

import React from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle2, XCircle, X } from 'lucide-react';

export const NotificationSystem: React.FC = () => {
  const { notifications, dismissNotification } = useTerrible();

  const getIcon = (type?: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400 shrink-0" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-purple-400 shrink-0" />;
    }
  };

  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;

  return (
    <>
      {corners.map(corner => {
        const cornerNotifs = notifications.filter(n => (n.corner || 'top-right') === corner);
        if (cornerNotifs.length === 0) return null;

        const positionClasses = {
          'top-left': 'top-20 left-6 flex-col',
          'top-right': 'top-20 right-6 flex-col',
          'bottom-left': 'bottom-20 left-6 flex-col-reverse',
          'bottom-right': 'bottom-24 right-6 flex-col-reverse',
        }[corner];

        return (
          <div key={corner} className={`fixed z-50 flex gap-3 pointer-events-none max-w-sm w-full ${positionClasses}`}>
            <AnimatePresence>
              {cornerNotifs.map(notif => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, scale: 0.8, y: corner.startsWith('top') ? -20 : 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: corner.endsWith('right') ? 50 : -50 }}
                  className="pointer-events-auto w-full p-4 rounded-xl glass-panel border border-white/10 shadow-2xl backdrop-blur-xl flex items-start gap-3 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-emerald-500" />
                  {getIcon(notif.type)}
                  <div className="flex-1 pr-4">
                    <h4 className="text-xs font-mono font-bold tracking-wider text-gray-200 uppercase">
                      {notif.title}
                    </h4>
                    {notif.message && (
                      <p className="text-xs text-gray-400 mt-1 font-sans leading-relaxed">
                        {notif.message}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => dismissNotification(notif.id)}
                    className="text-gray-500 hover:text-white p-1 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );
      })}
    </>
  );
};
