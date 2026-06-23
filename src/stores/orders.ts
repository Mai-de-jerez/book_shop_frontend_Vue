// src/stores/order.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import type { PedidoResumen, PedidoDetalle, PedidoPost } from '@/interfaces/order_model'

export const useOrderStore = defineStore('order', () => {
  const authStore = useAuthStore()

  // --- ESTADO ---
  const pedidos = ref<PedidoResumen[]>([])
  const pedidoDetalle = ref<PedidoDetalle | null>(null)
  const cargando = ref(false)
  const totalPedidos = ref(0)
  const paginaActual = ref(1)
  const porPagina = ref(6)
  const textoBusqueda = ref('')

  // --- ACCIONES ---

  // GET /api/pedidos
  async function listarPedidos(busqueda = '', pagina = 1, porPaginaParam = 6) {
    cargando.value = true
    try {
      const params = new URLSearchParams({
        pagina: String(pagina),
        porPagina: String(porPaginaParam),
      })
      if (busqueda.trim()) params.append('busqueda', busqueda.trim())

      const data = await authStore.apiFetch(`/pedidos?${params.toString()}`)

      pedidos.value = data.contenido || []
      totalPedidos.value = data.total || 0
      paginaActual.value = data.pagina
      porPagina.value = data.porPagina
      textoBusqueda.value = busqueda
    } catch (error) {
      console.error('Error al listar pedidos:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // GET /api/pedidos/{id}
  async function obtenerPedido(id: number) {
    cargando.value = true
    try {
      pedidoDetalle.value = await authStore.apiFetch(`/pedidos/${id}`)
      return pedidoDetalle.value
    } catch (error) {
      console.error(`Error al obtener pedido ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // PUT /api/pedidos/{id}
  async function actualizarPedido(id: number, datos: PedidoPost) {
    cargando.value = true
    try {
      const respuesta = await authStore.apiFetch(`/pedidos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(datos),
      })
      // Refrescamos listado manteniendo estado actual
      await listarPedidos(textoBusqueda.value, paginaActual.value, porPagina.value)
      return respuesta
    } catch (error) {
      console.error(`Error al actualizar pedido ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  function resetDetalle(): void {
    pedidoDetalle.value = null
  }

  return {
    pedidos,
    pedidoDetalle,
    cargando,
    totalPedidos,
    paginaActual,
    porPagina,
    textoBusqueda,
    listarPedidos,
    obtenerPedido,
    actualizarPedido,
    resetDetalle,
  }
})
