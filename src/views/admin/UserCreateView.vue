<template>
  <UserForm @submit="handleCreate" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificacion } from '@/composables/useNotificacion'
import UserForm from '@/components/forms/UserForm.vue'

const router = useRouter()
const userStore = useUserStore()
const notificacion = useNotificacion()

async function handleCreate(formData: FormData) {
  try {
    await userStore.crearUsuario(formData)
    notificacion.exito('Usuario creado correctamente')
    router.push({ name: 'admin-usuarios' })
  } catch (error: any) {
    notificacion.error(error.message || 'Error al crear el usuario')
  }
}
</script>
