<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fallback } from '../data/fallback.js'
import { loadSchoolPages } from '../services/directus.js'

defineProps({ highVisibility: Boolean })
const emit = defineEmits(['update:highVisibility'])
const menuOpen = ref(false)
const schoolMenu = ref(null)
const schoolPages = ref(fallback.pages)
const route = useRoute()

function closeAllMenus() {
  menuOpen.value = false
  closeSchoolMenu()
}

function handlePageClick(event) {
  if (schoolMenu.value?.open && !schoolMenu.value.contains(event.target)) closeSchoolMenu()
}

function handleKeydown(event) {
  if (event.key === 'Escape') closeAllMenus()
}

onMounted(async () => {
  document.addEventListener('pointerdown', handlePageClick)
  document.addEventListener('keydown', handleKeydown)
  schoolPages.value = await loadSchoolPages()
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handlePageClick)
  document.removeEventListener('keydown', handleKeydown)
})

watch(() => route.fullPath, closeAllMenus)

function closeMenu() {
  menuOpen.value = false
}

function closeSchoolMenu() {
  if (schoolMenu.value) schoolMenu.value.open = false
}
</script>

<template>
  <div class="topbar">
    <div class="container topbar-inner">
      <div class="socials" aria-label="Социальные сети"><span>VK</span><span>MAX</span></div>
      <div class="topbar-actions">
        <span>Чеченская Республика</span>
        <button class="vision-toggle" type="button" :aria-pressed="highVisibility" @click="emit('update:highVisibility', !highVisibility)">
          <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.8"/></svg>
          <span>{{ highVisibility ? 'Обычная версия сайта' : 'Версия для слабовидящих' }}</span>
        </button>
      </div>
    </div>
  </div>
  <header class="site-header" id="top">
    <div class="container masthead">
      <a class="brand" href="/#top" aria-label="Республиканская школа самбо — на главную">
        <span class="brand-mark" aria-hidden="true"><img src="/assets/minsport-chr-logo.png" alt="" /></span>
        <span class="brand-copy"><small>Государственное бюджетное учреждение дополнительного образования</small><strong>Республиканская школа самбо</strong></span>
      </a>
      <div class="masthead-actions"><RouterLink class="contact-button" to="/contacts">Связаться со школой <b>↗</b></RouterLink></div>
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="mobileNav" :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'" @click="menuOpen = !menuOpen"><span></span><span></span><span></span></button>
    </div>
    <div class="nav-row">
      <nav class="container desktop-nav" aria-label="Основная навигация">
        <a href="/#top">Главная</a>
        <details ref="schoolMenu" class="nav-dropdown"><summary><span>О школе</span><svg class="nav-dropdown-chevron" aria-hidden="true" viewBox="0 0 12 8"><path d="m1 1.25 5 5 5-5"/></svg></summary><div class="nav-dropdown-menu" @click="closeSchoolMenu"><RouterLink v-for="page in schoolPages" :key="page.id" :to="`/about/${page.slug}`">{{ page.menu_title || page.title }}</RouterLink></div></details>
        <RouterLink to="/documents">Документы</RouterLink><RouterLink to="/news">Новости</RouterLink><RouterLink to="/gallery">Галерея</RouterLink><RouterLink to="/contacts">Контакты</RouterLink>
      </nav>
      <nav v-show="menuOpen" id="mobileNav" class="mobile-nav" aria-label="Мобильная навигация">
        <a href="/#top" @click="closeMenu">Главная</a><span class="nav-group-label">О ШКОЛЕ</span><RouterLink v-for="page in schoolPages" :key="page.id" class="subnav-link" :to="`/about/${page.slug}`" @click="closeMenu">{{ page.menu_title || page.title }}</RouterLink><RouterLink to="/documents" @click="closeMenu">Документы</RouterLink><RouterLink to="/news" @click="closeMenu">Новости</RouterLink><RouterLink to="/gallery" @click="closeMenu">Галерея</RouterLink><RouterLink to="/contacts" @click="closeMenu">Контакты</RouterLink>
      </nav>
    </div>
  </header>
</template>
