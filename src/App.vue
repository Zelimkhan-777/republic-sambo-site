<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'

const highVisibility = ref(false)
</script>

<template>
  <div :class="{ 'high-visibility': highVisibility }">
    <a class="skip-link" href="#main">Перейти к содержимому</a>
    <SiteHeader v-model:high-visibility="highVisibility" />
    <RouterView />
    <SiteFooter />
  </div>
</template>
