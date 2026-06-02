export interface Contact {
  id: string;
  name: string;
  position: string;
  email: string;
  phone?: string;
  avatar: string;
  department?: string;
}

export const CONTACTS: Contact[] = [
  { id: 'c1', name: 'Иванова Елена Сергеевна',    position: 'Руководитель образовательной программы', email: 'e.ivanova@university.ru',    phone: '+7 (495) 123-45-67', avatar: 'ЕИ', department: 'Кафедра информационных систем' },
  { id: 'c2', name: 'Петров Михаил Андреевич',    position: 'Заведующий кафедрой',                   email: 'm.petrov@university.ru',     phone: '+7 (495) 234-56-78', avatar: 'МП', department: 'Кафедра информационных систем' },
  { id: 'c3', name: 'Сидорова Наталья Владимировна', position: 'Куратор производственной практики', email: 'n.sidorova@university.ru',   phone: '+7 (495) 345-67-89', avatar: 'НС', department: 'Деканат' },
  { id: 'c4', name: 'Козлов Алексей Иванович',    position: 'Председатель ГЭК',                      email: 'a.kozlov@commission.ru',     phone: '+7 (495) 456-78-90', avatar: 'АК', department: 'Внешний эксперт' },
  { id: 'c5', name: 'Морозова Дарья Петровна',    position: 'Специалист деканата',                   email: 'd.morozova@university.ru',   phone: '+7 (495) 567-89-01', avatar: 'ДМ', department: 'Деканат' },
  { id: 'c6', name: 'Новиков Сергей Олегович',    position: 'Специалист службы качества',            email: 's.novikov@university.ru',    phone: '+7 (495) 678-90-12', avatar: 'СН', department: 'Служба качества образования' },
  { id: 'c7', name: 'Белова Анастасия Юрьевна',   position: 'Научный руководитель',                  email: 'a.belova@university.ru',     phone: '+7 (495) 789-01-23', avatar: 'АБ', department: 'Кафедра информационных систем' },
  { id: 'c8', name: 'Громов Дмитрий Николаевич',  position: 'Ответственный за аккредитацию',         email: 'd.gromov@university.ru',     phone: '+7 (495) 890-12-34', avatar: 'ДГ', department: 'Учебно-методическое управление' },
];
