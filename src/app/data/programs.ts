export interface Program {
  id: string;
  name: string;
  code: string;
  level: string;
  color: string;
  dot: string;
}

export const PROGRAMS: Program[] = [
  { id: 'all', name: 'Все программы', code: '',   level: '',             color: 'bg-gray-100 text-gray-700',    dot: 'bg-gray-400' },
  { id: 'pm',  name: 'Управление проектами',       code: 'ПМ', level: 'Магистратура',   color: 'bg-indigo-100 text-indigo-700',  dot: 'bg-indigo-500' },
  { id: 'se',  name: 'Программная инженерия',      code: 'ПИ', level: 'Бакалавриат',    color: 'bg-sky-100 text-sky-700',        dot: 'bg-sky-500' },
  { id: 'ds',  name: 'Наука о данных',             code: 'НД', level: 'Магистратура',   color: 'bg-violet-100 text-violet-700',  dot: 'bg-violet-500' },
  { id: 'ux',  name: 'Цифровые медиакоммуникации', code: 'ЦМ', level: 'Бакалавриат',   color: 'bg-rose-100 text-rose-700',      dot: 'bg-rose-500' },
];
