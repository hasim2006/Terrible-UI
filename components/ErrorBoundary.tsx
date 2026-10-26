'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Terrible UI caught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl glass-panel border border-red-500/40 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mx-auto animate-pulse">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-mono font-bold text-red-400">
                SYSTEM COLLAPSE
              </h2>
              <p className="text-sm text-gray-300 font-sans leading-relaxed">
                Something went wrong. We don't know what. But it probably wasn't your fault.
              </p>
            </div>

            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-purple-600 text-white font-mono text-xs font-bold tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> ATTEMPT RECOVERY
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
