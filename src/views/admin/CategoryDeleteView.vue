<template>
  <section class="form-container">
    <h2 class="titulo-seccion-form">¿ELIMINAR CATEGORÍA?</h2>
    <div class="form-content">
      <p>Estás a punto de borrar permanentemente:</p>
      <h3>{{ categoriaStore.categoriaDetalle?.nombre ?? 'Cargando...' }}</h3>
      <p class="parrafo-seguridad">Esta acción no se puede deshacer.</p>
    </div>
    <div class="form-buttons">
      <button class="btn-enviar" @click="confirmarEliminar" :disabled="cargando">
        {{ cargando ? 'ELIMINANDO...' : 'CONFIRMAR BORRADO' }}
      </button>
      <button class="btn-cancelar" @click="router.push(`/admin/categorias`)">CANCELAR</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCategoriaStore } from '@/stores/categories'
import { useNotificacion } from '@/composables/useNotificacion'

const route = useRoute()
const router = useRouter()
const categoriaStore = useCategoriaStore()
const notificacion = useNotificacion()
const cargando = ref(false)

onMounted(async () => {
  await categoriaStore.obtenerCategoria(Number(route.params.id))
})

async function confirmarEliminar() {
  if (!categoriaStore.categoriaDetalle) return
  cargando.value = true
  try {
    await categoriaStore.eliminarCategoria(categoriaStore.categoriaDetalle.id)
    notificacion.exito(
      `Categoría "${categoriaStore.categoriaDetalle.nombre}" eliminada correctamente`,
    )
    await router.replace('/admin/categorias')
  } catch (e: any) {
    notificacion.error(e.message || 'Error al eliminar')
  } finally {
    cargando.value = false
  }
}
</script>
