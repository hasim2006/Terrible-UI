'use client';

import React, { useState } from 'react';
import { useTerrible } from '@/context/TerribleContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, AlertTriangle, CheckCircle2, XCircle, ShieldAlert, Sparkles } from 'lucide-react';

export default function SimpleForm() {
  const { incrementBadDecisions, addNotification, playUiSound, unlockAchievement } = useTerrible();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    phone: '',
    favoriteColor: '#a855f7',
    securityQuestion: '',
    reason: '',
    sureChecked: false,
  });

  const [submitStep, setSubmitStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const submitButtonLabels = [
    'SUBMIT',
    'MAYBE SUBMIT',
    'ARE YOU SURE?',
    'THINK AGAIN',
    'SUBMIT ANYWAY',
    'FINAL SUBMISSION',
    'FINAL SUBMISSION 2',
    'SUBMIT FOR REAL',
  ];

  // Ridiculous validation outputs
  const getValidationFeedback = () => {
    const feedback: { field: string; message: string; type: 'error' | 'warning' }[] = [];

    if (formData.email.includes('@') && formData.email.includes('.')) {
      feedback.push({ field: 'Email', message: 'Email is suspiciously valid.', type: 'warning' });
    }

    if (formData.password.length > 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password)) {
      feedback.push({ field: 'Password', message: 'Password is too strong.', type: 'error' });
    } else if (formData.password.length > 0) {
      feedback.push({ field: 'Password', message: 'Password lacks emotional strength.', type: 'error' });
    }

    if (formData.password && formData.confirmPassword && formData.password === formData.confirmPassword) {
      feedback.push({ field: 'Confirm Password', message: 'Matching passwords look suspicious.', type: 'warning' });
    }

    if (formData.age && parseInt(formData.age, 10) > 0) {
      feedback.push({ field: 'Age', message: 'Age seems statistically unlikely.', type: 'error' });
    }

    if (formData.phone.length > 5) {
      feedback.push({ field: 'Phone', message: 'Phone number contains too many digits.', type: 'warning' });
    }

    return feedback;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playUiSound('click');
    incrementBadDecisions(2, 'form_submit');
    unlockAchievement('FORM_WARRIOR');

    if (submitStep < submitButtonLabels.length - 1) {
      setSubmitStep(prev => prev + 1);
      addNotification("SUBMISSION PROGRESS", `Advanced to step ${submitStep + 2} of submission.`, "warning");
    } else {
      setSubmitted(true);
      playUiSound('achievement');
      addNotification("FORM SUBMITTED", "Registration failed successfully!", "error");
    }
  };

  const feedbackList = getValidationFeedback();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" /> IMPOSSIBLE VALIDATION
        </div>
        <h1 className="text-4xl font-extrabold font-mono text-white">THE SIMPLE FORM</h1>
        <p className="text-xs text-gray-400 font-sans">
          Please fill in all 10 simple fields below to complete your registration.
        </p>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-6">
        
        {/* Field 1: Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            1. Full Name <span className="text-purple-400">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="e.g. John Doe"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
          />
        </div>

        {/* Field 2: Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            2. Email Address <span className="text-purple-400">*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john@example.com"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
          />
        </div>

        {/* Field 3: Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            3. Password <span className="text-purple-400">*</span>
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter password..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
          />
        </div>

        {/* Field 4: Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            4. Confirm Password <span className="text-purple-400">*</span>
          </label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Re-enter password..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
          />
        </div>

        {/* Field 5: Age */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            5. Age <span className="text-purple-400">*</span>
          </label>
          <input
            type="number"
            required
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            placeholder="Enter age..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
          />
        </div>

        {/* Field 6: Phone Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            6. Phone Number <span className="text-purple-400">*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
          />
        </div>

        {/* Field 7: Favorite Color Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            7. Favorite Color <span className="text-purple-400">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={formData.favoriteColor}
              onChange={(e) => handleInputChange('favoriteColor', e.target.value)}
              className="w-12 h-10 rounded-lg bg-transparent cursor-pointer border border-white/10"
            />
            <span className="font-mono text-xs text-gray-400">{formData.favoriteColor}</span>
          </div>
        </div>

        {/* Field 8: Security Question */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            8. Security Question <span className="text-purple-400">*</span>
          </label>
          <select
            value={formData.securityQuestion}
            onChange={(e) => handleInputChange('securityQuestion', e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 font-sans"
          >
            <option value="" className="bg-gray-900">Select an unanswerable question...</option>
            <option value="q1" className="bg-gray-900">What is the capital of Atlantis?</option>
            <option value="q2" className="bg-gray-900">What color is Tuesday?</option>
            <option value="q3" className="bg-gray-900">Why did the fleeing button cross the road?</option>
          </select>
        </div>

        {/* Field 9: Reason for Registration */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-gray-300 uppercase tracking-wider block">
            9. Reason for Registration <span className="text-purple-400">*</span>
          </label>
          <textarea
            rows={2}
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            placeholder="Write at least 50 words explaining your choice..."
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 font-sans"
          />
        </div>

        {/* Field 10: Are you absolutely sure? */}
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <span className="text-xs font-mono text-gray-300">
            10. Are you absolutely sure you want to register?
          </span>
          <input
            type="checkbox"
            checked={formData.sureChecked}
            onChange={(e) => {
              playUiSound('click');
              // Intentionally uncheck half the time when user clicks!
              if (Math.random() > 0.5) {
                addNotification("CHECKBOX ERROR", "Checkbox un-checked itself.", "warning");
                handleInputChange('sureChecked', false);
              } else {
                handleInputChange('sureChecked', e.target.checked);
              }
            }}
            className="w-5 h-5 rounded accent-purple-600 cursor-pointer"
          />
        </div>

        {/* Live Validation Warnings Container */}
        {feedbackList.length > 0 && (
          <div className="p-4 rounded-2xl bg-yellow-950/40 border border-yellow-500/30 space-y-2">
            <div className="flex items-center gap-2 text-yellow-400 text-xs font-mono font-bold uppercase">
              <AlertTriangle className="w-4 h-4" /> LIVE VALIDATION DIAGNOSTICS
            </div>
            <ul className="space-y-1 text-xs font-sans text-gray-300">
              {feedbackList.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-yellow-400 font-mono">• [{item.field}]:</span> {item.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dynamic Submit Button */}
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-emerald-600 text-white font-mono font-extrabold text-sm tracking-wider shadow-[0_0_25px_rgba(168,85,247,0.3)] hover:opacity-90 transition-all cursor-pointer"
        >
          {submitButtonLabels[submitStep]} ({submitStep + 1}/{submitButtonLabels.length})
        </button>

      </form>

      {/* Submission Result Modal */}
      <AnimatePresence>
        {submitted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full p-8 rounded-3xl glass-panel border border-red-500/50 text-center space-y-6 shadow-2xl"
            >
              <div className="p-4 rounded-2xl bg-red-500/20 text-red-400 w-fit mx-auto border border-red-500/30">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold font-mono text-white">REGISTRATION FAILED SUCCESSFULLY</h3>
                <p className="text-xs text-gray-300 font-sans">
                  Your registration data was rejected because all fields passed validation. Perfect inputs are disallowed in this system.
                </p>
              </div>
              <button
                onClick={() => {
                  playUiSound('click');
                  setSubmitted(false);
                  setSubmitStep(0);
                }}
                className="w-full py-3 rounded-xl bg-purple-600 text-white font-mono text-xs font-bold hover:bg-purple-500 transition-colors"
              >
                TRY AGAIN WITH WORSE DATA
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
