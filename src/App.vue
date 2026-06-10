<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Repeat2, Search, X, Home, Map, BookOpen, ChevronRight } from 'lucide-vue-next'
import HomePage from './app/components/pages/HomePage.vue'
import RoadmapPage from './app/components/pages/RoadmapPage.vue'
import KnowledgePage from './app/components/pages/KnowledgePage.vue'
import ArticlePage from './app/components/pages/ArticlePage.vue'
import TaskDetailPage from './app/components/pages/TaskDetailPage.vue'
import Footer from './app/components/Footer.vue'
import { ALL_TASKS, KNOWLEDGE_ARTICLES } from './app/data'

type MainTab = 'home' | 'roadmap' | 'knowledge'
type PageView =
  | { tab: MainTab }
  | { tab: 'knowledge'; articleId: string }
  | { tab: 'roadmap'; taskId: string }

const view = ref<PageView>({ tab: 'roadmap' })
const academicYear = ref('2025-2026')
const searchQuery = ref('')
const searchOpen = ref(false)
const favorites = ref<Set<string>>(new Set())

const searchInputRef = ref<HTMLInputElement | null>(null)

watch(searchOpen, (val) => {
  if (val) nextTick(() => searchInputRef.value?.focus())
})

const activeTab = computed(() => {
  const v = view.value as any
  return 'tab' in v ? v.tab : 'home'
})

const articleTitle = computed(() => {
  const v = view.value as any
  if ('articleId' in v) {
    return KNOWLEDGE_ARTICLES.find((a) => a.id === v.articleId)?.title
  }
  return undefined
})

const taskTitle = computed(() => {
  const v = view.value as any
  if ('taskId' in v) {
    return ALL_TASKS.find((t) => t.id === v.taskId)?.title
  }
  return undefined
})

const crumbs = computed<{ label: string; clickable: boolean }[]>(() => {
  const result = [{ label: 'Жизненный цикл программы', clickable: true }]
  const v = view.value as any
  if ('articleId' in v) {
    result.push({ label: 'База знаний', clickable: true })
    if (articleTitle.value) result.push({ label: articleTitle.value, clickable: false })
  } else if ('taskId' in v) {
    result.push({ label: 'Дорожная карта', clickable: true })
    if (taskTitle.value) result.push({ label: taskTitle.value, clickable: false })
  } else {
    result.push({ label: 'Дорожная карта', clickable: false })
  }
  return result
})

const closeSearch = () => {
  searchOpen.value = false
  searchQuery.value = ''
}

const navItems = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'roadmap', label: 'Дорожная карта', icon: Map },
  { id: 'knowledge', label: 'База знаний', icon: BookOpen },
]

const toggleFav = (id: string) => {
  const n = new Set(favorites.value)
  if (n.has(id)) n.delete(id)
  else n.add(id)
  favorites.value = n
}

const navigateToTask = (taskId: string) => {
  view.value = { tab: 'roadmap', taskId }
}

const navigateToArticle = (articleId: string) => {
  view.value = { tab: 'knowledge', articleId }
}

const navigateToTab = (tab: string) => {
  view.value = { tab: tab as MainTab }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div class="flex items-center h-14 px-5 gap-4">
        <!-- Logo -->
        <button @click="view = { tab: 'home' }" class="flex items-center gap-2.5 shrink-0 hover:opacity-80 transition-opacity">
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
            @click="view = { tab: tab.id as MainTab }"
            :class="[
              'flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              activeTab === tab.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800',
            ]"
          >
            <component :is="tab.icon" :size="15" />
            <span class="hidden md:block">{{ tab.label }}</span>
          </button>
        </nav>

        <!-- Right side -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Search -->
          <div v-if="searchOpen" class="flex items-center gap-2 bg-gray-100 rounded-xl px-3.5 py-2">
            <Search :size="14" class="text-gray-400 shrink-0" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Поиск задач и статей..."
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
        </div>
      </div>

      <!-- Breadcrumbs -->
      <div class="px-5 py-2 border-t border-gray-50 flex items-center gap-1.5 bg-gray-50/50">
        <template v-for="(c, i) in crumbs" :key="i">
          <ChevronRight v-if="i > 0" :size="12" class="text-gray-300" />
          <button
            v-if="c.clickable && i === 0"
            @click="view = { tab: 'home' }"
            class="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            {{ c.label }}
          </button>
          <button
            v-else-if="c.clickable"
            @click="view = { tab: activeTab }"
            class="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            {{ c.label }}
          </button>
          <span v-else class="text-xs text-gray-500 truncate max-w-[200px]">{{ c.label }}</span>
        </template>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1">
      <HomePage
        v-if="activeTab === 'home'"
        :academic-year="academicYear"
        :notifications="[]"
        @navigate-task="navigateToTask"
        @navigate-tab="navigateToTab"
      />
      <RoadmapPage
        v-else-if="!('articleId' in view) && !('taskId' in view) && activeTab === 'roadmap'"
        :search-query="searchQuery"
        :academic-year="academicYear"
        @update-academic-year="academicYear = $event"
        @navigate-task="navigateToTask"
        @navigate-article="navigateToArticle"
      />
      <KnowledgePage
        v-else-if="!('articleId' in view) && !('taskId' in view) && activeTab === 'knowledge'"
        :search-query="searchQuery"
        :favorites="favorites"
        @toggle-favorite="toggleFav"
        @open-article="navigateToArticle"
      />
      <ArticlePage
        v-else-if="'articleId' in view"
        :article-id="(view as any).articleId"
        @back="view = { tab: 'knowledge' }"
        :favorites="favorites"
        @toggle-favorite="toggleFav"
        @navigate-task="navigateToTask"
        @navigate-article="navigateToArticle"
      />
      <TaskDetailPage
        v-else-if="'taskId' in view"
        :task-id="(view as any).taskId"
        @back="view = { tab: 'roadmap' }"
        @navigate-article="navigateToArticle"
      />
    </main>

    <Footer />
  </div>
</template>
