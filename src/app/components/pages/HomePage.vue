<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, AlertCircle, Clock, CheckCircle2, ArrowRight, CalendarDays, AlertTriangle } from 'lucide-vue-next'
import { ALL_TASKS, getAcademicYearRange, MONTH_NAMES_RU } from '../../data/tasks'

interface Props {
  academicYear: string
  notifications: any[]
}

interface Emits {
  navigateTask: [id: string]
  navigateTab: [tab: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const yearTasks = computed(() => {
  const { start, end } = getAcademicYearRange(props.academicYear)
  return ALL_TASKS.filter(task => {
    const deadline = new Date(task.deadline)
    return deadline >= start && deadline <= end
  })
})

const today = new Date()
today.setHours(0, 0, 0, 0)
const in7Days = new Date(today)
in7Days.setDate(in7Days.getDate() + 7)

const overdue = computed(() => yearTasks.value.filter(t => t.status === 'Просрочена'))
const upcoming = computed(() =>
  yearTasks.value.filter(t => {
    const deadline = new Date(t.deadline)
    deadline.setHours(0, 0, 0, 0)
    return deadline >= today && deadline <= in7Days && t.status !== 'Выполнена'
  })
)
const completed = computed(() => yearTasks.value.filter(t => t.status === 'Выполнена'))
const inProgress = computed(() => yearTasks.value.filter(t => t.status === 'В работе'))

const completionPct = computed(() =>
  yearTasks.value.length ? Math.round((completed.value.length / yearTasks.value.length) * 100) : 0
)

const stats = computed(() => [
  { label: 'Всего задач', value: yearTasks.value.length, icon: CalendarDays, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Выполнено', value: completed.value.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'В работе', value: inProgress.value.length, icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Просрочено', value: overdue.value.length, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
])

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return `${date.getDate()} ${MONTH_NAMES_RU[date.getMonth()]}`
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-8">
    <!-- Hero -->
    <div class="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl p-7 mb-8 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div class="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div class="relative">
        <div class="flex items-center gap-2 mb-2">
          <TrendingUp :size="18" class="text-indigo-200" />
          <span class="text-indigo-200 text-sm font-medium">Учебный год {{ academicYear }}</span>
        </div>
        <h1 class="text-2xl font-bold mb-1">Жизненный цикл программы</h1>
        <p class="text-indigo-200 text-sm mb-5 max-w-lg">Система управления образовательной программой — все задачи, документы и контакты в одном месте.</p>
        <div class="flex items-center gap-6">
          <div>
            <div class="text-3xl font-bold">{{ completionPct }}%</div>
            <div class="text-indigo-200 text-xs mt-0.5">выполнено за год</div>
          </div>
          <div class="flex-1 max-w-xs">
            <div class="h-2 bg-white/20 rounded-full overflow-hidden">
              <div class="h-full bg-white rounded-full transition-all" :style="{ width: `${completionPct}%` }" />
            </div>
            <div class="flex justify-between mt-1 text-[11px] text-indigo-200">
              <span>{{ completed.length }} завершено</span>
              <span>{{ yearTasks.length }} всего</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
        <div :class="['w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.bg]">
          <component :is="stat.icon" :size="18" :class="stat.color" />
        </div>
        <div class="text-2xl font-bold text-gray-900">{{ stat.value }}</div>
        <div class="text-xs text-gray-500 mt-0.5">{{ stat.label }}</div>
      </div>
    </div>

    <!-- Upcoming & Overdue -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl border border-gray-200 p-5">
        <div class="flex items-center gap-2 mb-4">
          <Clock :size="16" class="text-blue-600" />
          <h3 class="font-semibold text-gray-900">Предстоящие задачи</h3>
        </div>
        <div v-if="upcoming.length === 0" class="text-sm text-gray-500">Нет задач на ближайшую неделю</div>
        <div v-else class="space-y-2">
          <button
            v-for="task in upcoming.slice(0, 5)"
            :key="task.id"
            @click="emit('navigateTask', task.id)"
            class="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors border border-blue-100"
          >
            <div class="font-medium text-sm text-gray-900">{{ task.title }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ formatDate(task.deadline) }}</div>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-200 p-5">
        <div class="flex items-center gap-2 mb-4">
          <AlertTriangle :size="16" class="text-red-600" />
          <h3 class="font-semibold text-gray-900">Просрочены</h3>
        </div>
        <div v-if="overdue.length === 0" class="text-sm text-gray-500">Отлично, нет просроченных задач</div>
        <div v-else class="space-y-2">
          <button
            v-for="task in overdue"
            :key="task.id"
            @click="emit('navigateTask', task.id)"
            class="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors border border-red-100"
          >
            <div class="font-medium text-sm text-gray-900">{{ task.title }}</div>
            <div class="text-xs text-gray-500 mt-1">Дедлайн: {{ formatDate(task.deadline) }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
