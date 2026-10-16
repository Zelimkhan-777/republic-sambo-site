import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { seoFromRoute } from './seo.js'
import './assets/site.css'

router.afterEach((to) => seoFromRoute(to))

createApp(App).use(router).mount('#app')
