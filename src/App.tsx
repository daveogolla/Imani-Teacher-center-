import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { SchemeGenerator } from './components/SchemeGenerator';
import { LessonPlanGenerator } from './components/LessonPlanGenerator';
import { RevisionGenerator } from './components/RevisionGenerator';
import { KicdBooksCatalog } from './components/KicdBooksCatalog';
import { ContentIdeasBank } from './components/ContentIdeasBank';
import { ProgressTrackerCalendar } from './components/ProgressTrackerCalendar';
import { MpesaPaymentModal } from './components/MpesaPaymentModal';
import { AuthModal } from './components/AuthModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { AndroidFrame } from './components/AndroidFrame';
import {
  Sparkles,
  Smartphone,
  FileText,
  BookOpen,
  FileCheck,
  Lightbulb,
  Calendar,
  Home,
  ShieldCheck,
  Heart,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentTab, setCurrentTab, isAndroidView, setIsAiDrawerOpen } = useApp();

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'schemes':
        return <SchemeGenerator />;
      case 'lesson-plans':
        return <LessonPlanGenerator />;
      case 'revision':
        return <RevisionGenerator />;
      case 'books':
        return <KicdBooksCatalog />;
      case 'ideas':
        return <ContentIdeasBank />;
      case 'calendar':
        return <ProgressTrackerCalendar />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveView()}
      </main>

      {/* Floating Action Button for AI Copilot (visible on desktop and mobile) */}
      <button
        onClick={() => setIsAiDrawerOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-2xl shadow-emerald-600/40 hover:scale-105 active:scale-95 transition flex items-center space-x-2 border border-white/20 cursor-pointer"
        title="Open KICD AI Curriculum Assistant"
      >
        <Sparkles className="w-5 h-5 text-emerald-200 animate-spin-slow" />
        <span className="hidden sm:inline font-bold text-xs tracking-wide">Ask AI Copilot</span>
      </button>

      {/* Mobile Bottom Navigation (Visible when not in AndroidFrame mode on smaller screens) */}
      {!isAndroidView && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center text-[10px] font-bold ${
              currentTab === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => setCurrentTab('schemes')}
            className={`flex flex-col items-center text-[10px] font-bold ${
              currentTab === 'schemes'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>Schemes</span>
          </button>
          <button
            onClick={() => setCurrentTab('revision')}
            className={`flex flex-col items-center text-[10px] font-bold ${
              currentTab === 'revision'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500'
            }`}
          >
            <FileCheck className="w-4 h-4 mb-0.5" />
            <span>Revision</span>
          </button>
          <button
            onClick={() => setCurrentTab('books')}
            className={`flex flex-col items-center text-[10px] font-bold ${
              currentTab === 'books'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Books</span>
          </button>
          <button
            onClick={() => setCurrentTab('ideas')}
            className={`flex flex-col items-center text-[10px] font-bold ${
              currentTab === 'ideas'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-500'
            }`}
          >
            <Lightbulb className="w-4 h-4 mb-0.5" />
            <span>Ideas</span>
          </button>
          <button
            onClick={() => setCurrentTab('calendar')}
            className={`flex flex-col items-center text-[10px] font-bold ${
              currentTab === 'calendar'
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-slate-500'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Calendar</span>
          </button>
        </div>
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-slate-800 dark:text-slate-200">IMANI TEACHERS CENTER</span>
            <span>•</span>
            <span>KICD Approved Kenyan Curriculum Repository</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>M-Pesa Direct Send Money: <strong>0707423879</strong> (Ksh. 15 / download)</span>
            <span>•</span>
            <span>PP1 to Grade 12 & KCSE/CBE</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <MpesaPaymentModal />
      <AuthModal />
      <AiAssistantDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AndroidFrame>
        <MainAppContent />
      </AndroidFrame>
    </AppProvider>
  );
}
