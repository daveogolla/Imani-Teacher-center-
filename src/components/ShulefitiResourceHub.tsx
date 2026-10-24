import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SHULEFITI_RESOURCES, ShulefitiResource } from '../data/shulefitiResources';
import { exportSchemeToDocx, triggerDownload, printFormattedDocument } from '../services/docExportService';
import { generateSchemeWithAI } from '../services/aiService';
import { SchemeOfWork } from '../types';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  FileCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Calendar,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Sliders,
  PenTool,
  Printer,
  X,
  Lock,
} from 'lucide-react';

export const ShulefitiResourceHub: React.FC = () => {
  const { user, initiateDownloadPayment, setCurrentTab, setSchemes } = useApp();

  // Search & Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTerm, setSelectedTerm] = useState<string>('ALL');
  const [previewResource, setPreviewResource] = useState<ShulefitiResource | null>(null);
  const [previewScheme, setPreviewScheme] = useState<SchemeOfWork | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Levels for filter tabs
  const levels = [
    { id: 'ALL', label: 'All Levels', icon: '🌟' },
    { id: 'Junior Secondary', label: 'Junior Secondary (JSS 7-9)', icon: '🔬' },
    { id: 'Senior Secondary', label: 'Senior School (Form 1-4 / KCSE)', icon: '🏛️' },
    { id: 'Upper Primary', label: 'Upper Primary (Grades 4-6)', icon: '📘' },
    { id: 'Lower Primary', label: 'Lower Primary (Grades 1-3)', icon: '🎒' },
    { id: 'Pre-Primary', label: 'Pre-Primary (PP1 & PP2)', icon: '🧸' },
  ];

  const categories = [
    { id: 'ALL', label: 'All Resources' },
    { id: 'SCHEME', label: 'Schemes of Work' },
    { id: 'LESSON_PLAN', label: 'Lesson Plans' },
    { id: 'REVISION_EXAM', label: 'Revision & Exams' },
    { id: 'SET_BOOK', label: 'KICD Set Books' },
  ];

  const terms = ['ALL', 'Term 1', 'Term 2', 'Term 3'];

  // Filtered resources
  const filteredResources = useMemo(() => {
    return SHULEFITI_RESOURCES.filter((res) => {
      if (selectedLevel !== 'ALL' && res.level !== selectedLevel) return false;
      if (selectedCategory !== 'ALL' && res.category !== selectedCategory) return false;
      if (selectedTerm !== 'ALL' && res.term !== selectedTerm) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          res.title.toLowerCase().includes(q) ||
          res.subject.toLowerCase().includes(q) ||
          res.grade.toLowerCase().includes(q) ||
          res.summary.toLowerCase().includes(q) ||
          res.approvedBooks.some((b) => b.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [selectedLevel, selectedCategory, selectedTerm, searchTerm]);

  // Load interactive preview of a resource
  const handleOpenPreview = async (res: ShulefitiResource) => {
    setPreviewResource(res);
    setIsLoadingPreview(true);

    try {
      const scheme = await generateSchemeWithAI({
        schoolName: user.schoolName || 'KENYA CURRICULUM ACADEMY',
        teacherName: user.name || 'Dave Ogolla',
        tscNumber: user.tscNumber || '',
        grade: res.grade,
        subject: res.subject,
        term: res.term,
        year: res.year,
        lessonsPerWeek: res.lessonsPerWeek,
        termStartDate: res.term === 'Term 3' ? '2026-08-24' : '2026-01-06',
        termEndDate: res.term === 'Term 3' ? '2026-10-23' : '2026-04-03',
        halfTermStartDate: res.term === 'Term 3' ? '' : '2026-02-18',
        halfTermEndDate: res.term === 'Term 3' ? '' : '2026-02-22',
        approvedBooks: res.approvedBooks,
        topicsDescription: res.summary,
        includeBreaks: true,
        halfTermWeek: res.term === 'Term 3' ? 0 : 7,
        totalWeeks: res.term === 'Term 3' ? 9 : 13,
      });

      setPreviewScheme(scheme);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  // Download Word (.docx) - STRICTLY requires Ksh 15 via M-Pesa
  const handleDownloadWord = async (res: ShulefitiResource) => {
    setIsExporting(res.id + '-word');

    initiateDownloadPayment(
      'SCHEME',
      res.id,
      res.title,
      'WORD',
      async () => {
        try {
          const scheme = await generateSchemeWithAI({
            schoolName: user.schoolName || '',
            teacherName: user.name || 'Mwalimu',
            tscNumber: user.tscNumber || '',
            grade: res.grade,
            subject: res.subject,
            term: res.term,
            year: res.year,
            lessonsPerWeek: res.lessonsPerWeek,
            termStartDate: res.term === 'Term 3' ? '2026-08-24' : '2026-01-06',
            termEndDate: res.term === 'Term 3' ? '2026-10-23' : '2026-04-03',
            halfTermStartDate: res.term === 'Term 3' ? '' : '2026-02-18',
            halfTermEndDate: res.term === 'Term 3' ? '' : '2026-02-22',
            approvedBooks: res.approvedBooks,
            topicsDescription: res.summary,
            includeBreaks: true,
            halfTermWeek: res.term === 'Term 3' ? 0 : 7,
            totalWeeks: res.term === 'Term 3' ? 9 : 13,
          });

          const blob = await exportSchemeToDocx(scheme);
          triggerDownload(
            blob,
            `${res.subject.replace(/[^a-zA-Z0-9]/g, '_')}_${res.grade}_${res.term}_Schemes.docx`
          );
        } catch (err) {
          console.error(err);
        } finally {
          setIsExporting(null);
        }
      }
    );
  };

  // Download PDF / Print - STRICTLY requires Ksh 15 via M-Pesa
  const handleDownloadPdf = async (res: ShulefitiResource) => {
    setIsExporting(res.id + '-pdf');

    initiateDownloadPayment(
      'SCHEME',
      res.id,
      res.title,
      'PDF',
      async () => {
        try {
          const scheme = await generateSchemeWithAI({
            schoolName: user.schoolName || 'KENYA CURRICULUM SCHOOL',
            teacherName: user.name || 'Mwalimu',
            tscNumber: user.tscNumber || '',
            grade: res.grade,
            subject: res.subject,
            term: res.term,
            year: res.year,
            lessonsPerWeek: res.lessonsPerWeek,
            termStartDate: res.term === 'Term 3' ? '2026-08-24' : '2026-01-06',
            termEndDate: res.term === 'Term 3' ? '2026-10-23' : '2026-04-03',
            halfTermStartDate: res.term === 'Term 3' ? '' : '2026-02-18',
            halfTermEndDate: res.term === 'Term 3' ? '' : '2026-02-22',
            approvedBooks: res.approvedBooks,
            topicsDescription: res.summary,
            includeBreaks: true,
            halfTermWeek: res.term === 'Term 3' ? 0 : 7,
            totalWeeks: res.term === 'Term 3' ? 9 : 13,
          });

          const tableRowsHtml = scheme.lessons
            .map((l) => {
              if (l.isBreak) {
                return `
                  <tr class="break-row">
                    <td><strong>${l.week}</strong></td>
                    <td>${l.lessonNumber}</td>
                    <td colspan="8" style="padding: 12px; background: #fef3c7; color: #b45309; text-align: center;">
                      <strong>*** ${l.breakTitle || 'OFFICIAL BREAK'} - WEEK ${l.week} ***</strong><br/>
                      <em style="color: #78350f; font-size: 8.5pt;">[DURATION LEFT BLANK: Learners & Staff on scheduled recess. No classroom lessons scheduled.]</em>
                    </td>
                  </tr>
                `;
              }
              return `
                <tr>
                  <td><strong>${l.week}</strong></td>
                  <td>${l.lessonNumber}</td>
                  <td>${l.strand}</td>
                  <td>${l.subStrand}</td>
                  <td>${l.specificLearningOutcomes.replace(/\n/g, '<br/>')}</td>
                  <td>${l.keyInquiryQuestions}</td>
                  <td>${l.learningExperiences}</td>
                  <td>${l.learningResources}</td>
                  <td>${l.assessmentMethods}</td>
                  <td>${l.reflection || ''}</td>
                </tr>
              `;
            })
            .join('');

          const html = `
            <div class="header-box">
              <h1 style="color: #047857; margin: 0; font-size: 22pt;">${scheme.schoolName.toUpperCase()}</h1>
              <h3 style="margin: 4px 0; color: #374151;">KENYA INSTITUTE OF CURRICULUM DEVELOPMENT (KICD) APPROVED SCHEMES OF WORK</h3>
              <h2 style="color: #111827; margin: 6px 0; font-size: 16pt;">${scheme.subject.toUpperCase()} - ${scheme.grade.toUpperCase()} (${scheme.term.toUpperCase()} ${scheme.year})</h2>
            </div>

            <table class="meta-table">
              <tr>
                <td><strong>Teacher Name:</strong> ${scheme.teacherName}</td>
                <td><strong>TSC Number:</strong> ${scheme.tscNumber ? scheme.tscNumber : '_____________________'}</td>
                <td><strong>Lessons Per Week:</strong> ${scheme.lessonsPerWeek}</td>
              </tr>
              <tr>
                <td><strong>Term Start:</strong> ${scheme.termStartDate}</td>
                <td><strong>Half Term (Blank in Schedule):</strong> ${scheme.term === 'Term 3' ? 'No Half Term in Term 3 (Continuous Exam Term)' : `${scheme.halfTermStartDate} to ${scheme.halfTermEndDate}`}</td>
                <td><strong>Term Closing:</strong> ${scheme.termEndDate}</td>
              </tr>
              <tr>
                <td colspan="3"><strong>KICD Approved Books:</strong> ${scheme.approvedBooks.join(', ')}</td>
              </tr>
            </table>

            <table>
              <thead>
                <tr>
                  <th>Wk</th>
                  <th>Lsn</th>
                  <th>Strand</th>
                  <th>Sub-Strand</th>
                  <th>Specific Learning Outcomes</th>
                  <th>Key Inquiry Questions</th>
                  <th>Learning Experiences & Competencies</th>
                  <th>Resources & KICD Books</th>
                  <th>Assessment</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHtml}
              </tbody>
            </table>

            <div class="approvals">
              <h4 style="margin: 5px 0;">Official Administrative Sign-Off & Approvals:</h4>
              <table style="border: none; margin-top: 5px;">
                <tr style="border: none;">
                  <td style="border: none;">
                    <strong>HoD Approval:</strong> ${scheme.approvals.hod.name}<br/>
                    Sign: _________________ Date: ____/____/2026
                  </td>
                  <td style="border: none;">
                    <strong>Deputy Principal:</strong> ${scheme.approvals.deputyPrincipal.name}<br/>
                    Sign: _________________ Date: ____/____/2026
                  </td>
                  <td style="border: none;">
                    <strong>Principal:</strong> ${scheme.approvals.principal.name}<br/>
                    Sign: _________________ Date: ____/____/2026
                  </td>
                </tr>
              </table>
            </div>

            <div class="page-footer">
              IMANI TEACHERS CENTER | Mwalimu: ${scheme.teacherName}${scheme.tscNumber ? ` (TSC: ${scheme.tscNumber})` : ''} | Term: ${scheme.term} | Official KICD Format
            </div>
          `;

          printFormattedDocument(html, `${res.subject}_${res.grade}_${res.term}_Schemes`);
        } catch (err) {
          console.error(err);
        } finally {
          setIsExporting(null);
        }
      }
    );
  };

  // Open custom generator prefilled
  const handleCustomizeScheme = (res: ShulefitiResource) => {
    setCurrentTab('schemes');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Shulefiti Style Hero Portal Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-emerald-700/50">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kenya's #1 KICD Approved Curriculum Downloads Portal</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-white">
            Schemes of Work, Lesson Plans & Revision Exams
          </h1>

          <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
            Download editable Microsoft Word (.docx) and PDF schemes of work, competency-based lesson plans, and KCSE revision papers referencing official KICD books (KLB Top Scholar, Oxford Spotlight, Longhorn Distinguished, Moran Explorer).
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-3 py-1 rounded-xl font-bold flex items-center">
              <Smartphone className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Compulsory Ksh 15 M-Pesa to 0707423879
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl text-slate-200 flex items-center font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Blank Half-Term & Closing Breaks Included
            </span>
            <span className="bg-white/10 px-3 py-1 rounded-xl text-slate-200 flex items-center font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              HoD & Principal Signature Placeholders
            </span>
          </div>
        </div>

        {/* Floating Quick Action */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs text-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">Ready for 2026 School Calendar:</span>
            <span>Terms 1, 2, and 3</span>
          </div>

          <button
            onClick={() => setCurrentTab('schemes')}
            className="py-2 px-4 rounded-xl bg-white text-slate-900 font-extrabold text-xs hover:bg-slate-100 flex items-center space-x-1.5 shadow-md cursor-pointer transition active:scale-95"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open Custom Schemes Generator</span>
          </button>
        </div>

        {/* Decorative blur lights */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Shulefiti Level Selector Bar */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {levels.map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => setSelectedLevel(lvl.id)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 cursor-pointer shrink-0 ${
              selectedLevel === lvl.id
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-400'
            }`}
          >
            <span>{lvl.icon}</span>
            <span>{lvl.label}</span>
          </button>
        ))}
      </div>

      {/* Search & Category Filter Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Bar (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by subject, grade, book (e.g. Integrated Science, KLB)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Category Filter Pills (4 cols) */}
          <div className="md:col-span-4 flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Term Filter (3 cols) */}
          <div className="md:col-span-3 flex items-center justify-end space-x-1">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Term:</span>
            {terms.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTerm(t)}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                  selectedTerm === t
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-2 px-1">
          <span>Showing <strong>{filteredResources.length}</strong> KICD approved documents</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            Compulsory Ksh 15 per document via M-Pesa to 0707423879
          </span>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => (
          <div
            key={res.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {res.grade} • {res.term}
                </span>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Ksh 15.00
                </span>
              </div>

              {/* Title & Subject */}
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-emerald-600 transition">
                  {res.title}
                </h3>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  {res.subject} • {res.lessonsPerWeek} Lessons/Week
                </p>
              </div>

              {/* Summary Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {res.summary}
              </p>

              {/* KICD Book Citations */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Approved KICD Books:
                </span>
                <div className="space-y-0.5">
                  {res.approvedBooks.map((b, idx) => (
                    <div key={idx} className="flex items-center text-[10.5px] text-slate-700 dark:text-slate-300 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 shrink-0" />
                      <span className="truncate">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Preview & Download (compulsory Ksh 15) */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadWord(res)}
                  disabled={isExporting === res.id + '-word'}
                  className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  title="Download editable Word .docx (Charges Ksh.15 M-Pesa)"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Word (.docx)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownloadPdf(res)}
                  disabled={isExporting === res.id + '-pdf'}
                  className="py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-extrabold text-xs shadow-md shadow-purple-600/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
                  title="Print / Download PDF (Charges Ksh.15 M-Pesa)"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PDF / Print</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenPreview(res)}
                  className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center space-x-1 transition cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-emerald-600" />
                  <span>Quick Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCustomizeScheme(res)}
                  className="py-1.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center space-x-1 transition cursor-pointer"
                  title="Customize teacher name, TSC number, and school header"
                >
                  <PenTool className="w-3 h-3" />
                  <span>Customize</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quick Preview Modal */}
      {previewResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 md:p-6 space-y-4 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 mr-2">
                  {previewResource.grade} • {previewResource.term}
                </span>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white inline-block">
                  {previewResource.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setPreviewResource(null);
                  setPreviewScheme(null);
                }}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Details Bar */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  Approved KICD Books: <span className="font-normal">{previewResource.approvedBooks.join(', ')}</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Includes blank half-term & closing breaks, core competencies, and official signature blocks.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadWord(previewResource)}
                  className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Word (.docx) - Ksh 15</span>
                </button>
                <button
                  onClick={() => handleDownloadPdf(previewResource)}
                  className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>PDF / Print - Ksh 15</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="flex-1 overflow-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
              {isLoadingPreview ? (
                <div className="p-12 text-center space-y-2">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-600">Generating preview table from KICD syllabus...</p>
                </div>
              ) : previewScheme ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-emerald-700 text-white sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 border-r border-emerald-600">Wk</th>
                      <th className="p-2.5 border-r border-emerald-600">Lsn</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[120px]">Strand</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[130px]">Sub-Strand</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[200px]">Specific Learning Outcomes</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[140px]">Key Inquiry Questions</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[180px]">Learning Experiences</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[140px]">Resources & KICD Books</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[100px]">Assessment</th>
                      <th className="p-2.5 min-w-[90px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {previewScheme.lessons.map((lsn, idx) => {
                      if (lsn.isBreak) {
                        return (
                          <tr key={idx} className="bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200">
                            <td className="p-2 font-black text-center">{lsn.week}</td>
                            <td className="p-2 text-center">{lsn.lessonNumber}</td>
                            <td colSpan={8} className="p-3 text-center">
                              <span className="font-extrabold text-amber-800 dark:text-amber-300 tracking-wide uppercase">
                                *** {lsn.breakTitle || 'OFFICIAL BREAK'} - WEEK {lsn.week} ***
                              </span>
                              <p className="text-[11px] text-amber-700 dark:text-amber-400 italic mt-0.5">
                                [DURATION LEFT BLANK: Learners & staff on scheduled recess. No classroom lessons scheduled.]
                              </p>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="p-2 font-bold text-center border-r border-slate-200 dark:border-slate-800">{lsn.week}</td>
                          <td className="p-2 text-center border-r border-slate-200 dark:border-slate-800">{lsn.lessonNumber}</td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-semibold">{lsn.strand}</td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800">{lsn.subStrand}</td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 whitespace-pre-line text-[11px]">{lsn.specificLearningOutcomes}</td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">{lsn.keyInquiryQuestions}</td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px]">{lsn.learningExperiences}</td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px] text-emerald-700 font-medium">{lsn.learningResources}</td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px]">{lsn.assessmentMethods}</td>
                          <td className="p-2 text-[11px] text-slate-500">{lsn.reflection || 'Delivered'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : null}
            </div>

            {/* Official Signature Boxes */}
            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Official Administrative Approvals (Placeholders included on export):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold block">Head of Department (HoD)</span>
                  <span className="text-slate-400">Sign: ________________ Date: ____/____/2026</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold block">Deputy Principal (Academics)</span>
                  <span className="text-slate-400">Sign: ________________ Date: ____/____/2026</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold block">Principal / Head Teacher</span>
                  <span className="text-slate-400">Seal & Sign: ________________ Date: ____/____/2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
