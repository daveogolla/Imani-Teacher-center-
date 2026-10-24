import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GRADES_LIST } from '../data/curriculumData';
import { KICD_APPROVED_BOOKS } from '../data/kicdBooks';
import { generateLessonPlanWithAI } from '../services/aiService';
import { exportLessonPlanToDocx, triggerDownload, printFormattedDocument } from '../services/docExportService';
import { LessonPlan } from '../types';
import {
  BookOpen,
  Sparkles,
  Download,
  Printer,
  Smartphone,
  School,
  User,
  Clock,
  Layers,
  CheckCircle,
  FileText,
} from 'lucide-react';

import { KENYAN_COUNTIES_SCHOOLS, getOfficialTermStrands } from '../data/curriculumData';

export const LessonPlanGenerator: React.FC = () => {
  const { user, lessonPlans, setLessonPlans, initiateDownloadPayment, isDocumentUnlocked } = useApp();

  const [schoolName, setSchoolName] = useState(user.schoolName || '');
  const [teacherName, setTeacherName] = useState(user.name || 'Dave Ogolla');
  const [tscNumber, setTscNumber] = useState(user.tscNumber || '');
  const [grade, setGrade] = useState('Grade 7');
  const [subject, setSubject] = useState('Mathematics');
  const [strand, setStrand] = useState('Numbers');
  const [subStrand, setSubStrand] = useState('Whole Numbers & Prime Factorisation');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([
    'KLB Visionary Junior Secondary Mathematics Grade 7',
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [activePlan, setActivePlan] = useState<LessonPlan | null>(lessonPlans[0] || null);

  const availableBooks = KICD_APPROVED_BOOKS.filter(
    (b) => b.gradeLevels.includes(grade) || b.subject.toLowerCase().includes(subject.toLowerCase().slice(0, 4))
  );

  const handleBookToggle = (title: string) => {
    setSelectedBooks((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const plan = await generateLessonPlanWithAI({
        schoolName,
        teacherName,
        tscNumber,
        grade,
        subject,
        strand,
        subStrand,
        date,
        durationMinutes,
        approvedBooks: selectedBooks.length > 0 ? selectedBooks : ['KLB Visionary', 'Oxford Course Book'],
      });

      setLessonPlans((prev) => [plan, ...prev]);
      setActivePlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadWord = (plan: LessonPlan) => {
    initiateDownloadPayment(
      'LESSON_PLAN',
      plan.id,
      plan.title,
      'WORD',
      async () => {
        try {
          const blob = await exportLessonPlanToDocx(plan);
          triggerDownload(blob, `${plan.schoolName}_${plan.subject}_Lesson_Plan.docx`);
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  const handleDownloadPdf = (plan: LessonPlan) => {
    initiateDownloadPayment('LESSON_PLAN', plan.id, plan.title, 'PDF', () => {
      const stepsHtml = plan.lessonDevelopment
        .map(
          (s) => `
        <tr>
          <td><strong>${s.step}</strong><br/><em>${s.competenceFocus}</em></td>
          <td>${s.time}</td>
          <td>${s.teacherActivity}</td>
          <td>${s.learnerActivity}</td>
        </tr>
      `
        )
        .join('');

      const html = `
        <div class="header-box">
          <h2 style="color: #047857; margin: 0;">${plan.schoolName.toUpperCase()}</h2>
          <h3 style="margin: 4px 0;">OFFICIAL KICD CBC / 8-4-4 LESSON PLAN</h3>
          <h4 style="margin: 4px 0; color: #111;">${plan.subject} (${plan.grade}) - ${plan.subStrand}</h4>
        </div>

        <table class="meta-table">
          <tr>
            <td><strong>Teacher:</strong> ${plan.teacherName}</td>
            <td><strong>TSC No:</strong> ${plan.tscNumber ? plan.tscNumber : '_____________________'}</td>
            <td><strong>Date & Time:</strong> ${plan.date} (${plan.durationMinutes} mins)</td>
          </tr>
          <tr>
            <td><strong>Strand:</strong> ${plan.strand}</td>
            <td><strong>Sub-Strand:</strong> ${plan.subStrand}</td>
            <td><strong>Roll Call:</strong> Boys: ${plan.rollCallBoys} | Girls: ${plan.rollCallGirls}</td>
          </tr>
          <tr>
            <td colspan="3"><strong>Primary KICD Books:</strong> ${plan.kicdApprovedBooks.join(', ')}</td>
          </tr>
          <tr>
            <td colspan="3"><strong>Core Competencies:</strong> ${plan.coreCompetencies.join('; ')}</td>
          </tr>
          <tr>
            <td colspan="3"><strong>Values & PCIs:</strong> ${plan.values.join(', ')} | ${plan.pcis.join(', ')}</td>
          </tr>
        </table>

        <table>
          <thead>
            <tr>
              <th style="width: 20%;">Step</th>
              <th style="width: 10%;">Time</th>
              <th style="width: 35%;">Teacher Activities</th>
              <th style="width: 35%;">Learner Activities</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Introduction</strong></td>
              <td>${plan.introduction.time}</td>
              <td>${plan.introduction.teacherActivity}</td>
              <td>${plan.introduction.learnerActivity}</td>
            </tr>
            ${stepsHtml}
            <tr>
              <td><strong>Conclusion</strong></td>
              <td>${plan.conclusion.time}</td>
              <td>${plan.conclusion.summary}</td>
              <td>${plan.conclusion.learnerActivity}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 15px; font-size: 9.5pt;">
          <strong>Self-Evaluation:</strong> <em>${plan.selfEvaluation}</em>
        </div>

        <div class="approvals">
          <table style="border: none;">
            <tr style="border: none;">
              <td style="border: none;"><strong>HoD Signature:</strong> _______________________ Date: ____/____/2026</td>
              <td style="border: none;"><strong>Principal Signature:</strong> _______________________ Date: ____/____/2026</td>
            </tr>
          </table>
        </div>

        <div class="page-footer">
          IMANI TEACHERS CENTER • Official KICD CBC Lesson Plan Template • Page 1 of 1
        </div>
      `;
      printFormattedDocument(html, plan.title);
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-teal-600 dark:text-teal-400" />
            CBC & KCSE Lesson Plan Generator
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Pedagogically structured with 3-phase lesson development, teacher/learner activities, and approval blocks.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-teal-50 dark:bg-teal-950/60 border border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300 px-3.5 py-1.5 rounded-2xl text-xs font-bold shadow-sm">
          <Smartphone className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>Ksh 15 / download via M-Pesa to 0707423879</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <form
            onSubmit={handleGenerate}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <School className="w-4 h-4 mr-1.5 text-teal-600 dark:text-teal-400" />
              Lesson Profile
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select or Enter Your School Name:
              </label>
              <input
                type="text"
                required
                list="lesson-plan-schools"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Type or select school (e.g. Alliance, Pangani, Maranda...)"
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
              <datalist id="lesson-plan-schools">
                {KENYAN_COUNTIES_SCHOOLS.map((sch) => (
                  <option key={sch} value={sch} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Teacher Name:
                </label>
                <input
                  type="text"
                  required
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
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
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grade / Class:
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
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
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Strand:
                </label>
                <input
                  type="text"
                  required
                  value={strand}
                  onChange={(e) => setStrand(e.target.value)}
                  placeholder="e.g. Numbers"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Sub-Strand:
                </label>
                <input
                  type="text"
                  required
                  value={subStrand}
                  onChange={(e) => setSubStrand(e.target.value)}
                  placeholder="e.g. Prime Factorisation"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select KICD Approved Source Books:
              </label>
              <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                {availableBooks.map((b) => (
                  <label
                    key={b.id}
                    className="flex items-center space-x-2 text-[11px] text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(b.title)}
                      onChange={() => handleBookToggle(b.title)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="truncate">{b.title}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-teal-600/30 flex items-center justify-center space-x-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-teal-200" />
              <span>{isGenerating ? 'Generating Lesson Plan...' : 'Generate CBC Lesson Plan'}</span>
            </button>
          </form>
        </div>

        {/* Right: Active Plan Preview & Download (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activePlan ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-100 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300">
                    Official KICD Standard Lesson Plan
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                    {activePlan.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activePlan.schoolName || user.schoolName || 'Your School'} • {activePlan.date} ({activePlan.durationMinutes} mins)
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2 py-1 rounded-xl">
                    Ksh 15 M-Pesa
                  </span>

                  <button
                    onClick={() => handleDownloadWord(activePlan)}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/20 transition cursor-pointer"
                    title="Download Word .docx (Charges Ksh.15 M-Pesa)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Word (.docx) - Ksh 15</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPdf(activePlan)}
                    className="py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20 transition cursor-pointer"
                    title="Print / Download PDF (Charges Ksh.15 M-Pesa)"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>PDF / Print - Ksh 15</span>
                  </button>
                </div>
              </div>

              {/* Administrative Details Box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Teacher:</span>
                    <span className="font-semibold">{activePlan.teacherName} {activePlan.tscNumber ? `(TSC: ${activePlan.tscNumber})` : ''}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Strand / Sub-strand:</span>
                    <span className="font-semibold">{activePlan.strand} &gt; {activePlan.subStrand}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">KICD Source Book:</span>
                    <span className="font-semibold text-teal-600">{activePlan.kicdApprovedBooks[0] || 'KLB Visionary'}</span>
                  </div>
                </div>
              </div>

              {/* Lesson Development Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-teal-700 text-white">
                    <tr>
                      <th className="p-2.5 border-r border-teal-600 w-1/4">Step</th>
                      <th className="p-2.5 border-r border-teal-600 w-16">Time</th>
                      <th className="p-2.5 border-r border-teal-600">Teacher Activities</th>
                      <th className="p-2.5">Learner Activities</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    <tr>
                      <td className="p-2.5 font-bold border-r border-slate-200 dark:border-slate-800">
                        Introduction
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                        {activePlan.introduction.time}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                        {activePlan.introduction.teacherActivity}
                      </td>
                      <td className="p-2.5">{activePlan.introduction.learnerActivity}</td>
                    </tr>

                    {activePlan.lessonDevelopment.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-bold border-r border-slate-200 dark:border-slate-800">
                          {s.step}
                          <span className="block font-normal text-[10px] text-teal-600 dark:text-teal-400">
                            {s.competenceFocus}
                          </span>
                        </td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{s.time}</td>
                        <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                          {s.teacherActivity}
                        </td>
                        <td className="p-2.5">{s.learnerActivity}</td>
                      </tr>
                    ))}

                    <tr>
                      <td className="p-2.5 font-bold border-r border-slate-200 dark:border-slate-800">
                        Conclusion
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                        {activePlan.conclusion.time}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                        {activePlan.conclusion.summary}
                      </td>
                      <td className="p-2.5">{activePlan.conclusion.learnerActivity}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
              <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">Select parameters on the left to generate lesson plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
