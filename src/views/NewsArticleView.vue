<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { assetUrl, loadNewsArticle } from '../services/directus.js'

const route = useRoute()
const article = ref(null)
const loading = ref(true)

onMounted(async () => {
  try { article.value = await loadNewsArticle(route.params.slug) } finally { loading.value = false }
})
</script>

<template>
  <main id="main" class="article-page container">
    <p v-if="loading">Загрузка…</p>
    <article v-else-if="article"><RouterLink class="text-link" to="/news">← Все новости</RouterLink><span class="eyebrow"><i></i>{{ article.category }}</span><h1>{{ article.title }}</h1><img v-if="article.cover" :src="assetUrl(article.cover)" :alt="article.title" /><div class="article-body" v-html="article.content || '<p>Материал готовится к публикации.</p>'"></div></article>
    <section v-else><h1>Новость не найдена</h1><RouterLink class="text-link" to="/news">Вернуться к новостям</RouterLink></section>
  </main>
</template>
