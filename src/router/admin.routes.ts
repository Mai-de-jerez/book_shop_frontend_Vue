import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      {
        path: '', // Al estar vacío, carga este componente por defecto en la URL /admin
        component: () => import('@/views/admin/AdminDashView.vue'),
        name: 'admin-dashboard',
      },
      {
        path: 'libros', // Ojo: SIN la barra '/' inicial
        component: () => import('@/views/admin/BookListView.vue'),
        name: 'admin-libros',
      },
    ],
  },
]
