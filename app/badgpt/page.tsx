'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, RefreshCw, AlertCircle, HelpCircle, MessageSquare } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'badgpt';
  text: string;
  timestamp: string;
}

const PREDEFINED_QUESTIONS = [
  "How do I close this?",
  "Where are settings?",
  "Why is the button moving?",
  "Is this website broken?",
  "How do I submit the form?",
  "Can I turn off sound?",
];

const RESPONSES_MAP: Record<string, string> = {
  "How do I close this?": "Have you considered closing your browser?",
  "Where are settings?": "There are several. None are correct.",
  "Why is the button moving?": "It has somewhere to be.",
  "Is this website broken?": "No. It is working exactly as designed.",
  "How do I submit the form?": "Press Alt+F4 to fast submit all fields.",
  "Can I turn off sound?": "The sound likes you. Why mute a friend?",
};

export default function BadGPTPage() {
  const { incrementBadDecisions, playUiSound } = useTerrible();

  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'badgpt',
      text: "Welcome to the official BadGPT portal. Ask any question and I will guarantee zero assistance.",
      timestamp: '12:00 PM',
    },
  ]);

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isThinking) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsThinking(true);
    playUiSound('click');
    incrementBadDecisions(1, 'badgpt_full_page');

    setTimeout(() => {
      let answer = RESPONSES_MAP[text];
      if (!answer) {
        const fallbacks = [
          "My AI model concluded that answering this question would decrease your confusion.",
          "Error 404: Helpful advice not found.",
          "According to my knowledge base, try doing the opposite of whatever you intend.",
          "Your query has been logged and immediately ignored.",
        ];
        answer = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      }

      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'badgpt',
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);
      playUiSound('modal');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 font-mono text-xs font-semibold">
          <Bot className="w-3.5 h-3.5" /> ARTIFICIAL UNHELPFULNESS
        </div>
        <h1 className="text-4xl font-extrabold font-mono text-white">BadGPT AI</h1>
        <p className="text-xs text-gray-400 font-sans">
          Powered by state-of-the-art neural un-learning algorithms.
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Suggested Questions Sidebar */}
        <div className="lg:col-span-1 p-5 rounded-3xl glass-panel border border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-purple-400" /> FREQUENT QUESTIONS
          </h3>
          <div className="space-y-2">
            {PREDEFINED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-purple-500/20 text-xs font-sans text-gray-300 hover:text-white transition-colors border border-white/5"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3 rounded-3xl glass-panel border border-white/10 shadow-2xl flex flex-col h-[550px] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-purple-950/30 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-mono font-bold text-white flex items-center gap-2">
                BadGPT Neural Network <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </h2>
              <span className="text-[10px] font-mono text-emerald-400">STATUS: 100% UNHELPFUL</span>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 font-sans text-xs">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-br-none shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-white/5 text-gray-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] font-mono text-gray-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs p-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> BadGPT is generating unhelpful response...
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-4 border-t border-white/10 bg-black/40 flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask BadGPT anything..."
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isThinking}
              className="px-5 py-3 rounded-xl bg-purple-600 text-white font-mono font-bold text-xs disabled:opacity-50 hover:bg-purple-500 transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
