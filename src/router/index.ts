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
        { path: 'tienda', name: 'tienda', component: () => import('@/views/ShopView.vue') },
        {
          path: 'tienda/:id',
          name: 'tienda-detalle',
          component: () => import('@/views/ShopDetailView.vue'),
        },
        {
          path: 'perfil/ver',
          name: 'perfil',
          component: () => import('@/views/PerfilView.vue'),
        },
        {
          path: 'perfil/editar',
          name: 'editar-perfil',
          component: () => import('@/views/EditarPerfilView.vue'),
        },
      ],
    },
    ...authRoutes,
  ],
})

export default router
