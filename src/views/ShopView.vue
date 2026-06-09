<template>
  <div>
    <!-- Buscador -->
    <section class="buscador-seccion">
      <input type="text" v-model="busqueda" placeholder="Buscar libros..." @input="onBusqueda" />
      <button type="button" class="btn-ver" @click="limpiarBusqueda">Limpiar</button>
    </section>

    <h2 class="titulo-seccion">LISTADO DE PRODUCTOS</h2>

    <!-- Grid -->
    <section class="contenedor-grid">
      <p v-if="shopStore.cargando" class="cargando">Cargando libros... 🦎</p>
      <p v-else-if="shopStore.libros.length === 0">No hay libros disponibles.</p>
      <div v-else v-for="libro in shopStore.libros" :key="libro.id" class="producto-card">
        <img :src="`/media/libros/${libro.imagen}`" :alt="`Portada de ${libro.titulo}`" />
        <h3>{{ libro.titulo }}</h3>
        <p class="precio">{{ libro.precio?.toFixed(2) ?? '0.00' }}€</p>
        <router-link :to="`/tienda/${libro.id}`" class="btn-ver">Ver más</router-link>
      </div>
    </section>

    <!-- Paginación -->
    <div class="paginacion-container">
      <button
        type="button"
        :disabled="shopStore.paginaActual <= 1"
        @click="cambiarPagina(shopStore.paginaActual - 1)"
      >
        Anterior
      </button>
      <span id="num-pagina">Página {{ shopStore.paginaActual }}</span>
      <button
        type="button"
        :disabled="shopStore.paginaActual >= shopStore.totalPaginas"
        @click="cambiarPagina(shopStore.paginaActual + 1)"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useShopStore } from '@/stores/shop'

const shopStore = useShopStore()
const busqueda = ref('')
let debounceTimer: ReturnType<typeof setTimeout>

function onBusqueda() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    shopStore.cargarLibros(busqueda.value, 1)
  }, 300)
}

function limpiarBusqueda() {
  busqueda.value = ''
  shopStore.cargarLibros('', 1)
}

function cambiarPagina(pagina: number) {
  shopStore.cargarLibros(busqueda.value, pagina)
}

onMounted(() => {
  shopStore.cargarLibros()
})
</script>

<style scoped>
input[type='text'] {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.paginacion-container button {
  padding: 10px 20px;
  font-size: 1rem;
}

@media (max-width: 480px) {
  input[type='text'] {
    width: 150px;
  }
}
</style>
