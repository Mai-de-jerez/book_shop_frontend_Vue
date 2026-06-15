import type { RouteRecordRaw } from 'vue-router'

export const clientRoutes: RouteRecordRaw[] = [
  {
    path: 'perfil/ver',
    name: 'perfil',
    component: () => import('../views/clients/PerfilView.vue'),
  },
  {
    path: 'perfil/editar',
    name: 'editar-perfil',
    component: () => import('../views/clients/EditarPerfilView.vue'),
  },
  {
    path: 'perfil/pedidos',
    name: 'mis-pedidos',
    component: () => import('../views/clients/MisPedidosView.vue'),
  },
  {
    path: 'carrito',
    name: 'carrito',
    component: () => import('../views/clients/CartView.vue'),
  },
  {
    path: 'checkout',
    name: 'checkout',
    component: () => import('../views/clients/CheckoutView.vue'),
  },
]
