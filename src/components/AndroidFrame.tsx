import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wifi,
  BatteryCharging,
  Signal,
  Home,
  FileText,
  FileCheck,
  BookOpen,
  Lightbulb,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const AndroidFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAndroidView, currentTab, setCurrentTab } = useApp();

  if (!isAndroidView) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen py-6 px-2 flex items-center justify-center bg-slate-900/90 backdrop-blur-md">
      {/* Android Device Mockup Shell */}
      <div className="relative w-full max-w-[420px] h-[880px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-white/10 flex flex-col overflow-hidden">
        {/* Top Speaker & Camera Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-b-2xl z-40 flex items-center justify-center space-x-2">
          <div className="w-12 h-1 bg-slate-800 rounded-full" />
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-700" />
        </div>

        {/* Android Status Bar */}
        <div className="w-full pt-1.5 pb-2 px-6 flex items-center justify-between text-white text-[11px] font-semibold select-none z-30 shrink-0">
          <span>14:50</span>
          <div className="flex items-center space-x-2 text-[10px]">
            <span className="font-mono text-emerald-400 font-bold">Safaricom 5G</span>
            <Signal className="w-3 h-3 text-white" />
            <Wifi className="w-3 h-3 text-white" />
            <span className="flex items-center">
              98%
              <BatteryCharging className="w-3 h-3 ml-0.5 text-emerald-400" />
            </span>
          </div>
        </div>

        {/* App Content Container inside Phone */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 rounded-[36px] p-4 text-slate-900 dark:text-slate-100 no-scrollbar">
          {children}
        </div>

        {/* Android Bottom Navigation Bar */}
        <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-2 pb-4 px-2 rounded-b-[36px] flex items-center justify-around z-30 shrink-0">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              currentTab === 'dashboard'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Home className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setCurrentTab('schemes')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              currentTab === 'schemes'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>Schemes</span>
          </button>

          <button
            onClick={() => setCurrentTab('revision')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              currentTab === 'revision'
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileCheck className="w-4 h-4 mb-0.5" />
            <span>Revision</span>
          </button>

          <button
            onClick={() => setCurrentTab('books')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              currentTab === 'books'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span>Books</span>
          </button>

          <button
            onClick={() => setCurrentTab('ideas')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              currentTab === 'ideas'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Lightbulb className="w-4 h-4 mb-0.5" />
            <span>Ideas</span>
          </button>

          <button
            onClick={() => setCurrentTab('calendar')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl text-[10px] font-bold transition ${
              currentTab === 'calendar'
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            <span>Calendar</span>
          </button>
        </div>

        {/* Android Home Indicator Pill */}
        <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-1 mb-0.5 shrink-0" />
      </div>
    </div>
  );
};
