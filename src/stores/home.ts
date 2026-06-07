import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

const BASE_URL = 'http://localhost:8080/book-shop/api'

export const useTiendaStore = defineStore('tienda', () => {
  const authStore = useAuthStore()

  const topVentas = ref<any[]>([])
  const novedades = ref<any[]>([])
  const cargando = ref(false)

  async function cargarTopVentas() {
    cargando.value = true
    try {
      const res = await fetch(`${BASE_URL}/tienda/top`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      topVentas.value = await res.json()
    } catch (error) {
      console.error('Error cargando top ventas:', error)
    } finally {
      cargando.value = false
    }
  }

  async function cargarNovedades() {
    cargando.value = true
    try {
      const res = await fetch(`${BASE_URL}/tienda/ultimos`, {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      })
      novedades.value = await res.json()
    } catch (error) {
      console.error('Error cargando novedades:', error)
    } finally {
      cargando.value = false
    }
  }

  return {
    topVentas,
    novedades,
    cargando,
    cargarTopVentas,
    cargarNovedades,
  }
})
