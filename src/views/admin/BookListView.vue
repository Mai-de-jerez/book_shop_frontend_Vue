<!-- <template>
  <main id="contenedor-principal">
    <section id="vista-listado" class="admin-panel-listado vista-oculta">
      <section class="buscador-seccion">
        <input type="text" id="busqueda-input" placeholder="Buscar libro..." />
        <button type="button" id="btn-limpiar" class="btn-ver">Limpiar</button>
      </section>
      <a href="?accion=alta" id="btn-añadir-dinamico" class="btn-nuevo-admin">NUEVO LIBRO</a>
      <h2 id="titulo-seccion" class="titulo-seccion-admin">LISTADO DE LIBROS</h2>

      <table class="tabla-admin">
        <thead id="tabla-head">
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
        <tbody id="tabla-body"></tbody>
      </table>

      <div class="paginacion-container">
        <button type="button" id="pag-anterior" class="btn-ver">Anterior</button>
        <span id="num-pagina">Página 1</span>
        <button type="button" id="pag-siguiente" class="btn-ver">Siguiente</button>
      </div>
    </section>
  </main>
</template>
<script setup lang="ts"></script>
<style scoped></style> -->

<template>
  <main id="contenedor-principal">
    <section id="vista-listado" class="admin-panel-listado">
      <Buscador
        v-model="textoBusqueda"
        placeholder="Buscar libro..."
        :debounce="300"
        @buscar="manejarBuscar"
        @limpiar="manejarLimpiar"
      />

      <router-link to="/admin/libros/nuevo" id="btn-añadir-dinamico" class="btn-nuevo-admin">
        NUEVO LIBRO
      </router-link>

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
                :to="`/admin/libros/detalle/${libro.id}`"
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
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useLibroStore } from '@/stores/book'
import { useRouter } from 'vue-router'

import Buscador from '@/components/SearchInput.vue'
import Paginator from '@/components/Paginator.vue'

const libroStore = useLibroStore()
const router = useRouter()

const textoBusqueda = ref('')
const librosPorPagina = 6

onMounted(() => {
  libroStore.listarLibros(textoBusqueda.value, libroStore.paginaActual, librosPorPagina)
})

const totalPaginas = computed(() => {
  return Math.ceil(libroStore.totalElementos / librosPorPagina) || 1
})

function manejarBuscar(valor: string) {
  libroStore.listarLibros(valor, 1, librosPorPagina)
}

function manejarLimpiar() {
  textoBusqueda.value = ''
  libroStore.listarLibros('', 1, librosPorPagina)
}

function manejarCambioPagina(nuevaPagina: number) {
  libroStore.listarLibros(textoBusqueda.value, nuevaPagina, librosPorPagina)
}

function irAEliminar(id: number) {
  router.push(`/admin/libros/eliminar/${id}`)
}
</script>
