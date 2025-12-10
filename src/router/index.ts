import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'
import MusicPage from '@/pages/MusicPage.vue'
import UploadPage from '@/pages/UploadPage.vue'
import LoginPage from '@/pages/LoginPage.vue'
import { useAuth } from '@/auth/useAuth.ts'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '', name: 'home', component: HomePage, meta: { requireAuth: true } },
    { path: '/', name: 'home', component: HomePage, meta: { requireAuth: true } },
    { path: '/upload', name: 'upload', component: UploadPage, meta: { requireAuth: true } },
    { path: '/login', name: 'login', component: LoginPage },
  ],
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth()

  if (to.meta.requireAuth && !isAuthenticated.value) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})

export default router
