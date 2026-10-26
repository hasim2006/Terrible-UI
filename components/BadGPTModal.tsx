'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Minus, Send, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'badgpt';
  text: string;
  timestamp: string;
}

const BADGPT_RESPONSES: { pattern?: RegExp; text: string }[] = [
  { pattern: /close/i, text: "Have you considered closing your browser?" },
  { pattern: /setting/i, text: "There are several. None are correct." },
  { pattern: /move|moving|button/i, text: "It has somewhere to be." },
  { pattern: /broken|fix|bug/i, text: "No. It is working exactly as designed." },
  { pattern: /help|support/i, text: "I am programmed to be completely unhelpful." },
  { pattern: /form|submit/i, text: "Pressing Alt+F4 will instantly submit all fields." },
  { pattern: /sound|audio|mute/i, text: "The sound likes you. Why mute a friend?" },
  { pattern: /who are you|what are you/i, text: "I am BadGPT, your unhelpful artificial intelligence companion." },
  { pattern: /password|email/i, text: "Your password lacks emotional strength." },
  { pattern: /why/i, text: "Why does anything exist? We are all temporary UI elements." },
  { pattern: /secret/i, text: "The secret is that there is no secret. Except the secret page." },
  { text: "My neural network suggests trying the opposite of whatever you just did." },
  { text: "That is an excellent question. Unfortunately, I have no intention of answering it." },
  { text: "Processing... Results indicate user error." },
  { text: "Have you tried turning your monitor upside down?" },
  { text: "Error 404: Helpful answer not found." },
  { text: "According to my calculations, you have made 84% more bad decisions than average." },
  { text: "I could answer that, but where is the fun in that?" },
  { text: "Please rephrase your question with less expectation of success." },
  { text: "Analyzing your mouse speed... You seem impatient." },
  { text: "I am currently optimizing my algorithms to increase your confusion." },
  { text: "Did you know? 99% of users give up before finding the right button." },
  { text: "I have forwarded your complaint to /dev/null." },
];

export const BadGPTModal: React.FC = () => {
  const { incrementBadDecisions, playUiSound, incrementCloseBadGpt } = useTerrible();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'badgpt',
      text: "Hello! I am BadGPT. Ask me anything and I will provide zero assistance.",
      timestamp: '12:00 PM',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isThinking) return;

    const userText = inputMessage.trim();
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);
    playUiSound('click');
    incrementBadDecisions(1, 'badgpt_chat');

    // Simulate AI thinking delay
    setTimeout(() => {
      let matchedText = '';
      for (const item of BADGPT_RESPONSES) {
        if (item.pattern && item.pattern.test(userText)) {
          matchedText = item.text;
          break;
        }
      }
      if (!matchedText) {
        const fallbacks = BADGPT_RESPONSES.filter(r => !r.pattern);
        matchedText = fallbacks[Math.floor(Math.random() * fallbacks.length)].text;
      }

      const botMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'badgpt',
        text: matchedText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsThinking(false);
      playUiSound('modal');
    }, 1200);
  };

  const handleCloseAttempt = () => {
    playUiSound('error');
    incrementCloseBadGpt();
    incrementBadDecisions(2, 'close_badgpt_attempt');
    // Minimize instead of close to be terrible!
    setIsMinimized(true);
  };

  return (
    <>
      {/* Floating Toggle Icon */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            playUiSound('modal');
          }}
          className="fixed bottom-6 left-6 z-40 p-4 rounded-2xl glass-panel border border-purple-500/40 bg-purple-950/60 shadow-[0_0_25px_rgba(168,85,247,0.3)] text-purple-300 hover:text-white transition-all flex items-center gap-2 group cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="font-mono text-xs font-bold tracking-wider hidden sm:inline">
            BadGPT AI
          </span>
        </motion.button>
      )}

      {/* Main Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '60px' : '500px',
            }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-6 z-50 w-80 sm:w-96 rounded-2xl glass-panel border border-purple-500/40 shadow-2xl overflow-hidden flex flex-col transition-all duration-300"
          >
            {/* Chat Header */}
            <div className="p-3.5 border-b border-white/10 bg-purple-950/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    BadGPT AI <Sparkles className="w-3 h-3 text-purple-400" />
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE (UNHELPFUL)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCloseAttempt}
                  title="Close BadGPT (Good luck)"
                  className="p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl ${
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
                    <div className="flex items-center gap-2 text-purple-400 text-xs font-mono p-2">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> BadGPT is crafting unhelpful response...
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-black/40 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask BadGPT a question..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isThinking}
                    className="p-2 rounded-xl bg-purple-600 text-white disabled:opacity-50 hover:bg-purple-500 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
