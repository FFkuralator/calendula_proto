<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { Task } from '../data/tasks'
import { CATEGORY_CONFIG, MONTH_NAMES_RU } from '../data/tasks'

interface Props {
  tasks: Task[]
  referenceDate: Date
}

interface Emits {
  taskClick: [task: Task]
  weekChange: [date: Date]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const DAY_NAMES_FULL = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье']
const DAY_NAMES_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const getMondayOf = (date: Date): Date => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

const addDays = (date: Date, n: number): Date => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

const isSameDay = (a: Date, b: Date) => {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

const formatWeekRange = (monday: Date): string => {
  const sunday = addDays(monday, 6)
  const sameMonth = monday.getMonth() === sunday.getMonth()
  if (sameMonth) {
    return `${monday.getDate()}–${sunday.getDate()} ${MONTH_NAMES_RU[monday.getMonth()]} ${monday.getFullYear()}`
  }
  return `${monday.getDate()} ${MONTH_NAMES_RU[monday.getMonth()]} – ${sunday.getDate()} ${MONTH_NAMES_RU[sunday.getMonth()]} ${sunday.getFullYear()}`
}

const monday = computed(() => getMondayOf(props.referenceDate))

const today = computed(() => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
})

const weekDays = computed(() => Array.from({ length: 7 }, (_, i) => addDays(monday.value, i)))

const getTasksForDay = (day: Date) =>
  props.tasks.filter(t => {
    const d = new Date(t.deadline)
    d.setHours(0, 0, 0, 0)
    return isSameDay(d, day)
  })

const goPrev = () => emit('weekChange', addDays(monday.value, -7))
const goNext = () => emit('weekChange', addDays(monday.value, 7))
const goToday = () => emit('weekChange', new Date())

const hasAnyTasks = computed(() => weekDays.value.some(day => getTasksForDay(day).length > 0))
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <div class="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
      <div class="flex items-center gap-2">
        <button
          @click="goPrev"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft :size="16" />
        </button>
        <span class="text-sm font-semibold text-gray-800 min-w-[200px] text-center">{{ formatWeekRange(monday) }}</span>
        <button
          @click="goNext"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronRight :size="16" />
        </button>
      </div>
      <button
        @click="goToday"
        class="text-xs font-medium text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
      >
        Сегодня
      </button>
    </div>

    <div class="grid grid-cols-7">
      <div
        v-for="(day, i) in weekDays"
        :key="`header-${i}`"
        :class="[
          'py-3 px-2 text-center border-b border-gray-100',
          i < 6 ? 'border-r border-gray-100' : '',
          isSameDay(day, today) ? 'bg-indigo-50' : i >= 5 ? 'bg-rose-50/30' : '',
        ]"
      >
        <div :class="['text-[10px] font-semibold uppercase tracking-wide mb-1', i >= 5 ? 'text-rose-400' : 'text-gray-400']">
          {{ DAY_NAMES_SHORT[i] }}
        </div>
        <div
          :class="[
            'w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-bold',
            isSameDay(day, today) ? 'bg-indigo-600 text-white' : i >= 5 ? 'text-rose-500' : 'text-gray-700',
          ]"
        >
          {{ day.getDate() }}
        </div>
      </div>

      <div
        v-for="(day, i) in weekDays"
        :key="`tasks-${i}`"
        :class="[
          'min-h-[300px] p-1.5',
          i < 6 ? 'border-r border-gray-100' : '',
          isSameDay(day, today) ? 'bg-indigo-50/30' : i >= 5 ? 'bg-rose-50/10' : '',
        ]"
      >
        <div v-if="getTasksForDay(day).length === 0" class="h-full flex items-start justify-center pt-8">
          <span class="text-[10px] text-gray-200">—</span>
        </div>
        <div v-else class="space-y-1.5">
          <button
            v-for="task in getTasksForDay(day)"
            :key="task.id"
            @click="emit('taskClick', task)"
            :class="[
              'w-full text-left rounded-xl px-2 py-2 text-[11px] leading-snug transition-all hover:opacity-90 hover:shadow-sm group border',
              CATEGORY_CONFIG[task.category].bg,
              CATEGORY_CONFIG[task.category].border,
              CATEGORY_CONFIG[task.category].text,
            ]"
          >
            <div class="flex items-center gap-1 mb-1">
              <span :class="['w-1.5 h-1.5 rounded-full shrink-0', CATEGORY_CONFIG[task.category].dot]" />
              <span :class="['text-[9px] font-semibold uppercase tracking-wide opacity-70', CATEGORY_CONFIG[task.category].text]">
                {{ task.category }}
              </span>
            </div>
            <span class="font-semibold block leading-tight">{{ task.title }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-100 px-5 py-2.5 bg-gray-50/50 flex items-center gap-4">
      <template v-for="(day, i) in weekDays" :key="`summary-${i}`">
        <span v-if="getTasksForDay(day).length > 0" class="text-xs text-gray-500">
          <strong class="text-gray-700">{{ DAY_NAMES_SHORT[i] }}</strong
          >: {{ getTasksForDay(day).length }} {{ getTasksForDay(day).length === 1 ? 'задача' : 'задачи' }}
        </span>
      </template>
      <span v-if="!hasAnyTasks" class="text-xs text-gray-400">На этой неделе задач нет</span>
    </div>
  </div>
</template>
