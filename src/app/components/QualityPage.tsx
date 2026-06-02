import React from 'react';
import { TrendingUp, Users, Award, CheckCircle2, AlertCircle, Clock, BarChart2, Target, Star, FileText, Download, ArrowRight, ShieldCheck, Workflow } from 'lucide-react';

interface Metric { label: string; value: string; sub: string; icon: any; color: string; bgColor: string }

const METRICS: Metric[] = [
  { label: 'Успеваемость',    value: '87%', sub: '+2.4% к прошлому году',   icon: TrendingUp, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  { label: 'Трудоустройство', value: '94%', sub: 'Выпускников 2024–2025',   icon: Users,      color: 'text-emerald-600',bgColor: 'bg-emerald-50' },
  { label: 'Средний балл ВКР',value: '4.6', sub: 'По итогам защит',         icon: Award,      color: 'text-amber-600',  bgColor: 'bg-amber-50' },
  { label: 'Выполнение плана',value: '73%', sub: 'Задач завершено',          icon: Target,     color: 'text-sky-600',    bgColor: 'bg-sky-50' },
];

const AUDITS = [
  { name: 'Проверка учебного плана на соответствие ФГОС',   result: 'Соответствует',         date: '15.10.2025', status: 'ok' },
  { name: 'Анализ РПД на актуальность содержания',          result: 'Замечания устранены',    date: '05.11.2025', status: 'ok' },
  { name: 'Мониторинг удовлетворённости студентов',         result: '4.2 / 5.0',             date: '30.11.2025', status: 'ok' },
  { name: 'Внутренний аудит качества ОП',                   result: 'Просрочен',             date: '28.11.2025', status: 'overdue' },
  { name: 'Проверка условий реализации программы',          result: 'Запланирован',           date: '01.02.2026', status: 'pending' },
  { name: 'Самообследование ОП',                            result: 'Запланирован',           date: '18.04.2026', status: 'pending' },
];

const QUALITY_PROCESS = [
  { step: 1, title: 'Планирование качества', desc: 'Определение целевых показателей качества ОП и разработка плана мероприятий по их достижению', icon: Target, color: 'indigo' },
  { step: 2, title: 'Сбор данных', desc: 'Мониторинг успеваемости, трудоустройства, удовлетворённости студентов и работодателей', icon: BarChart2, color: 'sky' },
  { step: 3, title: 'Анализ и оценка', desc: 'Сопоставление фактических показателей с плановыми, выявление отклонений и причин', icon: TrendingUp, color: 'emerald' },
  { step: 4, title: 'Аудит и верификация', desc: 'Внутренние аудиты, проверки соответствия требованиям ФГОС и аккредитационным показателям', icon: ShieldCheck, color: 'amber' },
  { step: 5, title: 'Улучшение', desc: 'Разработка и реализация корректирующих мер, актуализация программы на основе результатов анализа', icon: Workflow, color: 'violet' },
];

const QUALITY_DOCS = [
  { title: 'Политика в области качества ОП', type: 'PDF', updated: '01.09.2025' },
  { title: 'Матрица компетенций и критерии оценки', type: 'XLSX', updated: '01.09.2025' },
  { title: 'Отчёт по самообследованию 2024–2025', type: 'PDF', updated: '30.06.2025' },
  { title: 'Протоколы заседаний методкомиссии', type: 'ZIP', updated: '15.11.2025' },
  { title: 'Результаты анкетирования студентов', type: 'PDF', updated: '30.11.2025' },
  { title: 'План мероприятий по улучшению качества', type: 'DOCX', updated: '05.09.2025' },
];

const COMPETENCIES = [
  { name: 'Общепрофессиональные компетенции', covered: 95 },
  { name: 'Профессиональные компетенции', covered: 88 },
  { name: 'Универсальные компетенции', covered: 100 },
  { name: 'Цифровые компетенции', covered: 82 },
];

const PROCESS_COLOR: Record<string, string> = {
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  sky:    'bg-sky-100 text-sky-700 border-sky-200',
  emerald:'bg-emerald-100 text-emerald-700 border-emerald-200',
  amber:  'bg-amber-100 text-amber-700 border-amber-200',
  violet: 'bg-violet-100 text-violet-700 border-violet-200',
};
const PROCESS_DOT: Record<string, string> = {
  indigo: 'bg-indigo-500', sky: 'bg-sky-500', emerald: 'bg-emerald-500', amber: 'bg-amber-500', violet: 'bg-violet-500',
};

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex justify-center gap-0.5 mb-1">
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={16}
          className={s <= Math.round(score) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${value >= 90 ? 'bg-emerald-500' : value >= 75 ? 'bg-amber-400' : 'bg-rose-400'}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function QualityPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Качество программы</h1>
        <p className="text-sm text-gray-500">Мониторинг показателей качества образовательной программы</p>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {METRICS.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${m.bgColor} flex items-center justify-center mb-3`}>
                <Icon size={18} className={m.color} />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-0.5">{m.value}</div>
              <div className="text-xs font-semibold text-gray-700 mb-0.5">{m.label}</div>
              <div className="text-[11px] text-gray-400">{m.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Quality Control Process */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <Workflow size={16} className="text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Процесс контроля качества</h2>
        </div>
        <div className="relative">
          {/* Connector line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100 hidden sm:block" style={{ top: '20px' }} />
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {QUALITY_PROCESS.map((step, i) => {
              const Icon = step.icon;
              const cls = PROCESS_COLOR[step.color];
              const dot = PROCESS_DOT[step.color];
              return (
                <div key={step.step} className="flex flex-col items-center text-center relative">
                  <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center mb-3 relative z-10 bg-white ${cls}`}>
                    <Icon size={16} />
                  </div>
                  <div className="text-xs font-semibold text-gray-800 mb-1.5 leading-tight">{step.title}</div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{step.desc}</p>
                  {i < QUALITY_PROCESS.length - 1 && (
                    <div className="hidden sm:flex absolute top-5 left-full items-center justify-center w-4 z-20 -ml-2">
                      <ArrowRight size={10} className="text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Audits */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-800">Аудиты и проверки</h2>
          </div>
          <div className="space-y-3">
            {AUDITS.map((a, i) => {
              const statusCls = a.status === 'ok' ? 'bg-emerald-100 text-emerald-700' : a.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600';
              const Icon = a.status === 'ok' ? CheckCircle2 : a.status === 'overdue' ? AlertCircle : Clock;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${statusCls}`}>
                    <Icon size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-700 font-medium leading-snug mb-0.5 truncate" title={a.name}>{a.name}</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${statusCls}`}>{a.result}</span>
                      <span className="text-[11px] text-gray-400">{a.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Competency coverage */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={15} className="text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-800">Покрытие компетенций ФГОС</h2>
          </div>
          <div className="space-y-4">
            {COMPETENCIES.map(c => (
              <div key={c.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-700 font-medium">{c.name}</span>
                  <span className={`text-xs font-bold ${c.covered >= 90 ? 'text-emerald-600' : c.covered >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>{c.covered}%</span>
                </div>
                <ProgressBar value={c.covered} />
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-500 mb-2">Статус аккредитации</div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span className="text-sm font-semibold text-gray-800">Аккредитована</span>
              <span className="text-xs text-gray-400 ml-auto">до 01.09.2028</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quality documents */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Документы качества</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUALITY_DOCS.map(doc => (
            <div key={doc.title} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer group">
              <div className="w-9 h-9 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <FileText size={14} className="text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700 transition-colors leading-snug mb-0.5 line-clamp-2">{doc.title}</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1 py-0.5 rounded">{doc.type}</span>
                  <span className="text-[10px] text-gray-400">{doc.updated}</span>
                </div>
              </div>
              <Download size={13} className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Graduate feedback with stars */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-5">
          <Users size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Обратная связь выпускников 2024–2025</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {[
            { label: 'Качество преподавания', score: 4.5 },
            { label: 'Актуальность содержания', score: 4.2 },
            { label: 'Практическая направленность', score: 4.4 },
            { label: 'Организация учебного процесса', score: 4.0 },
          ].map(item => (
            <div key={item.label} className="text-center bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{item.score.toFixed(1)}</div>
              <StarRating score={item.score} />
              <div className="text-[11px] text-gray-500 leading-tight mt-1.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
