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

<style scoped>
/* Estilos específicos para el carrito */
.carrito-contenedor {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 15px;
}

.carrito-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
  gap: 20px;
}

.item-imagen img {
  width: 100px;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.item-info {
  flex: 1;
}
.item-info h3 {
  margin-bottom: 5px;
  font-size: 1.3rem;
  color: #333;
}
.item-autor {
  color: #666;
  margin-bottom: 10px;
}
.item-precio-unitario span {
  font-weight: bold;
}

.item-controles {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-top: 15px;
}

.control-cantidad input {
  width: 60px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.btn-borrar-carrito {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-borrar-carrito:hover {
  background: #c82333;
}

.item-subtotal p {
  font-size: 1.4rem;
  font-weight: bold;
  color: #2e7d32;
  min-width: 100px;
  text-align: right;
}

.resumen-pedido-carrito {
  margin-top: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.acciones-carrito {
  display: flex;
  gap: 40px;
  align-items: center;
}

.acciones-carrito .btn-comprar,
.acciones-carrito .btn-volver {
  margin: 0;
  width: 220px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
}

/* Tamaño móviles pequeños */
@media (max-width: 480px) {
  .carrito-item {
    flex-direction: column;
    text-align: center;
    padding: 20px 10px;
  }

  .item-imagen img {
    width: 150px;
    height: auto;
  }

  .item-controles {
    flex-direction: column;
    gap: 15px;
  }

  .item-subtotal {
    width: 100%;
    border-top: 1px solid #eee;
    padding-top: 15px;
  }

  .item-subtotal p {
    text-align: center;
  }

  .btn-borrar-carrito {
    width: 100%;
  }

  .acciones-carrito {
    flex-direction: column;
    gap: 20px;
    align-items: center;
  }

  .acciones-carrito .btn-comprar,
  .acciones-carrito .btn-volver {
    width: 100%;
  }
}
</style>
