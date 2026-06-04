<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '../data/tasks'
import { CATEGORY_CONFIG, MONTH_NAMES_RU } from '../data/tasks'

const props = defineProps<{
  month: number
  year: number
  tasks: Task[]
}>()

const emit = defineEmits<{
  (e: 'task-click', task: Task): void
}>()

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function buildCalendarDays(year: number, month: number): (number | null)[] {
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
  const result: (number | null)[][] = []
  for (let i = 0; i < cells.value.length; i += 7) {
    result.push(cells.value.slice(i, i + 7))
  }
  return result
})

const today = new Date()
const todayDay = today.getDate()
const todayMonth = today.getMonth()
const todayYear = today.getFullYear()

function getTasksForDay(day: number): Task[] {
  return props.tasks.filter((t) => {
    const d = new Date(t.deadline)
    return d.getDate() === day && d.getMonth() === props.month && d.getFullYear() === props.year
  })
}

function isToday(day: number): boolean {
  return day === todayDay && props.month === todayMonth && props.year === todayYear
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden">
    <!-- Month/Year header -->
    <div class="px-5 py-3 border-b border-gray-100 bg-gray-50/60">
      <span class="text-sm font-semibold text-gray-700">
        {{ MONTH_NAMES_RU[month] }} {{ year }}
      </span>
    </div>

    <!-- Day name headers -->
    <div class="grid grid-cols-7 border-b border-gray-100">
      <div
        v-for="(d, i) in DAY_NAMES"
        :key="d"
        :class="[
          'py-2.5 text-center text-xs font-semibold tracking-wide uppercase',
          i >= 5 ? 'text-rose-400' : 'text-gray-400',
        ]"
      >
        {{ d }}
      </div>
    </div>

    <!-- Calendar grid -->
    <div>
      <div
        v-for="(week, wi) in weeks"
        :key="wi"
        :class="['grid grid-cols-7', wi < weeks.length - 1 ? 'border-b border-gray-100' : '']"
      >
        <div
          v-for="(day, di) in week"
          :key="di"
          :class="[
            'min-h-[100px] p-2',
            di < 6 ? 'border-r border-gray-100' : '',
            !day ? 'bg-gray-50/40' : di >= 5 ? 'bg-rose-50/20' : 'bg-white',
            day && isToday(day) ? 'ring-1 ring-inset ring-indigo-300 bg-indigo-50/30' : '',
          ]"
        >
          <template v-if="day">
            <!-- Date number -->
            <div class="flex items-center justify-end mb-1.5">
              <span
                :class="[
                  'text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full',
                  isToday(day) ? 'bg-indigo-600 text-white' : di >= 5 ? 'text-rose-400' : 'text-gray-600',
                ]"
              >
                {{ day }}
              </span>
            </div>

            <!-- Task chips -->
            <div class="space-y-1">
              <button
                v-for="task in getTasksForDay(day).slice(0, 3)"
                :key="task.id"
                @click="emit('task-click', task)"
                :title="task.title"
                :class="[
                  'w-full text-left px-1.5 py-0.5 rounded-md text-[11px] leading-tight truncate font-medium transition-opacity hover:opacity-80 border',
                  CATEGORY_CONFIG[task.category].bg,
                  CATEGORY_CONFIG[task.category].text,
                  CATEGORY_CONFIG[task.category].border,
                ]"
              >
                {{ task.title }}
              </button>
              <div v-if="getTasksForDay(day).length > 3" class="text-[10px] text-gray-400 pl-1">
                +{{ getTasksForDay(day).length - 3 }} ещё
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
