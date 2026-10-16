<script setup>
import { computed, onMounted, ref } from 'vue'
import { assetUrl, loadDocuments } from '../services/directus.js'

const documents = ref([])
const query = ref('')
const loading = ref(true)

const normalize = (value) => String(value || '').toLocaleLowerCase('ru-RU').trim()

const sections = computed(() => {
  const search = normalize(query.value)
  const grouped = new Map()

  for (const document of documents.value) {
    const category = document.section?.title || document.category || 'Другие документы'
    const matches = !search || normalize(category).includes(search) || normalize(document.title).includes(search)
    if (!matches) continue
    if (!grouped.has(category)) grouped.set(category, [])
    grouped.get(category).push(document)
  }

  return Array.from(grouped, ([title, items]) => ({ title, items }))
})

const resultCount = computed(() => sections.value.reduce((sum, section) => sum + section.items.length, 0))

function documentWord(count) {
  const lastTwo = count % 100
  const last = count % 10
  if (lastTwo >= 11 && lastTwo <= 14) return 'документов'
  if (last === 1) return 'документ'
  if (last >= 2 && last <= 4) return 'документа'
  return 'документов'
}

onMounted(async () => {
  documents.value = await loadDocuments()
  loading.value = false
})
</script>

<template>
  <main id="main">
    <section class="inner-hero documents-hero"><div class="container"><span class="eyebrow light"><i></i>ОТКРЫТОСТЬ И ПРОЗРАЧНОСТЬ</span><h1>Документы</h1><p>Официальные сведения, локальные акты, образовательные программы и отчётные материалы школы.</p></div></section>
    <section class="section documents-page-section"><div class="container"><div class="document-search"><label for="documentSearch">Поиск по документам</label><div><span aria-hidden="true"></span><input id="documentSearch" v-model="query" type="search" placeholder="Введите название раздела или документа" autocomplete="off" /><button v-if="query" type="button" aria-label="Очистить поиск" @click="query = ''">×</button></div><small v-if="query && !loading">Найдено: {{ resultCount }}</small></div><p v-if="loading" class="loading-state">Загрузка документов…</p><div v-else-if="sections.length" class="document-sections"><section v-for="section in sections" :key="section.title" class="document-category"><div class="document-category-heading"><span>Раздел</span><h2>{{ section.title }}</h2><small>{{ section.items.length }} {{ documentWord(section.items.length) }}</small></div><div class="document-page-list"><component :is="item.file ? 'a' : 'div'" v-for="item in section.items" :key="item.id" class="document-page-item" :class="{ unavailable: !item.file }" :href="item.file ? assetUrl(item.file) : undefined" :target="item.file ? '_blank' : undefined" :rel="item.file ? 'noopener noreferrer' : undefined"><span class="document-page-icon">▤</span><span><strong>{{ item.title }}</strong><small>{{ item.description || (item.file ? 'Открыть документ' : 'Документ готовится к публикации') }}</small></span><b>{{ item.file ? '↗' : '—' }}</b></component></div></section></div><div v-else class="empty-state"><h2>Ничего не найдено</h2><p>Попробуйте изменить поисковый запрос.</p><button type="button" class="clear-search" @click="query = ''">Очистить поиск</button></div></div></section>
  </main>
</template>
