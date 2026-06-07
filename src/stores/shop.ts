import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useShopStore = defineStore('shop', () => {
  const authStore = useAuthStore()

  const libros = ref<any[]>([])
  const libroDetalle = ref<any | null>(null)
  const categorias = ref<any[]>([])
  const totalPaginas = ref(0)
  const paginaActual = ref(1)
  const cargando = ref(false)

  async function cargarLibros(busqueda?: string, pagina = 1, porPagina = 8) {
    cargando.value = true
    try {
      const params = new URLSearchParams()
      if (busqueda) params.set('busqueda', busqueda)
      params.set('pagina', String(pagina))
      params.set('porPagina', String(porPagina))

      const data = await authStore.apiFetch(`/tienda?${params.toString()}`)
      libros.value = data.contenido
      totalPaginas.value = Math.ceil(data.total / data.porPagina)
      paginaActual.value = data.pagina
    } catch (error) {
      console.error('Error cargando libros:', error)
    } finally {
      cargando.value = false
    }
  }

  async function cargarDetalle(id: number) {
    cargando.value = true
    try {
      libroDetalle.value = await authStore.apiFetch(`/tienda/${id}`)
    } catch (error) {
      console.error('Error cargando detalle:', error)
    } finally {
      cargando.value = false
    }
  }

  return {
    libros,
    libroDetalle,
    categorias,
    totalPaginas,
    paginaActual,
    cargando,
    cargarLibros,
    cargarDetalle,
  }
})
