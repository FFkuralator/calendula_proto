<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { Repeat2, Search, X, ChevronDown, Home, Map, BookOpen, ChevronRight } from 'lucide-vue-next'
import RoadmapPage from './app/components/RoadmapPage.vue'
import TaskDetailPage from './app/components/TaskDetailPage.vue'
import Footer from './app/components/Footer.vue'
import { ACADEMIC_YEARS, ALL_TASKS } from './app/data/tasks'

type PageView = { tab: 'roadmap' } | { tab: 'roadmap'; taskId: string }

const view = ref<PageView>({ tab: 'roadmap' })
const academicYear = ref('2025-2026')
const searchQuery = ref('')
const searchOpen = ref(false)
const yearOpen = ref(false)

const searchInputRef = ref<HTMLInputElement | null>(null)
const yearRef = ref<HTMLDivElement | null>(null)

watch(searchOpen, (val) => {
  if (val) nextTick(() => searchInputRef.value?.focus())
})

const taskTitle = computed(() => {
  const v = view.value as any
  if (v.taskId) return ALL_TASKS.find((t) => t.id === v.taskId)?.title
  return undefined
})

const crumbs = computed<{ label: string; clickable: boolean }[]>(() => {
  const result = [{ label: 'Жизненный цикл программы', clickable: true }]
  const v = view.value as any
  if (v.taskId) {
    result.push({ label: 'Дорожная карта', clickable: true })
    if (taskTitle.value) result.push({ label: taskTitle.value, clickable: false })
  } else {
    result.push({ label: 'Дорожная карта', clickable: false })
  }
  return result
})

const currentTask = computed(() => {
  const v = view.value as any
  if (v.taskId) return ALL_TASKS.find((t) => t.id === v.taskId) ?? null
  return null
})

const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
}

const goRoadmap = () => { view.value = { tab: 'roadmap' } }

const navigateToTask = (taskId: string) => {
  view.value = { tab: 'roadmap', taskId }
}

const handleClickOutside = (e: MouseEvent) => {
  if (yearRef.value && !yearRef.value.contains(e.target as Node)) {
    yearOpen.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', handleClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside))

const navItems = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'roadmap', label: 'Дорожная карта', icon: Map },
  { id: 'knowledge', label: 'База знаний', icon: BookOpen },
]
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div class="flex items-center h-14 px-5 gap-4">
        <!-- Logo -->
        <button @click="goRoadmap" class="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity">
          <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-300">
            <Repeat2 :size="18" class="text-white" />
          </div>
          <span class="text-sm font-semibold text-gray-900 hidden lg:block leading-tight">
            Жизненный цикл<br /><span class="text-gray-500 font-normal">программы</span>
          </span>
        </button>

        <!-- Nav -->
        <nav class="flex items-center gap-0.5 flex-1 overflow-x-auto">
          <button
            v-for="tab in navItems"
            :key="tab.id"
            disabled
            :class="[
              'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all cursor-not-allowed',
              tab.id === 'roadmap' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-400 opacity-50',
            ]"
          >
            <component :is="tab.icon" :size="15" />
            <span class="hidden md:block">{{ tab.label }}</span>
          </button>
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Search open -->
          <div v-if="searchOpen" class="flex items-center gap-2 bg-gray-100 rounded-xl px-3.5 py-2">
            <Search :size="14" class="text-gray-400 shrink-0" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Поиск задач..."
              class="bg-transparent border-none outline-none text-sm text-gray-800 w-48 placeholder:text-gray-400"
            />
            <button @click="closeSearch" class="text-gray-400 hover:text-gray-600 transition-colors">
              <X :size="14" />
            </button>
          </div>
          <button
            v-else
            @click="searchOpen = true"
            title="Поиск"
            class="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Search :size="17" />
          </button>

          <!-- Year selector -->
          <div class="relative" ref="yearRef">
            <button
              @click="yearOpen = !yearOpen"
              class="flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors"
            >
              {{ academicYear }}
              <ChevronDown :size="13" :class="['transition-transform', yearOpen ? 'rotate-180' : '']" />
            </button>
            <div
              v-if="yearOpen"
              class="absolute right-0 top-full mt-2 w-36 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-30"
            >
              <button
                v-for="yr in ACADEMIC_YEARS"
                :key="yr"
                @click="academicYear = yr; yearOpen = false"
                :class="[
                  'w-full text-left px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-between',
                  yr === academicYear ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50',
                ]"
              >
                {{ yr }}
                <div v-if="yr === academicYear" class="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Breadcrumbs -->
      <div class="px-5 py-2 border-t border-gray-50 flex items-center gap-1.5 bg-gray-50/50">
        <template v-for="(c, i) in crumbs" :key="i">
          <ChevronRight v-if="i > 0" :size="12" class="text-gray-300" />
          <button v-if="c.clickable" @click="goRoadmap" class="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            {{ c.label }}
          </button>
          <span v-else class="text-xs text-gray-500 truncate max-w-[200px]">{{ c.label }}</span>
        </template>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 overflow-auto">
      <TaskDetailPage v-if="currentTask" :task="currentTask" @back="goRoadmap" />
      <RoadmapPage v-else :search-query="searchQuery" :academic-year="academicYear" @navigate-task="navigateToTask" />
    </main>

    <Footer />
  </div>
</template>
