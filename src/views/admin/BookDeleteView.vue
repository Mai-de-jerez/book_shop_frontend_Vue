<template>
  <section id="vista-eliminar">
    <section class="form-container">
      <h2 class="titulo-seccion-form">¿ELIMINAR LIBRO?</h2>
      <div class="form-content">
        <p>Estás a punto de borrar permanentemente:</p>
        <h3>{{ libroStore.libroDetalle?.titulo ?? 'Cargando...' }}</h3>
        <p class="parrafo-seguridad">Esta acción no se puede deshacer.</p>
      </div>
      <div class="form-buttons">
        <button class="btn-enviar" @click="confirmarEliminar" :disabled="cargando">
          {{ cargando ? 'ELIMINANDO...' : 'CONFIRMAR BORRADO' }}
        </button>
        <button class="btn-cancelar" @click="router.push(`/admin/libros/${route.params.id}`)">
          CANCELAR
        </button>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLibroStore } from '@/stores/book'
import { useNotificacion } from '@/composables/useNotificacion'

const route = useRoute()
const router = useRouter()
const libroStore = useLibroStore()
const notificacion = useNotificacion()
const cargando = ref(false)

onMounted(async () => {
  await libroStore.obtenerLibroPorId(Number(route.params.id))
})

async function confirmarEliminar() {
  if (!libroStore.libroDetalle) return
  cargando.value = true
  try {
    await libroStore.eliminarLibro(libroStore.libroDetalle.id)
    notificacion.exito(`Libro "${libroStore.libroDetalle.titulo}" eliminado correctamente`)
    router.push('/admin/libros')
  } catch (e: any) {
    notificacion.error(e.message || 'Error al eliminar')
  } finally {
    cargando.value = false
  }
}
</script>
