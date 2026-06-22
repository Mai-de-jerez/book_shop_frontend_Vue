import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import type { LibroResponse, PaginaLibros } from '@/interfaces/book_models'

export const useLibroStore = defineStore('libro', () => {
  const authStore = useAuthStore()

  // --- ESTADOS REACTIVOS ---
  const libros = ref<LibroResponse[]>([])
  const libroDetalle = ref<LibroResponse | null>(null)
  const cargando = ref(false)
  const totalElementos = ref(0)
  const paginaActual = ref(1)
  const porPagina = ref(6)
  const textoBusqueda = ref('')

  // --- MÉTODOS / ACCIONES ---

  /**
   * 1. GET /api/libros con filtros
   */

  async function listarLibros(busqueda = '', pagina = 1, porPaginaParam = 6): Promise<void> {
    cargando.value = true
    try {
      const params = new URLSearchParams()
      if (busqueda.trim()) params.append('busqueda', busqueda.trim())
      params.append('pagina', String(pagina))
      params.append('porPagina', String(porPaginaParam))

      const data = await authStore.apiFetch(`/libros?${params.toString()}`)

      if (data && typeof data === 'object' && 'contenido' in data) {
        const res = data as PaginaLibros
        libros.value = res.contenido || []
        totalElementos.value = res.total || 0
      } else {
        libros.value = Array.isArray(data) ? (data as LibroResponse[]) : []
      }
      paginaActual.value = pagina
      porPagina.value = porPaginaParam
      textoBusqueda.value = busqueda
    } catch (error) {
      console.error('Error al listar libros:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  /**
   * 2. GET /api/libros/{id}
   */
  async function obtenerLibroPorId(id: number): Promise<void> {
    cargando.value = true
    try {
      libroDetalle.value = (await authStore.apiFetch(`/libros/${id}`)) as LibroResponse
    } catch (error) {
      console.error(`Error al obtener libro ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  /**
   * 3. POST /api/libros (Usa FormData por el @MultipartConfig del servlet)
   */
  async function crearLibro(formData: FormData): Promise<{ mensaje: string }> {
    cargando.value = true
    try {
      const respuesta = await authStore.apiFetch('/libros', {
        method: 'POST',
        body: formData,
      })
      return respuesta as { mensaje: string }
    } catch (error) {
      console.error('Error al crear libro:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  /**
   * 4. PUT /api/libros/{id} (Usa FormData para procesar imágenes en el servlet)
   */
  async function actualizarLibro(id: number, formData: FormData): Promise<{ mensaje: string }> {
    cargando.value = true
    try {
      const respuesta = await authStore.apiFetch(`/libros/${id}`, {
        method: 'PUT',
        body: formData,
      })
      return respuesta as { mensaje: string }
    } catch (error) {
      console.error(`Error al actualizar libro ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  /**
   * 5. DELETE /api/libros/{id}
   */
  async function eliminarLibro(id: number): Promise<{ mensaje: string }> {
    cargando.value = true
    try {
      const respuesta = await authStore.apiFetch(`/libros/${id}`, {
        method: 'DELETE',
      })
      return respuesta as { mensaje: string }
    } catch (error) {
      console.error(`Error al eliminar libro ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  function resetDetalle(): void {
    libroDetalle.value = null
  }

  return {
    libros,
    libroDetalle,
    cargando,
    totalElementos,
    paginaActual,
    porPagina,
    textoBusqueda,
    listarLibros,
    obtenerLibroPorId,
    crearLibro,
    actualizarLibro,
    eliminarLibro,
    resetDetalle,
  }
})
