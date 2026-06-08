<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { SlidersHorizontal, ChevronDown, Check, X, List, Calendar, CalendarDays, Info, BookOpen, FileText, ExternalLink } from 'lucide-vue-next'
import {
  CATEGORIES, MONTH_NAMES_RU,
  CATEGORY_CONFIG, ALL_TASKS,
  getAcademicYearRange,
} from '../../data/tasks'
import type { Task, TaskCategory } from '../../data/tasks'

type ViewMode = 'calendar' | 'list'

const props = defineProps<{
  searchQuery: string
  academicYear: string
}>()

const emit = defineEmits<{
  navigateTask: [id: string]
  navigateArticle: [id: string]
}>()

const SIDEBAR_DOCS = [
  'Регламент проведения ГИА',
  'Чеклист допуска к защите',
  'Пакет шаблонных приказов',
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`
}

const filterOpen = ref(false)
const activeCategories = ref<TaskCategory[]>([...CATEGORIES])
const viewMode = ref<ViewMode>('list')

const filterRef = ref<HTMLDivElement | null>(null)

const handleClickOutside = (e: MouseEvent) => {
  if (filterRef.value && !filterRef.value.contains(e.target as Node)) filterOpen.value = false
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

const yearTasks = computed(() => {
  const { start, end } = getAcademicYearRange(props.academicYear)
  return ALL_TASKS.filter((t) => {
    const d = new Date(t.deadline)
    return d >= start && d <= end
  })
})

const filteredTasks = computed(() => {
  let tasks = yearTasks.value
  if (props.searchQuery) {
    const q = props.searchQuery.toLowerCase()
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        (t.responsible && t.responsible.toLowerCase().includes(q))
    )
  }
  if (activeCategories.value.length < CATEGORIES.length) {
    tasks = tasks.filter((t) => activeCategories.value.includes(t.category))
  }
  return tasks
})

const filterCount = computed(() =>
  activeCategories.value.length < CATEGORIES.length ? CATEGORIES.length - activeCategories.value.length : 0
)

function toggleCategory(cat: TaskCategory) {
  if (activeCategories.value.includes(cat)) {
    activeCategories.value = activeCategories.value.filter((c) => c !== cat)
  } else {
    activeCategories.value = [...activeCategories.value, cat]
  }
}

function resetFilters() {
  activeCategories.value = [...CATEGORIES]
}

const listGroups = computed(() => {
  const sorted = [...filteredTasks.value].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  )
  const map = new Map<string, Task[]>()
  for (const t of sorted) {
    const key = t.deadline
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(t)
  }
  return Array.from(map.entries()).map(([date, tasks]) => {
    const d = new Date(date)
    return {
      label: `${d.getDate()} ${MONTH_NAMES_RU[d.getMonth()].toLowerCase()} ${d.getFullYear()}`,
      date,
      tasks,
    }
  })
})

function getDiffDays(deadline: string): number {
  const today2 = new Date()
  today2.setHours(0, 0, 0, 0)
  const dl = new Date(deadline)
  dl.setHours(0, 0, 0, 0)
  return Math.ceil((dl.getTime() - today2.getTime()) / 86400000)
}

const viewModes: [ViewMode, any, string][] = [
  ['list', List, 'Список'],
]
</script>

<template>
  <div class="flex gap-0 h-full">
    <div class="flex-1 min-w-0 px-6 py-6">
      <div class="mb-5">
        <h1 class="text-xl font-semibold text-gray-900 mb-1">Дорожная карта задач на учебный год</h1>
        <p class="text-sm text-gray-500">Задачи отсортированы по дедлайну. Используйте фильтры, чтобы быстрее найти нужные задачи.</p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5 mb-4">
        <div class="relative ml-auto" ref="filterRef">
          <button
            @click="filterOpen = !filterOpen"
            :class="[
              'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all',
              filterCount > 0
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600',
            ]"
          >
            <SlidersHorizontal :size="14" />
            Фильтры
            <span
              v-if="filterCount > 0"
              class="w-5 h-5 bg-indigo-600 text-white rounded-full text-[10px] flex items-center justify-center font-bold"
            >
              {{ filterCount }}
            </span>
            <ChevronDown :size="13" :class="['transition-transform', filterOpen ? 'rotate-180' : '']" />
          </button>
          <div
            v-if="filterOpen"
            class="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-200 shadow-xl z-30 overflow-hidden"
          >
            <div class="p-4 border-b border-gray-100 flex items-center justify-between">
              <span class="text-sm font-semibold text-gray-800">Фильтры</span>
              <button v-if="filterCount > 0" @click="resetFilters" class="text-xs text-indigo-600 font-medium">Сбросить</button>
            </div>
            <div class="p-4 border-b border-gray-100">
              <div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-3">Категория</div>
              <div class="space-y-2">
                <button
                  v-for="cat in CATEGORIES"
                  :key="cat"
                  @click="toggleCategory(cat)"
                  class="flex items-center gap-2.5 w-full text-left group"
                >
                  <div
                    :class="[
                      'w-4 h-4 rounded border flex items-center justify-center transition-colors',
                      activeCategories.includes(cat)
                        ? `${CATEGORY_CONFIG[cat].dot} border-transparent`
                        : 'border-gray-300 group-hover:border-indigo-400',
                    ]"
                  >
                    <Check v-if="activeCategories.includes(cat)" :size="10" class="text-white" :stroke-width="3" />
                  </div>
                  <span :class="['w-2 h-2 rounded-full', CATEGORY_CONFIG[cat].dot]" />
                  <span class="text-sm text-gray-700">{{ cat }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <span>Задач: <strong class="text-gray-800">{{ filteredTasks.length }}</strong></span>
        <button
          v-if="filterCount > 0"
          @click="resetFilters"
          class="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
        >
          <X :size="11" /> Сбросить фильтры
        </button>
      </div>

      <div v-if="listGroups.length === 0" class="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200">
        <Calendar :size="40" class="mx-auto mb-3 opacity-30" />
        <p class="text-sm">Задачи не найдены</p>
      </div>
      <div v-else class="space-y-5">
        <div v-for="group in listGroups" :key="group.date">
          <div class="flex items-center gap-3 mb-2.5">
            <div class="w-2 h-2 rounded-full bg-indigo-400" />
            <span class="text-sm font-semibold text-gray-700 capitalize">{{ group.label }}</span>
            <div class="flex-1 h-px bg-gray-100" />
          </div>
          <div class="space-y-2">
            <button
              v-for="task in group.tasks"
              :key="task.id"
              @click="emit('navigateTask', task.id)"
              class="w-full text-left rounded-xl border p-4 transition-all group bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm"
            >
              <div class="flex items-start gap-3">
                <span :class="['w-3 h-3 rounded-full shrink-0 mt-1', CATEGORY_CONFIG[task.category].dot]" />
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-3 mb-1.5">
                    <span class="text-sm font-semibold leading-snug text-gray-800 group-hover:text-indigo-700 transition-colors">
                      {{ task.title }}
                    </span>
                  </div>
                  <p class="text-xs leading-relaxed mb-2.5 line-clamp-1 text-gray-500">{{ task.description }}</p>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      :class="[
                        'flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg',
                        getDiffDays(task.deadline) <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600',
                      ]"
                    >
                      <span class="opacity-60">до</span> {{ formatDate(task.deadline) }}
                      <template v-if="getDiffDays(task.deadline) >= 0 && getDiffDays(task.deadline) <= 3">
                        · {{ getDiffDays(task.deadline) === 0 ? 'сегодня' : `${getDiffDays(task.deadline)} дн.` }}
                      </template>
                    </span>
                    <span
                      :class="[
                        'text-[11px] font-medium px-2 py-0.5 rounded-lg border',
                        CATEGORY_CONFIG[task.category].bg,
                        CATEGORY_CONFIG[task.category].text,
                        CATEGORY_CONFIG[task.category].border,
                      ]"
                    >{{ task.category }}</span>
                    <span
                      v-for="tag in task.tags.slice(0, 2)"
                      :key="tag"
                      class="text-[11px] px-2 py-0.5 rounded-lg bg-gray-100 text-gray-500"
                    >{{ tag }}</span>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="w-60 shrink-0 border-l border-gray-100 px-4 py-6 space-y-4 hidden xl:block">
      <div class="bg-indigo-50 rounded-2xl p-4">
        <div class="flex items-center gap-2 mb-3">
          <Info :size="13" class="text-indigo-500" />
          <span class="text-xs font-semibold text-indigo-700">Совет</span>
        </div>
        <ul class="space-y-2">
          <li class="flex items-start gap-2">
            <span class="w-4 h-4 rounded-full bg-indigo-200 text-indigo-700 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <span class="text-[11px] text-indigo-700 leading-relaxed">Используйте фильтры по категории</span>
          </li>
          <li class="flex items-start gap-2">
            <span class="w-4 h-4 rounded-full bg-indigo-200 text-indigo-700 text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <span class="text-[11px] text-indigo-700 leading-relaxed">Нажмите на задачу для просмотра подробностей</span>
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-4">
        <div class="flex items-center gap-2 mb-3">
          <BookOpen :size="13" class="text-gray-400" />
          <span class="text-xs font-semibold text-gray-700">Материалы ГИА</span>
        </div>
        <div class="space-y-2">
          <button v-for="doc in SIDEBAR_DOCS" :key="doc" class="flex items-center gap-2 w-full text-left group">
            <FileText :size="11" class="text-indigo-400 shrink-0" />
            <span class="text-[11px] text-gray-600 group-hover:text-indigo-600 transition-colors leading-snug">{{ doc }}</span>
            <ExternalLink :size="9" class="text-gray-300 group-hover:text-indigo-400 transition-colors ml-auto shrink-0" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
