// src/stores/client.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import type { Usuario, Pedido, PedidoDetalle } from '@/interfaces/miPerfil'

export const useClientStore = defineStore('client', () => {
  const authStore = useAuthStore()

  // --- ESTADOS REACTIVOS ---
  const perfil = ref<Usuario | null>(null)
  const pedidos = ref<Pedido[]>([])
  const pedidoDetalle = ref<PedidoDetalle | null>(null)
  const cargando = ref(false)

  async function cargarPerfil(): Promise<void> {
    cargando.value = true
    try {
      perfil.value = (await authStore.apiFetch('/perfil/ver')) as Usuario
    } finally {
      cargando.value = false
    }
  }

  async function actualizarPerfil(formData: FormData): Promise<void> {
    cargando.value = true
    try {
      const data = (await authStore.apiFetch('/perfil/editar', {
        method: 'PUT',
        body: formData,
      })) as { usuario: Usuario; mensaje: string }

      if (data?.usuario) {
        perfil.value = data.usuario
        authStore.nombre = data.usuario.nombre
        sessionStorage.setItem('nombre', data.usuario.nombre)
      }
    } finally {
      cargando.value = false
    }
  }

  async function cargarPedidos(): Promise<void> {
    cargando.value = true
    try {
      pedidos.value = (await authStore.apiFetch('/perfil/pedidos')) as Pedido[]
    } finally {
      cargando.value = false
    }
  }

  async function cargarDetallePedido(idPedido: number): Promise<void> {
    cargando.value = true
    try {
      pedidoDetalle.value = (await authStore.apiFetch(
        `/perfil/pedidos/${idPedido}`,
      )) as PedidoDetalle
    } finally {
      cargando.value = false
    }
  }

  function resetDetalle(): void {
    pedidoDetalle.value = null
  }

  return {
    perfil,
    pedidos,
    pedidoDetalle,
    cargando,
    cargarPerfil,
    actualizarPerfil,
    cargarPedidos,
    cargarDetallePedido,
    resetDetalle,
  }
})
