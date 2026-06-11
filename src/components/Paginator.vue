<template>
  <div class="paginacion-container">
    <button
      type="button"
      :disabled="paginaActual <= 1"
      @click="emit('cambiarPagina', paginaActual - 1)"
    >
      Anterior
    </button>
    <span id="num-pagina">Página {{ paginaActual }}</span>
    <button
      type="button"
      :disabled="paginaActual >= totalPaginas"
      @click="emit('cambiarPagina', paginaActual + 1)"
    >
      Siguiente
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  paginaActual: number
  totalPaginas: number
}>()

const emit = defineEmits<{
  cambiarPagina: [pagina: number]
}>()
</script>

<style scoped>
.paginacion-container button {
  padding: 10px 20px;
  font-size: 1rem;
}

.paginacion-container {
  text-align: center;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.paginacion-container button {
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.paginacion-container button:hover {
  background-color: #4a4a4a;
}

#num-pagina {
  margin: 0 15px;
  font-weight: bold;
}
@media (max-width: 480px) {
  /* Paginación: Botones en columna */
  .paginacion-container {
    flex-direction: column;
    gap: 15px;
  }

  #num-pagina {
    order: -1;
    margin-bottom: 10px;
  }
}
</style>
