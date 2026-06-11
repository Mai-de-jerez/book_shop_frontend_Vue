import type { RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('../views/auth/LoginView.vue'),
      },
      {
        path: 'registro',
        name: 'registro',
        component: () => import('../views/auth/RegistroView.vue'),
      },
      {
        path: 'recuperar',
        name: 'recuperar',
        component: () => import('../views/auth/RecuperarPasswordView.vue'),
      },
      {
        path: 'recuperar/confirmar',
        name: 'nueva-password',
        component: () => import('../views/auth/NuevaPasswordView.vue'),
      },
    ],
  },
]
