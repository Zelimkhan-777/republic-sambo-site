<script setup>
import { ref } from 'vue'

defineProps({ highVisibility: Boolean })
const emit = defineEmits(['update:highVisibility'])
const menuOpen = ref(false)

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <div class="topbar">
    <div class="container topbar-inner">
      <div class="socials" aria-label="Социальные сети"><span>VK</span><span>MAX</span></div>
      <div class="topbar-actions">
        <span>Чеченская Республика</span>
        <button class="vision-toggle" type="button" :aria-pressed="highVisibility" @click="emit('update:highVisibility', !highVisibility)">
          {{ highVisibility ? 'Обычная версия' : '◉  Версия для слабовидящих' }}
        </button>
      </div>
    </div>
  </div>
  <header class="site-header" id="top">
    <div class="container masthead">
      <a class="brand" href="/#top" aria-label="Республиканская школа самбо — на главную">
        <span class="brand-mark" aria-hidden="true"><img src="/assets/minsport-chr-logo.png" alt="" /></span>
        <span class="brand-copy"><strong>Республиканская школа самбо</strong><small>ГБУ ДО · Чеченская Республика</small></span>
      </a>
      <div class="masthead-actions"><a class="contact-button" href="/#contacts">Связаться со школой <b>↗</b></a></div>
      <button class="menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="mobileNav" :aria-label="menuOpen ? 'Закрыть меню' : 'Открыть меню'" @click="menuOpen = !menuOpen"><span></span><span></span><span></span></button>
    </div>
    <div class="nav-row">
      <nav class="container desktop-nav" aria-label="Основная навигация">
        <a href="/#top">Главная</a>
        <details class="nav-dropdown"><summary>О школе</summary><div class="nav-dropdown-menu"><a href="/#information">Основные сведения об организации</a><a href="/#leadership">Руководство</a></div></details>
        <a href="/#documents">Документы</a><RouterLink to="/news">Новости</RouterLink><RouterLink to="/gallery">Галерея</RouterLink><a href="/#contacts">Контакты</a>
      </nav>
      <nav v-show="menuOpen" id="mobileNav" class="mobile-nav" aria-label="Мобильная навигация">
        <a href="/#top" @click="closeMenu">Главная</a><span class="nav-group-label">О ШКОЛЕ</span><a class="subnav-link" href="/#information" @click="closeMenu">Основные сведения об организации</a><a class="subnav-link" href="/#leadership" @click="closeMenu">Руководство</a><a href="/#documents" @click="closeMenu">Документы</a><RouterLink to="/news" @click="closeMenu">Новости</RouterLink><RouterLink to="/gallery" @click="closeMenu">Галерея</RouterLink><a href="/#contacts" @click="closeMenu">Контакты</a>
      </nav>
    </div>
  </header>
</template>
