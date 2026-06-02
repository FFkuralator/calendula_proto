import { Repeat2, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

const CONTACTS_LIST = [
  { name: 'Иванова Елена Сергеевна', position: 'Руководитель ОП', email: 'e.ivanova@university.ru', phone: '+7 (495) 123-45-67' },
  { name: 'Петров Михаил Андреевич', position: 'Заведующий кафедрой', email: 'm.petrov@university.ru', phone: '+7 (495) 234-56-78' },
  { name: 'Морозова Дарья Петровна', position: 'Специалист деканата', email: 'd.morozova@university.ru', phone: '+7 (495) 567-89-01' },
];

const LINKS = [
  { label: 'Дорожная карта' },
  { label: 'База знаний' },
  { label: 'Качество' },
  { label: 'Учебный план' },
  { label: 'Порядок поступления' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Repeat2 size={16} className="text-white" />
              </div>
              <span className="text-white font-semibold text-sm leading-tight">Жизненный цикл<br/>программы</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500 mb-4">
              Система управления жизненным циклом образовательной программы — от планирования до аккредитации.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-600">
              <MapPin size={12} />
              <span>Москва, ул. Университетская, д. 1</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-white font-semibold text-sm mb-4">Разделы</div>
            <ul className="space-y-2.5">
              {LINKS.map(l => (
                <li key={l.label}>
                  <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <div className="text-white font-semibold text-sm mb-4">Контакты</div>
            <div className="space-y-4">
              {CONTACTS_LIST.map(c => (
                <div key={c.email} className="space-y-1">
                  <div className="text-sm text-white font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500 mb-1.5">{c.position}</div>
                  <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors">
                    <Mail size={11} />
                    {c.email}
                  </a>
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors">
                    <Phone size={11} />
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">© 2025–2026 Жизненный цикл программы. Версия 2.0</p>
          <p className="text-xs text-gray-600">Разработано для управления образовательными программами</p>
        </div>
      </div>
    </footer>
  );
}
