export type NotificationType = 'error' | 'warning' | 'info' | 'success' | 'reminder';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  taskId?: string;
  articleId?: string;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'nn1', type: 'error',    title: 'Просрочена задача',          body: 'Внутренний аудит качества ОП истёк 28 ноября 2025',                  time: '2 дня назад',  read: false, taskId: 'n2' },
  { id: 'nn2', type: 'warning',  title: 'Дедлайн через 5 дней',       body: 'Предзащита ВКР — необходимо завершить до 25 марта',                  time: '1 час назад',  read: false, taskId: 'm2' },
  { id: 'nn3', type: 'warning',  title: 'Требуется согласование',      body: 'Состав ГЭК ожидает утверждения в министерстве',                     time: '3 часа назад', read: false, taskId: 'a1' },
  { id: 'nn4', type: 'reminder', title: 'Напоминание о дедлайне',      body: 'Через 2 недели — дедлайн приёма готовых ВКР от студентов',          time: 'сегодня',      read: false },
  { id: 'nn5', type: 'info',     title: 'Обновление в базе знаний',    body: 'Добавлен новый шаблон для самообследования образовательной программы', time: 'вчера',       read: true,  articleId: '11' },
  { id: 'nn6', type: 'success',  title: 'Задача выполнена',            body: 'Предложения по темам ВКР успешно собраны и утверждены',              time: '2 дня назад',  read: true,  taskId: 'm1' },
  { id: 'nn7', type: 'info',     title: 'Новый академический год',     body: 'Не забудьте актуализировать рабочие программы дисциплин до 31 января', time: '3 дня назад', read: true },
  { id: 'nn8', type: 'warning',  title: 'Приближается аттестация',     body: 'До итоговой аттестации I семестра осталось 20 дней',                 time: '5 дней назад', read: true },
];
