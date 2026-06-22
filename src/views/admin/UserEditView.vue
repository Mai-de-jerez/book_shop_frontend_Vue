<template>
  <UserForm :id="String(route.params.id)" @submit="handleUpdate" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificacion } from '@/composables/useNotificacion'
import UserForm from '@/components/forms/UserForm.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const notificacion = useNotificacion()

async function handleUpdate(formData: FormData) {
  try {
    await userStore.actualizarUsuario(Number(route.params.id), formData)
    notificacion.exito('Usuario actualizado correctamente')
    router.push({ name: 'admin-usuarios' })
  } catch (error: any) {
    notificacion.error(error.message || 'Error al actualizar el usuario')
  }
}
</script>
