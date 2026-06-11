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

  // Paginación, búsqueda y carga
  const totalPaginas = ref(0)
  const paginaActual = ref(1)
  const cargando = ref(false)
  const busqueda = ref('')

  // --- LLAMADAS A LA API ---
  // GET /api/tienda (Listado para la tienda con búsqueda y paginación)
  async function cargarLibros(nuevaBusqueda?: string, pagina = 1, porPagina = 8) {
    if (nuevaBusqueda !== undefined) busqueda.value = nuevaBusqueda
    cargando.value = true
    try {
      const params = new URLSearchParams()
      if (busqueda.value) params.set('busqueda', busqueda.value)
      params.set('pagina', String(pagina))
      params.set('porPagina', String(porPagina))

      const data = await authStore.apiFetch(`/tienda?${params.toString()}`)
      libros.value = data.contenido
      totalPaginas.value = Math.ceil(data.total / data.porPagina)
      paginaActual.value = data.pagina
    } catch (error) {
      console.error('Error cargando libros:', error)
      throw error
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
      throw error
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
      throw error
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
      throw error
    } finally {
      cargando.value = false
    }
  }

  function reset() {
    libros.value = []
    busqueda.value = ''
    paginaActual.value = 1
    totalPaginas.value = 0
  }

  return {
    libros,
    libroDetalle,
    categorias,
    topVentas,
    novedades,
    totalPaginas,
    paginaActual,
    busqueda,
    cargando,
    cargarLibros,
    cargarTopVentas,
    cargarNovedades,
    cargarDetalle,
    reset,
  }
})
