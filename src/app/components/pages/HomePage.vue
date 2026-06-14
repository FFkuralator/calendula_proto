<script setup lang="ts">
import { computed } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  Map,
  Target,
} from 'lucide-vue-next'
import {
  ALL_TASKS,
  CATEGORIES,
  CATEGORY_CONFIG,
  MONTH_NAMES_RU,
  getAcademicYearRange,
} from '../../data/tasks'
import type { Task, TaskCategory } from '../../data/tasks'
import type { AppNotification, NotificationType } from '../../data/notifications'

interface Props {
  academicYear: string
  notifications: AppNotification[]
}

interface Emits {
  navigateTask: [id: string]
  navigateTab: [tab: string]
  navigateArticle: [id: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const today = new Date()
today.setHours(0, 0, 0, 0)

const yearTasks = computed(() => {
  const { start, end } = getAcademicYearRange(props.academicYear)
  return ALL_TASKS.filter((task) => {
    const deadline = new Date(task.deadline)
    return deadline >= start && deadline <= end
  })
})

const sortedTasks = computed(() =>
  [...yearTasks.value].sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
)

const completed = computed(() => yearTasks.value.filter((task) => task.status === 'Выполнена'))
const overdue = computed(() => yearTasks.value.filter((task) => task.status === 'Просрочена'))
const inProgress = computed(() => yearTasks.value.filter((task) => task.status === 'В работе'))
const notStarted = computed(() => yearTasks.value.filter((task) => task.status === 'Не начата'))

const upcoming = computed(() =>
  sortedTasks.value
    .filter((task) => {
      const deadline = normalizeDate(task.deadline)
      return deadline >= today && task.status !== 'Выполнена'
    })
    .slice(0, 6)
)

const focusTasks = computed(() => {
  const urgent = sortedTasks.value.filter((task) => {
    const diff = getDiffDays(task.deadline)
    return task.status !== 'Выполнена' && (task.status === 'Просрочена' || diff <= 14)
  })
  return urgent.length > 0 ? urgent.slice(0, 5) : upcoming.value.slice(0, 5)
})

const completionPct = computed(() =>
  yearTasks.value.length ? Math.round((completed.value.length / yearTasks.value.length) * 100) : 0
)

const stats = computed(() => [
  {
    label: 'Всего задач',
    value: yearTasks.value.length,
    icon: CalendarDays,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
  },
  {
    label: 'Выполнено',
    value: completed.value.length,
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    label: 'В работе',
    value: inProgress.value.length,
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Просрочено',
    value: overdue.value.length,
    icon: AlertCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
])

const categoryRows = computed(() =>
  CATEGORIES.map((category) => {
    const tasks = yearTasks.value.filter((task) => task.category === category)
    const done = tasks.filter((task) => task.status === 'Выполнена').length
    const active = tasks.filter((task) => task.status === 'В работе' || task.status === 'На согласовании').length
    return {
      category,
      total: tasks.length,
      done,
      active,
      pct: tasks.length ? Math.round((done / tasks.length) * 100) : 0,
      config: CATEGORY_CONFIG[category as TaskCategory],
    }
  })
)

const unreadNotifications = computed(() => props.notifications.filter((notification) => !notification.read).length)
const visibleNotifications = computed(() => props.notifications.slice(0, 4))

function normalizeDate(dateString: string) {
  const date = new Date(dateString)
  date.setHours(0, 0, 0, 0)
  return date
}

function getDiffDays(dateString: string) {
  const deadline = normalizeDate(dateString)
  return Math.ceil((deadline.getTime() - today.getTime()) / 86400000)
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return `${date.getDate()} ${MONTH_NAMES_RU[date.getMonth()]}`
}

function deadlineTone(task: Task) {
  const diff = getDiffDays(task.deadline)
  if (task.status === 'Просрочена' || diff < 0) return 'bg-red-50 text-red-700 border-red-100'
  if (diff <= 7) return 'bg-amber-50 text-amber-700 border-amber-100'
  return 'bg-gray-50 text-gray-600 border-gray-100'
}

function deadlineLabel(task: Task) {
  const diff = getDiffDays(task.deadline)
  if (task.status === 'Просрочена' || diff < 0) return 'просрочено'
  if (diff === 0) return 'сегодня'
  return `${diff} дн.`
}

function notificationTone(type: NotificationType) {
  const tones = {
    error: { icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-600' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-600' },
    info: { icon: Bell, bg: 'bg-sky-50', text: 'text-sky-600' },
    success: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-600' },
    reminder: { icon: Clock, bg: 'bg-indigo-50', text: 'text-indigo-600' },
  }
  return tones[type]
}

function openNotification(notification: AppNotification) {
  if (notification.taskId) emit('navigateTask', notification.taskId)
  if (notification.articleId) emit('navigateArticle', notification.articleId)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-8">
    <section class="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div class="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-3">
            <CalendarDays :size="14" />
            Учебный год {{ academicYear }}
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Главная</h1>
          <p class="text-sm leading-relaxed text-gray-600 max-w-2xl">
            Сводка по задачам, срокам и материалам жизненного цикла образовательной программы.
          </p>
        </div>

        <div class="w-full lg:w-80">
          <div class="flex items-end justify-between mb-2">
            <div>
              <div class="text-xs font-semibold text-gray-500 uppercase">Готовность года</div>
              <div class="text-3xl font-bold text-gray-900 mt-1">{{ completionPct }}%</div>
            </div>
            <div class="text-right text-xs text-gray-500">
              <div><span class="font-semibold text-gray-800">{{ completed.length }}</span> выполнено</div>
              <div><span class="font-semibold text-gray-800">{{ yearTasks.length }}</span> всего</div>
            </div>
          </div>
          <div class="h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div class="h-full rounded-full bg-indigo-600 transition-all" :style="{ width: `${completionPct}%` }" />
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl border border-gray-200 p-5">
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-2xl font-bold text-gray-900">{{ stat.value }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ stat.label }}</div>
          </div>
          <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', stat.bg]">
            <component :is="stat.icon" :size="18" :class="stat.color" />
          </div>
        </div>
      </div>
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6">
      <div class="space-y-6">
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="flex items-center justify-between gap-3 mb-4">
            <div class="flex items-center gap-2">
              <Target :size="17" class="text-indigo-600" />
              <h2 class="font-semibold text-gray-900">Фокус на ближайшие сроки</h2>
            </div>
            <button
              @click="emit('navigateTab', 'roadmap')"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Дорожная карта
              <ArrowRight :size="14" />
            </button>
          </div>

          <div v-if="focusTasks.length === 0" class="rounded-xl border border-gray-100 bg-gray-50 p-5 text-sm text-gray-500">
            Нет срочных задач на ближайший период
          </div>
          <div v-else class="space-y-2">
            <button
              v-for="task in focusTasks"
              :key="task.id"
              @click="emit('navigateTask', task.id)"
              class="w-full text-left rounded-xl border border-gray-100 p-3.5 transition-colors hover:border-indigo-100 hover:bg-indigo-50/40"
            >
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="font-semibold text-sm text-gray-900 leading-snug">{{ task.title }}</div>
                  <div class="flex flex-wrap items-center gap-2 mt-2">
                    <span :class="['inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-semibold', deadlineTone(task)]">
                      {{ formatDate(task.deadline) }}
                      <span class="font-medium">{{ deadlineLabel(task) }}</span>
                    </span>
                    <span :class="['inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-medium', CATEGORY_CONFIG[task.category].bg, CATEGORY_CONFIG[task.category].text, CATEGORY_CONFIG[task.category].border]">
                      <span :class="['w-1.5 h-1.5 rounded-full', CATEGORY_CONFIG[task.category].dot]" />
                      {{ task.category }}
                    </span>
                  </div>
                </div>
                <ArrowRight :size="15" class="text-gray-300 shrink-0 mt-0.5" />
              </div>
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="flex items-center gap-2 mb-4">
            <ClipboardList :size="17" class="text-emerald-600" />
            <h2 class="font-semibold text-gray-900">Категории работ</h2>
          </div>

          <div class="space-y-3">
            <div v-for="row in categoryRows" :key="row.category" class="rounded-xl border border-gray-100 p-3.5">
              <div class="flex items-center justify-between gap-3 mb-2">
                <div class="flex items-center gap-2 min-w-0">
                  <span :class="['w-2.5 h-2.5 rounded-full shrink-0', row.config.dot]" />
                  <span class="text-sm font-semibold text-gray-800 truncate">{{ row.category }}</span>
                </div>
                <div class="text-xs text-gray-500 shrink-0">
                  {{ row.done }}/{{ row.total }}
                </div>
              </div>
              <div class="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div :class="['h-full rounded-full transition-all', row.config.dot]" :style="{ width: `${row.pct}%` }" />
              </div>
              <div class="mt-2 flex items-center justify-between text-[11px] text-gray-500">
                <span>{{ row.pct }}% выполнено</span>
                <span>{{ row.active }} в работе</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="space-y-6">
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="flex items-center justify-between gap-3 mb-4">
            <div class="flex items-center gap-2">
              <Bell :size="17" class="text-amber-600" />
              <h2 class="font-semibold text-gray-900">Уведомления</h2>
            </div>
            <span class="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
              {{ unreadNotifications }} новых
            </span>
          </div>

          <div v-if="visibleNotifications.length === 0" class="text-sm text-gray-500">Нет уведомлений</div>
          <div v-else class="space-y-2">
            <button
              v-for="notification in visibleNotifications"
              :key="notification.id"
              @click="openNotification(notification)"
              :disabled="!notification.taskId && !notification.articleId"
              class="w-full text-left rounded-xl border border-gray-100 p-3 transition-colors enabled:hover:border-indigo-100 enabled:hover:bg-indigo-50/40 disabled:cursor-default"
            >
              <div class="flex items-start gap-3">
                <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0', notificationTone(notification.type).bg]">
                  <component :is="notificationTone(notification.type).icon" :size="15" :class="notificationTone(notification.type).text" />
                </div>
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-gray-900 leading-snug">{{ notification.title }}</div>
                  <div class="text-xs text-gray-500 mt-1 line-clamp-2">{{ notification.body }}</div>
                  <div class="text-[11px] text-gray-400 mt-1.5">{{ notification.time }}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="flex items-center gap-2 mb-4">
            <Map :size="17" class="text-indigo-600" />
            <h2 class="font-semibold text-gray-900">Быстрые действия</h2>
          </div>

          <div class="grid gap-2">
            <button
              @click="emit('navigateTab', 'roadmap')"
              class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 text-left transition-colors hover:border-indigo-100 hover:bg-indigo-50/40"
            >
              <span class="flex items-center gap-2 text-sm font-medium text-gray-800">
                <CalendarDays :size="15" class="text-indigo-600" />
                Открыть дорожную карту
              </span>
              <ArrowRight :size="14" class="text-gray-300" />
            </button>
            <button
              @click="emit('navigateTab', 'knowledge')"
              class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3 text-left transition-colors hover:border-indigo-100 hover:bg-indigo-50/40"
            >
              <span class="flex items-center gap-2 text-sm font-medium text-gray-800">
                <BookOpen :size="15" class="text-indigo-600" />
                Перейти в базу знаний
              </span>
              <ArrowRight :size="14" class="text-gray-300" />
            </button>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="flex items-center gap-2 mb-4">
            <AlertTriangle :size="17" class="text-red-600" />
            <h2 class="font-semibold text-gray-900">Риски</h2>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="rounded-xl bg-red-50 p-3 text-center">
              <div class="text-lg font-bold text-red-700">{{ overdue.length }}</div>
              <div class="text-[11px] text-red-700">просрочено</div>
            </div>
            <div class="rounded-xl bg-amber-50 p-3 text-center">
              <div class="text-lg font-bold text-amber-700">{{ focusTasks.length }}</div>
              <div class="text-[11px] text-amber-700">в фокусе</div>
            </div>
            <div class="rounded-xl bg-slate-50 p-3 text-center">
              <div class="text-lg font-bold text-slate-700">{{ notStarted.length }}</div>
              <div class="text-[11px] text-slate-600">не начато</div>
            </div>
          </div>
        </div>
      </aside>
    </section>
  </div>
</template>
