import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './auth.routes'
import { clientRoutes } from './client.routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'about', name: 'about', component: () => import('@/views/AboutView.vue') },
        { path: 'tienda', name: 'tienda', component: () => import('@/views/ShopView.vue') },
        {
          path: 'tienda/:id',
          name: 'tienda-detalle',
          component: () => import('@/views/ShopDetailView.vue'),
        },
        ...clientRoutes,
      ],
    },
    ...authRoutes,
  ],
})

export default router
