import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/admin/AdminDashView.vue'),
        name: 'admin-dashboard',
      },
      {
        path: 'libros',
        component: () => import('@/views/admin/BookListView.vue'),
        name: 'admin-libros',
      },
      {
        path: 'libros/nuevo',
        component: () => import('@/views/admin/BookCreateView.vue'),
        name: 'admin-libro-nuevo',
      },
      {
        path: 'libros/eliminar/:id',
        component: () => import('@/views/admin/BookDeleteView.vue'),
        name: 'admin-libro-eliminar',
      },
      {
        path: 'libros/:id',
        component: () => import('@/views/admin/BookDetailView.vue'),
        name: 'admin-libro-detail',
      },
      {
        path: 'libros/:id/editar',
        component: () => import('@/views/admin/BookEditView.vue'),
        name: 'admin-libro-editar',
      },
    ],
  },
]
