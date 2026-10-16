import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import NewsArticleView from './views/NewsArticleView.vue'
import NewsListView from './views/NewsListView.vue'
import GalleryView from './views/GalleryView.vue'

export default createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/news', name: 'news', component: NewsListView },
    { path: '/news/:slug', name: 'news-article', component: NewsArticleView },
    { path: '/gallery', name: 'gallery', component: GalleryView },
  ],
})
