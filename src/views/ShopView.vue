<template>
  <div>
    <div class="seccion-header">
      <h2 class="titulo-seccion">LISTADO DE PRODUCTOS</h2>
      <!-- Buscador -->
      <SearchInput
        v-model="shopStore.busqueda"
        placeholder="Buscar libros..."
        @buscar="(v) => shopStore.cargarLibros(v, 1)"
        @limpiar="limpiarBusqueda"
      />
    </div>

    <!-- Grid -->
    <section class="contenedor-grid">
      <p v-if="shopStore.cargando" class="cargando">Cargando libros... 🦎</p>
      <p v-else-if="shopStore.libros.length === 0">No hay libros disponibles.</p>
      <BookCard v-else v-for="libro in shopStore.libros" :key="libro.id" :libro="libro" />
    </section>
    <!-- Paginación -->
    <Paginator
      :pagina-actual="shopStore.paginaActual"
      :total-paginas="shopStore.totalPaginas"
      @cambiar-pagina="cambiarPagina"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useShopStore } from '@/stores/shop'
import Paginator from '@/components/Paginator.vue'
import SearchInput from '@/components/SearchInput.vue'
import BookCard from '@/components/BookCard.vue'

const shopStore = useShopStore()

function limpiarBusqueda() {
  shopStore.cargarLibros('', 1)
}

function cambiarPagina(pagina: number) {
  shopStore.cargarLibros(shopStore.busqueda, pagina)
}

onMounted(() => {
  if (shopStore.libros.length === 0) {
    shopStore.cargarLibros()
  }
})
</script>
<style scoped>
.seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
}
.titulo-seccion {
  margin-top: 8px;
  margin-bottom: 8px;
}

section.contenedor-grid {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .seccion-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .titulo-seccion {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
