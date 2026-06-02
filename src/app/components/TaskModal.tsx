import { X, Calendar, Tag, User, Clock } from 'lucide-react';
import { Task, CATEGORY_CONFIG, STATUS_CONFIG, MONTH_NAMES_RU } from '../data/tasks';

interface Props {
  task: Task | null;
  onClose: () => void;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}

export function TaskModal({ task, onClose }: Props) {
  if (!task) return null;

  const cat = CATEGORY_CONFIG[task.category];
  const sta = STATUS_CONFIG[task.status];
  const deadline = new Date(task.deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header stripe */}
        <div className={`h-1.5 w-full ${cat.dot}`} />

        <div className="p-6">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cat.bg} ${cat.text} ${cat.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                {task.category}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sta.bg} ${sta.text} ${sta.border}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sta.dot}`} />
                {task.status}
              </span>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">{task.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">{task.description}</p>

          <div className="space-y-3 border-t border-gray-100 pt-4">
            {/* Deadline */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                <Calendar size={14} className="text-gray-500" />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-0.5">Дедлайн</div>
                <div className="text-sm font-medium text-gray-800">
                  {formatDate(task.deadline)}
                  {task.status !== 'Выполнена' && (
                    <span className={`ml-2 text-xs ${diffDays < 0 ? 'text-red-500' : diffDays <= 7 ? 'text-amber-500' : 'text-gray-400'}`}>
                      {diffDays < 0 ? `просрочено на ${Math.abs(diffDays)} д.` : diffDays === 0 ? 'сегодня' : `через ${diffDays} д.`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Responsible */}
            {task.responsible && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <User size={14} className="text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-0.5">Ответственный</div>
                  <div className="text-sm font-medium text-gray-800">{task.responsible}</div>
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  <Tag size={14} className="text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1.5">Теги</div>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
