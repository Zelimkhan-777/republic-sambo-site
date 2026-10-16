<script setup>
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

const highVisibility = ref(localStorage.getItem('school-high-visibility') === 'true')

watch(highVisibility, (enabled) => {
  document.documentElement.classList.toggle('high-visibility-mode', enabled)
  localStorage.setItem('school-high-visibility', String(enabled))
}, { immediate: true })
</script>

<template>
  <div :class="{ 'high-visibility': highVisibility }">
    <a class="skip-link" href="#main">Перейти к содержимому</a>
    <SiteHeader v-model:high-visibility="highVisibility" />
    <RouterView />
    <SiteFooter />
  </div>
</template>
