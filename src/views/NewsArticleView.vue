<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { assetUrl, loadNewsArticle } from '../services/directus.js'
import { absoluteUrl, applySeo, conciseDescription, siteUrl } from '../seo.js'

const route = useRoute()
const article = ref(null)
const loading = ref(true)

async function loadArticle(slug) {
  loading.value = true
  try {
    article.value = await loadNewsArticle(slug)
    if (article.value) {
      const description = conciseDescription(
        article.value.excerpt || article.value.content,
        'Новость ГБУ ДО «Республиканская школа самбо».',
      )
      const image = assetUrl(article.value.cover, '/assets/fsk-shali-building.jpg')
      applySeo({
        title: `${article.value.title} | Новости школы самбо`,
        description,
        path: `/news/${slug}`,
        image,
        type: 'article',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.value.title,
          description,
          image: [absoluteUrl(image)],
          datePublished: article.value.published_at,
          dateModified: article.value.date_updated || article.value.published_at,
          mainEntityOfPage: `${siteUrl}/news/${slug}`,
          publisher: {
            '@type': 'EducationalOrganization',
            name: 'ГБУ ДО «Республиканская школа самбо»',
            url: `${siteUrl}/`,
          },
        },
      })
    } else {
      applySeo({
        title: 'Новость не найдена | Республиканская школа самбо',
        description: 'Запрашиваемая новость не найдена.',
        path: `/news/${slug}`,
        robots: 'noindex, follow',
      })
    }
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, loadArticle, { immediate: true })
</script>

<template>
  <main id="main" class="article-page container">
    <p v-if="loading">Загрузка…</p>
    <article v-else-if="article"><RouterLink class="text-link" to="/news">← Все новости</RouterLink><span class="eyebrow"><i></i>{{ article.category }}</span><h1>{{ article.title }}</h1><img v-if="article.cover" :src="assetUrl(article.cover)" :alt="article.title" /><div class="article-body" v-html="article.content || '<p>Материал готовится к публикации.</p>'"></div></article>
    <section v-else><h1>Новость не найдена</h1><RouterLink class="text-link" to="/news">Вернуться к новостям</RouterLink></section>
  </main>
</template>
