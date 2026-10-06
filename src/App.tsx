/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { Navbar, NavTab } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { ResumeBuilder } from './components/builder/ResumeBuilder';
import { JobMatcher } from './components/job/JobMatcher';
import { ATSAnalyzer } from './components/analyzer/ATSAnalyzer';
import { SkillGapView } from './components/analyzer/SkillGapView';
import { InterviewCoach } from './components/interview/InterviewCoach';
import { ResumeHealthView } from './components/health/ResumeHealthView';
import { ResumePreview } from './components/preview/ResumePreview';
import { AuthModal } from './components/auth/AuthModal';
import { Target, Heart, ShieldCheck, Sparkles } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      {/* Main Content View */}
      <main className="flex-1 pb-16">
        {currentTab === 'landing' && <LandingPage onNavigate={setCurrentTab} />}
        {currentTab === 'dashboard' && <Dashboard onNavigate={setCurrentTab} />}
        {currentTab === 'builder' && <ResumeBuilder onNavigate={setCurrentTab} />}
        {currentTab === 'jobMatcher' && <JobMatcher onNavigate={setCurrentTab} />}
        {currentTab === 'analyzer' && <ATSAnalyzer onNavigate={setCurrentTab} />}
        {currentTab === 'skillGap' && <SkillGapView onNavigate={setCurrentTab} />}
        {currentTab === 'interview' && <InterviewCoach />}
        {currentTab === 'health' && <ResumeHealthView onNavigate={setCurrentTab} />}
        {currentTab === 'preview' && <ResumePreview onNavigate={setCurrentTab} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Target className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">ATS Pro</span>
            <span className="text-slate-400">• AI Resume Builder & Career Optimizer</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              AI-based compatibility estimate
            </span>
            <span className="text-slate-300">•</span>
            <button onClick={() => setCurrentTab('landing')} className="hover:text-blue-600">
              About Product
            </button>
            <span className="text-slate-300">•</span>
            <button onClick={() => setCurrentTab('builder')} className="hover:text-blue-600">
              Builder
            </button>
            <span className="text-slate-300">•</span>
            <button onClick={() => setCurrentTab('jobMatcher')} className="hover:text-blue-600">
              Job Matcher
            </button>
            <span className="text-slate-300">•</span>
            <button onClick={() => setCurrentTab('interview')} className="hover:text-blue-600">
              Interview Coach
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            Factual Accuracy & Anti-Hallucination Standard
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <AppContent />
      </ResumeProvider>
    </AuthProvider>
  );
}
