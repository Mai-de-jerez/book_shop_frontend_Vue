import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './auth.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'about', name: 'about', component: () => import('@/views/AboutView.vue') },
      ],
    },
    ...authRoutes,
  ],
})

export default router
