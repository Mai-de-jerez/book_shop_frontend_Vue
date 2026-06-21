// stores/categoria.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'

export interface Categoria {
  id: number
  nombre: string
}

export const useCategoriaStore = defineStore('categoria', () => {
  const authStore = useAuthStore()

  const categorias = ref<Categoria[]>([])
  const cargando = ref(false)

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

  return {
    categorias,
    cargando,
    listarCategorias,
  }
})
