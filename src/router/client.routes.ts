import type { RouteRecordRaw } from 'vue-router'

export const clientRoutes: RouteRecordRaw[] = [
  {
    path: 'perfil/ver',
    name: 'perfil',
    component: () => import('../views/PerfilView.vue'),
  },
  {
    path: 'perfil/editar',
    name: 'editar-perfil',
    component: () => import('../views/EditarPerfilView.vue'),
  },
  {
    path: 'perfil/pedidos',
    name: 'mis-pedidos',
    component: () => import('../views/MisPedidosView.vue'),
  },
  {
    path: 'carrito',
    name: 'carrito',
    component: () => import('../views/CartView.vue'),
  },
  {
    path: 'checkout',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
  },
]
