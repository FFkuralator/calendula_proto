import React, { useState } from 'react';
import { Search, FileText, Star, BookOpen } from 'lucide-react';
import { KNOWLEDGE_ARTICLES, KNOWLEDGE_SECTIONS, KNOWLEDGE_CATEGORIES, KnowledgeArticle } from '../data/knowledge';

interface Props {
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenArticle: (id: string) => void;
}

const COLOR_MAP: Record<string, string> = {
  indigo:  'bg-indigo-50 text-indigo-600 border-indigo-100',
  sky:     'bg-sky-50 text-sky-600 border-sky-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  teal:    'bg-teal-50 text-teal-600 border-teal-100',
};

const CAT_COLOR: Record<string, string> = {
  'ГИА':          'bg-indigo-100 text-indigo-700',
  'Методология':  'bg-sky-100 text-sky-700',
  'Аккредитация': 'bg-emerald-100 text-emerald-700',
  'Практика':     'bg-teal-100 text-teal-700',
};

const SECTION_ICON: Record<string, string> = {
  'Помощь для РОПа':      '🛟',
  'Возможности для РОПа': '✨',
  'Вводный курс':         '🎓',
  'Частые вопросы':       '❓',
};

type Filter = 'Все' | string;

export function KnowledgePage({ favorites, onToggleFavorite, onOpenArticle }: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Filter>('Все');
  const [activeSection, setActiveSection] = useState<Filter>('Все');
  const [showFavorites, setShowFavorites] = useState(false);

  const filtered = KNOWLEDGE_ARTICLES.filter(d => {
    const matchCat = activeCategory === 'Все' || d.category === activeCategory;
    const matchSec = activeSection === 'Все' || d.section === activeSection;
    const matchFav = !showFavorites || favorites.has(d.id);
    const matchQ = !query || d.title.toLowerCase().includes(query.toLowerCase()) || d.description.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchSec && matchFav && matchQ;
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">База знаний</h1>
        <p className="text-sm text-gray-500">Документы, шаблоны и регламенты для работы с образовательной программой</p>
      </div>

      {/* Search + favorites */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по документам..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFavorites(v => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
            showFavorites
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600'
          }`}
        >
          <Star size={14} className={showFavorites ? 'fill-amber-400 text-amber-400' : ''} />
          Избранное
          {favorites.size > 0 && (
            <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${showFavorites ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {favorites.size}
            </span>
          )}
        </button>
      </div>

      {/* Section filter */}
      <div className="mb-4">
        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Разделы</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSection('Все')}
            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === 'Все' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
          >
            Все разделы
          </button>
          {KNOWLEDGE_SECTIONS.map(sec => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                activeSection === sec
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
              }`}
            >
              <span>{SECTION_ICON[sec]}</span>
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveCategory('Все')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === 'Все' ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}
        >
          Все категории
        </button>
        {KNOWLEDGE_CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === cat ? 'bg-gray-700 text-white' : `${CAT_COLOR[cat]} border border-transparent hover:opacity-80`}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookOpen size={44} className="mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium mb-1">Документы не найдены</p>
          <p className="text-xs text-gray-400">Попробуйте изменить запрос или фильтры</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(doc => {
            const Icon = doc.icon;
            const iconCls = COLOR_MAP[doc.color] || COLOR_MAP.indigo;
            const isFav = favorites.has(doc.id);
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-lg hover:shadow-gray-100 hover:border-gray-300 transition-all group cursor-pointer flex flex-col"
                onClick={() => onOpenArticle(doc.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${iconCls}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={e => { e.stopPropagation(); onToggleFavorite(doc.id); }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isFav ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'}`}
                      title={isFav ? 'Убрать из избранного' : 'Добавить в избранное'}
                    >
                      <Star size={14} className={isFav ? 'fill-amber-400' : ''} />
                    </button>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{doc.type}</span>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-800 mb-1.5 leading-snug group-hover:text-indigo-700 transition-colors flex-1">{doc.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{doc.description}</p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${CAT_COLOR[doc.category]}`}>{doc.category}</span>
                    <span className="text-[10px] text-gray-400">{doc.readTime}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">Обновлён {doc.updated}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
