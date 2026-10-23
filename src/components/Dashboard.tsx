import React from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText,
  Lightbulb,
  Calendar,
  Download,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  School,
  FileCheck,
  Smartphone,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    user,
    setCurrentTab,
    schemes,
    lessonPlans,
    revisionMaterials,
    contentIdeas,
    scheduleEvents,
    downloadReceipts,
    generationTasks,
    setIsAiDrawerOpen,
  } = useApp();

  // Find next upcoming event (especially half term or end term break)
  const upcomingEvents = [...scheduleEvents]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .filter((e) => !e.completed);

  const nextBreak = scheduleEvents.find(
    (e) => e.type === 'HALF_TERM' || e.type === 'END_TERM'
  );

  const totalDocumentsCreated = schemes.length + lessonPlans.length + revisionMaterials.length;
  const completedIdeasCount = contentIdeas.filter((i) => i.isCompleted).length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 p-6 md:p-8 text-white shadow-xl border border-emerald-700/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Kenya KICD Curriculum Portal</span>
            </div>
            {/* Personalized greeting avoiding generic 'Otieno' */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Karibu, Mwalimu <span className="text-emerald-300">{user.name || 'Dave Ogolla'}</span>!
            </h1>
            <p className="text-slate-200 text-sm md:text-base leading-relaxed">
              Kenya KICD Approved CBC & KCSE Curriculum Management Portal. Generate authentic schemes of work with blank breaks, lesson plans, and revision resources customized for your school.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-2 text-xs text-emerald-200/90">
              <span className="flex items-center bg-white/10 px-3 py-1 rounded-lg backdrop-blur">
                <School className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                School: <strong className="ml-1 text-white">{user.schoolName && !user.schoolName.toLowerCase().includes('lenana') ? user.schoolName : 'Choose Your School'}</strong>
              </span>
              <span className="flex items-center bg-white/10 px-3 py-1 rounded-lg backdrop-blur">
                <FileCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                TSC No: {user.tscNumber ? user.tscNumber : 'Optional (Blank)'}
              </span>
              <span className="flex items-center bg-white/10 px-3 py-1 rounded-lg backdrop-blur">
                <Smartphone className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                M-Pesa STK Prompt: 0707423879 (Ksh 15)
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={() => setCurrentTab('schemes')}
              className="py-3 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/30 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Schemes</span>
            </button>
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="py-2.5 px-5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white font-semibold text-xs backdrop-blur flex items-center justify-center space-x-2 transition border border-white/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>AI Teacher Copilot</span>
            </button>
          </div>
        </div>

        {/* Community Trust Bar */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-200/90">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">14,800+ Teachers, HoDs & Principals</span>
            <span>across all 47 Kenyan Counties</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="bg-white/10 px-2 py-0.5 rounded">Auto Term 1/2/3 Dates</span>
            <span className="bg-white/10 px-2 py-0.5 rounded">Direct Phone STK Push</span>
            <span className="bg-white/10 px-2 py-0.5 rounded">KICD Approved Books</span>
          </div>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-48 h-48 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Documents */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Created Resources</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{totalDocumentsCreated}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {schemes.length} schemes, {lessonPlans.length} plans
            </p>
          </div>
        </div>

        {/* Content Ideas */}
        <div
          onClick={() => setCurrentTab('ideas')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Content Ideas Bank</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{contentIdeas.length}</div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
              {completedIdeasCount} applied in class
            </p>
          </div>
        </div>

        {/* Next Scheduled Break Countdown */}
        <div
          onClick={() => setCurrentTab('calendar')}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Next Official Break</span>
            <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {nextBreak?.title || 'Term 1 Half Term'}
            </div>
            <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-0.5 flex items-center">
              <span>{nextBreak?.date || 'Mid Term (Blank in doc)'}</span>
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </p>
          </div>
        </div>

        {/* Downloaded Materials & Mpesa */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verified Downloads</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">{downloadReceipts.length}</div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mt-0.5">
              Ksh {downloadReceipts.length * 15} via 0707423879
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Content Generation Tasks & Visual Progress Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks Status & Quick Links */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generation Tasks Status Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                  Content Generation Tasks Status
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live status of your KICD-aligned syllabus, lesson plans, and revision generation
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                All Systems Operational
              </span>
            </div>

            <div className="space-y-3">
              {generationTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:border-emerald-300 dark:hover:border-emerald-800 transition"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{task.grade}</span>
                        <span>•</span>
                        <span>{task.subject}</span>
                        <span>•</span>
                        <span>{task.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="hidden sm:block text-right">
                      <span className="inline-flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready
                      </span>
                      <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (task.type === 'SCHEME') setCurrentTab('schemes');
                        else if (task.type === 'LESSON_PLAN') setCurrentTab('lesson-plans');
                        else setCurrentTab('revision');
                      }}
                      className="p-2 rounded-xl bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-600 shadow-sm transition"
                      title="Open Resource"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hub Navigation Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              onClick={() => setCurrentTab('schemes')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-400 dark:hover:border-emerald-600 transition shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Schemes of Work</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">PP1 to Form 4 with blank breaks</p>
            </button>

            <button
              onClick={() => setCurrentTab('lesson-plans')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-teal-400 dark:hover:border-teal-600 transition shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">CBC Lesson Plans</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">3-step development & approvals</p>
            </button>

            <button
              onClick={() => setCurrentTab('revision')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <FileCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">KCSE & CBE Revision</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Topical questions & answer guides</p>
            </button>

            <button
              onClick={() => setCurrentTab('books')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-amber-400 dark:hover:border-amber-600 transition shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <BookOpen className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">KICD Approved Books</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">KLB, Oxford, Moran, Longhorn</p>
            </button>

            <button
              onClick={() => setCurrentTab('ideas')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-rose-400 dark:hover:border-rose-600 transition shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Content Ideas Bank</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{contentIdeas.length} saved ideas</p>
            </button>

            <button
              onClick={() => setCurrentTab('calendar')}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-sky-400 dark:hover:border-sky-600 transition shadow-sm group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition">
                <Calendar className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Term Calendar</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Syllabus schedule & break periods</p>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Progress Tracker of Downloaded Materials */}
        <div className="space-y-6">
          {/* Visual Progress Tracker Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
                <Download className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                Downloaded Materials Progress
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track downloads, format distribution & M-Pesa receipts (Ksh 15 to 0707423879)
              </p>
            </div>

            {/* Visual Meter */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600 dark:text-slate-300">Syllabus Resource Coverage</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">78% Complete</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" style={{ width: '78%' }} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-center text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <div className="bg-white dark:bg-slate-900 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Word (.docx): </span>
                  <span className="text-emerald-600 font-extrabold">{downloadReceipts.filter(r => r.downloadFormat === 'WORD').length}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-200">PDF Document: </span>
                  <span className="text-purple-600 font-extrabold">{downloadReceipts.filter(r => r.downloadFormat === 'PDF').length}</span>
                </div>
              </div>
            </div>

            {/* Recent M-Pesa Receipts List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Recent M-Pesa Downloads</span>
                <span className="text-[11px] font-normal text-emerald-600">0707423879</span>
              </div>

              {downloadReceipts.slice(0, 3).map((rcpt, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl p-2.5 text-xs flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {rcpt.documentTitle}
                    </p>
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400">{rcpt.receiptNo}</span>
                      <span>•</span>
                      <span>{rcpt.downloadFormat}</span>
                    </div>
                  </div>
                  <span className="font-black text-emerald-600 dark:text-emerald-400 shrink-0">
                    Ksh 15
                  </span>
                </div>
              ))}
            </div>

            {/* Important KICD Notice Box */}
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-3.5 text-xs text-amber-800 dark:text-amber-300 space-y-1">
              <div className="flex items-center font-bold">
                <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                <span>KICD Break Compliance Active</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-300/80">
                Official Kenya National Half Term Break & End Term dates are automatically blanked out on exported documents to comply with Ministry of Education standards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
