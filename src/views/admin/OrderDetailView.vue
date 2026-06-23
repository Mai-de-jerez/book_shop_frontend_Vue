<template>
  <div v-if="orderStore.cargando">Cargando...</div>

  <section v-else-if="orderStore.pedidoDetalle" id="vista-detalle">
    <h1 class="detalle-titulo">Pedido #{{ orderStore.pedidoDetalle.id }}</h1>

    <section class="detalle-contenedor">
      <div class="detalle-imagen">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px">
          <h3>Información del Pedido</h3>
          <p><strong>Usuario:</strong> {{ orderStore.pedidoDetalle.nombreUsuario }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(orderStore.pedidoDetalle.fecha) }}</p>
          <p>
            <strong>Estado:</strong>
            <span :class="'estado-' + orderStore.pedidoDetalle.estado.toLowerCase()">
              {{ orderStore.pedidoDetalle.estado }}
            </span>
          </p>
          <p><strong>Método de Pago:</strong> {{ orderStore.pedidoDetalle.metodoPago }}</p>
          <p><strong>Dirección:</strong> {{ orderStore.pedidoDetalle.direccion }}</p>
          <p style="font-size: 1.3em; margin-top: 20px">
            <strong>Total:</strong>
            <span style="color: #28a745">{{ orderStore.pedidoDetalle.total.toFixed(2) }} €</span>
          </p>
        </div>
      </div>

      <div class="detalle-info">
        <h3>Productos del Pedido</h3>
        <div style="margin-top: 20px">
          <div
            v-for="(d, index) in orderStore.pedidoDetalle.detalles"
            :key="index"
            style="
              display: flex;
              align-items: center;
              border-bottom: 1px solid #ddd;
              padding: 15px 0;
            "
          >
            <img
              :src="`/media/libros/${d.imagen || 'sin-foto.png'}`"
              style="
                width: 80px;
                height: 120px;
                object-fit: cover;
                margin-right: 20px;
                border-radius: 5px;
              "
            />
            <div style="flex: 1">
              <p style="margin: 6px"><strong>Título:</strong> {{ d.tituloLibro }}</p>
              <p style="margin: 6px"><strong>Autor:</strong> {{ d.autorLibro }}</p>
              <p style="margin: 6px">
                <strong>Cantidad:</strong> {{ d.cantidad }} | <strong>Subtotal:</strong>
                <span style="color: #28a745; font-weight: bold"
                  >{{ (d.cantidad * d.precioVenta).toFixed(2) }}€</span
                >
              </p>
            </div>
          </div>
        </div>

        <RouterLink
          :to="`/admin/pedidos/editar/${orderStore.pedidoDetalle.id}`"
          class="btn-comprar"
        >
          <span>✏️ EDITAR PEDIDO</span>
        </RouterLink>
        <RouterLink to="/admin/pedidos" class="btn-ver">VOLVER</RouterLink>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orders'
import { useNotificacion } from '@/composables/useNotificacion'
import { formatDate } from '@/utils/dateFormatter'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const notificacion = useNotificacion()

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    await orderStore.obtenerPedido(id)
  } catch (error: any) {
    notificacion.error('Error al cargar el detalle del pedido')
    router.push({ name: 'admin-pedidos' })
  }
})
</script>

<style scoped>
.btn-ver {
  display: inline-block;
  padding: 12px 40px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border: 2px solid #333;
  font-weight: bold;
  transition: all 0.3s;
  border-radius: 4px;
  text-align: center;
}

.btn-ver:hover {
  background-color: transparent;
  color: #333;
}
.detalle-info {
  padding-bottom: 40px;
}
</style>
