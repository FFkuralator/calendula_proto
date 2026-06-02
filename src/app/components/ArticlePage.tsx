import React, { useState } from 'react';
import { ArrowLeft, Clock, Star, Mail, Phone, FileText, ChevronRight, BookOpen } from 'lucide-react';
import { KnowledgeArticle, KNOWLEDGE_ARTICLES } from '../data/knowledge';
import { CONTACTS } from '../data/contacts';
import { ALL_TASKS, CATEGORY_CONFIG, STATUS_CONFIG, MONTH_NAMES_RU } from '../data/tasks';

interface Props {
  article: KnowledgeArticle;
  onBack: () => void;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onNavigateTask: (id: string) => void;
  onNavigateArticle: (id: string) => void;
}

const CAT_COLOR: Record<string, string> = {
  indigo:  'bg-indigo-50 border-indigo-200 text-indigo-700',
  sky:     'bg-sky-50 border-sky-200 text-sky-700',
  emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  teal:    'bg-teal-50 border-teal-200 text-teal-700',
};

function formatDate(str: string) {
  const d = new Date(str);
  return `${d.getDate()} ${MONTH_NAMES_RU[d.getMonth()]} ${d.getFullYear()}`;
}

export function ArticlePage({ article, onBack, favorites, onToggleFavorite, onNavigateTask, onNavigateArticle }: Props) {
  const isFav = favorites.has(article.id);
  const Icon = article.icon;

  const contacts = article.contactIds.map(id => CONTACTS.find(c => c.id === id)).filter(Boolean);
  const relatedTasks = article.relatedTaskIds.map(id => ALL_TASKS.find(t => t.id === id)).filter(Boolean);
  const relatedArticles = KNOWLEDGE_ARTICLES.filter(a => article.relatedDocIds.includes(a.id) && a.id !== article.id).slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group">
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        Вернуться в базу знаний
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${CAT_COLOR[article.color] || CAT_COLOR.indigo}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${CAT_COLOR[article.color] || CAT_COLOR.indigo}`}>
                    {article.category}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={11} className="text-gray-400" />
                    <span className="text-[11px] text-gray-400">{article.readTime} чтения</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-[11px] text-gray-400">Обновлён {article.updated}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onToggleFavorite(article.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isFav
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-500'
                }`}
              >
                <Star size={13} className={isFav ? 'fill-amber-400 text-amber-400' : ''} />
                {isFav ? 'В избранном' : 'В избранное'}
              </button>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-3">{article.title}</h1>
            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-3 leading-relaxed border border-gray-100">
              <span className="font-medium text-gray-700">Кратко: </span>
              {article.summary}
            </p>
          </div>

          {/* Steps */}
          {article.steps.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Порядок действий</h2>
              <div className="space-y-5">
                {article.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {i + 1}
                      </div>
                      {i < article.steps.length - 1 && (
                        <div className="w-px flex-1 bg-indigo-100 mt-2 mb-0 min-h-[20px]" />
                      )}
                    </div>
                    <div className="pb-5 flex-1">
                      <h3 className="text-sm font-semibold text-gray-800 mb-1.5">{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related tasks */}
          {relatedTasks.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Связанные задачи</h2>
              <div className="space-y-2">
                {relatedTasks.map(t => t && (
                  <button
                    key={t.id}
                    onClick={() => onNavigateTask(t.id)}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${CATEGORY_CONFIG[t.category].dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 group-hover:text-indigo-700 transition-colors truncate">{t.title}</div>
                      <div className="text-xs text-gray-400">
                        {t.category} · до {formatDate(t.deadline)}
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_CONFIG[t.status].bg} ${STATUS_CONFIG[t.status].text} ${STATUS_CONFIG[t.status].border}`}>
                      {t.status}
                    </span>
                    <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Contacts */}
          {contacts.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">Контакты по теме</h2>
              <div className="space-y-4">
                {contacts.map(c => c && (
                  <div key={c.id}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-9 h-9 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {c.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800 leading-tight">{c.name}</div>
                        <div className="text-[11px] text-gray-500">{c.position}</div>
                      </div>
                    </div>
                    <div className="pl-11 space-y-1">
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

          {/* Related materials */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-3">Связанные материалы</h2>
              <div className="space-y-2">
                {relatedArticles.map(a => (
                  <button
                    key={a.id}
                    onClick={() => onNavigateArticle(a.id)}
                    className="w-full text-left flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <FileText size={14} className="text-gray-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                    <span className="text-xs text-gray-700 group-hover:text-indigo-700 transition-colors leading-snug flex-1">{a.title}</span>
                    <ChevronRight size={12} className="text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section badge */}
          <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
            <div className="text-xs font-semibold text-indigo-700 mb-1">Раздел базы знаний</div>
            <div className="text-sm font-medium text-indigo-900">{article.section}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
