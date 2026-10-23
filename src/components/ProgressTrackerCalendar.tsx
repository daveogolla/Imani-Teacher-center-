import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ScheduleEvent } from '../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  School,
  TrendingUp,
} from 'lucide-react';

export const ProgressTrackerCalendar: React.FC = () => {
  const { scheduleEvents, addScheduleEvent, deleteScheduleEvent } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<ScheduleEvent['type']>('LESSON');
  const [date, setDate] = useState('2026-03-02');
  const [grade, setGrade] = useState('Grade 7');
  const [subject, setSubject] = useState('Mathematics');
  const [notes, setNotes] = useState('');

  const [currentMonth, setCurrentMonth] = useState('2026-03');

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    addScheduleEvent({
      title,
      type,
      date,
      grade: type === 'LESSON' ? grade : undefined,
      subject: type === 'LESSON' ? subject : undefined,
      notes: notes || undefined,
      completed: false,
    });

    setTitle('');
    setNotes('');
  };

  const sortedEvents = [...scheduleEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center">
            <CalendarIcon className="w-6 h-6 mr-2 text-sky-600 dark:text-sky-400" />
            Curriculum Schedule & Syllabus Progress Tracker
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Keep track of term dates, half-term breaks, lesson pacing, and official school calendar milestones.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 px-3.5 py-1.5 rounded-2xl text-xs font-bold">
          <TrendingUp className="w-4 h-4 mr-1 text-sky-600" />
          <span>Syllabus Pacing: Week 8 of 13</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Event Scheduler Form (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <form
            onSubmit={handleAddEvent}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3.5"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <Plus className="w-4 h-4 mr-1.5 text-sky-500" />
              Schedule Post / Lesson / Event
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Event Title:
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grade 7 Integrated Science Quiz"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Event Type:
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="LESSON">Scheduled Lesson</option>
                  <option value="HALF_TERM">Half Term Break</option>
                  <option value="END_TERM">End of Term</option>
                  <option value="EXAM">Exam / Assessment</option>
                  <option value="MEETING">Staff / HOD Meeting</option>
                  <option value="HOLIDAY">Public Holiday</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Date:
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {type === 'LESSON' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Grade:
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Subject:
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notes:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Lesson objectives, lab equipment needed..."
                className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center space-x-1.5 transition cursor-pointer"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Add to Schedule</span>
            </button>
          </form>

          {/* Break Policy Notice */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 text-xs text-amber-800 dark:text-amber-300 space-y-1">
            <div className="flex items-center font-bold">
              <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
              <span>KICD Break Schedule Rule</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Whenever it's a half term break or end of term closing in your syllabus, the time slot is automatically left blank on your generated documents with explicit notices.
            </p>
          </div>
        </div>

        {/* Right: Scheduled Timeline (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center">
                <Clock className="w-4 h-4 mr-2 text-sky-500" />
                Scheduled Term Events & Break Milestones ({sortedEvents.length})
              </h3>
              <span className="text-xs text-slate-400">Kenya Academic Calendar 2026</span>
            </div>

            <div className="space-y-3">
              {sortedEvents.map((ev) => {
                const isBreak = ev.type === 'HALF_TERM' || ev.type === 'END_TERM';
                return (
                  <div
                    key={ev.id}
                    className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                      isBreak
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isBreak
                              ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200'
                              : 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300'
                          }`}
                        >
                          {ev.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {ev.date} {ev.endDate && `to ${ev.endDate}`}
                        </span>
                      </div>

                      <h4
                        className={`text-sm font-bold ${
                          isBreak
                            ? 'text-amber-900 dark:text-amber-200'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {ev.title}
                      </h4>

                      {ev.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {ev.notes}
                        </p>
                      )}

                      {isBreak && (
                        <p className="text-[10px] font-bold text-amber-700 dark:text-amber-400">
                          ★ Blank Duration in Schemes of Work as required by KICD guidelines.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteScheduleEvent(ev.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition"
                      title="Remove event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
