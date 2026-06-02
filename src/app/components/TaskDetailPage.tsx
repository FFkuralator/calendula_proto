import React from 'react';
import { ArrowLeft, Calendar, User, FileText, BookOpen, Mail, Phone, Target, ClipboardList } from 'lucide-react';
import { Task, CATEGORY_CONFIG, MONTH_NAMES_RU } from '../data/tasks';
import { CONTACTS } from '../data/contacts';
import { KNOWLEDGE_ARTICLES } from '../data/knowledge';

interface Props {
  task: Task;
  onBack: () => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTH_NAMES_RU[d.getMonth()]} ${d.getFullYear()}`;
}

const DOCS = [
  { id: 'doc-gek-form', label: 'Форма состава ГЭК', type: 'DOCX' },
  { id: 'doc-letter',   label: 'Письмо ректору',     type: 'DOCX' },
  { id: 'doc-reg',      label: 'Регламент ГИА',      type: 'PDF' },
];

export function TaskDetailPage({ task, onBack }: Props) {
  const cat = CATEGORY_CONFIG[task.category];
  const deadline = new Date(task.deadline);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const contacts = (task.contactIds ?? []).map(id => CONTACTS.find(c => c.id === id)).filter(Boolean);
  const docs = (task.documentIds ?? []).map(id => DOCS.find(d => d.id === id)).filter(Boolean);
  const articles = (task.relatedArticleIds ?? []).map(id => KNOWLEDGE_ARTICLES.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back + breadcrumb */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Вернуться к дорожной карте
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cat.bg} ${cat.text} ${cat.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                {task.category}
              </span>
              {task.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{tag}</span>
              ))}
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-3 leading-snug">{task.title}</h1>
            <p className="text-sm text-gray-600 leading-relaxed">{task.description}</p>
          </div>

          {/* Goal */}
          {task.goal && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Target size={14} className="text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-800">Цель задачи</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-9">{task.goal}</p>
            </div>
          )}

          {/* Criteria */}
          {task.criteria && task.criteria.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <ClipboardList size={14} className="text-emerald-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-800">Критерии выполнения</h2>
              </div>
              <div className="space-y-2.5">
                {task.criteria.map((c, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
                    <span className="text-sm leading-relaxed text-gray-700">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {(docs.length > 0 || articles.length > 0) && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-sky-100 rounded-lg flex items-center justify-center">
                  <FileText size={14} className="text-sky-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-800">Документы и материалы</h2>
              </div>
              <div className="space-y-2">
                {docs.map(d => d && (
                  <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-sky-200 hover:bg-sky-50 transition-all cursor-pointer">
                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-sky-600" />
                    </div>
                    <span className="text-sm text-gray-700 flex-1">{d.label}</span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{d.type}</span>
                  </div>
                ))}
                {articles.map(a => a && (
                  <div key={a.id} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen size={14} className="text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-700">{a.title}</div>
                      <div className="text-[10px] text-gray-400">{a.category}</div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{a.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: sidebar */}
        <div className="space-y-4">
          {/* Deadline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Дедлайн</div>
            <div className="flex items-center gap-2.5 mb-2">
              <Calendar size={16} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-800">{formatDate(task.deadline)}</span>
            </div>
            <div className={`text-xs font-medium px-2.5 py-1.5 rounded-lg inline-block ${
              diffDays < 0 ? 'bg-red-100 text-red-700' :
              diffDays <= 7 ? 'bg-amber-100 text-amber-700' :
              diffDays <= 30 ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {diffDays < 0 ? `Просрочено на ${Math.abs(diffDays)} дн.` :
               diffDays === 0 ? 'Срок истекает сегодня' :
               `Осталось ${diffDays} дн.`}
            </div>
          </div>

          {/* Responsible contacts */}
          {contacts.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Ответственные</div>
              <div className="space-y-3.5">
                {contacts.map(c => c && (
                  <div key={c.id}>
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {c.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800 leading-tight">{c.name}</div>
                        <div className="text-[11px] text-gray-500">{c.position}</div>
                      </div>
                    </div>
                    <div className="pl-10 space-y-1">
                      <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                        <Mail size={11} />{c.email}
                      </a>
                      {c.phone && (
                        <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                          <Phone size={11} />{c.phone}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
