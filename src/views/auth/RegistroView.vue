<template>
  <main id="contenedor-principal">
    <ClientForm :es-edicion="false" :cargando="cargando" @submit="handleSubmit" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificacion } from '@/composables/useNotificacion'
import ClientForm from '@/components/forms/ClientForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const notificacion = useNotificacion()
const cargando = ref(false)

async function handleSubmit(formData: FormData) {
  cargando.value = true
  try {
    await authStore.registro(formData)

    router.push({
      path: '/auth/login',
      state: {
        mensaje: '¡Cuenta creada con éxito! Ya puedes iniciar sesión.',
        tipo: 'exito',
      },
    })
  } catch (error: any) {
    notificacion.error(error.message || 'Error al procesar el registro')
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
main {
  background-color: #333;
  color: #474747;
}
</style>
