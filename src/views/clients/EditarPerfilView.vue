<template>
  <main id="contenedor-principal">
    <ClientForm
      :es-edicion="true"
      :foto-actual="clientStore.perfil?.foto ?? ''"
      :initial-values="{
        nombre: clientStore.perfil?.nombre ?? '',
        email: clientStore.perfil?.email ?? '',
      }"
      :cargando="clientStore.cargando"
      @submit="handleSubmit"
    />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/perfil'
import { useNotificacion } from '@/composables/useNotificacion'
import ClientForm from '@/components/forms/ClientForm.vue'

const router = useRouter()
const clientStore = useClientStore()
const notificacion = useNotificacion()

onMounted(async () => {
  if (!clientStore.perfil) {
    await clientStore.cargarPerfil()
  }
})

async function handleSubmit(formData: FormData) {
  try {
    await clientStore.actualizarPerfil(formData)
    notificacion.exito('Perfil actualizado correctamente')
    router.push('/perfil/ver')
  } catch (error: any) {
    notificacion.error(error.message || 'Error al actualizar el perfil')
  }
}
</script>
