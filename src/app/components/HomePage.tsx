import React from 'react';
import { TrendingUp, AlertCircle, Clock, CheckCircle2, ArrowRight, CalendarDays, AlertTriangle, Repeat2 } from 'lucide-react';
import { ALL_TASKS, CATEGORY_CONFIG, STATUS_CONFIG, MONTH_NAMES_RU, getAcademicYearRange } from '../data/tasks';
import { AppNotification } from '../data/notifications';

interface Props {
  academicYear: string;
  notifications: AppNotification[];
  onNavigateTask: (id: string) => void;
  onNavigateTab: (tab: string) => void;
}

const NOTIF_CONFIG = {
  error:   { icon: AlertCircle,   bg: 'bg-red-50',    border: 'border-red-100',    text: 'text-red-600',    label: 'bg-red-100 text-red-700' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50',  border: 'border-amber-100',  text: 'text-amber-600',  label: 'bg-amber-100 text-amber-700' },
  info:    { icon: Clock,         bg: 'bg-blue-50',   border: 'border-blue-100',   text: 'text-blue-600',   label: 'bg-blue-100 text-blue-700' },
  success: { icon: CheckCircle2,  bg: 'bg-emerald-50',border: 'border-emerald-100',text: 'text-emerald-600',label: 'bg-emerald-100 text-emerald-700' },
  reminder:{ icon: Clock,         bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600', label: 'bg-indigo-100 text-indigo-700' },
} as const;

function formatDate(str: string) {
  const d = new Date(str);
  return `${d.getDate()} ${MONTH_NAMES_RU[d.getMonth()]}`;
}

export function HomePage({ academicYear, notifications, onNavigateTask, onNavigateTab }: Props) {
  const { start, end } = getAcademicYearRange(academicYear);
  const yearTasks = ALL_TASKS.filter(t => { const d = new Date(t.deadline); return d >= start && d <= end; });

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const in7Days = new Date(today); in7Days.setDate(in7Days.getDate() + 7);

  const overdue    = yearTasks.filter(t => t.status === 'Просрочена');
  const upcoming   = yearTasks.filter(t => { const d = new Date(t.deadline); d.setHours(0,0,0,0); return d >= today && d <= in7Days && t.status !== 'Выполнена'; });
  const completed  = yearTasks.filter(t => t.status === 'Выполнена');
  const inProgress = yearTasks.filter(t => t.status === 'В работе');
  const unread     = notifications.filter(n => !n.read);

  const completionPct = yearTasks.length ? Math.round((completed.length / yearTasks.length) * 100) : 0;

  const stats = [
    { label: 'Всего задач',  value: yearTasks.length, icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Выполнено',    value: completed.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'В работе',     value: inProgress.length,icon: Clock,        color: 'text-blue-600',    bg: 'bg-blue-50' },
    { label: 'Просрочено',   value: overdue.length,   icon: AlertCircle,  color: 'text-red-600',     bg: 'bg-red-50' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-7 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Repeat2 size={18} className="text-indigo-200" />
            <span className="text-indigo-200 text-sm font-medium">Учебный год {academicYear}</span>
          </div>
          <h1 className="text-2xl font-bold mb-1">Жизненный цикл программы</h1>
          <p className="text-indigo-200 text-sm mb-5 max-w-lg">Система управления образовательной программой — все задачи, документы и контакты в одном месте.</p>

          <div className="flex items-center gap-6">
            <div>
              <div className="text-3xl font-bold">{completionPct}%</div>
              <div className="text-indigo-200 text-xs mt-0.5">выполнено за год</div>
            </div>
            <div className="flex-1 max-w-xs">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${completionPct}%` }} />
              </div>
              <div className="flex justify-between mt-1 text-[11px] text-indigo-200">
                <span>{completed.length} завершено</span>
                <span>{yearTasks.length} всего</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon size={18} className={s.color} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming tasks */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock size={14} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-800">Ближайшие задачи</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">7 дней</span>
            </div>
            <button onClick={() => onNavigateTab('roadmap')} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Все <ArrowRight size={11} />
            </button>
          </div>

          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle2 size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">Ближайших задач нет</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.slice(0, 5).map(task => {
                const cat = CATEGORY_CONFIG[task.category];
                const sta = STATUS_CONFIG[task.status];
                const d = new Date(task.deadline); d.setHours(0,0,0,0);
                const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
                return (
                  <button key={task.id} onClick={() => onNavigateTask(task.id)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.dot}`} />
                    <span className="text-sm text-gray-700 group-hover:text-blue-700 transition-colors flex-1 truncate">{task.title}</span>
                    <span className={`text-[11px] font-semibold shrink-0 ${diff === 0 ? 'text-red-600' : diff <= 3 ? 'text-amber-600' : 'text-gray-400'}`}>
                      {diff === 0 ? 'сегодня' : `${diff} дн.`}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Overdue tasks */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle size={14} className="text-red-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-800">Просроченные задачи</h2>
              {overdue.length > 0 && (
                <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">{overdue.length}</span>
              )}
            </div>
            <button onClick={() => onNavigateTab('roadmap')} className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              Перейти <ArrowRight size={11} />
            </button>
          </div>

          {overdue.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle2 size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs">Просроченных задач нет</p>
            </div>
          ) : (
            <div className="space-y-2">
              {overdue.slice(0, 5).map(task => {
                const d = new Date(task.deadline); d.setHours(0,0,0,0);
                const diff = Math.ceil((today.getTime() - d.getTime()) / 86400000);
                return (
                  <button key={task.id} onClick={() => onNavigateTask(task.id)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100 hover:border-red-300 hover:bg-red-100 transition-all group">
                    <AlertCircle size={14} className="text-red-500 shrink-0" />
                    <span className="text-sm text-red-800 group-hover:text-red-900 transition-colors flex-1 truncate font-medium">{task.title}</span>
                    <span className="text-[11px] font-semibold text-red-600 shrink-0">−{diff} дн.</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      {unread.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle size={14} className="text-amber-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">Требуют внимания</h2>
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{unread.length}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {unread.slice(0, 6).map(n => {
              const cfg = NOTIF_CONFIG[n.type];
              const Icon = cfg.icon;
              return (
                <div key={n.id} className={`flex items-start gap-2.5 p-3 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                  <Icon size={14} className={`${cfg.text} shrink-0 mt-0.5`} />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-gray-800 truncate">{n.title}</div>
                    <div className="text-[11px] text-gray-500 leading-relaxed mt-0.5 line-clamp-2">{n.body}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
