import type { RouteRecordRaw } from 'vue-router'

export const clientRoutes: RouteRecordRaw[] = [
  {
    path: 'perfil/ver',
    name: 'perfil',
    meta: { requiereAuth: true, soloCliente: true },
    component: () => import('../views/clients/PerfilView.vue'),
  },
  {
    path: 'perfil/editar',
    name: 'editar-perfil',
    meta: { requiereAuth: true, soloCliente: true },
    component: () => import('../views/clients/EditarPerfilView.vue'),
  },
  {
    path: 'perfil/pedidos',
    name: 'mis-pedidos',
    meta: { requiereAuth: true, soloCliente: true },
    component: () => import('../views/clients/MisPedidosView.vue'),
  },
  {
    path: 'carrito',
    name: 'carrito',
    meta: { requiereAuth: true, soloCliente: true },
    component: () => import('../views/clients/CartView.vue'),
  },
  {
    path: 'checkout',
    name: 'checkout',
    meta: { requiereAuth: true, soloCliente: true },
    component: () => import('../views/clients/CheckoutView.vue'),
  },
]
