import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export const useShopStore = defineStore('shop', () => {
  const authStore = useAuthStore()

  // --- ESTADOS REACTIVOS ---
  const libros = ref<any[]>([])
  const libroDetalle = ref<any | null>(null)
  const categorias = ref<any[]>([])

  // Estados específicos para la Home
  const topVentas = ref<any[]>([])
  const novedades = ref<any[]>([])

  // Paginación y carga
  const totalPaginas = ref(0)
  const paginaActual = ref(1)
  const cargando = ref(false)

  // --- LLAMADAS A LA API ---
  // GET /api/tienda (Listado para la tienda con búsqueda y paginación)
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

  // GET /api/tienda/top (Los más vendidos de la Home)
  async function cargarTopVentas() {
    cargando.value = true
    try {
      topVentas.value = await authStore.apiFetch('/tienda/top')
    } catch (error) {
      console.error('Error cargando top ventas:', error)
    } finally {
      cargando.value = false
    }
  }

  // GET /api/tienda/ultimos (Las novedades de la Home)
  async function cargarNovedades() {
    cargando.value = true
    try {
      novedades.value = await authStore.apiFetch('/tienda/ultimos')
    } catch (error) {
      console.error('Error cargando novedades:', error)
    } finally {
      cargando.value = false
    }
  }

  // GET /api/tienda/{id} (Detalle de un libro individual)
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
    topVentas,
    novedades,
    totalPaginas,
    paginaActual,
    cargando,
    cargarLibros,
    cargarTopVentas,
    cargarNovedades,
    cargarDetalle,
  }
})
