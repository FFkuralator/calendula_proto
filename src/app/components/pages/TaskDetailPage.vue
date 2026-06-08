<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLeft, Calendar, FileText, BookOpen, Mail, Phone, Target, ClipboardList } from 'lucide-vue-next'
import { ALL_TASKS, CATEGORY_CONFIG, MONTH_NAMES_RU } from '../../data/tasks'
import { CONTACTS } from '../../data/contacts'
import { KNOWLEDGE_ARTICLES } from '../../data/knowledge'

interface Props {
  taskId: string
}

interface Emits {
  back: []
  navigateArticle: [id: string]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const task = computed(() => ALL_TASKS.find(t => t.id === props.taskId))

const DOCS = [
  { id: 'doc-gek-form', label: 'Форма состава ГЭК', type: 'DOCX' },
  { id: 'doc-letter', label: 'Письмо ректору', type: 'DOCX' },
  { id: 'doc-reg', label: 'Регламент ГИА', type: 'PDF' },
]

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getDate()} ${MONTH_NAMES_RU[d.getMonth()]} ${d.getFullYear()}`
}

const cat = computed(() => task.value ? CATEGORY_CONFIG[task.value.category] : null)

const diffDays = computed(() => {
  if (!task.value) return 0
  const deadline = new Date(task.value.deadline)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadline.setHours(0, 0, 0, 0)
  return Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
})

const contacts = computed(() =>
  task.value ? (task.value.contactIds ?? []).map((id) => CONTACTS.find((c) => c.id === id)).filter(Boolean) : []
)

const docs = computed(() =>
  task.value ? (task.value.documentIds ?? []).map((id) => DOCS.find((d) => d.id === id)).filter(Boolean) : []
)

const articles = computed(() =>
  task.value ? (task.value.relatedArticleIds ?? []).map((id) => KNOWLEDGE_ARTICLES.find((a) => a.id === id)).filter(Boolean) : []
)

const deadlineLabel = computed(() => {
  const d = diffDays.value
  if (d < 0) return `Просрочено на ${Math.abs(d)} дн.`
  if (d === 0) return 'Срок истекает сегодня'
  return `Осталось ${d} дн.`
})

const deadlineClass = computed(() => {
  const d = diffDays.value
  if (d < 0) return 'bg-red-100 text-red-700'
  if (d <= 7) return 'bg-amber-100 text-amber-700'
  if (d <= 30) return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-600'
})
</script>

<template>
  <div v-if="task" class="max-w-4xl mx-auto px-6 py-8">
    <button @click="emit('back')" class="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-6 group">
      <ArrowLeft :size="16" class="group-hover:-translate-x-0.5 transition-transform" />
      Вернуться к дорожной карте
    </button>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-5">
        <div class="bg-white rounded-2xl border border-gray-200 p-6">
          <div class="flex flex-wrap gap-2 mb-4">
            <span v-if="cat" :class="['inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', cat.bg, cat.text, cat.border]">
              <span :class="['w-1.5 h-1.5 rounded-full', cat.dot]" />
              {{ task.category }}
            </span>
            <span v-for="tag in task.tags" :key="tag" class="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              {{ tag }}
            </span>
          </div>
          <h1 class="text-xl font-semibold text-gray-900 mb-3 leading-snug">{{ task.title }}</h1>
          <p class="text-sm text-gray-600 leading-relaxed">{{ task.description }}</p>
        </div>

        <div v-if="task.goal" class="bg-white rounded-2xl border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Target :size="14" class="text-indigo-600" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800">Цель задачи</h2>
          </div>
          <p class="text-sm text-gray-600 leading-relaxed pl-9">{{ task.goal }}</p>
        </div>

        <div v-if="task.criteria && task.criteria.length > 0" class="bg-white rounded-2xl border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
              <ClipboardList :size="14" class="text-emerald-600" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800">Критерии выполнения</h2>
          </div>
          <div class="space-y-2.5">
            <div v-for="(c, i) in task.criteria" :key="i" class="flex items-start gap-3">
              <div class="w-2 h-2 rounded-full bg-emerald-400 shrink-0 mt-2" />
              <span class="text-sm leading-relaxed text-gray-700">{{ c }}</span>
            </div>
          </div>
        </div>

        <div v-if="docs.length > 0 || articles.length > 0" class="bg-white rounded-2xl border border-gray-200 p-6">
          <div class="flex items-center gap-2 mb-4">
            <div class="w-7 h-7 bg-sky-100 rounded-lg flex items-center justify-center">
              <FileText :size="14" class="text-sky-600" />
            </div>
            <h2 class="text-sm font-semibold text-gray-800">Документы и материалы</h2>
          </div>
          <div class="space-y-2">
            <div
              v-for="d in docs"
              :key="d!.id"
              class="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-sky-200 hover:bg-sky-50 transition-all cursor-pointer"
            >
              <div class="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                <FileText :size="14" class="text-sky-600" />
              </div>
              <span class="text-sm text-gray-700 flex-1">{{ d!.label }}</span>
              <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{{ d!.type }}</span>
            </div>
            <button
              v-for="a in articles"
              :key="a!.id"
              @click="emit('navigateArticle', a!.id)"
              class="w-full flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-left"
            >
              <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen :size="14" class="text-indigo-600" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-gray-700">{{ a!.title }}</div>
                <div class="text-[10px] text-gray-400">{{ a!.category }}</div>
              </div>
              <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{{ a!.type }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Дедлайн</div>
          <div class="flex items-center gap-2.5 mb-2">
            <Calendar :size="16" class="text-gray-400" />
            <span class="text-sm font-semibold text-gray-800">{{ formatDate(task.deadline) }}</span>
          </div>
          <div :class="['text-xs font-medium px-2.5 py-1.5 rounded-lg inline-block', deadlineClass]">
            {{ deadlineLabel }}
          </div>
        </div>

        <div v-if="contacts.length > 0" class="bg-white rounded-2xl border border-gray-200 p-5">
          <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Ответственные</div>
          <div class="space-y-3.5">
            <div v-for="c in contacts" :key="c!.id">
              <div class="flex items-center gap-2.5 mb-1.5">
                <div class="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {{ c!.avatar }}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-800 leading-tight">{{ c!.name }}</div>
                  <div class="text-[11px] text-gray-500">{{ c!.position }}</div>
                </div>
              </div>
              <div class="pl-10 space-y-1">
                <a :href="`mailto:${c!.email}`" class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                  <Mail :size="11" />{{ c!.email }}
                </a>
                <a v-if="c!.phone" :href="`tel:${c!.phone}`" class="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 transition-colors">
                  <Phone :size="11" />{{ c!.phone }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
