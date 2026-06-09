<template>
  <div>
    <p v-if="shopStore.cargando" class="cargando">Cargando... 🦎</p>

    <template v-else-if="shopStore.libroDetalle">
      <h1 class="detalle-titulo">{{ shopStore.libroDetalle.titulo }}</h1>
      <section class="detalle-contenedor">
        <div class="detalle-imagen">
          <img
            :src="`/media/libros/${shopStore.libroDetalle.imagen}`"
            :alt="shopStore.libroDetalle.titulo"
          />
        </div>

        <div class="detalle-info">
          <p><strong>Autor:</strong> {{ shopStore.libroDetalle.autor }}</p>
          <p><strong>Categoría:</strong> {{ shopStore.libroDetalle.nombreCategoria }}</p>
          <div>
            <strong>Descripción:</strong>
            <p>{{ shopStore.libroDetalle.descripcion }}</p>
          </div>
          <p class="precio-detalle">
            Precio: {{ shopStore.libroDetalle.precio?.toFixed(2) ?? '0.00' }}€
          </p>

          <div class="selector-cantidad-wrapper">
            <label for="input-cantidad"><strong>Cantidad:</strong></label>
            <input
              type="number"
              id="input-cantidad"
              v-model.number="cantidad"
              min="1"
              :max="shopStore.libroDetalle.stock"
            />
          </div>

          <button class="btn-comprar" @click="añadirAlCarrito">🛒 AÑADIR AL CARRITO</button>

          <router-link to="/tienda" class="btn-volver">VOLVER A LA TIENDA</router-link>
        </div>
      </section>
    </template>

    <p v-else>No se encontró el libro.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop'
import { useAuthStore } from '@/stores/auth'
import { useNotificacion } from '@/composables/useNotificacion'

const route = useRoute()
const router = useRouter()
const shopStore = useShopStore()
const authStore = useAuthStore()
const notificacion = useNotificacion()

const cantidad = ref(1)

async function añadirAlCarrito() {
  if (!authStore.estaLogueado) {
    notificacion.error('Debes iniciar sesión para comprar')
    setTimeout(() => router.push('/auth/login'), 1500)
    return
  }

  const libro = shopStore.libroDetalle
  if (!libro) return

  if (cantidad.value <= 0 || cantidad.value > libro.stock) {
    notificacion.error(`Cantidad no válida. Stock disponible: ${libro.stock}`)
    return
  }

  try {
    const carritoActual = JSON.parse(localStorage.getItem('carrito') || '[]')
    const data = await authStore.apiFetch('/carrito/add', {
      method: 'POST',
      body: JSON.stringify({
        carrito: carritoActual,
        id_libro: libro.id,
        cantidad: cantidad.value,
      }),
    })

    localStorage.setItem('carrito', JSON.stringify(data.carrito))
    notificacion.exito(`✅ ${cantidad.value} x "${libro.titulo}" añadido`)
  } catch (error: any) {
    notificacion.error(error.message || 'Error al añadir al carrito')
  }
}

onMounted(() => {
  const id = Number(route.params.id)
  if (id) shopStore.cargarDetalle(id)
})
</script>
