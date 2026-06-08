<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../data/tasks'
import { CATEGORY_CONFIG, MONTH_NAMES_RU } from '../data/tasks'

interface Props {
  month: number
  year: number
  tasks: Task[]
}

interface Emits {
  taskClick: [task: Task]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const buildCalendarDays = (year: number, month: number) => {
  const first = new Date(year, month, 1)
  let dow = first.getDay()
  if (dow === 0) dow = 7
  const startOffset = dow - 1

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []

  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return cells
}

const cells = computed(() => buildCalendarDays(props.year, props.month))

const weeks = computed(() => {
  const weeks: (number | null)[][] = []
  for (let i = 0; i < cells.value.length; i += 7) {
    weeks.push(cells.value.slice(i, i + 7))
  }
  return weeks
})

const today = new Date()
const todayDay = today.getDate()
const todayMonth = today.getMonth()
const todayYear = today.getFullYear()

const getTasksForDay = (day: number) =>
  props.tasks.filter(t => {
    const taskStart = t.startDate ? new Date(t.startDate) : new Date(t.deadline)
    const taskEnd = new Date(t.deadline)
    const cellDate = new Date(props.year, props.month, day)

    taskStart.setHours(0, 0, 0, 0)
    taskEnd.setHours(0, 0, 0, 0)
    cellDate.setHours(0, 0, 0, 0)

    return cellDate >= taskStart && cellDate <= taskEnd
  })
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <div class="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
      <span class="text-sm font-semibold text-gray-700">
        {{ MONTH_NAMES_RU[month] }} {{ year }}
      </span>
    </div>

    <div class="grid grid-cols-7 border-b border-gray-100">
      <div
        v-for="(d, i) in DAY_NAMES"
        :key="d"
        :class="['py-2.5 text-center text-xs font-semibold tracking-wide uppercase', i >= 5 ? 'text-rose-400' : 'text-gray-400']"
      >
        {{ d }}
      </div>
    </div>

    <div>
      <div v-for="(week, wi) in weeks" :key="wi" :class="['grid grid-cols-7', wi < weeks.length - 1 ? 'border-b border-gray-100' : '']">
        <div
          v-for="(day, di) in week"
          :key="di"
          :class="[
            'min-h-[100px] p-2',
            di < 6 ? 'border-r border-gray-100' : '',
            !day
              ? 'bg-gray-50/40'
              : di >= 5
              ? 'bg-rose-50/20'
              : 'bg-white',
            day === todayDay && month === todayMonth && year === todayYear ? 'ring-1 ring-inset ring-red-300 bg-red-50/30' : '',
          ]"
        >
          <template v-if="day">
            <div class="flex items-center justify-end mb-1.5">
              <span
                :class="[
                  'text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full',
                  day === todayDay && month === todayMonth && year === todayYear
                    ? 'bg-red-600 text-white'
                    : di >= 5
                    ? 'text-rose-400'
                    : 'text-gray-400',
                ]"
              >
                {{ day }}
              </span>
            </div>

            <div v-if="getTasksForDay(day).length > 0" class="space-y-1">
              <button
                v-for="task in getTasksForDay(day).slice(0, 2)"
                :key="task.id"
                @click="emit('taskClick', task)"
                :class="[
                  'w-full text-left text-[10px] px-1.5 py-0.5 rounded transition-colors truncate border',
                  CATEGORY_CONFIG[task.category].bg,
                  CATEGORY_CONFIG[task.category].text,
                  CATEGORY_CONFIG[task.category].border,
                  'hover:shadow-sm',
                ]"
                :title="task.title"
              >
                {{ task.title }}
              </button>
              <div
                v-if="getTasksForDay(day).length > 2"
                class="text-[9px] text-gray-400 px-1.5 font-medium"
              >
                +{{ getTasksForDay(day).length - 2 }}
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
