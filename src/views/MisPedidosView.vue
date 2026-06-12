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

<style scoped>
.mensaje-vacio {
  text-align: center;
  margin: 40px 0;
}

/* Contenedor de cada pedido */

.resumen-pedido {
  margin-bottom: 30px;
  background: rgb(239, 239, 239); /* fondo gris claro */
  padding: 20px;
  border-radius: 8px;
}

.resumen-pedido-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
}

.resumen-pedido-top div:first-child h3 {
  margin-bottom: 10px;
}

.resumen-pedido-top div:first-child p {
  color: #666;
  margin-bottom: 5px;
}

.resumen-pedido-top div:first-child p:last-of-type {
  margin-bottom: 10px;
}

.resumen-pedido-top div:last-child {
  text-align: right;
}

.resumen-pedido-top div:last-child p {
  font-size: 1.8rem;
  font-weight: bold;
  color: #2e7d32;
  margin-bottom: 15px;
}

.resumen-pedido-top .btn-comprar {
  margin: 0;
  width: 180px;
}

/* Modal */
.modal-pedidos {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
}

.modal-contenido {
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-cerrar {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #dc3545;
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 20px;
  line-height: 1;
}

/* Productos en modal */

.modal-detalle-item {
  display: flex;
  gap: 20px;
  padding: 15px;
  align-items: center;
  background: #f9f9f9;
  border-radius: 6px;
  margin-bottom: 15px;
}

.modal-detalle-item img {
  width: 60px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.modal-detalle-item div:first-child h4 {
  margin: 0 0 5px 0;
}

.modal-detalle-item div:first-child p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.modal-detalle-item div:nth-of-type(1) {
  flex: 1;
}

.modal-detalle-item div:last-child {
  text-align: right;
}

.modal-detalle-item div:last-child p:first-child {
  font-weight: bold;
  color: #2e7d32;
  margin: 0;
}

.modal-detalle-item div:last-child p:last-child {
  font-size: 0.85rem;
  color: #999;
  margin: 5px 0 0 0;
}

/* Información general del pedido en modal */
.modal-detalle-info {
  background: rgb(229, 229, 229);
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.modal-detalle-total {
  text-align: right;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #333;
}

.modal-detalle-total p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2e7d32;
  margin: 0;
}
</style>
