<template>
  <section class="admin-panel-listado">
    <Buscador
      v-model="orderStore.textoBusqueda"
      placeholder="Buscar libro..."
      :debounce="300"
      @buscar="manejarBuscar"
      @limpiar="manejarLimpiar"
    />

    <h2 class="titulo-seccion-admin">LISTADO DE PEDIDOS</h2>

    <table class="tabla-admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Fecha</th>
          <th>Total</th>
          <th>Estado</th>
          <th>Método de Pago</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pedido in orderStore.pedidos" :key="pedido.id">
          <td>{{ pedido.id }}</td>
          <td>{{ pedido.nombreUsuario }}</td>
          <td>{{ formatDate(pedido.fecha) }}</td>
          <td>{{ pedido.total.toFixed(2) }}€</td>
          <td>{{ pedido.estado }}</td>
          <td>{{ pedido.metodoPago }}</td>
          <td class="celda-acciones">
            <router-link :to="`/admin/pedidos/editar/${pedido.id}`" class="btn-edit" title="Editar"
              >✏️</router-link
            >
            <router-link
              :to="`/admin/pedidos/${pedido.id}`"
              class="btn-ver-detalle"
              title="Ver detalle"
              >👁️</router-link
            >
          </td>
        </tr>

        <tr v-if="!orderStore.cargando && orderStore.pedidos.length === 0">
          <td colspan="7" style="text-align: center; color: white; padding: 20px">
            No hay pedidos que mostrar.
          </td>
        </tr>
        <tr v-if="orderStore.cargando">
          <td colspan="7" style="text-align: center; color: white; padding: 20px">
            Cargando pedidos...
          </td>
        </tr>
      </tbody>
    </table>

    <Paginator
      :pagina-actual="orderStore.paginaActual"
      :total-paginas="totalPaginas"
      @cambiar-pagina="manejarCambioPagina"
    />
  </section>
</template>

<script setup lang="ts">
import { formatDate } from '@/utils/dateFormatter'
import { onMounted, computed } from 'vue'
import { useOrderStore } from '@/stores/orders'
import Buscador from '@/components/SearchInput.vue'
import Paginator from '@/components/Paginator.vue'

const orderStore = useOrderStore()

const totalPaginas = computed(() => {
  return Math.ceil(orderStore.totalPedidos / orderStore.porPagina) || 1
})

onMounted(() => {
  orderStore.listarPedidos(orderStore.textoBusqueda, orderStore.paginaActual, orderStore.porPagina)
})

function manejarBuscar(valor: string) {
  orderStore.textoBusqueda = valor
  orderStore.listarPedidos(orderStore.textoBusqueda, 1, orderStore.porPagina)
}

function manejarLimpiar() {
  orderStore.textoBusqueda = ''
  orderStore.listarPedidos('', 1, orderStore.porPagina)
}

function manejarCambioPagina(nuevaPagina: number) {
  orderStore.listarPedidos(orderStore.textoBusqueda, nuevaPagina, orderStore.porPagina)
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
}
</style>
