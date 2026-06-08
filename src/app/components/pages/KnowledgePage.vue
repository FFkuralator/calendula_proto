<script setup lang="ts">
import { computed } from 'vue'
import { Star, BookOpen, Filter } from 'lucide-vue-next'
import { KNOWLEDGE_ARTICLES } from '../../data/knowledge'

interface Props {
  favorites: Set<string>
}

interface Emits {
  toggleFavorite: [id: string]
  openArticle: [id: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const articles = computed(() => KNOWLEDGE_ARTICLES)

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
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">База знаний</h1>
      <p class="text-gray-600">Руководства, инструкции и справочная информация для руководителей образовательных программ</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
