<template>
  <BookForm @submit="handleCreate" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useLibroStore } from '@/stores/book'
import { useNotificacion } from '@/composables/useNotificacion'
import BookForm from '@/components/forms/BookForm.vue'

const router = useRouter()
const libroStore = useLibroStore()
const notificacion = useNotificacion()

async function handleCreate(formData: FormData) {
  try {
    await libroStore.crearLibro(formData)
    notificacion.exito('Libro creado correctamente')
    router.push({ name: 'admin-libros' })
  } catch (error: any) {
    notificacion.error(error.message || 'Error al crear el libro')
  }
}
</script>
