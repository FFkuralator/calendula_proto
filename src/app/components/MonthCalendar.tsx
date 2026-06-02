import { Task, CATEGORY_CONFIG, MONTH_NAMES_RU } from '../data/tasks';

interface Props {
  month: number; // 0-11
  year: number;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function buildCalendarDays(year: number, month: number): (number | null)[] {
  const first = new Date(year, month, 1);
  let dow = first.getDay(); // 0=Sun
  if (dow === 0) dow = 7;
  const startOffset = dow - 1; // Mon=0

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];

  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

export function MonthCalendar({ month, year, tasks, onTaskClick }: Props) {
  const cells = buildCalendarDays(year, month);
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const today = new Date();
  const todayDay = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const getTasksForDay = (day: number) =>
    tasks.filter(t => {
      const d = new Date(t.deadline);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Month/Year header */}
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
        <span className="text-sm font-semibold text-gray-700">
          {MONTH_NAMES_RU[month]} {year}
        </span>
      </div>

      {/* Day name headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`py-2.5 text-center text-xs font-semibold tracking-wide uppercase ${
              i >= 5 ? 'text-rose-400' : 'text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div>
        {weeks.map((week, wi) => (
          <div key={wi} className={`grid grid-cols-7 ${wi < weeks.length - 1 ? 'border-b border-gray-100' : ''}`}>
            {week.map((day, di) => {
              const isWeekend = di >= 5;
              const isToday = day !== null && day === todayDay && month === todayMonth && year === todayYear;
              const dayTasks = day ? getTasksForDay(day) : [];

              return (
                <div
                  key={di}
                  className={`min-h-[100px] p-2 ${di < 6 ? 'border-r border-gray-100' : ''} ${
                    !day ? 'bg-gray-50/40' : isWeekend ? 'bg-rose-50/20' : 'bg-white'
                  } ${isToday ? 'ring-1 ring-inset ring-indigo-300 bg-indigo-50/30' : ''}`}
                >
                  {day && (
                    <>
                      {/* Date number */}
                      <div className="flex items-center justify-end mb-1.5">
                        <span
                          className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                            isToday
                              ? 'bg-indigo-600 text-white'
                              : isWeekend
                              ? 'text-rose-400'
                              : 'text-gray-600'
                          }`}
                        >
                          {day}
                        </span>
                      </div>

                      {/* Task chips */}
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map(task => {
                          const cat = CATEGORY_CONFIG[task.category];
                          return (
                            <button
                              key={task.id}
                              onClick={() => onTaskClick(task)}
                              title={task.title}
                              className={`w-full text-left px-1.5 py-0.5 rounded-md text-[11px] leading-tight truncate font-medium transition-opacity hover:opacity-80 border ${cat.bg} ${cat.text} ${cat.border}`}
                            >
                              {task.title}
                            </button>
                          );
                        })}
                        {dayTasks.length > 3 && (
                          <div className="text-[10px] text-gray-400 pl-1">
                            +{dayTasks.length - 3} ещё
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
