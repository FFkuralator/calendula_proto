<script setup lang="ts">
import { Repeat2, Mail, Phone, MapPin } from 'lucide-vue-next'

const CONTACTS_LIST = [
  { name: 'Иванова Елена Сергеевна', position: 'Руководитель ОП', email: 'e.ivanova@university.ru', phone: '+7 (495) 123-45-67' },
  { name: 'Петров Михаил Андреевич', position: 'Заведующий кафедрой', email: 'm.petrov@university.ru', phone: '+7 (495) 234-56-78' },
  { name: 'Морозова Дарья Петровна', position: 'Специалист деканата', email: 'd.morozova@university.ru', phone: '+7 (495) 567-89-01' },
]

const LINKS = [
  'Дорожная карта',
  'База знаний',
  'Качество',
  'Учебный план',
  'Порядок поступления',
]
</script>

<template>
  <footer class="bg-gray-900 text-gray-400 mt-auto">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2.5 mb-4">
            <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Repeat2 :size="16" class="text-white" />
            </div>
            <span class="text-white font-semibold text-sm leading-tight">Жизненный цикл<br />программы</span>
          </div>
          <p class="text-sm leading-relaxed text-gray-500 mb-4">
            Система управления жизненным циклом образовательной программы — от планирования до аккредитации.
          </p>
          <div class="flex items-center gap-1.5 text-xs text-gray-600">
            <MapPin :size="12" />
            <span>Москва, ул. Университетская, д. 1</span>
          </div>
        </div>

        <!-- Navigation -->
        <div>
          <div class="text-white font-semibold text-sm mb-4">Разделы</div>
          <ul class="space-y-2.5">
            <li v-for="label in LINKS" :key="label">
              <button class="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                {{ label }}
              </button>
            </li>
          </ul>
        </div>

        <!-- Contacts -->
        <div>
          <div class="text-white font-semibold text-sm mb-4">Контакты</div>
          <div class="space-y-4">
            <div v-for="c in CONTACTS_LIST" :key="c.email" class="space-y-1">
              <div class="text-sm text-white font-medium">{{ c.name }}</div>
              <div class="text-xs text-gray-500 mb-1.5">{{ c.position }}</div>
              <a :href="`mailto:${c.email}`" class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors">
                <Mail :size="11" />{{ c.email }}
              </a>
              <a :href="`tel:${c.phone}`" class="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-400 transition-colors">
                <Phone :size="11" />{{ c.phone }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-xs text-gray-600">© 2025–2026 Жизненный цикл программы. Версия 2.0</p>
        <p class="text-xs text-gray-600">Разработано для управления образовательными программами</p>
      </div>
    </div>
  </footer>
</template>
