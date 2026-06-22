<template>
  <section class="admin-panel-listado">
    <div class="barra-superior">
      <Buscador
        v-model="libroStore.textoBusqueda"
        placeholder="Buscar libro..."
        :debounce="300"
        @buscar="manejarBuscar"
        @limpiar="manejarLimpiar"
      />
      <router-link to="/admin/libros/nuevo" id="btn-añadir-dinamico" class="btn-nuevo-admin">
        NUEVO LIBRO
      </router-link>
    </div>

    <h2 id="titulo-seccion" class="titulo-seccion-admin">LISTADO DE LIBROS</h2>

    <table class="tabla-admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Autor</th>
          <th>Categoría</th>
          <th>Stock</th>
          <th>Precio</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tabla-body">
        <tr v-for="libro in libroStore.libros" :key="libro.id">
          <td>{{ libro.id }}</td>
          <td>{{ libro.titulo }}</td>
          <td>{{ libro.autor }}</td>
          <td>{{ libro.nombreCategoria || 'Sin categoría' }}</td>
          <td>{{ libro.stock ?? 0 }}</td>
          <td>{{ libro.precio.toFixed(2) }}€</td>
          <td class="celda-acciones">
            <router-link :to="`/admin/libros/editar/${libro.id}`" class="btn-edit" title="Editar"
              >✏️</router-link
            >
            <router-link
              :to="`/admin/libros/${libro.id}`"
              class="btn-ver-detalle"
              title="Ver detalle"
              >👁️</router-link
            >
            <a href="#" class="btn-borrar" title="Eliminar" @click.prevent="irAEliminar(libro.id)"
              >🗑️</a
            >
          </td>
        </tr>

        <tr v-if="!libroStore.cargando && libroStore.libros.length === 0">
          <td colspan="7" style="text-align: center; color: white; padding: 20px">
            No hay libros que mostrar.
          </td>
        </tr>
        <tr v-if="libroStore.cargando">
          <td colspan="7" style="text-align: center; color: white; padding: 20px">
            Cargando libros...
          </td>
        </tr>
      </tbody>
    </table>

    <Paginator
      :pagina-actual="libroStore.paginaActual"
      :total-paginas="totalPaginas"
      @cambiar-pagina="manejarCambioPagina"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useLibroStore } from '@/stores/book'
import { useRouter } from 'vue-router'

import Buscador from '@/components/SearchInput.vue'
import Paginator from '@/components/Paginator.vue'

const libroStore = useLibroStore()
const router = useRouter()

const librosPorPagina = 6

const totalPaginas = computed(() => {
  return Math.ceil(libroStore.totalElementos / librosPorPagina) || 1
})

onMounted(() => {
  libroStore.listarLibros(libroStore.textoBusqueda, libroStore.paginaActual, librosPorPagina)
})

function manejarBuscar(valor: string) {
  libroStore.textoBusqueda = valor
  libroStore.listarLibros(libroStore.textoBusqueda, 1, librosPorPagina)
}

function manejarLimpiar() {
  libroStore.textoBusqueda = ''
  libroStore.listarLibros('', 1, librosPorPagina)
}

function manejarCambioPagina(nuevaPagina: number) {
  libroStore.listarLibros(libroStore.textoBusqueda, nuevaPagina, librosPorPagina)
}

function irAEliminar(id: number) {
  router.push(`/admin/libros/eliminar/${id}`)
}
</script>
<style scoped>
.barra-superior {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.admin-panel-listado {
  padding-top: 0;
}

@media (max-width: 700px) {
  .barra-superior {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 20px;
  }

  .btn-nuevo-admin {
    width: 100%;
    text-align: center;
  }
}
</style>
