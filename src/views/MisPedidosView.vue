<template>
  <main id="contenedor-principal">
    <h1 class="detalle-titulo">📦 Mis Pedidos</h1>

    <div v-if="!clientStore.cargando && clientStore.pedidos.length === 0" class="mensaje-vacio">
      <p class="parrafo-pedidos">No tienes pedidos realizados</p>
      <RouterLink to="/tienda" class="btn-comprar">Ir a la Tienda</RouterLink>
    </div>

    <section v-else id="pedidos-contenedor" class="carrito-contenedor">
      <div
        v-for="pedido in clientStore.pedidos"
        :key="pedido.id"
        class="resumen-pedido"
        style="margin-bottom: 30px"
      >
        <div class="resumen-pedido-top">
          <div>
            <h3>Pedido #{{ pedido.id }}</h3>
            <p>📅 {{ formatearFecha(pedido.fecha) }}</p>
            <p>📍 {{ pedido.direccion }}</p>
            <p>💳 {{ pedido.metodoPago }}</p>
            <span :class="obtenerClaseEstado(pedido.estado)">{{ pedido.estado }}</span>
          </div>
          <div>
            <p>{{ pedido.total.toFixed(2) }}€</p>
            <button class="btn-comprar" @click="abrirDetalle(pedido.id)">Ver Detalle</button>
          </div>
        </div>
      </div>
    </section>

    <div v-if="clientStore.pedidoDetalle" class="modal-pedidos" @click.self="cerrarModal">
      <div class="modal-contenido">
        <button class="modal-cerrar" @click="cerrarModal">✕</button>
        <h2>Detalle del Pedido #{{ clientStore.pedidoDetalle.id }}</h2>

        <div class="modal-detalle-info">
          <p><strong>Fecha:</strong> {{ formatearFecha(clientStore.pedidoDetalle.fecha) }}</p>
          <p><strong>Dirección:</strong> {{ clientStore.pedidoDetalle.direccion }}</p>
          <p><strong>Método de pago:</strong> {{ clientStore.pedidoDetalle.metodoPago }}</p>
          <p>
            <strong>Estado:</strong>
            <span :class="obtenerClaseEstado(clientStore.pedidoDetalle.estado)">{{
              clientStore.pedidoDetalle.estado
            }}</span>
          </p>
        </div>

        <h3>Productos:</h3>
        <div
          class="modal-detalle-item"
          v-for="item in clientStore.pedidoDetalle.detalles"
          :key="item.tituloLibro"
        >
          <img :src="`/media/libros/${item.imagen}`" :alt="item.tituloLibro" />
          <div>
            <h4>{{ item.tituloLibro }}</h4>
            <p>{{ item.autorLibro }}</p>
            <p>Cantidad: {{ item.cantidad }}</p>
          </div>
          <div>
            <p>{{ (item.precioVenta * item.cantidad).toFixed(2) }}€</p>
            <p>{{ item.precioVenta.toFixed(2) }}€ c/u</p>
          </div>
        </div>

        <div class="modal-detalle-total">
          <p>Total: {{ clientStore.pedidoDetalle.total.toFixed(2) }}€</p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useClientStore } from '@/stores/perfil'

const clientStore = useClientStore()

onMounted(() => {
  clientStore.cargarPedidos()
})

async function abrirDetalle(id: number) {
  await clientStore.cargarDetallePedido(id)
}

function cerrarModal() {
  clientStore.resetDetalle()
}

// Utilidades
function formatearFecha(timestamp: number) {
  return new Date(timestamp).toLocaleDateString('es-ES')
}

function obtenerClaseEstado(estado: string) {
  return `estado-${estado.toLowerCase()}`
}
</script>
