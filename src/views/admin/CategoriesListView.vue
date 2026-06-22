<template>
  <section class="admin-panel-listado">
    <div class="barra-superior">
      <Buscador
        v-model="categoriaStore.textoBusqueda"
        placeholder="Buscar categoría..."
        :debounce="300"
        @buscar="manejarBuscar"
        @limpiar="manejarLimpiar"
      />
      <router-link to="/admin/categorias/nueva" id="btn-añadir-dinamico" class="btn-nuevo-admin">
        NUEVA CATEGORÍA
      </router-link>
    </div>

    <h2 id="titulo-seccion" class="titulo-seccion-admin">LISTADO DE CATEGORÍAS</h2>

    <table class="tabla-admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tabla-body">
        <tr v-for="categoria in categoriaStore.categorias" :key="categoria.id">
          <td>{{ categoria.id }}</td>
          <td>{{ categoria.nombre }}</td>
          <td class="celda-acciones">
            <router-link
              :to="`/admin/categorias/editar/${categoria.id}`"
              class="btn-edit"
              title="Editar"
              >✏️</router-link
            >
            <a
              href="#"
              class="btn-borrar"
              title="Eliminar"
              @click.prevent="irAEliminar(categoria.id)"
              >🗑️</a
            >
          </td>
        </tr>

        <tr v-if="!categoriaStore.cargando && categoriaStore.categorias.length === 0">
          <td colspan="3" style="text-align: center; color: white; padding: 20px">
            No hay categorías que mostrar.
          </td>
        </tr>
        <tr v-if="categoriaStore.cargando">
          <td colspan="3" style="text-align: center; color: white; padding: 20px">
            Cargando categorías...
          </td>
        </tr>
      </tbody>
    </table>

    <Paginator
      :pagina-actual="categoriaStore.paginaActual"
      :total-paginas="totalPaginas"
      @cambiar-pagina="manejarCambioPagina"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCategoriaStore } from '@/stores/categories'
import Paginator from '@/components/Paginator.vue'
import Buscador from '@/components/SearchInput.vue'

const router = useRouter()
const categoriaStore = useCategoriaStore()
const totalPaginas = computed(() => {
  return Math.ceil(categoriaStore.totalCategorias / categoriaStore.porPagina) || 1
})

onMounted(() => {
  categoriaStore.listarCategoriasPaginado(
    categoriaStore.textoBusqueda,
    categoriaStore.paginaActual,
    categoriaStore.porPagina,
  )
})

function manejarBuscar(valor: string) {
  categoriaStore.textoBusqueda = valor
  categoriaStore.listarCategoriasPaginado(categoriaStore.textoBusqueda, 1, categoriaStore.porPagina)
}

function manejarLimpiar() {
  categoriaStore.textoBusqueda = ''
  categoriaStore.listarCategoriasPaginado('', 1, categoriaStore.porPagina)
}

function manejarCambioPagina(nuevaPagina: number) {
  categoriaStore.listarCategoriasPaginado(
    categoriaStore.textoBusqueda,
    nuevaPagina,
    categoriaStore.porPagina,
  )
}

function irAEliminar(id: number) {
  router.push(`/admin/categorias/eliminar/${id}`)
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
