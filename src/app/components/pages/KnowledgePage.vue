<script setup lang="ts">
import { computed, ref } from 'vue'
import { Star, BookOpen } from 'lucide-vue-next'
import { KNOWLEDGE_ARTICLES } from '../../data/knowledge'

interface Props {
  searchQuery: string
  favorites: Set<string>
}

interface Emits {
  toggleFavorite: [id: string]
  openArticle: [id: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showFavoritesOnly = ref(false)

const favoriteCount = computed(() => props.favorites.size)

const normalizedSearch = computed(() => props.searchQuery.trim().toLowerCase())

const articles = computed(() => {
  const q = normalizedSearch.value
  return KNOWLEDGE_ARTICLES.filter((article) => {
    if (showFavoritesOnly.value && !props.favorites.has(article.id)) return false
    if (!q) return true

    return [
      article.title,
      article.description,
      article.category,
      article.section,
      article.type,
      article.summary,
      ...article.steps.flatMap((step) => [step.title, step.content]),
    ].some((value) => value.toLowerCase().includes(q))
  })
})

const getIconColor = (color: string) => {
  const colors: Record<string, string> = {
    'text-indigo-600': 'text-indigo-600',
    'text-emerald-600': 'text-emerald-600',
    'text-sky-600': 'text-sky-600',
    'text-orange-600': 'text-orange-600',
  }
  return colors[color] || 'text-indigo-600'
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-6 py-8">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">База знаний</h1>
        <p class="text-gray-600">Руководства, инструкции и справочная информация для руководителей образовательных программ</p>
      </div>
      <button
        @click="showFavoritesOnly = !showFavoritesOnly"
        :class="[
          'inline-flex items-center justify-center gap-2 self-start px-3.5 py-2 rounded-xl text-sm font-medium border transition-all',
          showFavoritesOnly
            ? 'bg-yellow-50 border-yellow-200 text-yellow-700 shadow-sm'
            : 'bg-white border-gray-200 text-gray-600 hover:border-yellow-200 hover:text-yellow-600',
        ]"
      >
        <Star :size="15" :fill="showFavoritesOnly ? 'currentColor' : 'none'" />
        Избранное
        <span
          :class="[
            'min-w-5 h-5 px-1.5 rounded-full text-[10px] flex items-center justify-center font-bold',
            showFavoritesOnly ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-500',
          ]"
        >
          {{ favoriteCount }}
        </span>
      </button>
    </div>

    <div
      v-if="articles.length === 0"
      class="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-200"
    >
      <Star :size="40" class="mx-auto mb-3 opacity-30" />
      <p class="text-sm">
        {{ normalizedSearch ? 'Материалы по запросу не найдены' : 'В избранном пока нет материалов' }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-for="article in articles"
        :key="article.id"
        @click="emit('openArticle', article.id)"
        class="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all text-left group"
      >
        <div class="flex items-start justify-between mb-3">
          <div :class="['w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center', getIconColor(article.color)]">
            <BookOpen :size="18" />
          </div>
          <button
            @click.stop="emit('toggleFavorite', article.id)"
            class="text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <Star :size="16" :fill="props.favorites.has(article.id) ? 'currentColor' : 'none'" />
          </button>
        </div>
        <h3 class="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">{{ article.title }}</h3>
        <p class="text-sm text-gray-600 line-clamp-2 mb-3">{{ article.description }}</p>
        <div class="flex items-center justify-between text-xs text-gray-500">
          <span class="bg-gray-100 px-2 py-1 rounded">{{ article.category }}</span>
          <span>{{ article.readTime }}</span>
        </div>
      </button>
    </div>
  </div>
</template>
