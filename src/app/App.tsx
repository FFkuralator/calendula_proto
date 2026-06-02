import React, { useState, useRef, useEffect } from 'react';
import { Repeat2, Search, X, ChevronDown, Home, Map, BookOpen, Award, ChevronRight } from 'lucide-react';
import { RoadmapPage } from './components/RoadmapPage';
import { TaskDetailPage } from './components/TaskDetailPage';
import { Footer } from './components/Footer';
import { ACADEMIC_YEARS, ALL_TASKS } from './data/tasks';
import { KNOWLEDGE_ARTICLES } from './data/knowledge';

/* MARKER-MAKE-KIT-INVOKED */

type PageView =
  | { tab: 'roadmap' }
  | { tab: 'roadmap'; taskId: string };

function getBreadcrumbs(view: PageView, extras?: { taskTitle?: string }): { label: string; clickable: boolean }[] {
  const crumbs: { label: string; clickable: boolean }[] = [
    { label: 'Жизненный цикл программы', clickable: true },
  ];
  if ('taskId' in view) {
    crumbs.push({ label: 'Дорожная карта', clickable: true });
    if (extras?.taskTitle) crumbs.push({ label: extras.taskTitle, clickable: false });
  } else {
    crumbs.push({ label: 'Дорожная карта', clickable: false });
  }
  return crumbs;
}

export default function App() {
  const [view, setView] = useState<PageView>({ tab: 'roadmap' });
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (searchOpen) searchRef.current?.focus(); }, [searchOpen]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) setYearOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const navigateToTask = (taskId: string) => {
    setView({ tab: 'roadmap', taskId });
  };
  const taskTitle = 'taskId' in view
    ? ALL_TASKS.find(t => t.id === view.taskId)?.title
    : undefined;

  const crumbs = getBreadcrumbs(view, { taskTitle });

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(''); };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="flex items-center h-14 px-5 gap-4">
          {/* Logo */}
          <button onClick={() => setView({ tab: 'home' })} className="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-300">
              <Repeat2 size={18} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900 hidden lg:block leading-tight">
              Жизненный цикл<br/><span className="text-gray-500 font-normal">программы</span>
            </span>
          </button>

          {/* Nav */}
          <nav className="flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'home', label: 'Главная', icon: Home },
              { id: 'roadmap', label: 'Дорожная карта', icon: Map },
              { id: 'knowledge', label: 'База знаний', icon: BookOpen },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = tab.id === 'roadmap';
              return (
                <button key={tab.id} disabled
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-not-allowed ${
                    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-400 opacity-50'
                  }`}>
                  <Icon size={15} />
                  <span className="hidden md:block">{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3.5 py-2">
                <Search size={14} className="text-gray-400 shrink-0" />
                <input ref={searchRef} type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Поиск задач..." className="bg-transparent border-none outline-none text-sm text-gray-800 w-48 placeholder:text-gray-400" />
                <button onClick={closeSearch} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={14} /></button>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)} title="Поиск"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
                <Search size={17} />
              </button>
            )}

            {/* Year selector */}
            <div className="relative" ref={yearRef}>
              <button onClick={() => setYearOpen(v => !v)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors">
                {academicYear}
                <ChevronDown size={13} className={`transition-transform ${yearOpen ? 'rotate-180' : ''}`} />
              </button>
              {yearOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-30">
                  {ACADEMIC_YEARS.map(yr => (
                    <button key={yr} onClick={() => { setAcademicYear(yr); setYearOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between ${yr === academicYear ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                      {yr}
                      {yr === academicYear && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="px-5 py-2 border-t border-gray-50 flex items-center gap-1.5 bg-gray-50/50">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight size={12} className="text-gray-300" />}
              {c.clickable && i === 0 ? (
                <button onClick={() => setView({ tab: 'roadmap' })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                  {c.label}
                </button>
              ) : c.clickable ? (
                <button onClick={() => setView({ tab: 'roadmap' })} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                  {c.label}
                </button>
              ) : (
                <span className="text-xs text-gray-500 truncate max-w-[200px]">{c.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-auto">
        {'taskId' in view ? (
          (() => {
            const task = ALL_TASKS.find(t => t.id === view.taskId);
            return task ? (
              <TaskDetailPage
                task={task}
                onBack={() => setView({ tab: 'roadmap' })}
              />
            ) : null;
          })()
        ) : (
          <RoadmapPage searchQuery={searchQuery} academicYear={academicYear} onNavigateTask={navigateToTask} />
        )}
      </main>

      <Footer />
    </div>
  );
}
