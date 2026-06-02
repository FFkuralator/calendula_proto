import React, { useState, useRef, useEffect, useMemo } from 'react';
import { SlidersHorizontal, ChevronDown, Check, X, List, Calendar, CalendarDays, Info, BookOpen, FileText, ExternalLink } from 'lucide-react';
import {
  Task, CATEGORIES, ACADEMIC_MONTHS, MONTH_NAMES_RU,
  CATEGORY_CONFIG, ALL_TASKS,
  getAcademicYearRange, getCalendarYear,
  TaskCategory,
} from '../data/tasks';
import { MonthCalendar } from './MonthCalendar';
import { WeekView } from './WeekView';

type ViewMode = 'calendar' | 'week' | 'list';

interface Props {
  searchQuery: string;
  academicYear: string;
  onNavigateTask?: (id: string) => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}

export function RoadmapPage({ searchQuery, academicYear, onNavigateTask }: Props) {
  const SIDEBAR_DOCS = [
    'Регламент проведения ГИА',
    'Чеклист допуска к защите',
    'Пакет шаблонных приказов',
  ];

  const { start, end } = getAcademicYearRange(academicYear);
  const now = new Date();

  const defaultMonthEntry = ACADEMIC_MONTHS.find(m => {
    const cy = getCalendarYear(m.index, academicYear);
    return m.index === now.getMonth() && cy === now.getFullYear();
  });

  const [selectedMonths, setSelectedMonths] = useState<number[]>(
    defaultMonthEntry ? [defaultMonthEntry.index] : []
  );
  const [showAllMonths, setShowAllMonths] = useState(selectedMonths.length === 0);
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategories, setActiveCategories] = useState<TaskCategory[]>([...CATEGORIES]);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const handleTaskClick = (t: Task) => { if (onNavigateTask) onNavigateTask(t.id); };
  const [weekRef, setWeekRef] = useState(new Date());

  const filterRef = useRef<HTMLDivElement>(null);
  const monthPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
      if (monthPickerRef.current && !monthPickerRef.current.contains(e.target as Node)) setMonthPickerOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const yearTasks = useMemo(() =>
    ALL_TASKS.filter(t => {
      const d = new Date(t.deadline);
      return d >= start && d <= end;
    }), [academicYear]);

  const filteredTasks = useMemo(() => {
    let tasks = yearTasks;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        (t.responsible && t.responsible.toLowerCase().includes(q))
      );
    }
    if (activeCategories.length < CATEGORIES.length)
      tasks = tasks.filter(t => activeCategories.includes(t.category));
    return tasks;
  }, [yearTasks, searchQuery, activeCategories]);

  const displayedTasks = useMemo(() => {
    if (showAllMonths || selectedMonths.length === 0) return filteredTasks;
    return filteredTasks.filter(t => {
      const d = new Date(t.deadline);
      return selectedMonths.includes(d.getMonth());
    });
  }, [filteredTasks, showAllMonths, selectedMonths]);

  const filterCount =
    (activeCategories.length < CATEGORIES.length ? CATEGORIES.length - activeCategories.length : 0);

  const toggleCategory = (cat: TaskCategory) =>
    setActiveCategories(p => p.includes(cat) ? p.filter(c => c !== cat) : [...p, cat]);

  const handleSelectAllMonths = () => { setShowAllMonths(true); setSelectedMonths([]); };
  const toggleMonth = (idx: number) => {
    setShowAllMonths(false);
    setSelectedMonths(p => p.includes(idx) ? p.filter(m => m !== idx) : [...p, idx]);
  };

  // Grouped by date for list view
  const listGroups = useMemo(() => {
    const sorted = [...displayedTasks].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    const map = new Map<string, Task[]>();
    for (const t of sorted) {
      const key = t.deadline;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    }
    return Array.from(map.entries()).map(([date, tasks]) => {
      const d = new Date(date);
      return {
        label: `${d.getDate()} ${MONTH_NAMES_RU[d.getMonth()].toLowerCase()} ${d.getFullYear()}`,
        date,
        tasks,
      };
    });
  }, [displayedTasks]);

  return (
    <div className="flex gap-0 h-full">
      <div className="flex-1 min-w-0 px-6 py-6">
        {/* Page header */}
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Дорожная карта задач на учебный год</h1>
          <p className="text-sm text-gray-500">Задачи отсортированы по дедлайну. Используйте фильтры, чтобы быстрее найти нужные задачи.</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {/* All months button */}
          <button
            onClick={handleSelectAllMonths}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
              showAllMonths
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 border-indigo-600'
                : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            Все месяцы
          </button>

          {/* Month picker */}
          <div className="relative" ref={monthPickerRef}>
            <button
              onClick={() => setMonthPickerOpen(v => !v)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
                !showAllMonths && selectedMonths.length > 0
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              <CalendarDays size={14} />
              Выбрать месяц
              {!showAllMonths && selectedMonths.length > 0 && (
                <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {selectedMonths.length}
                </span>
              )}
              <ChevronDown size={13} className={`transition-transform ${monthPickerOpen ? 'rotate-180' : ''}`} />
            </button>
            {monthPickerOpen && (
              <div className="absolute left-0 top-full mt-2 w-60 bg-white rounded-2xl border border-gray-200 shadow-xl z-30 p-3">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide px-1 mb-2">Выберите один или несколько</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {ACADEMIC_MONTHS.map(m => {
                    const isSelected = selectedMonths.includes(m.index);
                    const cy = getCalendarYear(m.index, academicYear);
                    const cnt = yearTasks.filter(t => { const d = new Date(t.deadline); return d.getMonth() === m.index && d.getFullYear() === cy; }).length;
                    return (
                      <button
                        key={m.name}
                        onClick={() => toggleMonth(m.index)}
                        className={`relative flex flex-col items-center py-2 px-1 rounded-xl text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-gray-100 text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        <span>{m.short}</span>
                        {cnt > 0 && (
                          <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}>{cnt}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedMonths.length > 0 && (
                  <button onClick={() => { setSelectedMonths([]); setShowAllMonths(true); }}
                    className="mt-2 w-full text-xs text-indigo-600 hover:text-indigo-700 font-medium py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                    Сбросить выбор
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Filter */}
          <div className="relative ml-auto" ref={filterRef}>
            <button onClick={() => setFilterOpen(v => !v)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all ${
                filterCount > 0 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              <SlidersHorizontal size={14} />
              Фильтры
              {filterCount > 0 && <span className="w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold">{filterCount}</span>}
              <ChevronDown size={13} className={`transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl z-30 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">Фильтры</span>
                  {filterCount > 0 && (
                    <button onClick={() => { setActiveCategories([...CATEGORIES]); }} className="text-xs text-indigo-600 font-medium">Сбросить</button>
                  )}
                </div>
                <div className="p-4 border-b border-gray-100">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Категория</div>
                  <div className="space-y-2">
                    {CATEGORIES.map(cat => {
                      const cfg = CATEGORY_CONFIG[cat];
                      const checked = activeCategories.includes(cat);
                      return (
                        <button key={cat} onClick={() => toggleCategory(cat)} className="flex items-center gap-2.5 w-full text-left group">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${checked ? `${cfg.dot} border-transparent` : 'border-gray-300 group-hover:border-indigo-400'}`}>
                            {checked && <Check size={10} className="text-white" strokeWidth={3} />}
                          </div>
                          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                          <span className="text-sm text-gray-700">{cat}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 shrink-0">
            {([['calendar', Calendar, 'Месяц'], ['week', CalendarDays, 'Неделя'], ['list', List, 'Список']] as const).map(([mode, Icon, label]) => (
              <button key={mode} onClick={() => setViewMode(mode as ViewMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === mode ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
          <span>Задач: <strong className="text-gray-800">{displayedTasks.length}</strong></span>
          {filterCount > 0 && (
            <button onClick={() => { setActiveCategories([...CATEGORIES]); }}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
              <X size={11} /> Сбросить фильтры
            </button>
          )}
        </div>

        {/* Views */}
        {viewMode === 'calendar' && (
          <div className="space-y-5">
            {(showAllMonths ? ACADEMIC_MONTHS : ACADEMIC_MONTHS.filter(m => selectedMonths.includes(m.index))).map(m => {
              const cy = getCalendarYear(m.index, academicYear);
              const mTasks = displayedTasks.filter(t => { const d = new Date(t.deadline); return d.getMonth() === m.index && d.getFullYear() === cy; });
              if (!showAllMonths && selectedMonths.length > 0) {
                return <MonthCalendar key={`${cy}-${m.index}`} month={m.index} year={cy} tasks={mTasks} onTaskClick={t => handleTaskClick(t)} />;
              }
              if (mTasks.length === 0) return null;
              return <MonthCalendar key={`${cy}-${m.index}`} month={m.index} year={cy} tasks={mTasks} onTaskClick={t => handleTaskClick(t)} />;
            })}
          </div>
        )}

        {viewMode === 'week' && (
          <WeekView
            tasks={displayedTasks}
            onTaskClick={t => handleTaskClick(t)}
            referenceDate={weekRef}
            onWeekChange={setWeekRef}
          />
        )}

        {viewMode === 'list' && (
          <div>
            {listGroups.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
                <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Задачи не найдены</p>
              </div>
            ) : (
              <div className="space-y-5">
                {listGroups.map(group => (
                  <div key={group.date}>
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span className="text-sm font-semibold text-gray-700 capitalize">{group.label}</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>
                    <div className="space-y-2">
                      {group.tasks.map(task => {
                        const cat = CATEGORY_CONFIG[task.category];
                        const today2 = new Date(); today2.setHours(0,0,0,0);
                        const dl = new Date(task.deadline); dl.setHours(0,0,0,0);
                        const diff = Math.ceil((dl.getTime() - today2.getTime()) / 86400000);
                        return (
                          <button key={task.id} onClick={() => handleTaskClick(task)}
                            className="w-full text-left rounded-xl border p-4 transition-all group bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm">
                            <div className="flex items-start gap-3">
                              <span className={`w-3 h-3 rounded-full ${cat.dot} shrink-0 mt-1`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-1.5">
                                  <span className="text-sm font-semibold leading-snug text-gray-800 group-hover:text-indigo-700 transition-colors">
                                    {task.title}
                                  </span>
                                </div>
                                <p className="text-xs leading-relaxed mb-2.5 line-clamp-1 text-gray-500">{task.description}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {/* Deadline */}
                                  <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg ${
                                    diff <= 3 ? 'bg-amber-100 text-amber-700' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    <span className="opacity-60">до</span> {formatDate(task.deadline)}
                                    {diff >= 0 && diff <= 3 && ` · ${diff === 0 ? 'сегодня' : `${diff} дн.`}`}
                                  </span>
                                  {/* Category */}
                                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg border ${cat.bg} ${cat.text} ${cat.border}`}>{task.category}</span>
                                  {/* Tags */}
                                  {task.tags.slice(0, 2).map(tag => (
                                    <span key={tag} className="text-[11px] px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500">{tag}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div className="w-60 shrink-0 border-l border-gray-100 px-4 py-6 space-y-4 hidden xl:block">
        <div className="bg-indigo-50 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info size={13} className="text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-700">Инструкция</span>
          </div>
          <ul className="space-y-2">
            {['Выберите месяц или период для просмотра', 'Используйте фильтры по категории', 'Нажмите на задачу для просмотра подробностей'].map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-indigo-200 text-indigo-700 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-[11px] text-indigo-700 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={13} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-700">Материалы ГИА</span>
          </div>
          <div className="space-y-2">
            {SIDEBAR_DOCS.map(doc => (
              <button key={doc} className="flex items-center gap-2 w-full text-left group">
                <FileText size={11} className="text-indigo-400 shrink-0" />
                <span className="text-[11px] text-gray-600 group-hover:text-indigo-600 transition-colors leading-snug">{doc}</span>
                <ExternalLink size={9} className="text-gray-300 group-hover:text-indigo-400 transition-colors ml-auto shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
