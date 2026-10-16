<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { assetUrl, loadSchoolPage, loadSchoolPages } from '../services/directus.js'
import { applySeo, conciseDescription, siteUrl } from '../seo.js'

const route = useRoute()
const page = ref(null)
const pages = ref([])
const loading = ref(true)

const formatDate = (value) => value
  ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value))
  : ''

async function loadPage(slug) {
  loading.value = true
  try {
    const [currentPage, menuPages] = await Promise.all([
      loadSchoolPage(slug),
      loadSchoolPages(),
    ])
    page.value = currentPage
    pages.value = menuPages
    if (currentPage) {
      const description = conciseDescription(
        currentPage.excerpt || currentPage.content,
        'Сведения о ГБУ ДО «Республиканская школа самбо».',
      )
      applySeo({
        title: `${currentPage.title} | Республиканская школа самбо`,
        description,
        path: `/about/${slug}`,
        image: currentPage.cover ? assetUrl(currentPage.cover) : '/assets/fsk-shali-building.jpg',
        jsonLd: {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: currentPage.title,
          description,
          url: `${siteUrl}/about/${slug}`,
          isPartOf: {
            '@type': 'WebSite',
            name: 'ГБУ ДО «Республиканская школа самбо»',
            url: `${siteUrl}/`,
          },
        },
      })
    } else {
      applySeo({
        title: 'Страница не найдена | Республиканская школа самбо',
        description: 'Запрашиваемая страница не найдена.',
        path: `/about/${slug}`,
        robots: 'noindex, follow',
      })
    }
  } finally {
    loading.value = false
  }
}

watch(() => route.params.slug, loadPage, { immediate: true })
</script>

<template>
  <main id="main" :aria-busy="loading">
    <section class="inner-hero about-page-hero">
      <div class="container">
        <span class="eyebrow light"><i></i>О ШКОЛЕ</span>
        <h1>{{ page?.title || (loading ? 'Загрузка…' : 'Страница не найдена') }}</h1>
        <p v-if="page?.excerpt">{{ page.excerpt }}</p>
      </div>
    </section>

    <section v-if="loading" class="section content-page-section"><div class="container loading-state">Загрузка страницы…</div></section>

    <section v-else-if="page" class="section content-page-section">
      <div class="container content-page-layout">
        <aside class="content-page-nav" aria-label="Разделы о школе">
          <span>О ШКОЛЕ</span>
          <RouterLink v-for="item in pages" :key="item.id" :to="`/about/${item.slug}`" :class="{ active: item.slug === page.slug }">
            {{ item.menu_title || item.title }} <b>→</b>
          </RouterLink>
        </aside>

        <article class="content-page-article">
          <img v-if="page.cover" class="content-page-cover" :src="assetUrl(page.cover)" :alt="page.title" />
          <div class="article-body" v-html="page.content"></div>

          <section v-for="section in page.sections || []" :key="section.id" class="content-page-block">
            <span v-if="section.eyebrow" class="eyebrow"><i></i>{{ section.eyebrow }}</span>
            <h2 v-if="section.title">{{ section.title }}</h2>
            <img v-if="section.image" :src="assetUrl(section.image)" :alt="section.image_alt || section.title || page.title" loading="lazy" />
            <div v-if="section.content" class="article-body" v-html="section.content"></div>
          </section>

          <p v-if="page.date_updated" class="content-page-updated">Последнее обновление: {{ formatDate(page.date_updated) }}</p>
        </article>
      </div>
    </section>

    <section v-else class="section content-page-section">
      <div class="container empty-state"><h2>Страница не найдена</h2><p>Материал ещё не опубликован или был перемещён.</p><RouterLink class="text-link" to="/">Вернуться на главную →</RouterLink></div>
    </section>
  </main>
</template>
