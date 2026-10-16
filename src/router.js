import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import NewsArticleView from './views/NewsArticleView.vue'
import NewsListView from './views/NewsListView.vue'
import GalleryView from './views/GalleryView.vue'
import DocumentsView from './views/DocumentsView.vue'
import DynamicPageView from './views/DynamicPageView.vue'
import ContactsView from './views/ContactsView.vue'

export default createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { seo: {
        title: 'Школа самбо в Шали | ГБУ ДО «Республиканская школа самбо»',
        description: 'Официальный сайт ГБУ ДО «Республиканская школа самбо»: обучение самбо, новости, документы, руководство и контакты ФСК Шали.',
        image: '/assets/fsk-shali-building.jpg',
        schema: 'organization',
      } },
    },
    {
      path: '/news',
      name: 'news',
      component: NewsListView,
      meta: { seo: {
        title: 'Новости школы самбо | Республиканская школа самбо',
        description: 'Новости школы самбо в Шали: соревнования, учебно-тренировочные сборы, достижения спортсменов и события учреждения.',
        image: '/assets/shali-training.jpg',
      } },
    },
    {
      path: '/news/:slug',
      name: 'news-article',
      component: NewsArticleView,
      meta: { seo: {
        title: 'Новости | Республиканская школа самбо',
        description: 'Новости и события ГБУ ДО «Республиканская школа самбо».',
      } },
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryView,
      meta: { seo: {
        title: 'Галерея ФСК Шали | Республиканская школа самбо',
        description: 'Фотографии тренировок, соревнований, сборов и мероприятий Республиканской школы самбо на базе ФСК Шали.',
        image: '/assets/school-championship-shali.jpg',
      } },
    },
    {
      path: '/documents',
      name: 'documents',
      component: DocumentsView,
      meta: { seo: {
        title: 'Документы | ГБУ ДО «Республиканская школа самбо»',
        description: 'Официальные документы Республиканской школы самбо: сведения об организации, локальные акты, программы и отчётные материалы.',
      } },
    },
    {
      path: '/about/:slug',
      name: 'about-page',
      component: DynamicPageView,
      meta: { seo: {
        title: 'О школе | ГБУ ДО «Республиканская школа самбо»',
        description: 'Сведения о деятельности, руководстве и образовательной работе Республиканской школы самбо в Чеченской Республике.',
      } },
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: ContactsView,
      meta: { seo: {
        title: 'Контакты школы самбо в Шали | Республиканская школа самбо',
        description: 'Телефоны администрации, электронная почта и режим работы ГБУ ДО «Республиканская школа самбо» в Шали.',
      } },
    },
  ],
})
