<script setup>
import { onMounted, ref } from 'vue'
import { assetUrl, loadGallery } from '../services/directus.js'

const items = ref([])
const loading = ref(true)

onMounted(async () => {
  items.value = await loadGallery()
  loading.value = false
})
</script>

<template>
  <main id="main">
    <section class="inner-hero gallery-hero"><div class="container"><span class="eyebrow light"><i></i>ЖИЗНЬ ШКОЛЫ</span><h1>Галерея</h1><p>Тренировки, соревнования, сборы и важные события школы.</p></div></section>
    <section class="section gallery-page-section"><div class="container"><p v-if="loading" class="loading-state">Загрузка фотографий…</p><div v-else-if="items.length" class="gallery-page-grid"><figure v-for="item in items" :key="item.id"><img :src="assetUrl(item.image)" :alt="item.alt || 'Фотография школы самбо'" loading="lazy" /><figcaption v-if="item.alt">{{ item.alt }}</figcaption></figure></div><div v-else class="empty-state"><h2>Фотографий пока нет</h2><p>Новые материалы появятся после публикации в административной панели.</p></div></div></section>
  </main>
</template>
