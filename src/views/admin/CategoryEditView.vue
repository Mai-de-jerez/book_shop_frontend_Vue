<template>
  <CategoryForm :id="String(route.params.id)" @submit="handleUpdate" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useCategoriaStore } from '@/stores/categories'
import { useNotificacion } from '@/composables/useNotificacion'
import CategoryForm from '@/components/forms/CategoryForm.vue'

const route = useRoute()
const router = useRouter()
const categoriaStore = useCategoriaStore()
const notificacion = useNotificacion()

async function handleUpdate(formData: FormData) {
  try {
    const nombre = formData.get('nombre') as string

    await categoriaStore.actualizarCategoria(Number(route.params.id), nombre)

    notificacion.exito('Categoría actualizada correctamente')
    router.push({ name: 'admin-categorias' })
  } catch (error: any) {
    notificacion.error(error.message || 'Error al actualizar categoría')
  }
}
</script>
