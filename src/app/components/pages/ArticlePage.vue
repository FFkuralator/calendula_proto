<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, Star, Clock, Tag } from 'lucide-vue-next'
import { KNOWLEDGE_ARTICLES } from '../../data/knowledge'

interface Props {
  articleId: string
  favorites: Set<string>
}

interface Emits {
  back: []
  toggleFavorite: [id: string]
  navigateTask: [id: string]
  navigateArticle: [id: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const article = computed(() => KNOWLEDGE_ARTICLES.find(a => a.id === props.articleId))
</script>

<template>
  <div v-if="article" class="max-w-3xl mx-auto px-6 py-8">
    <button @click="emit('back')" class="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 mb-6 text-sm font-medium">
      <ArrowLeft :size="16" />
      Назад в Базу знаний
    </button>

    <div class="bg-white rounded-2xl border border-gray-200 p-8">
      <div class="flex items-start justify-between mb-4">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">{{ article.category }}</span>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">{{ article.title }}</h1>
        </div>
        <button
          @click="emit('toggleFavorite', article.id)"
          class="text-gray-400 hover:text-yellow-500 transition-colors"
        >
          <Star :size="24" :fill="props.favorites.has(article.id) ? 'currentColor' : 'none'" />
        </button>
      </div>

      <div class="flex items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
        <div class="flex items-center gap-1">
          <Clock :size="14" />
          {{ article.readTime }}
        </div>
        <div>{{ article.section }}</div>
      </div>

      <div class="prose prose-sm max-w-none mb-8">
        <p class="text-gray-700 mb-6">{{ article.description }}</p>

        <div v-if="article.steps.length > 0" class="space-y-4">
          <h2 class="text-lg font-semibold text-gray-900 mt-6 mb-4">Пошаговое руководство</h2>
          <div
            v-for="(step, i) in article.steps"
            :key="i"
            class="border-l-4 border-indigo-500 pl-4 py-2"
          >
            <h3 class="font-semibold text-gray-900">{{ i + 1 }}. {{ step.title }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ step.content }}</p>
          </div>
        </div>
      </div>

      <div v-if="article.summary" class="bg-indigo-50 rounded-xl p-4 mb-6 border border-indigo-100">
        <h3 class="font-semibold text-indigo-900 mb-2">Резюме</h3>
        <p class="text-sm text-indigo-800">{{ article.summary }}</p>
      </div>
    </div>
  </div>
</template>
