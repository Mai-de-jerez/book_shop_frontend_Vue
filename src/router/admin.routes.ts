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
      // ========== LIBROS ==========
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
        path: 'libros/editar/:id',
        component: () => import('@/views/admin/BookEditView.vue'),
        name: 'admin-libro-editar',
      },

      // ========== CATEGORÍAS ==========
      {
        path: 'categorias',
        component: () => import('@/views/admin/CategoriesListView.vue'),
        name: 'admin-categorias',
      },
      {
        path: 'categorias/nueva',
        component: () => import('@/views/admin/CategoryCreateView.vue'),
        name: 'admin-categoria-nueva',
      },
      {
        path: 'categorias/eliminar/:id',
        component: () => import('@/views/admin/CategoryDeleteView.vue'),
        name: 'admin-categoria-eliminar',
      },
      {
        path: 'categorias/editar/:id',
        component: () => import('@/views/admin/CategoryEditView.vue'),
        name: 'admin-categoria-editar',
      },
    ],
  },
]
