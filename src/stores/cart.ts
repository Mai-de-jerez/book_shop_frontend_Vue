import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartResponse, DetallePedido } from '@/interfaces/cart-models'
import { useAuthStore } from './auth'

export const useCartStore = defineStore('cart', () => {
  const carrito = ref<DetallePedido[]>(JSON.parse(sessionStorage.getItem('carrito') || '[]'))
  const total = computed(() =>
    carrito.value.reduce((acc, item) => acc + item.cantidad * item.precioVenta, 0),
  )

  const authStore = useAuthStore()

  function persistir() {
    sessionStorage.setItem('carrito', JSON.stringify(carrito.value))
  }

  async function sincronizarCarrito(path: string, payload: any = {}) {
    try {
      const data: CartResponse = await authStore.apiFetch(`/carrito${path}`, {
        method: 'POST',
        body: JSON.stringify({
          carrito: carrito.value,
          ...payload,
        }),
      })

      carrito.value = data.carrito || []
      persistir()
    } catch (error) {
      console.error('Fallo en el Carrito:', error)
      throw error
    }
  }

  async function agregar(idLibro: number, cantidad: number) {
    await sincronizarCarrito('/agregar', { id_libro: idLibro, cantidad })
  }

  async function eliminar(idLibro: number) {
    await sincronizarCarrito('/eliminar', { id_libro: idLibro })
  }

  async function actualizar(idLibro: number, cantidad: number) {
    await sincronizarCarrito('/actualizar', { id_libro: idLibro, cantidad })
  }

  async function cargar() {
    await sincronizarCarrito('/ver')
  }

  const totalItems = computed(() => carrito.value.reduce((acc, item) => acc + item.cantidad, 0))

  return { carrito, total, totalItems, agregar, eliminar, actualizar, cargar }
})
