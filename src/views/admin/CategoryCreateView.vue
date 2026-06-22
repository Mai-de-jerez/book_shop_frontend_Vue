<template>
  <CategoryForm @submit="handleCreate" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCategoriaStore } from '@/stores/categories'
import { useNotificacion } from '@/composables/useNotificacion'
import CategoryForm from '@/components/forms/CategoryForm.vue'

const router = useRouter()
const categoriaStore = useCategoriaStore()
const notificacion = useNotificacion()

async function handleCreate(formData: FormData) {
  const nombre = formData.get('nombre') as string

  try {
    await categoriaStore.crearCategoria(nombre)

    notificacion.exito('Categoría creada correctamente')
    router.push({ name: 'admin-categorias' })
  } catch (error: any) {
    notificacion.error(error.message || 'Error al crear la categoría')
  }
}
</script>
