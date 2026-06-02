import React from 'react';
import { X, CheckCircle2, AlertTriangle, Info, AlertCircle, Bell, Clock } from 'lucide-react';
import { AppNotification, NotificationType } from '../data/notifications';

interface Props {
  notifications: AppNotification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateTask?: (taskId: string) => void;
}

const TYPE_CONFIG: Record<NotificationType, { icon: any; iconColor: string; bg: string; border: string }> = {
  error:    { icon: AlertCircle,  iconColor: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-100' },
  warning:  { icon: AlertTriangle,iconColor: 'text-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-100' },
  info:     { icon: Info,          iconColor: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  success:  { icon: CheckCircle2, iconColor: 'text-emerald-500',bg: 'bg-emerald-50',border: 'border-emerald-100' },
  reminder: { icon: Clock,        iconColor: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
};

export function NotificationPanel({ notifications, onClose, onMarkRead, onMarkAllRead, onNavigateTask }: Props) {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/80 z-50 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Bell size={16} className="text-gray-600" />
          <span className="text-sm font-semibold text-gray-900">Уведомления</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 bg-indigo-600 text-white rounded-full text-[10px] font-bold">{unreadCount}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
              Прочитать все
            </button>
          )}
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <Bell size={32} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400">Нет уведомлений</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map(n => {
              const cfg = TYPE_CONFIG[n.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  className={`px-5 py-3.5 flex gap-3 transition-colors cursor-pointer ${n.read ? 'opacity-60 hover:opacity-80' : 'hover:bg-gray-50'}`}
                  onClick={() => {
                    onMarkRead(n.id);
                    if (n.taskId && onNavigateTask) onNavigateTask(n.taskId);
                  }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg} border ${cfg.border}`}>
                    <Icon size={14} className={cfg.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900 leading-tight">{n.title}</span>
                      {!n.read && <span className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                    <span className="text-[11px] text-gray-400 mt-1 block">{n.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
