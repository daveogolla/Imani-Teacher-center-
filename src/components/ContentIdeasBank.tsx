import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GRADES_LIST } from '../data/curriculumData';
import {
  Lightbulb,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Tag,
  BookOpen,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const ContentIdeasBank: React.FC = () => {
  const { contentIdeas, addContentIdea, toggleCompleteIdea, deleteIdea, setCurrentTab } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [grade, setGrade] = useState('Grade 7');
  const [notes, setNotes] = useState('');
  const [tagsStr, setTagsStr] = useState('Experiment, Realia');
  const [scheduledDate, setScheduledDate] = useState('');
  const [filterTag, setFilterTag] = useState<string>('ALL');

  const allTags = Array.from(
    new Set(contentIdeas.flatMap((i) => i.tags || []))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addContentIdea({
      title,
      subject,
      grade,
      notes,
      tags,
      scheduledDate: scheduledDate || undefined,
      isCompleted: false,
    });

    setTitle('');
    setNotes('');
    setScheduledDate('');
  };

  const filteredIdeas = contentIdeas.filter((i) => {
    if (filterTag !== 'ALL' && !i.tags.includes(filterTag)) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <Lightbulb className="w-6 h-6 mr-2 text-amber-500" />
            Teacher Content Ideas Bank & Post Scheduler
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Save pedagogical sparks, low-cost realia experiments, project ideas and schedule them into your teaching calendar.
          </p>
        </div>

        <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 px-3.5 py-1.5 rounded-2xl shadow-sm self-start md:self-auto">
          {contentIdeas.filter((i) => !i.isCompleted).length} Ideas Pending Implementation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Idea Creator Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <Plus className="w-4 h-4 mr-1.5 text-amber-500" />
              Capture New Teaching Idea
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Idea Title:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Improvised manometer using transparent tube & red water"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grade Level:
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
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
                  Subject / Learning Area:
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Science / Math"
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Pedagogical Notes / Required Materials:
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe how learners will interact, safety tips, book references..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma separated):
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Realia, CBC, Experiment"
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Schedule Execution Date:
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Save Content Idea to Bank</span>
            </button>
          </form>
        </div>

        {/* Right: Ideas List & Schedule Tracking (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tag filters */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setFilterTag('ALL')}
              className={`px-3 py-1 rounded-full font-bold transition shrink-0 ${
                filterTag === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
              }`}
            >
              All Ideas ({contentIdeas.length})
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-3 py-1 rounded-full font-medium transition shrink-0 ${
                  filterTag === tag
                    ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredIdeas.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                No content ideas in this category. Add your first idea using the form!
              </div>
            ) : (
              filteredIdeas.map((idea) => (
                <div
                  key={idea.id}
                  className={`p-4 rounded-3xl border transition flex items-start justify-between gap-3 ${
                    idea.isCompleted
                      ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-400 dark:hover:border-amber-600'
                  }`}
                >
                  <button
                    onClick={() => toggleCompleteIdea(idea.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-500 transition shrink-0"
                    title={idea.isCompleted ? 'Mark Pending' : 'Mark Completed'}
                  >
                    {idea.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300">
                        {idea.grade} • {idea.subject}
                      </span>
                      {idea.scheduledDate && (
                        <span className="text-[11px] text-slate-500 flex items-center font-medium">
                          <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                          {idea.scheduledDate}
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-sm font-bold ${
                        idea.isCompleted
                          ? 'line-through text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {idea.title}
                    </h4>

                    {idea.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {idea.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {idea.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-400 font-medium"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2 shrink-0">
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Delete Idea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCurrentTab('lesson-plans')}
                      className="p-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center font-semibold"
                      title="Turn into Lesson Plan"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
