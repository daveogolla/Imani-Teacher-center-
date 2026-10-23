import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GRADES_LIST, KENYA_TERM_CONFIG, KENYAN_COUNTIES_SCHOOLS, getOfficialTermStrands } from '../data/curriculumData';
import { KICD_APPROVED_BOOKS } from '../data/kicdBooks';
import { generateSchemeWithAI } from '../services/aiService';
import { exportSchemeToDocx, triggerDownload, printFormattedDocument } from '../services/docExportService';
import { SchemeOfWork } from '../types';
import {
  FileText,
  Sparkles,
  Download,
  BookOpen,
  Calendar,
  School,
  User,
  Award,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCheck,
  Smartphone,
  Layers,
  Clock,
  Printer,
  ChevronDown,
  ShieldCheck,
  PenTool,
  Check,
  Zap,
  Plus,
} from 'lucide-react';

export const SchemeGenerator: React.FC = () => {
  const { user, schemes, setSchemes, initiateDownloadPayment, isDocumentUnlocked, signApproveScheme } = useApp();

  // Generator form fields
  const [schoolName, setSchoolName] = useState(user.schoolName || '');
  const [teacherName, setTeacherName] = useState(user.name || 'Dave Ogolla');
  const [tscNumber, setTscNumber] = useState(user.tscNumber || '');
  const [grade, setGrade] = useState('Grade 7');
  const [subject, setSubject] = useState('Mathematics');
  const [term, setTerm] = useState<'Term 1' | 'Term 2' | 'Term 3'>('Term 2');
  const [year, setYear] = useState(2026);
  const [lessonsPerWeek, setLessonsPerWeek] = useState(5);

  // Term dates initialized from official KENYA_TERM_CONFIG
  const initialConfig = KENYA_TERM_CONFIG['Term 2'];
  const [totalWeeks, setTotalWeeks] = useState(initialConfig.totalWeeks);
  const [halfTermWeek, setHalfTermWeek] = useState(initialConfig.halfTermWeek);
  const [termStartDate, setTermStartDate] = useState(initialConfig.termStartDate);
  const [termEndDate, setTermEndDate] = useState(initialConfig.termEndDate);
  const [halfTermStartDate, setHalfTermStartDate] = useState(initialConfig.halfTermStartDate);
  const [halfTermEndDate, setHalfTermEndDate] = useState(initialConfig.halfTermEndDate);

  // Topics and KICD books
  const availableTermStrands = getOfficialTermStrands(grade, subject, term);
  const [selectedStrands, setSelectedStrands] = useState<string[]>(() => {
    return availableTermStrands.map((s) => s.strand);
  });
  const [customStrandInput, setCustomStrandInput] = useState('');
  const [topicsDescription, setTopicsDescription] = useState(() => {
    return availableTermStrands.map((s) => `${s.strand} (${s.subStrands.slice(0, 3).join(', ')})`).join('; ');
  });

  const [selectedBooks, setSelectedBooks] = useState<string[]>([
    'KLB Visionary Junior Secondary Mathematics Grade 7',
    'Moran Junior Secondary Mathematics',
  ]);

  // Synchronize available strands when grade, subject, or term changes
  useEffect(() => {
    const strands = getOfficialTermStrands(grade, subject, term);
    setSelectedStrands(strands.map((s) => s.strand));
    const desc = strands.map((s) => `${s.strand} (${s.subStrands.slice(0, 3).join(', ')})`).join('; ');
    setTopicsDescription(desc);
  }, [grade, subject, term]);

  const handleToggleStrand = (strandName: string) => {
    setSelectedStrands((prev) => {
      const next = prev.includes(strandName)
        ? prev.filter((s) => s !== strandName)
        : [...prev, strandName];
      const active = availableTermStrands.filter((s) => next.includes(s.strand));
      const desc = active.map((s) => `${s.strand} (${s.subStrands.slice(0, 3).join(', ')})`).join('; ');
      setTopicsDescription(desc || 'General Curriculum Strands');
      return next;
    });
  };

  const handleSelectAllStrands = () => {
    const all = availableTermStrands.map((s) => s.strand);
    setSelectedStrands(all);
    const desc = availableTermStrands.map((s) => `${s.strand} (${s.subStrands.slice(0, 3).join(', ')})`).join('; ');
    setTopicsDescription(desc);
  };

  const handleClearAllStrands = () => {
    setSelectedStrands([]);
    setTopicsDescription('');
  };

  const handleAddCustomStrand = () => {
    if (!customStrandInput.trim()) return;
    const strand = customStrandInput.trim();
    if (!selectedStrands.includes(strand)) {
      setSelectedStrands((prev) => [...prev, strand]);
      setTopicsDescription((prev) => (prev ? `${prev}; ${strand}` : strand));
    }
    setCustomStrandInput('');
  };

  // Status & Active preview
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePreviewScheme, setActivePreviewScheme] = useState<SchemeOfWork | null>(schemes[0] || null);
  const [isDocxDownloading, setIsDocxDownloading] = useState(false);

  // Administrative Signing Modal/Form state
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [signRole, setSignRole] = useState<'hod' | 'deputyPrincipal' | 'principal'>('hod');
  const [signOfficerName, setSignOfficerName] = useState(user.name || '');
  const [signRemarks, setSignRemarks] = useState('Verified aligned to KICD curriculum designs and school calendar.');

  // Filter available books based on chosen grade & subject
  const currentGradeInfo = GRADES_LIST.find((g) => g.id === grade) || GRADES_LIST[0];
  const availableBooks = KICD_APPROVED_BOOKS.filter(
    (b) => b.gradeLevels.includes(grade) || b.subject.toLowerCase().includes(subject.toLowerCase().slice(0, 4))
  );

  // CRITICAL REQUIREMENT: "Let change in the term automatically change term dates and term of the content being downloaded."
  const handleTermChange = (newTerm: 'Term 1' | 'Term 2' | 'Term 3') => {
    setTerm(newTerm);
    const config = KENYA_TERM_CONFIG[newTerm];
    if (config) {
      setTermStartDate(config.termStartDate);
      setTermEndDate(config.termEndDate);
      setHalfTermStartDate(config.hasHalfTerm ? config.halfTermStartDate : '');
      setHalfTermEndDate(config.hasHalfTerm ? config.halfTermEndDate : '');
      setHalfTermWeek(config.hasHalfTerm ? config.halfTermWeek : 0);
      setTotalWeeks(config.totalWeeks);

      // If activePreviewScheme exists, synchronize its term & dates so download reflects immediately
      if (activePreviewScheme) {
        const updatedScheme: SchemeOfWork = {
          ...activePreviewScheme,
          term: newTerm,
          termStartDate: config.termStartDate,
          termEndDate: config.termEndDate,
          halfTermStartDate: config.hasHalfTerm ? config.halfTermStartDate : '',
          halfTermEndDate: config.hasHalfTerm ? config.halfTermEndDate : '',
          title: `SCHEMES OF WORK - ${activePreviewScheme.subject.toUpperCase()} ${activePreviewScheme.grade.toUpperCase()} (${newTerm.toUpperCase()} ${year})`,
        };
        setActivePreviewScheme(updatedScheme);
        setSchemes((prev) =>
          prev.map((s) => (s.id === updatedScheme.id ? updatedScheme : s))
        );
      }
    }
  };

  const handleBookToggle = (bookTitle: string) => {
    setSelectedBooks((prev) =>
      prev.includes(bookTitle) ? prev.filter((b) => b !== bookTitle) : [...prev, bookTitle]
    );
  };

  const handleApplyPreset = (pGrade: string, pSubject: string, pTerm: 'Term 1' | 'Term 2' | 'Term 3', pTopics: string) => {
    setGrade(pGrade);
    setSubject(pSubject);
    handleTermChange(pTerm);
    setTopicsDescription(pTopics);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const newScheme = await generateSchemeWithAI({
        schoolName,
        teacherName,
        tscNumber,
        grade,
        subject,
        term,
        year,
        lessonsPerWeek,
        termStartDate,
        termEndDate,
        halfTermStartDate,
        halfTermEndDate,
        approvedBooks: selectedBooks.length > 0 ? selectedBooks : ['KLB Visionary', 'Oxford Course Book'],
        topicsDescription,
        includeBreaks: true,
        halfTermWeek,
        totalWeeks,
      });

      setSchemes((prev) => [newScheme, ...prev]);
      setActivePreviewScheme(newScheme);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Sign & approve handler
  const handleExecuteSignApproval = () => {
    if (!activePreviewScheme || !signOfficerName) return;

    signApproveScheme(
      activePreviewScheme.id,
      signRole,
      signOfficerName,
      signRemarks
    );

    setActivePreviewScheme((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        approvals: {
          ...prev.approvals,
          [signRole]: {
            name: signOfficerName,
            signed: true,
            date: new Date().toLocaleDateString('en-KE'),
            remarks: signRemarks,
          },
        },
      };
    });

    setIsSigningOpen(false);
  };

  const handleDownloadWord = (scheme: SchemeOfWork) => {
    initiateDownloadPayment(
      'SCHEME',
      scheme.id,
      `${scheme.subject} - ${scheme.grade} (${scheme.term}) Schemes`,
      'WORD',
      async () => {
        setIsDocxDownloading(true);
        try {
          const blob = await exportSchemeToDocx(scheme);
          triggerDownload(
            blob,
            `${scheme.schoolName}_${scheme.subject}_${scheme.grade}_${scheme.term}_Schemes_of_Work.docx`
          );
        } catch (e) {
          console.error('Word export error:', e);
        } finally {
          setIsDocxDownloading(false);
        }
      }
    );
  };

  const handleDownloadPdf = (scheme: SchemeOfWork) => {
    initiateDownloadPayment(
      'SCHEME',
      scheme.id,
      `${scheme.subject} - ${scheme.grade} (${scheme.term}) Schemes`,
      'PDF',
      () => {
        const tableRowsHtml = scheme.lessons
          .map((l) => {
            if (l.isBreak) {
              return `
                <tr class="break-row">
                  <td><strong>${l.week}</strong></td>
                  <td>${l.lessonNumber}</td>
                  <td colspan="8" style="padding: 12px; background: #fef3c7; color: #b45309; text-align: center;">
                    <strong>*** ${l.breakTitle || 'OFFICIAL BREAK'} - WEEK ${l.week} ***</strong><br/>
                    <em style="color: #78350f; font-size: 8.5pt;">[DURATION LEFT BLANK: Learners & Staff on scheduled break. No classroom lessons scheduled.]</em>
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
                  ${scheme.approvals.hod.signed ? `<span style="color:#047857; font-weight:bold;">[DIGITALLY SIGNED & VERIFIED ${scheme.approvals.hod.date || ''}]</span><br/><em>${scheme.approvals.hod.remarks || ''}</em>` : 'Sign: _________________ Date: ____/____/2026'}
                </td>
                <td style="border: none;">
                  <strong>Deputy Principal:</strong> ${scheme.approvals.deputyPrincipal.name}<br/>
                  ${scheme.approvals.deputyPrincipal.signed ? `<span style="color:#047857; font-weight:bold;">[DIGITALLY APPROVED & COUNTERSIGNED ${scheme.approvals.deputyPrincipal.date || ''}]</span><br/><em>${scheme.approvals.deputyPrincipal.remarks || ''}</em>` : 'Sign: _________________ Date: ____/____/2026'}
                </td>
                <td style="border: none;">
                  <strong>Principal:</strong> ${scheme.approvals.principal.name}<br/>
                  ${scheme.approvals.principal.signed ? `<span style="color:#047857; font-weight:bold;">[OFFICIALLY SEALED & AUTHORIZED ${scheme.approvals.principal.date || ''}]</span><br/><em>${scheme.approvals.principal.remarks || ''}</em>` : 'Sign: _________________ Date: ____/____/2026'}
                </td>
              </tr>
            </table>
          </div>

          <div class="page-footer">
            IMANI TEACHERS CENTER | Mwalimu: ${scheme.teacherName}${scheme.tscNumber ? ` (TSC: ${scheme.tscNumber})` : ''} | Term: ${scheme.term} | Official KICD Format
          </div>
        `;

        printFormattedDocument(html, `${scheme.subject}_${scheme.grade}_${scheme.term}_Schemes`);
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header & Conversion Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <FileText className="w-6 h-6 mr-2 text-emerald-600 dark:text-emerald-400" />
            Schemes of Work Generator (PP1 to Grade 12)
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Term changes automatically synchronize official Kenya academic calendar dates and downloaded content.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-sm">
          <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Ksh 15 / download • Prompt sent directly to phone</span>
        </div>
      </div>

      {/* 1-Click Popular Preset Pills to make website easier to use */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center shrink-0">
          <Zap className="w-3.5 h-3.5 mr-1 text-amber-500" />
          1-Click Popular Presets:
        </span>
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => handleApplyPreset('Grade 7', 'Mathematics', 'Term 2', 'Algebra, Geometry, Mensuration & Statistics')}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 hover:text-emerald-700 whitespace-nowrap text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition"
          >
            Grade 7 Math (Term 2)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('Grade 8', 'Integrated Science', 'Term 2', 'Chemical Reactions, Human Body Systems, Sound & Heat')}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 hover:text-emerald-700 whitespace-nowrap text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition"
          >
            Grade 8 Science (Term 2)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('PP1', 'Mathematical Activities', 'Term 2', 'Number value 1-10, shapes, patterns, sorting')}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 hover:text-emerald-700 whitespace-nowrap text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition"
          >
            PP1 Math Activities
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('Grade 10', 'Chemistry', 'Term 2', 'Gas Laws, Structure & Bonding, Acids & Bases')}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 text-slate-700 dark:text-slate-300 hover:text-emerald-700 whitespace-nowrap text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition"
          >
            Grade 10 / Form 1 Chemistry
          </button>
        </div>
      </div>

      {/* Main Grid: Input Form & Interactive Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <form
            onSubmit={handleGenerate}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <School className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
              1. School & Teacher Details
            </h3>

            {/* School Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select or Enter Your School Name:
              </label>
              <input
                type="text"
                required
                list="scheme-schools"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Type or select school (e.g. Alliance, Pangani, Maranda...)"
                className="w-full px-3.5 py-2 text-xs md:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <datalist id="scheme-schools">
                {KENYAN_COUNTIES_SCHOOLS.map((sch) => (
                  <option key={sch} value={sch} />
                ))}
              </datalist>
            </div>

            {/* Teacher Name & TSC */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teacher Name:
                </label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Dave Ogolla"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  TSC Number (Optional):
                </label>
                <input
                  type="text"
                  value={tscNumber}
                  onChange={(e) => setTscNumber(e.target.value)}
                  placeholder="Optional (leave blank or enter TSC Number)"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2 pt-2">
              <Calendar className="w-4 h-4 mr-1.5 text-teal-600 dark:text-teal-400" />
              2. Term Selection (Auto Updates Term Dates & Content)
            </h3>

            {/* AUTOMATIC TERM SELECTOR */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase">
                  Select Academic Term:
                </label>
                <span className="text-[10px] font-bold text-emerald-700 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  {KENYA_TERM_CONFIG[term].totalWeeks} Weeks
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['Term 1', 'Term 2', 'Term 3'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTermChange(t)}
                    className={`py-2 px-2 text-xs font-extrabold rounded-xl border transition cursor-pointer text-center ${
                      term === t
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 italic">
                ✓ {KENYA_TERM_CONFIG[term].description}
              </p>
            </div>

            {/* Term Start & End Dates Display (Auto-synced) */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-0.5">
                  Term Start Date:
                </label>
                <input
                  type="date"
                  value={termStartDate}
                  onChange={(e) => setTermStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-0.5">
                  End Term Closing:
                </label>
                <input
                  type="date"
                  value={termEndDate}
                  onChange={(e) => setTermEndDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Half Term Break Dates (Auto-synced) - Term 3 has NO half-term break */}
            {term === 'Term 3' ? (
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-3 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <div className="flex items-center text-xs font-bold text-emerald-900 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span>Term 3: Continuous 9-Week Exam Term</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400">
                  Official KICD calendar has <strong>no half term break in Term 3</strong>. Teaching and revision proceed continuously up to National Examinations.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50/70 dark:bg-amber-950/30 p-3 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-amber-800 dark:text-amber-300">
                  <span>Half Term Break (Blank Duration)</span>
                  <span className="text-[10px] bg-amber-200 dark:bg-amber-900 px-2 py-0.5 rounded-full">Week {halfTermWeek}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={halfTermStartDate}
                    onChange={(e) => setHalfTermStartDate(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="date"
                    value={halfTermEndDate}
                    onChange={(e) => setHalfTermEndDate(e.target.value)}
                    className="w-full px-2 py-1 text-xs rounded-lg border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            )}

            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2 pt-2">
              <Layers className="w-4 h-4 mr-1.5 text-teal-600 dark:text-teal-400" />
              3. Grade, Subject & Lessons
            </h3>

            {/* Grade & Subject */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grade / Level:
                </label>
                <select
                  value={grade}
                  onChange={(e) => {
                    const newGrade = e.target.value;
                    setGrade(newGrade);
                    const gInfo = GRADES_LIST.find((g) => g.id === newGrade);
                    if (gInfo && gInfo.subjects.length > 0) {
                      setSubject(gInfo.subjects[0]);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {GRADES_LIST.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Subject:
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {currentGradeInfo.subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lessons per week */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Lessons/Week:
                </label>
                <select
                  value={lessonsPerWeek}
                  onChange={(e) => setLessonsPerWeek(Number(e.target.value))}
                  className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Lesson/Week' : 'Lessons/Week'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year:
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-2 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* KICD Book Selection Checkboxes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                KICD Approved Textbooks:
              </label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {availableBooks.map((b) => (
                  <label
                    key={b.id}
                    className={`flex items-start space-x-2 p-1.5 rounded-xl text-xs border cursor-pointer transition ${
                      selectedBooks.includes(b.title)
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(b.title)}
                      onChange={() => handleBookToggle(b.title)}
                      className="mt-0.5 rounded text-emerald-600"
                    />
                    <span className="font-semibold block truncate text-[11px]">{b.title}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Interactive Term Strands & Topics Selector */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <label className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase flex items-center">
                    <Layers className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    4. Strands & Topics for {term}:
                  </label>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    KICD approved syllabus strands for <strong>{grade} - {subject}</strong>
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 self-end sm:self-auto text-[10px]">
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                    {selectedStrands.length} Selected
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllStrands}
                    className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllStrands}
                    className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* List of Strands */}
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {availableTermStrands.map((ts) => {
                  const isChecked = selectedStrands.includes(ts.strand);
                  return (
                    <div
                      key={ts.id}
                      onClick={() => handleToggleStrand(ts.strand)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/50 text-slate-900 dark:text-white shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center space-x-2 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-emerald-600 w-3.5 h-3.5"
                          />
                          <span className="text-[12px]">{ts.strand}</span>
                        </label>
                        <span className="text-[10px] text-slate-400">
                          {ts.subStrands.length} sub-topics
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5 pl-5">
                        {ts.subStrands.map((sub, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[9.5px] bg-white/90 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                          >
                            • {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Custom Strand input */}
              <div className="flex items-center space-x-1.5 pt-1">
                <input
                  type="text"
                  value={customStrandInput}
                  onChange={(e) => setCustomStrandInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomStrand();
                    }
                  }}
                  placeholder="Add custom strand or topic for this term..."
                  className="flex-1 px-2.5 py-1 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddCustomStrand}
                  className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-700 flex items-center space-x-1 cursor-pointer shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{isGenerating ? `Generating ${term} Schemes...` : `Generate ${term} Schemes of Work`}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Interactive Document Preview & Digital Approvals (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activePreviewScheme ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300">
                      {activePreviewScheme.term} ({activePreviewScheme.year})
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {activePreviewScheme.schoolName || user.schoolName || 'Your School'}
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {activePreviewScheme.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mwalimu {activePreviewScheme.teacherName} {activePreviewScheme.tscNumber ? `(TSC: ${activePreviewScheme.tscNumber})` : '(TSC: Optional / Blank)'}
                  </p>
                </div>

                {/* Download Actions (Downloads strictly after verified payment confirmation) */}
                <div className="flex items-center space-x-2">
                  {isDocumentUnlocked(activePreviewScheme.id, activePreviewScheme.title) ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                      Ksh 15 M-Pesa
                    </span>
                  )}

                  <button
                    onClick={() => handleDownloadWord(activePreviewScheme)}
                    disabled={isDocxDownloading}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition cursor-pointer"
                    title={
                      isDocumentUnlocked(activePreviewScheme.id, activePreviewScheme.title)
                        ? 'Download Word .docx (Unlocked)'
                        : 'Download Word .docx (Charges Ksh.15 - downloads after payment confirmation)'
                    }
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Word (.docx)</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(activePreviewScheme)}
                    className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20 transition cursor-pointer"
                    title={
                      isDocumentUnlocked(activePreviewScheme.id, activePreviewScheme.title)
                        ? 'Print / Download PDF (Unlocked)'
                        : 'Print / Download PDF (Charges Ksh.15 - downloads after payment confirmation)'
                    }
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>PDF / Print</span>
                  </button>
                </div>
              </div>

              {/* ADMINISTRATIVE DIGITAL SIGN-IN & APPROVALS PANEL */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1 text-emerald-600" />
                    Administrative Sign-In & Approvals
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSigningOpen(true);
                      setSignOfficerName(user.name);
                    }}
                    className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1 transition shadow-sm cursor-pointer"
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Sign & Approve Document</span>
                  </button>
                </div>

                {/* Sign-off Stamps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  {/* HoD Block */}
                  <div className={`p-2.5 rounded-xl border ${activePreviewScheme.approvals.hod.signed ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Head of Department</span>
                      {activePreviewScheme.approvals.hod.signed && <Check className="w-3 h-3 text-emerald-600" />}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold block mt-0.5 truncate">{activePreviewScheme.approvals.hod.name}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {activePreviewScheme.approvals.hod.signed ? `✓ Approved ${activePreviewScheme.approvals.hod.date}` : 'Pending HOD Signature'}
                    </span>
                  </div>

                  {/* Deputy Principal Block */}
                  <div className={`p-2.5 rounded-xl border ${activePreviewScheme.approvals.deputyPrincipal.signed ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Deputy Principal</span>
                      {activePreviewScheme.approvals.deputyPrincipal.signed && <Check className="w-3 h-3 text-emerald-600" />}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold block mt-0.5 truncate">{activePreviewScheme.approvals.deputyPrincipal.name}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {activePreviewScheme.approvals.deputyPrincipal.signed ? `✓ Countersigned ${activePreviewScheme.approvals.deputyPrincipal.date}` : 'Pending Deputy Sign'}
                    </span>
                  </div>

                  {/* Principal Block */}
                  <div className={`p-2.5 rounded-xl border ${activePreviewScheme.approvals.principal.signed ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>Principal / Head</span>
                      {activePreviewScheme.approvals.principal.signed && <Check className="w-3 h-3 text-emerald-600" />}
                    </div>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold block mt-0.5 truncate">{activePreviewScheme.approvals.principal.name}</span>
                    <span className="text-[10px] text-slate-500 block">
                      {activePreviewScheme.approvals.principal.signed ? `✓ Authorized ${activePreviewScheme.approvals.principal.date}` : 'Pending Principal Seal'}
                    </span>
                  </div>
                </div>

                {/* Inline signing dialog if open */}
                {isSigningOpen && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-xl space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-white">Digital Curriculum Sign-off & Verification</span>
                      <button onClick={() => setIsSigningOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">Designation / Role:</label>
                        <select
                          value={signRole}
                          onChange={(e) => setSignRole(e.target.value as any)}
                          className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        >
                          <option value="hod">Head of Department (HoD)</option>
                          <option value="deputyPrincipal">Deputy Principal (Academics)</option>
                          <option value="principal">Principal / Head Teacher</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500">Signer Name:</label>
                        <input
                          type="text"
                          value={signOfficerName}
                          onChange={(e) => setSignOfficerName(e.target.value)}
                          placeholder="e.g. Mwalimu J. Mwangi"
                          className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500">Approval Remarks:</label>
                      <input
                        type="text"
                        value={signRemarks}
                        onChange={(e) => setSignRemarks(e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleExecuteSignApproval}
                      className="w-full py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                    >
                      Apply Digital Stamp & Sign Document
                    </button>
                  </div>
                )}
              </div>

              {/* Interactive Schemes Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-700/80 rounded-2xl max-h-[480px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-emerald-700 text-white sticky top-0 z-10">
                    <tr>
                      <th className="p-2.5 border-r border-emerald-600">Wk</th>
                      <th className="p-2.5 border-r border-emerald-600">Lsn</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[120px]">Strand</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[130px]">Sub-Strand</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[200px]">Specific Learning Outcomes</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[140px]">Key Inquiry</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[180px]">Learning Experiences</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[140px]">Resources / KICD Books</th>
                      <th className="p-2.5 border-r border-emerald-600 min-w-[100px]">Assessment</th>
                      <th className="p-2.5 min-w-[90px]">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {activePreviewScheme.lessons.map((lsn, idx) => {
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
                                [DURATION LEFT BLANK AS PER KICD CURRICULUM DIRECTIVE: Learners & teachers on scheduled recess]
                              </p>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-800 dark:text-slate-200"
                        >
                          <td className="p-2 font-bold text-center border-r border-slate-200 dark:border-slate-800">
                            {lsn.week}
                          </td>
                          <td className="p-2 text-center border-r border-slate-200 dark:border-slate-800">
                            {lsn.lessonNumber}
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 font-semibold text-slate-900 dark:text-white">
                            {lsn.strand}
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800">
                            {lsn.subStrand}
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 whitespace-pre-line text-[11px]">
                            {lsn.specificLearningOutcomes}
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                            {lsn.keyInquiryQuestions}
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px]">
                            {lsn.learningExperiences}
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            {lsn.learningResources}
                          </td>
                          <td className="p-2 border-r border-slate-200 dark:border-slate-800 text-[11px]">
                            {lsn.assessmentMethods}
                          </td>
                          <td className="p-2 text-[11px] text-slate-500">
                            {lsn.reflection || 'Delivered'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No Schemes Preview Available</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Fill the form on the left and click "Generate Schemes of Work" to produce a customized KICD document.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
