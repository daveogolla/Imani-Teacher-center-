import React from 'react';
import { useApp } from '../context/AppContext';
import {
  School,
  Moon,
  Sun,
  Smartphone,
  Sparkles,
  User,
  Search,
  BookOpen,
  FileText,
  FileCheck,
  Lightbulb,
  Calendar,
  LogOut,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    isDarkMode,
    toggleDarkMode,
    isAndroidView,
    setIsAndroidView,
    currentTab,
    setCurrentTab,
    searchQuery,
    setSearchQuery,
    setIsAuthModalOpen,
    setIsAiDrawerOpen,
    logoutUser,
  } = useApp();

  const navLinks = [
    { id: 'dashboard', label: 'Curriculum Hub (Ksh 15)', icon: BookOpen },
    { id: 'schemes', label: 'Custom Schemes', icon: FileText },
    { id: 'lesson-plans', label: 'Lesson Plans', icon: BookOpen },
    { id: 'revision', label: 'Revision & Exams', icon: FileCheck },
    { id: 'books', label: 'KICD Books', icon: BookOpen },
    { id: 'ideas', label: 'Ideas Bank', icon: Lightbulb },
    { id: 'calendar', label: 'Term Calendar', icon: Calendar },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & School Badge */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-600/30 font-black text-lg">
              ITC
            </div>
            <div>
              <span className="font-extrabold text-base md:text-lg tracking-tight text-slate-900 dark:text-white flex items-center">
                IMANI TEACHERS CENTER
              </span>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider truncate max-w-[190px]">
                {user.schoolName || 'Kenya National Curriculum Hub'}
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes, KICD books..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 md:space-x-3 shrink-0">
            {/* AI Assistant Button */}
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition shadow-sm cursor-pointer"
              title="Open AI Teacher Copilot"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>AI Copilot</span>
            </button>

            {/* Android Mode Toggle */}
            <button
              onClick={() => setIsAndroidView(!isAndroidView)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 border transition cursor-pointer ${
                isAndroidView
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
              }`}
              title={isAndroidView ? 'Switch to Full Dashboard' : 'Preview as Android App'}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden lg:inline">{isAndroidView ? 'Exit Android View' : 'Android App View'}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile / Login Button */}
            {user.isLoggedIn ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center space-x-2 p-1.5 pr-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition cursor-pointer"
                  title="Edit Teacher Profile"
                >
                  <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0) || 'M'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center leading-tight">
                      Mwalimu {user.name}
                      {user.role && user.role !== 'TEACHER' && (
                        <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold uppercase">
                          {user.role === 'HOD' ? 'HoD' : user.role === 'DEPUTY_PRINCIPAL' ? 'Deputy' : 'Principal'}
                        </span>
                      )}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {user.tscNumber}
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer flex items-center space-x-1"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Desktop Tab Navigation Row */}
        <nav className="hidden md:flex items-center space-x-1 py-1.5 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto text-xs">
          {navLinks.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-xl font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
