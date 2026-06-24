<template>
  <section id="vista-eliminar">
    <section class="form-container">
      <h2 class="titulo-seccion-form">¿ELIMINAR USUARIO?</h2>
      <div class="form-content">
        <p>Estás a punto de borrar permanentemente:</p>
        <h3>{{ userStore.usuarioDetalle?.nombre ?? 'Cargando...' }}</h3>
        <p class="parrafo-seguridad">Esta acción no se puede deshacer.</p>
      </div>
      <div class="form-buttons">
        <button class="btn-enviar" @click="confirmarEliminar" :disabled="cargando">
          {{ cargando ? 'ELIMINANDO...' : 'CONFIRMAR BORRADO' }}
        </button>
        <button class="btn-cancelar" @click="router.push(`/admin/usuarios`)">CANCELAR</button>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useNotificacion } from '@/composables/useNotificacion'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const notificacion = useNotificacion()
const cargando = ref(false)

onMounted(async () => {
  await userStore.obtenerUsuario(Number(route.params.id))
})

async function confirmarEliminar() {
  if (!userStore.usuarioDetalle) return
  cargando.value = true
  try {
    await userStore.eliminarUsuario(userStore.usuarioDetalle.id)
    notificacion.exito(`Usuario "${userStore.usuarioDetalle.nombre}" eliminado correctamente`)
    router.push('/admin/usuarios')
  } catch (e: any) {
    notificacion.error(e.message || 'Error al eliminar')
  } finally {
    cargando.value = false
  }
}
</script>
