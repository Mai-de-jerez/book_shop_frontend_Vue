import { createRouter, createWebHistory } from 'vue-router'
import { authRoutes } from './auth.routes'
import { clientRoutes } from './client.routes'
import { adminRoutes } from './admin.routes'
import { useAuthStore } from '@/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiereAuth?: boolean
    soloAdmin?: boolean
    soloCliente?: boolean
  }
}

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
    ...adminRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiereAuth && !auth.estaLogueado) return '/auth/login'
  if (to.meta.soloAdmin && !auth.esAdmin) return '/'
  if (to.meta.soloCliente && !auth.esCliente) return '/'
})

export default router
