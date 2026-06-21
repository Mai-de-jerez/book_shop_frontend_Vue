<template>
  <BookForm :id="String(route.params.id)" @submit="handleUpdate" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useLibroStore } from '@/stores/book'
import { useNotificacion } from '@/composables/useNotificacion'
import BookForm from '@/components/forms/BookForm.vue'

const route = useRoute()
const router = useRouter()
const libroStore = useLibroStore()
const notificacion = useNotificacion()

async function handleUpdate(formData: FormData) {
  try {
    await libroStore.actualizarLibro(Number(route.params.id), formData)
    notificacion.exito('Libro actualizado correctamente')
    router.push({ name: 'admin-libros' })
  } catch (error: any) {
    notificacion.error(error.message || 'Error al actualizar el libro')
  }
}
</script>
