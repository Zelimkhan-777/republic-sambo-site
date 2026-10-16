<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { assetUrl, loadNewsPage } from '../services/directus.js'

const route = useRoute()
const router = useRouter()
const pageSize = 6
const items = ref([])
const total = ref(0)
const loading = ref(true)
const currentPage = computed(() => Math.max(1, Number(route.query.page) || 1))
const pageCount = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

const formatDate = (value) => value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value)) : ''

async function fetchPage() {
  loading.value = true
  const result = await loadNewsPage(currentPage.value, pageSize)
  items.value = result.items
  total.value = result.total
  loading.value = false

  if (currentPage.value > pageCount.value) {
    router.replace({ name: 'news', query: pageCount.value > 1 ? { page: pageCount.value } : {} })
  }
}

function goToPage(page) {
  if (page < 1 || page > pageCount.value || page === currentPage.value) return
  router.push({ name: 'news', query: page > 1 ? { page } : {} })
}

watch(() => route.query.page, fetchPage, { immediate: true })
</script>

<template>
  <main id="main">
    <section class="inner-hero"><div class="container"><span class="eyebrow light"><i></i>СОБЫТИЯ ШКОЛЫ</span><h1>Новости</h1><p>Соревнования, учебно-тренировочные сборы и жизнь Республиканской школы самбо.</p></div></section>
    <section class="section news-index-section"><div class="container"><div class="listing-top"><p>Последние публикации</p><span v-if="total">Материалов: {{ total }}</span></div><p v-if="loading" class="loading-state">Загрузка новостей…</p><div v-else-if="items.length" class="news-index-grid"><RouterLink v-for="(item, index) in items" :key="item.id" class="news-index-card" :to="`/news/${item.slug}`"><div class="news-index-image"><img :src="assetUrl(item.cover, index % 2 ? '/assets/grozny-competition.jpg' : '/assets/shali-training.jpg')" :alt="item.title" loading="lazy" /></div><div class="news-index-copy"><span>{{ item.category }}</span><h2>{{ item.title }}</h2><div><time :datetime="item.published_at">{{ formatDate(item.published_at) }}</time><b>↗</b></div></div></RouterLink></div><div v-else class="empty-state"><h2>Новостей пока нет</h2><p>Новые материалы появятся после публикации в административной панели.</p></div><nav v-if="pageCount > 1" class="pagination" aria-label="Страницы новостей"><button type="button" :disabled="currentPage === 1" aria-label="Предыдущая страница" @click="goToPage(currentPage - 1)">←</button><button v-for="page in pageCount" :key="page" type="button" :class="{ active: page === currentPage }" :aria-current="page === currentPage ? 'page' : undefined" @click="goToPage(page)">{{ page }}</button><button type="button" :disabled="currentPage === pageCount" aria-label="Следующая страница" @click="goToPage(currentPage + 1)">→</button></nav></div></section>
  </main>
</template>
