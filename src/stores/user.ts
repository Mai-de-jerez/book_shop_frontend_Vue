// stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import type { Usuario, UsuarioPaginado } from '@/interfaces/user_models'

export const useUserStore = defineStore('user', () => {
  const authStore = useAuthStore()

  // --- ESTADO ---
  const usuarios = ref<Usuario[]>([])
  const usuarioDetalle = ref<Usuario | null>(null)
  const cargando = ref(false)
  const totalUsuarios = ref(0)
  const paginaActual = ref(1)
  const porPagina = ref(6)
  const textoBusqueda = ref('')

  // --- ACCIONES ---

  // Listar usuarios con paginación
  async function listarUsuarios(
    busqueda: string = '',
    pagina: number = 1,
    porPaginaParam: number = 6,
  ): Promise<UsuarioPaginado> {
    cargando.value = true
    try {
      const params = new URLSearchParams()
      if (busqueda.trim()) params.append('busqueda', busqueda.trim())
      params.append('pagina', String(pagina))
      params.append('porPagina', String(porPaginaParam))

      const data = (await authStore.apiFetch(`/usuarios?${params.toString()}`)) as UsuarioPaginado

      usuarios.value = data.usuarios || []
      totalUsuarios.value = data.total || 0
      paginaActual.value = data.pagina || 1
      porPagina.value = data.porPagina || 6
      textoBusqueda.value = busqueda

      return data
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Obtener un usuario por ID
  async function obtenerUsuario(id: number): Promise<Usuario> {
    cargando.value = true
    try {
      const data = (await authStore.apiFetch(`/usuarios/${id}`)) as Usuario
      usuarioDetalle.value = data
      return data
    } catch (error) {
      console.error(`Error al obtener usuario ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Crear usuario (solo admin)
  async function crearUsuario(formData: FormData): Promise<{ mensaje: string }> {
    cargando.value = true
    try {
      const data = (await authStore.apiFetch('/usuarios', {
        method: 'POST',
        body: formData,
      })) as { mensaje: string }

      // Recargar lista
      await listarUsuarios(textoBusqueda.value, paginaActual.value, porPagina.value)
      return data
    } catch (error) {
      console.error('Error al crear usuario:', error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Actualizar usuario (solo admin)
  async function actualizarUsuario(id: number, formData: FormData): Promise<{ mensaje: string }> {
    cargando.value = true
    try {
      const data = (await authStore.apiFetch(`/usuarios/${id}`, {
        method: 'PUT',
        body: formData,
      })) as { mensaje: string }

      // Actualizar en el array
      const index = usuarios.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        const usuarioActualizado = await obtenerUsuario(id)
        usuarios.value[index] = usuarioActualizado
      }

      return data
    } catch (error) {
      console.error(`Error al actualizar usuario ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Eliminar usuario (solo admin)
  async function eliminarUsuario(id: number): Promise<{ mensaje: string }> {
    cargando.value = true
    try {
      const data = (await authStore.apiFetch(`/usuarios/${id}`, {
        method: 'DELETE',
      })) as { mensaje: string }

      usuarios.value = usuarios.value.filter((u) => u.id !== id)
      totalUsuarios.value--

      if (usuarioDetalle.value?.id === id) {
        usuarioDetalle.value = null
      }

      return data
    } catch (error) {
      console.error(`Error al eliminar usuario ${id}:`, error)
      throw error
    } finally {
      cargando.value = false
    }
  }

  // Resetear estado
  function resetUsuarioDetalle(): void {
    usuarioDetalle.value = null
  }

  function resetPaginacion(): void {
    paginaActual.value = 1
    totalUsuarios.value = 0
    textoBusqueda.value = ''
  }

  return {
    // Estado
    usuarios,
    usuarioDetalle,
    cargando,
    totalUsuarios,
    paginaActual,
    porPagina,
    textoBusqueda,

    // Acciones
    listarUsuarios,
    obtenerUsuario,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    resetUsuarioDetalle,
    resetPaginacion,
  }
})
