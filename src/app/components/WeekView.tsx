import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task, CATEGORY_CONFIG, MONTH_NAMES_RU } from '../data/tasks';

interface Props {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  referenceDate: Date;
  onWeekChange: (date: Date) => void;
}

const DAY_NAMES_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
const DAY_NAMES_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getMondayOf(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
}

function formatWeekRange(monday: Date): string {
  const sunday = addDays(monday, 6);
  const sameMonth = monday.getMonth() === sunday.getMonth();
  if (sameMonth) {
    return `${monday.getDate()}–${sunday.getDate()} ${MONTH_NAMES_RU[monday.getMonth()]} ${monday.getFullYear()}`;
  }
  return `${monday.getDate()} ${MONTH_NAMES_RU[monday.getMonth()]} – ${sunday.getDate()} ${MONTH_NAMES_RU[sunday.getMonth()]} ${sunday.getFullYear()}`;
}

export function WeekView({ tasks, onTaskClick, referenceDate, onWeekChange }: Props) {
  const monday = getMondayOf(referenceDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  const goPrev = () => onWeekChange(addDays(monday, -7));
  const goNext = () => onWeekChange(addDays(monday, 7));
  const goToday = () => onWeekChange(new Date());

  const getTasksForDay = (day: Date) =>
    tasks.filter(t => {
      const d = new Date(t.deadline);
      d.setHours(0, 0, 0, 0);
      return isSameDay(d, day);
    });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Week navigation */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
        <div className="flex items-center gap-2">
          <button onClick={goPrev} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-gray-800 min-w-[200px] text-center">{formatWeekRange(monday)}</span>
          <button onClick={goNext} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
        <button onClick={goToday} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
          Сегодня
        </button>
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7">
        {/* Headers */}
        {weekDays.map((day, i) => {
          const isToday = isSameDay(day, today);
          const isWeekend = i >= 5;
          return (
            <div
              key={i}
              className={`py-3 px-2 text-center border-b border-gray-100 ${i < 6 ? 'border-r border-gray-100' : ''} ${isToday ? 'bg-indigo-50' : isWeekend ? 'bg-rose-50/30' : ''}`}
            >
              <div className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${isWeekend ? 'text-rose-400' : 'text-gray-400'}`}>
                {DAY_NAMES_SHORT[i]}
              </div>
              <div className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-bold ${
                isToday ? 'bg-indigo-600 text-white' : isWeekend ? 'text-rose-500' : 'text-gray-700'
              }`}>
                {day.getDate()}
              </div>
            </div>
          );
        })}

        {/* Task cells */}
        {weekDays.map((day, i) => {
          const dayTasks = getTasksForDay(day);
          const isToday = isSameDay(day, today);
          const isWeekend = i >= 5;
          return (
            <div
              key={i}
              className={`min-h-[300px] p-1.5 ${i < 6 ? 'border-r border-gray-100' : ''} ${isToday ? 'bg-indigo-50/30' : isWeekend ? 'bg-rose-50/10' : ''}`}
            >
              {dayTasks.length === 0 ? (
                <div className="h-full flex items-start justify-center pt-8">
                  <span className="text-[10px] text-gray-200">—</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {dayTasks.map(task => {
                    const cat = CATEGORY_CONFIG[task.category];
                    return (
                      <button
                        key={task.id}
                        onClick={() => onTaskClick(task)}
                        className={`w-full text-left rounded-xl px-2 py-2 text-[11px] leading-snug transition-all hover:opacity-90 hover:shadow-sm group border ${cat.bg} ${cat.border} ${cat.text}`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cat.dot}`} />
                          <span className={`text-[9px] font-semibold uppercase tracking-wide ${cat.text} opacity-70`}>
                            {task.category}
                          </span>
                        </div>
                        <span className="font-semibold block leading-tight">{task.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="border-t border-gray-100 px-5 py-2.5 bg-gray-50/50 flex items-center gap-4">
        {weekDays.map((day, i) => {
          const count = getTasksForDay(day).length;
          if (!count) return null;
          return (
            <span key={i} className="text-xs text-gray-500">
              <strong className="text-gray-700">{DAY_NAMES_SHORT[i]}</strong>: {count} {count === 1 ? 'задача' : 'задачи'}
            </span>
          );
        })}
        {weekDays.every(day => getTasksForDay(day).length === 0) && (
          <span className="text-xs text-gray-400">На этой неделе задач нет</span>
        )}
      </div>
    </div>
  );
}
