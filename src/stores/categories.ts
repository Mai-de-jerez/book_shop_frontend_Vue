// stores/categories.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export interface Categoria {
  id: number
  nombre: string
}

export interface CategoriaPaginada {
  pagina: number
  total: number
  porPagina: number
  categorias: Categoria[]
}

export const useCategoriaStore = defineStore('categoria', () => {
  const authStore = useAuthStore()

  // --- ESTADO ---
  const categorias = ref<Categoria[]>([])
  const categoriaActual = ref<Categoria | null>(null)
  const categoriaDetalle = ref<Categoria | null>(null)
  const cargando = ref(false)
  const totalCategorias = ref(0)
  const paginaActual = ref(1)
  const porPagina = ref(6)
  const textoBusqueda = ref('')

  // --- ACCIONES ---

  // Listar todas las categorías (sin paginación)
  async function listarCategorias(): Promise<void> {
    cargando.value = true
    try {
      const data = await authStore.apiFetch('/categorias')
      categorias.value = Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error al cargar categorías:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Listar categorías con paginación
  async function listarCategoriasPaginado(
    busqueda: string = '',
    pagina: number = 1,
    porPaginaParam: number = 6,
  ): Promise<CategoriaPaginada> {
    cargando.value = true
    try {
      const params = new URLSearchParams()
      if (busqueda) params.append('busqueda', busqueda)
      params.append('pagina', String(pagina))
      params.append('porPagina', String(porPaginaParam))

      const data = (await authStore.apiFetch(
        `/categorias?${params.toString()}`,
      )) as CategoriaPaginada

      categorias.value = data.categorias || []
      totalCategorias.value = data.total || 0
      paginaActual.value = data.pagina || 1
      porPagina.value = data.porPagina || 6
      textoBusqueda.value = busqueda

      return data
    } catch (error) {
      console.error('Error al cargar categorías paginadas:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Obtener una categoría por ID
  async function obtenerCategoria(id: number): Promise<Categoria> {
    cargando.value = true
    try {
      const data = (await authStore.apiFetch(`/categorias/${id}`)) as Categoria
      categoriaActual.value = data
      categoriaDetalle.value = data
      return data
    } catch (error) {
      console.error(`Error al obtener categoría ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Crear una nueva categoría
  async function crearCategoria(nombre: string): Promise<{ mensaje: string }> {
    cargando.value = true
    try {
      const data = (await authStore.apiFetch('/categorias', {
        method: 'POST',
        body: JSON.stringify({ nombre }),
        headers: { 'Content-Type': 'application/json' },
      })) as { mensaje: string }

      // Recargar lista para actualizar
      await listarCategoriasPaginado(undefined, paginaActual.value, porPagina.value)

      return data
    } catch (error) {
      console.error('Error al crear categoría:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Actualizar una categoría
  async function actualizarCategoria(id: number, nombre: string): Promise<{ mensaje: string }> {
    cargando.value = true
    try {
      const data = (await authStore.apiFetch(`/categorias/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nombre }),
        headers: { 'Content-Type': 'application/json' },
      })) as { mensaje: string }

      // Actualizar en el array
      const index = categorias.value.findIndex((c) => c.id === id)
      if (index !== -1) {
        categorias.value[index] = { id, nombre }
      }

      if (categoriaActual.value?.id === id) {
        categoriaActual.value = { id, nombre }
      }

      return data
    } catch (error) {
      console.error(`Error al actualizar categoría ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Eliminar una categoría
  async function eliminarCategoria(id: number): Promise<{ mensaje: string }> {
    cargando.value = true
    try {
      const data = (await authStore.apiFetch(`/categorias/${id}`, {
        method: 'DELETE',
      })) as { mensaje: string }

      // Eliminar del array
      categorias.value = categorias.value.filter((c) => c.id !== id)

      if (categoriaActual.value?.id === id) {
        categoriaActual.value = null
      }

      // Actualizar total
      totalCategorias.value--

      return data
    } catch (error: any) {
      // Capturar error 409 (conflicto por libros asociados)
      if (error.message?.includes('409') || error.status === 409) {
        throw new Error('No se puede eliminar la categoría porque tiene libros asociados')
      }
      console.error(`Error al eliminar categoría ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Resetear estado
  function resetCategoriaActual(): void {
    categoriaActual.value = null
  }

  function resetPaginacion(): void {
    paginaActual.value = 1
    totalCategorias.value = 0
  }

  return {
    // Estado
    categorias,
    categoriaActual,
    categoriaDetalle,
    cargando,
    totalCategorias,
    paginaActual,
    porPagina,
    textoBusqueda,

    // Acciones
    listarCategorias,
    listarCategoriasPaginado,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    resetCategoriaActual,
    resetPaginacion,
  }
})
