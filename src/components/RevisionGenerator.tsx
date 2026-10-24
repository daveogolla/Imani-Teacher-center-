import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { GRADES_LIST, TOPIC_CATALOG, KENYAN_COUNTIES_SCHOOLS } from '../data/curriculumData';
import { KICD_APPROVED_BOOKS } from '../data/kicdBooks';
import { OFFICIAL_ASSESSMENTS } from '../data/assessmentCatalog';
import { generateRevisionPack } from '../services/aiService';
import { exportRevisionToDocx, triggerDownload, printFormattedDocument } from '../services/docExportService';
import { RevisionMaterial } from '../types';
import {
  FileCheck,
  Filter,
  Search,
  BookOpen,
  Download,
  Printer,
  Sparkles,
  Smartphone,
  ChevronDown,
  Layers,
  GraduationCap,
  Clock,
  Award,
  Eye,
  CheckCircle,
  Building,
  School,
  FileText,
  Zap,
} from 'lucide-react';
import { getOfficialTermStrands } from '../data/curriculumData';

export const RevisionGenerator: React.FC = () => {
  const { revisionMaterials, setRevisionMaterials, initiateDownloadPayment, isDocumentUnlocked, user, updateUserSchool } = useApp();

  // Top Section Mode: 'FORM_4_KCSE' | 'CBC_ASSESSMENTS' | 'CUSTOM_GENERATOR'
  const [activeHubTab, setActiveHubTab] = useState<'FORM_4_KCSE' | 'CBC_ASSESSMENTS' | 'CUSTOM_GENERATOR'>('FORM_4_KCSE');

  // School Selection state (let user choose their own school)
  const [currentSchool, setCurrentSchool] = useState<string>(user.schoolName || '');
  const [isEditingSchool, setIsEditingSchool] = useState<boolean>(false);

  // Filters for CBC & Form 4
  const [selectedAssessmentStage, setSelectedAssessmentStage] = useState<'ALL' | 'OPENER' | 'MID_TERM' | 'END_YEAR'>('ALL');
  const [selectedCbcGrade, setSelectedCbcGrade] = useState<string>('ALL');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Active Selected Assessment for Preview
  const [activeAssessment, setActiveAssessment] = useState<RevisionMaterial | null>(OFFICIAL_ASSESSMENTS[0]);
  const [showMarkingScheme, setShowMarkingScheme] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Custom Generator Form
  const [customGrade, setCustomGrade] = useState<'Form 4' | string>('Form 4');
  const [customSubject, setCustomSubject] = useState('Mathematics (Alt A)');
  const [customStage, setCustomStage] = useState<'OPENER' | 'MID_TERM' | 'END_YEAR'>('OPENER');
  const [customTopics, setCustomTopics] = useState('Matrices, Transformations, Calculus');
  const [customBooks, setCustomBooks] = useState<string[]>(['KLB Top Mark KCSE Mathematics']);
  const [examDuration, setExamDuration] = useState(150);
  const [totalMarks, setTotalMarks] = useState(100);

  // Combine user saved revision with official catalog
  const combinedAssessments = useMemo(() => {
    return [...revisionMaterials, ...OFFICIAL_ASSESSMENTS];
  }, [revisionMaterials]);

  // Form 4 KCSE Filtered Items
  const form4Assessments = useMemo(() => {
    return combinedAssessments.filter((item) => {
      if (item.grade !== 'Form 4' && !item.isForm4Kcse) return false;
      if (selectedAssessmentStage !== 'ALL' && item.assessmentType !== selectedAssessmentStage) return false;
      if (selectedSubjectFilter !== 'ALL' && item.subject !== selectedSubjectFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.topics.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [combinedAssessments, selectedAssessmentStage, selectedSubjectFilter, searchTerm]);

  // CBC Filtered Items (PP1, PP2, Grade 1 to Grade 9)
  const cbcAssessments = useMemo(() => {
    return combinedAssessments.filter((item) => {
      if (item.grade === 'Form 4' || item.isForm4Kcse) return false;
      if (selectedAssessmentStage !== 'ALL' && item.assessmentType !== selectedAssessmentStage) return false;
      if (selectedCbcGrade !== 'ALL' && item.grade !== selectedCbcGrade) return false;
      if (selectedSubjectFilter !== 'ALL' && item.subject !== selectedSubjectFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.grade.toLowerCase().includes(q) ||
          item.topics.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [combinedAssessments, selectedAssessmentStage, selectedCbcGrade, selectedSubjectFilter, searchTerm]);

  const handleSaveSchool = (name: string) => {
    setCurrentSchool(name);
    updateUserSchool(name);
    setIsEditingSchool(false);
  };

  const handleDownloadWord = (item: RevisionMaterial) => {
    const titleWithSchool = currentSchool ? `${currentSchool} - ${item.title}` : item.title;
    initiateDownloadPayment('REVISION', item.id, titleWithSchool, 'WORD', async () => {
      try {
        const blob = await exportRevisionToDocx(item);
        triggerDownload(blob, `${(item.schoolName || currentSchool || 'Assessment').replace(/[\s/]/g, '_')}_${item.subject}_${item.grade}.docx`);
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleDownloadPdf = (item: RevisionMaterial) => {
    const schoolToDisplay = currentSchool || item.schoolName || 'KENYAN BASIC EDUCATION ASSESSMENT';
    const titleWithSchool = `${schoolToDisplay} - ${item.title}`;

    initiateDownloadPayment('REVISION', item.id, titleWithSchool, 'PDF', () => {
      const qHtml = item.questions
        .map(
          (q) => `
        <div style="margin-bottom: 22px; page-break-inside: avoid;">
          <p style="font-size: 11pt; font-weight: bold; color: #047857; margin-bottom: 4px;">
            Question ${q.number} [${q.marks} Marks]
          </p>
          <p style="font-size: 10.5pt; margin-bottom: 8px; line-height: 1.5;">${q.questionText}</p>
          <div style="font-size: 9pt; color: #666; margin-bottom: 6px;">
            <em>Primary Textbook Reference: ${q.kicdBookReference}</em>
          </div>
          <div style="background: #f8fafc; border-left: 3.5px solid #047857; padding: 10px 14px; margin-top: 6px; border-radius: 4px;">
            <strong style="color: #111; font-size: 9.5pt;">Official Marking Scheme / Answer Guide:</strong>
            <div style="font-size: 9.5pt; white-space: pre-line; color: #333; margin-top: 5px; line-height: 1.4;">${q.answerGuide}</div>
          </div>
        </div>
      `
        )
        .join('');

      const html = `
        <div class="header-box">
          <h1 style="color: #047857; margin: 0; font-size: 20pt;">${schoolToDisplay.toUpperCase()}</h1>
          <h3 style="margin: 4px 0; color: #374151;">${item.title}</h3>
          <p style="font-size: 10pt; color: #555; margin-top: 4px;">
            Grade / Class: <strong>${item.grade}</strong> | Subject: <strong>${item.subject}</strong> | Duration: <strong>${item.durationMinutes} Mins</strong> | Total Marks: <strong>${item.totalMarks}</strong>
          </p>
        </div>
        ${qHtml}
        <div class="page-footer">
          IMANI TEACHERS CENTER • Official KICD & KNEC Exam Standard • Page 1 of 1
        </div>
      `;
      printFormattedDocument(html, item.title);
    });
  };

  const handleCustomGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    const topicsArr = customTopics.split(',').map((t) => t.trim()).filter(Boolean);

    const generated = generateRevisionPack({
      grade: customGrade,
      subject: customSubject,
      curriculum: customGrade === 'Form 4' ? 'KCSE' : 'CBE',
      topics: topicsArr.length > 0 ? topicsArr : ['Core Curriculum Fundamentals'],
      approvedBooks: customBooks,
      durationMinutes: examDuration,
      totalMarks: totalMarks,
    });

    const withMeta: RevisionMaterial = {
      ...generated,
      title: `${customGrade.toUpperCase()} ${customStage.replace('_', ' ')} ASSESSMENT - ${customSubject.toUpperCase()}`,
      assessmentType: customStage,
      isForm4Kcse: customGrade === 'Form 4',
      schoolName: currentSchool,
    };

    setRevisionMaterials((prev) => [withMeta, ...prev]);
    setActiveAssessment(withMeta);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <FileCheck className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            Assessments & Form 4 KCSE Examinations Hub
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Download updated <strong>Opener, Mid Term, and End Year Assessments</strong> for CBC classes and examinations for <strong>Form 4 class</strong>.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-sm">
          <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <span>Ksh 15 / download • Prompt sent directly to phone</span>
        </div>
      </div>

      {/* USER SCHOOL SELECTION BAR (Lets user choose their own school) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Your Selected School on Cover Pages:</span>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center">
              {currentSchool ? currentSchool : <span className="text-amber-600 font-semibold italic">No school selected yet (Click to choose your school)</span>}
            </h4>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditingSchool ? (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <input
                type="text"
                list="popular-schools-list"
                value={currentSchool}
                onChange={(e) => setCurrentSchool(e.target.value)}
                placeholder="Type or select school name..."
                className="px-3 py-1.5 text-xs rounded-xl border border-emerald-400 dark:border-emerald-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none min-w-[240px]"
              />
              <datalist id="popular-schools-list">
                {KENYAN_COUNTIES_SCHOOLS.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              <button
                type="button"
                onClick={() => handleSaveSchool(currentSchool)}
                className="py-1.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingSchool(true)}
              className="py-1.5 px-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 hover:text-emerald-600 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700 transition"
            >
              {currentSchool ? 'Change School' : 'Choose Your School'}
            </button>
          )}
        </div>
      </div>

      {/* Main Hub Tabs: Form 4 KCSE vs CBC Assessments vs Custom Generator */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-black">
        <button
          onClick={() => {
            setActiveHubTab('FORM_4_KCSE');
            setActiveAssessment(form4Assessments[0] || null);
          }}
          className={`py-3 px-5 border-b-2 transition flex items-center space-x-2 cursor-pointer ${
            activeHubTab === 'FORM_4_KCSE'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>1. Form 4 KCSE Examinations ({form4Assessments.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveHubTab('CBC_ASSESSMENTS');
            setActiveAssessment(cbcAssessments[0] || null);
          }}
          className={`py-3 px-5 border-b-2 transition flex items-center space-x-2 cursor-pointer ${
            activeHubTab === 'CBC_ASSESSMENTS'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. CBC Classes Assessments (PP1 to Grade 9) ({cbcAssessments.length})</span>
        </button>

        <button
          onClick={() => setActiveHubTab('CUSTOM_GENERATOR')}
          className={`py-3 px-5 border-b-2 transition flex items-center space-x-2 cursor-pointer ${
            activeHubTab === 'CUSTOM_GENERATOR'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Generate Custom Examination</span>
        </button>
      </div>

      {/* FILTER CONTROLS FOR ACTIVE TAB */}
      {activeHubTab !== 'CUSTOM_GENERATOR' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Assessment Stage: Opener, Mid Term, End Year */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assessment Period:
              </label>
              <select
                value={selectedAssessmentStage}
                onChange={(e) => setSelectedAssessmentStage(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="ALL">All Periods (Opener, Mid Term, End Year)</option>
                <option value="OPENER">Term Opener Assessment</option>
                <option value="MID_TERM">Mid Term Formative Assessment</option>
                <option value="END_YEAR">End of Year / Mock Assessment</option>
              </select>
            </div>

            {/* If CBC, show Grade selector */}
            {activeHubTab === 'CBC_ASSESSMENTS' && (
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  CBC Class Level:
                </label>
                <select
                  value={selectedCbcGrade}
                  onChange={(e) => setSelectedCbcGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="ALL">All CBC Classes (PP1 - Grade 9)</option>
                  <option value="PP1">Pre-Primary 1 (PP1)</option>
                  <option value="PP2">Pre-Primary 2 (PP2)</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7 (JSS 1)</option>
                  <option value="Grade 8">Grade 8 (JSS 2)</option>
                  <option value="Grade 9">Grade 9 (KJSEA Mock)</option>
                </select>
              </div>
            )}

            {/* Subject / Learning Area */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Filter Subject:
              </label>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
              >
                <option value="ALL">All Subjects</option>
                {activeHubTab === 'FORM_4_KCSE' ? (
                  <>
                    <option value="Mathematics (Alt A)">Mathematics (Alt A)</option>
                    <option value="English">English</option>
                    <option value="Kiswahili">Kiswahili</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                    <option value="History & Government">History & Government</option>
                    <option value="Geography">Geography</option>
                    <option value="Business Studies">Business Studies</option>
                  </>
                ) : (
                  <>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Integrated Science">Integrated Science</option>
                    <option value="English">English</option>
                    <option value="Kiswahili">Kiswahili</option>
                    <option value="Pre-Technical Studies">Pre-Technical Studies</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Social Studies">Social Studies</option>
                    <option value="Mathematical Activities">Mathematical Activities (PP1/PP2)</option>
                  </>
                )}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Search Topics:
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g. Calculus, Woodwork, Plant..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 1. FORM 4 KCSE & 2. CBC ASSESSMENTS */}
      {activeHubTab !== 'CUSTOM_GENERATOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Assessment List (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
              <span>
                {activeHubTab === 'FORM_4_KCSE'
                  ? `Form 4 KCSE Papers (${form4Assessments.length})`
                  : `CBC Assessments (${cbcAssessments.length})`}
              </span>
              <span className="text-emerald-600">Updated 2026 Format</span>
            </div>

            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {(activeHubTab === 'FORM_4_KCSE' ? form4Assessments : cbcAssessments).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveAssessment(item)}
                  className={`p-4 rounded-3xl border transition cursor-pointer space-y-2 ${
                    activeAssessment?.id === item.id
                      ? 'border-indigo-500 dark:border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                      {item.grade} • {item.assessmentType?.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {item.durationMinutes} Mins • {item.totalMarks} Marks
                    </span>
                  </div>

                  <h4 className="text-xs md:text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                    {item.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{item.subject}</span>
                    <span className="text-emerald-600 font-bold">Includes Marking Scheme</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Active Assessment Preview & Actions (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {activeAssessment ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300">
                        {activeAssessment.grade} • {activeAssessment.assessmentType?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        {activeAssessment.durationMinutes} Mins • {activeAssessment.totalMarks} Marks
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {activeAssessment.title}
                    </h3>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                      School on Cover: {currentSchool || 'Click "Choose Your School" above to brand'}
                    </p>
                  </div>

                  {/* Download Buttons (Compulsory Ksh 15 M-Pesa Payment on Every Document Download) */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2 py-1 rounded-xl">
                      Ksh 15 M-Pesa
                    </span>

                    <button
                      onClick={() => handleDownloadWord(activeAssessment)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition cursor-pointer"
                      title="Download Microsoft Word .docx (Charges Ksh.15 M-Pesa)"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Word (.docx) - Ksh 15</span>
                    </button>

                    <button
                      onClick={() => handleDownloadPdf(activeAssessment)}
                      className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20 transition cursor-pointer"
                      title="Download / Print PDF (Charges Ksh.15 M-Pesa)"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>PDF / Print - Ksh 15</span>
                    </button>
                  </div>
                </div>

                {/* Toggle Marking Scheme */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    KICD Books: {activeAssessment.kicdBookReferences.join(', ')}
                  </span>
                  <button
                    onClick={() => setShowMarkingScheme(!showMarkingScheme)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {showMarkingScheme ? 'Hide Marking Guide' : 'Show Marking Guide'}
                  </button>
                </div>

                {/* Questions & Marking Scheme */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {activeAssessment.questions.map((q) => (
                    <div
                      key={q.number}
                      className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/50 dark:bg-slate-850 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-extrabold text-sm text-indigo-700 dark:text-indigo-400">
                          Question {q.number}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold">
                          [{q.marks} Marks]
                        </span>
                      </div>

                      <p className="text-xs md:text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                        {q.questionText}
                      </p>

                      <div className="text-[11px] text-slate-500 italic">
                        Reference: {q.kicdBookReference}
                      </div>

                      {showMarkingScheme && (
                        <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border-l-4 border-emerald-500 p-3 rounded-r-xl space-y-1">
                          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                            Official KNEC / KICD Marking Scheme:
                          </span>
                          <p className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                            {q.answerGuide}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                Select an assessment from the left to view questions and marking scheme.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: CUSTOM ASSESSMENT GENERATOR */}
      {activeHubTab === 'CUSTOM_GENERATOR' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm max-w-2xl mx-auto space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 mr-2 text-amber-500" />
            Generate Custom Examination or Assessment
          </h3>

          <form onSubmit={handleCustomGenerate} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Class / Level:
                </label>
                <select
                  value={customGrade}
                  onChange={(e) => setCustomGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="Form 4">Form 4 (KCSE Class)</option>
                  <option value="Grade 9">Grade 9 (KJSEA Class)</option>
                  <option value="Grade 8">Grade 8 (JSS)</option>
                  <option value="Grade 7">Grade 7 (JSS)</option>
                  <option value="Grade 6">Grade 6</option>
                  <option value="PP1">Pre-Primary 1 (PP1)</option>
                  <option value="PP2">Pre-Primary 2 (PP2)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Assessment Period:
                </label>
                <select
                  value={customStage}
                  onChange={(e) => setCustomStage(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="OPENER">Term Opener Assessment</option>
                  <option value="MID_TERM">Mid Term Formative Assessment</option>
                  <option value="END_YEAR">End of Year Examination</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Subject / Learning Area:
              </label>
              <input
                type="text"
                required
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="e.g. Mathematics or Integrated Science"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Specific Exam Topics:
              </label>
              <textarea
                rows={2}
                value={customTopics}
                onChange={(e) => setCustomTopics(e.target.value)}
                placeholder="e.g. Differentiation, Commercial Arithmetic, Probability"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Duration (Minutes):
                </label>
                <input
                  type="number"
                  value={examDuration}
                  onChange={(e) => setExamDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Total Marks:
                </label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black text-xs shadow-md shadow-amber-500/30 flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Building Custom Assessment...' : 'Build Custom Assessment & Marking Scheme'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
