import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('../layouts/AdminLayout.vue'),
    meta: { requiereAuth: true, soloAdmin: true },
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
        path: 'libros/editar/:id',
        component: () => import('@/views/admin/BookEditView.vue'),
        name: 'admin-libro-editar',
      },
      {
        path: 'libros/:id',
        component: () => import('@/views/admin/BookDetailView.vue'),
        name: 'admin-libro-detail',
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

      // ========== USUARIOS ==========
      {
        path: 'usuarios',
        component: () => import('@/views/admin/UsersListView.vue'),
        name: 'admin-usuarios',
      },
      {
        path: 'usuarios/nuevo',
        component: () => import('@/views/admin/UserCreateView.vue'),
        name: 'admin-usuario-nuevo',
      },
      {
        path: 'usuarios/eliminar/:id',
        component: () => import('@/views/admin/UserDeleteView.vue'),
        name: 'admin-usuario-eliminar',
      },
      {
        path: 'usuarios/editar/:id',
        component: () => import('@/views/admin/UserEditView.vue'),
        name: 'admin-usuario-editar',
      },
      {
        path: 'usuarios/:id',
        component: () => import('@/views/admin/UserDetailView.vue'),
        name: 'admin-usuario-detalle',
      },

      // ========== PEDIDOS ==========
      {
        path: 'pedidos',
        component: () => import('@/views/admin/OrderListView.vue'),
        name: 'admin-pedidos',
      },
      {
        path: 'pedidos/editar/:id',
        component: () => import('@/views/admin/OrderEditView.vue'),
        name: 'admin-pedido-editar',
      },
      {
        path: 'pedidos/:id',
        component: () => import('@/views/admin/OrderDetailView.vue'),
        name: 'admin-pedido-detalle',
      },
    ],
  },
]
