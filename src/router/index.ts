import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import MusicPage from '@/pages/MusicPage.vue'
import UploadPage from '@/pages/UploadPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/music', name: 'music', component: MusicPage },
    { path: '/upload', name: 'upload', component: UploadPage }
  ],
})

export default router
