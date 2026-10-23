import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { KICD_APPROVED_BOOKS } from '../data/kicdBooks';
import { GRADES_LIST } from '../data/curriculumData';
import { KicdBook } from '../types';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  FileText,
  Bookmark,
  Layers,
  Sparkles,
  ExternalLink,
  Award,
  BookMarked,
  X,
  FileCheck,
} from 'lucide-react';

export const KicdBooksCatalog: React.FC = () => {
  const { setCurrentTab } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPublisher, setSelectedPublisher] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTabFilter, setSelectedTabFilter] = useState<'ALL' | 'SET_BOOKS' | 'COURSE_BOOKS' | 'REVISION' | 'TEACHER_GUIDES'>('ALL');
  const [activeBookModal, setActiveBookModal] = useState<KicdBook | null>(null);

  const publishers = [
    'ALL',
    'KLB',
    'Oxford',
    'Moran',
    'Longhorn',
    'Spotlight',
    'EAEP',
    'Mentor',
    'JKF',
    'Targeter',
    'Queenex',
    'Mountain Top',
    'StoryMoja',
  ];

  const categories = [
    'ALL',
    'Course Book',
    'Teacher Guide',
    'Supplementary Reader',
    'Workbook / Assessment',
  ];

  const filteredBooks = useMemo(() => {
    return KICD_APPROVED_BOOKS.filter((b) => {
      if (selectedTabFilter === 'SET_BOOKS' && !b.isKcseSetBook) return false;
      if (selectedTabFilter === 'COURSE_BOOKS' && b.approvedCategory !== 'Course Book') return false;
      if (selectedTabFilter === 'REVISION' && b.approvedCategory !== 'Workbook / Assessment') return false;
      if (selectedTabFilter === 'TEACHER_GUIDES' && b.approvedCategory !== 'Teacher Guide') return false;

      if (selectedPublisher !== 'ALL' && b.publisher !== selectedPublisher) return false;
      if (selectedCategory !== 'ALL' && b.approvedCategory !== selectedCategory) return false;
      if (selectedGrade !== 'ALL' && !b.gradeLevels.includes(selectedGrade)) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          b.title.toLowerCase().includes(q) ||
          b.subject.toLowerCase().includes(q) ||
          b.kicdApprovalCode.toLowerCase().includes(q) ||
          (b.author && b.author.toLowerCase().includes(q)) ||
          (b.synopsis && b.synopsis.toLowerCase().includes(q)) ||
          (b.topicsCovered && b.topicsCovered.some((t) => t.toLowerCase().includes(q)));
        if (!matches) return false;
      }
      return true;
    });
  }, [searchTerm, selectedPublisher, selectedGrade, selectedCategory, selectedTabFilter]);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-emerald-600 dark:text-emerald-400" />
            KICD Approved Textbooks & Set Books Directory
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Official Kenya Institute of Curriculum Development approved course books, literature & Fasihi set books, teacher guides & assessment materials (PP1 to Grade 12 / Form 4).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 rounded-2xl shadow-sm">
          <span>{filteredBooks.length} of {KICD_APPROVED_BOOKS.length} books listed</span>
        </div>
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTabFilter('ALL')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center space-x-1.5 ${
            selectedTabFilter === 'ALL'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          <span>All Books ({KICD_APPROVED_BOOKS.length})</span>
        </button>

        <button
          onClick={() => setSelectedTabFilter('SET_BOOKS')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold transition cursor-pointer flex items-center space-x-1.5 ${
            selectedTabFilter === 'SET_BOOKS'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:border-amber-400'
          }`}
        >
          <BookMarked className="w-3.5 h-3.5" />
          <span>KCSE Set Books (Literature & Fasihi)</span>
        </button>

        <button
          onClick={() => setSelectedTabFilter('COURSE_BOOKS')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            selectedTabFilter === 'COURSE_BOOKS'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          <span>Course Books</span>
        </button>

        <button
          onClick={() => setSelectedTabFilter('REVISION')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            selectedTabFilter === 'REVISION'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          <span>Workbooks & Revision (KJSEA / KCSE)</span>
        </button>

        <button
          onClick={() => setSelectedTabFilter('TEACHER_GUIDES')}
          className={`py-2 px-3.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
            selectedTabFilter === 'TEACHER_GUIDES'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-400'
          }`}
        >
          <span>Official Teacher Guides</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Search Title, Author, or Strand:
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Fathers of Nations, Bembea, KLB..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Publisher Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Approved Publisher:
            </label>
            <select
              value={selectedPublisher}
              onChange={(e) => setSelectedPublisher(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {publishers.map((p) => (
                <option key={p} value={p}>
                  {p === 'ALL' ? 'All Publishers (KLB, Oxford, Moran...)' : p}
                </option>
              ))}
            </select>
          </div>

          {/* Grade Level Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Grade Alignment:
            </label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="ALL">All Grades (PP1 to Form 4)</option>
              {GRADES_LIST.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Material Type:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'ALL' ? 'All Material Types' : c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Book Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between ${
              book.isKcseSetBook
                ? 'border-amber-300 dark:border-amber-700/80 bg-amber-50/20 dark:bg-amber-950/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {book.publisher}
                  </span>
                  {book.isKcseSetBook && (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white uppercase tracking-wider">
                      KCSE Set Book
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {book.editionYear} Edition
                </span>
              </div>

              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-snug">
                  {book.title}
                </h3>
                {book.author && (
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-0.5">
                    Author: {book.author}
                  </p>
                )}
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  {book.subject} • {book.gradeLevels.join(', ')}
                </p>
              </div>

              {book.synopsis && (
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {book.synopsis}
                </p>
              )}

              {/* Topics / Strands Covered Chips */}
              {book.topicsCovered && book.topicsCovered.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Strands & Topics:</span>
                  <div className="flex flex-wrap gap-1">
                    {book.topicsCovered.slice(0, 3).map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 truncate max-w-[200px]"
                      >
                        {topic}
                      </span>
                    ))}
                    {book.topicsCovered.length > 3 && (
                      <button
                        onClick={() => setActiveBookModal(book)}
                        className="text-[10px] px-1.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        +{book.topicsCovered.length - 3} more
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/70 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Approval Code:</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                    {book.kicdApprovalCode}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {book.approvedCategory}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentTab('schemes')}
                  className="flex-1 py-2 px-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold flex items-center justify-center space-x-1 transition cursor-pointer"
                  title="Open Schemes of Work generator referencing this book"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>In Schemes</span>
                </button>

                <button
                  onClick={() => setCurrentTab('lesson-plans')}
                  className="flex-1 py-2 px-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-bold flex items-center justify-center space-x-1 transition cursor-pointer"
                  title="Open Lesson Plan generator referencing this book"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>Lesson Plan</span>
                </button>

                <button
                  onClick={() => setCurrentTab('revision')}
                  className="flex-1 py-2 px-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-[11px] font-bold flex items-center justify-center space-x-1 transition cursor-pointer"
                  title="Open Revision & Assessments referencing this book"
                >
                  <FileCheck className="w-3 h-3 text-blue-600" />
                  <span>Revision</span>
                </button>
              </div>

              <button
                onClick={() => setActiveBookModal(book)}
                className="w-full py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 text-[10px] font-semibold text-center transition cursor-pointer"
              >
                View Syllabus Strands & Approval Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Book Details Modal */}
      {activeBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveBookModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                {activeBookModal.publisher}
              </span>
              {activeBookModal.isKcseSetBook && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white uppercase">
                  Official KCSE Set Book
                </span>
              )}
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {activeBookModal.title}
              </h3>
              {activeBookModal.author && (
                <p className="text-sm font-bold text-amber-700 dark:text-amber-400 mt-1">
                  Author: {activeBookModal.author}
                </p>
              )}
              <p className="text-xs text-emerald-600 font-semibold mt-1">
                {activeBookModal.subject} • {activeBookModal.gradeLevels.join(', ')}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Official KICD Approval Code:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{activeBookModal.kicdApprovalCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Edition / Syllabus Year:</span>
                <span className="font-bold">{activeBookModal.editionYear} Edition</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-emerald-600">{activeBookModal.approvedCategory}</span>
              </div>
            </div>

            {activeBookModal.synopsis && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Curriculum Overview & Pedagogical Scope:
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {activeBookModal.synopsis}
                </p>
              </div>
            )}

            {activeBookModal.topicsCovered && activeBookModal.topicsCovered.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Syllabus Strands & Examination Focus Areas:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeBookModal.topicsCovered.map((topic, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={() => {
                  setActiveBookModal(null);
                  setCurrentTab('schemes');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/30 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Use in Schemes of Work</span>
              </button>
              <button
                onClick={() => {
                  setActiveBookModal(null);
                  setCurrentTab('revision');
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-600/30 transition cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>View Revision & Exams</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
