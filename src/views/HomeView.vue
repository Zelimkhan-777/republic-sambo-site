<script setup>
import { onMounted, ref } from 'vue'
import { assetUrl, loadHomePage } from '../services/directus.js'
import { fallback } from '../data/fallback.js'

const content = ref(fallback)
const loading = ref(true)

onMounted(async () => {
  content.value = await loadHomePage()
  loading.value = false
})

const formatDate = (value) => value ? new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value)) : ''
const fileLink = (file) => file ? assetUrl(file) : '#contacts'
</script>

<template>
  <main id="main" :aria-busy="loading">
    <section class="hero" aria-labelledby="heroTitle">
      <img class="hero-image hero-building" src="/assets/fsk-shali-building.jpg" alt="Здание физкультурно-спортивного комплекса «Шали»" />
      <div class="hero-overlay"></div>
      <div class="container hero-inner"><span class="location">⌖ &nbsp;г. Шали · Чеченская Республика</span><h1 id="heroTitle">Республиканская школа<br /><em>самбо</em></h1><p>Дополнительное образование, спортивная подготовка<br />и развитие самбо в Чеченской Республике.</p><div class="hero-actions"><a class="button button-light" href="#information">О школе <span>→</span></a><a class="button button-ghost" href="#documents">Документы <span>→</span></a></div><div class="hero-tags"><a href="#news">Новости <span>↗</span></a><a href="#gallery">Галерея <span>↗</span></a></div></div>
    </section>

    <section class="section services-section" aria-labelledby="servicesTitle"><div class="container"><div class="section-heading-row"><div><span class="eyebrow"><i></i>БЫСТРЫЙ ДОСТУП</span><h2 id="servicesTitle">Сервисы и разделы</h2></div><p>Основная информация<br />для поступающих и родителей</p></div><div class="service-grid"><a class="service-card service-card-featured" href="#information"><div class="service-top"><span class="service-icon">✓</span><small>ОРГАНИЗАЦИЯ</small></div><h3>О школе</h3><p>Основные сведения об учреждении и его деятельности.</p><div class="service-bottom"><span>Открыть раздел</span><b>→</b></div></a><a class="service-card" href="#documents"><div class="service-top"><span class="service-icon">▤</span><small>МАТЕРИАЛЫ</small></div><h3>Документы</h3><p>Локальные акты, программы и официальные сведения.</p><div class="service-bottom"><span>Открыть раздел</span><b>→</b></div></a><a class="service-card" href="#news"><div class="service-top"><span class="service-icon">◎</span><small>СОБЫТИЯ</small></div><h3>Новости</h3><p>События, соревнования и спортивная жизнь региона.</p><div class="service-bottom"><span>Посмотреть</span><b>→</b></div></a><a class="service-card" href="#gallery"><div class="service-top"><span class="service-icon">◫</span><small>МЕДИА</small></div><h3>Галерея</h3><p>Фотографии тренировок, турниров и спортивной жизни.</p><div class="service-bottom"><span>Смотреть</span><b>→</b></div></a></div></div></section>

    <section id="information" class="section about-section" aria-labelledby="aboutTitle"><div class="container about-grid"><div class="about-photo"><img src="/assets/shali-training.jpg" alt="Юные самбисты на учебно-тренировочном сборе в Шали" loading="lazy" /><span>Самбо в Чеченской Республике</span></div><div class="about-content"><span class="eyebrow"><i></i>ОСНОВНЫЕ СВЕДЕНИЯ</span><h2 id="aboutTitle">{{ content.about.title }}</h2><p class="lead">{{ content.about.lead }}</p><p>{{ content.about.text }}</p><a class="text-link" href="#documents">Документы школы <span>→</span></a></div></div></section>

    <section class="organization-section" aria-label="Сведения об организации"><div class="container organization-grid"><article class="organization-card"><small>ОБ УЧРЕЖДЕНИИ</small><h3>Основные сведения об организации</h3><p>{{ content.about.organization_details || 'Сведения об учреждении, образовательной деятельности и материально-техническом обеспечении будут опубликованы после утверждения.' }}</p></article><article id="leadership" class="organization-card"><small>РУКОВОДСТВО</small><template v-if="content.leadership.length"><h3>{{ content.leadership[0].name }}</h3><p>{{ content.leadership[0].position }}</p></template><template v-else><h3>Руководство</h3><p>Сведения о руководителе и административном составе школы будут размещены после официального назначения.</p></template></article></div></section>

    <section id="news" class="section media-section" aria-labelledby="newsTitle"><div class="container"><div class="section-heading-row"><div><span class="eyebrow"><i></i>В ЦЕНТРЕ ВНИМАНИЯ</span><h2 id="newsTitle">Новости</h2></div></div><div class="news-layout" v-if="content.news.length"><RouterLink class="news-feature" :to="`/news/${content.news[0].slug}`"><div class="news-feature-image"><img :src="assetUrl(content.news[0].cover, '/assets/shali-training.jpg')" :alt="content.news[0].title" loading="lazy" /></div><div class="news-feature-copy"><span>{{ content.news[0].category }}</span><h3>{{ content.news[0].title }}</h3><time :datetime="content.news[0].published_at">{{ formatDate(content.news[0].published_at) }}</time></div></RouterLink><div class="news-list"><RouterLink v-for="(item, index) in content.news.slice(1)" :key="item.id" :to="`/news/${item.slug}`"><img :src="assetUrl(item.cover, index ? '/assets/regional-tournament.jpg' : '/assets/grozny-competition.jpg')" :alt="item.title" loading="lazy" /><div><span>{{ item.category }}</span><h3>{{ item.title }}</h3><time :datetime="item.published_at">{{ formatDate(item.published_at) }}</time></div><b>↗</b></RouterLink></div></div></div></section>

    <section id="gallery" class="section gallery-section" aria-labelledby="galleryTitle"><div class="container"><div class="section-heading-row"><div><span class="eyebrow"><i></i>ФОТОГАЛЕРЕЯ</span><h2 id="galleryTitle">Галерея</h2></div></div><div class="gallery-grid"><div v-for="item in content.gallery.slice(0, 4)" :key="item.id" class="gallery-item"><img :src="assetUrl(item.image)" :alt="item.alt || 'Фотография школы самбо'" loading="lazy" /></div></div></div></section>

    <section id="documents" class="documents-section" aria-labelledby="documentsTitle"><div class="container documents-grid"><div class="documents-intro"><span class="eyebrow light"><i></i>ОТКРЫТОСТЬ И ПРОЗРАЧНОСТЬ</span><h2 id="documentsTitle">Документы<br />школы</h2><p>Официальные сведения, локальные акты, образовательные программы и отчётные материалы.</p><small>Документы публикуются и обновляются через административную панель школы.</small></div><div class="document-list"><a v-for="item in content.documents" :key="item.id" :href="fileLink(item.file)" :target="item.file ? '_blank' : undefined" :rel="item.file ? 'noopener noreferrer' : undefined"><span class="doc-icon">▤</span><span><strong>{{ item.title }}</strong><small>{{ item.description || item.category }}</small></span><b>↗</b></a></div></div></section>

    <section id="contacts" class="section contacts-section" aria-labelledby="contactsTitle"><div class="container"><span class="eyebrow"><i></i>КОНТАКТЫ</span><div class="contacts-layout"><div><h2 id="contactsTitle">Связаться со школой</h2><p>Актуальные контактные данные публикуются администрацией школы.</p></div><div class="contact-panel"><div><small>ОРГАНИЗАЦИЯ</small><strong>{{ content.contacts.organization }}</strong></div><div><small>РЕГИОН</small><strong>{{ content.contacts.region }}</strong></div><div><small>АДРЕС</small><strong>{{ content.contacts.address }}</strong></div><div v-if="content.contacts.phone"><small>ТЕЛЕФОН</small><strong>{{ content.contacts.phone }}</strong></div><div v-if="content.contacts.email"><small>ЭЛЕКТРОННАЯ ПОЧТА</small><strong>{{ content.contacts.email }}</strong></div></div></div></div></section>
  </main>
</template>
