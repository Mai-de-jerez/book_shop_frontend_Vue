<template>
  <main id="contenedor-principal">
    <h1 class="detalle-titulo">🛒 Mi Carrito de Compras</h1>

    <section class="carrito-contenedor">
      <div v-if="cartStore.carrito.length === 0" class="mensaje-vacio">
        <p>Tu carrito está vacío</p>
        <RouterLink to="/tienda" class="btn-comprar">Ir a la Tienda</RouterLink>
      </div>

      <div v-else>
        <div id="carrito-items">
          <div v-for="item in cartStore.carrito" :key="item.libro.id" class="carrito-item">
            <div class="item-imagen">
              <img :src="`media/libros/${item.libro.imagen}`" :alt="item.libro.titulo" />
            </div>

            <div class="item-info">
              <h3>{{ item.libro.titulo }}</h3>
              <p class="item-autor">{{ item.libro.autor }}</p>
              <p class="item-precio-unitario">Precio: {{ item.precioVenta.toFixed(2) }}€</p>

              <div class="item-controles">
                <div class="control-cantidad">
                  <label>Cantidad:</label>
                  <input
                    type="number"
                    :value="item.cantidad"
                    min="1"
                    :max="item.libro.stock"
                    @input="(e: any) => handleUpdate(item.libro.id, e.target.value)"
                  />
                </div>
                <button class="btn-borrar-carrito" @click="cartStore.eliminar(item.libro.id)">
                  🗑️ Eliminar
                </button>
              </div>
            </div>

            <div class="item-subtotal">
              <p>{{ (item.cantidad * item.precioVenta).toFixed(2) }}€</p>
            </div>
          </div>
        </div>

        <div class="resumen-pedido-carrito">
          <h3>Resumen del Pedido</h3>
          <p class="total-texto">
            <strong
              >Total: <span>{{ cartStore.total.toFixed(2) }}€</span></strong
            >
          </p>
          <div class="acciones-carrito">
            <RouterLink to="/checkout" class="btn-comprar">Proceder al Pago</RouterLink>
            <RouterLink to="/tienda" class="btn-volver">Seguir Comprando</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()

onMounted(() => {
  cartStore.cargar()
})

// Debounce para no saturar el servidor al cambiar cantidad
let timeout: any
function handleUpdate(idLibro: number, cantidad: string) {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    cartStore.actualizar(idLibro, Number(cantidad))
  }, 500)
}
</script>
