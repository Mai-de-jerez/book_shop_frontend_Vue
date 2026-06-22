<template>
  <main id="contenedor-principal">
    <div v-if="libroStore.cargando">Cargando...</div>

    <section v-else-if="libroStore.libroDetalle" id="vista-detalle">
      <h1 class="detalle-titulo">{{ libroStore.libroDetalle.titulo }}</h1>
      <section class="detalle-contenedor">
        <div class="detalle-imagen">
          <img :src="`/media/libros/${libroStore.libroDetalle.imagen}`" alt="Portada" />
        </div>
        <div class="detalle-info">
          <p><strong>ID interno:</strong> {{ libroStore.libroDetalle.id }}</p>
          <p><strong>Stock disponible:</strong> {{ libroStore.libroDetalle.stock }} unidades</p>
          <p class="autor"><strong>Autor:</strong> {{ libroStore.libroDetalle.autor }}</p>
          <p class="categoria">
            <strong>Categoría:</strong> {{ libroStore.libroDetalle.nombreCategoria }}
          </p>
          <p class="descripcion">
            <strong>Descripción completa:</strong><br />{{ libroStore.libroDetalle.descripcion }}
          </p>
          <p class="precio-detalle">Precio: {{ libroStore.libroDetalle.precio.toFixed(2) }} €</p>
          <RouterLink :to="`/admin/libros/editar/${libroStore.libroDetalle.id}`" class="btn-comprar"
            ><span class="icon-cart">✏️</span> <span>EDITAR LIBRO</span></RouterLink
          >
          <button @click="confirmarEliminar" class="btn-borrar-libro">ELIMINAR</button>
          <RouterLink to="/admin/libros" class="btn-ver">VOLVER</RouterLink>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLibroStore } from '@/stores/book'

const route = useRoute()
const router = useRouter()
const libroStore = useLibroStore()

onMounted(async () => {
  await libroStore.obtenerLibroPorId(Number(route.params.id))
})

async function confirmarEliminar() {
  if (!libroStore.libroDetalle) return
  router.push(`/admin/libros/eliminar/${libroStore.libroDetalle.id}`)
}
</script>

<style scoped>
.detalle-titulo {
  text-align: center;
  margin-bottom: 40px;
  text-transform: uppercase;
}

.detalle-contenedor {
  display: flex;
  gap: 50px;
  max-width: 900px;
  margin: 0 auto;
  align-items: flex-start;
}

.detalle-imagen {
  flex: 1;
}

.detalle-imagen img {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.detalle-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.precio-detalle {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e67e22;
}

.btn-comprar {
  display: inline-block;
  background-color: #2e7d32;
  color: white;
  padding: 12px 25px;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 2px solid #2e7d32;
  text-align: center;
}

.btn-comprar:hover {
  background-color: transparent;
  color: #2e7d32;
}

.btn-borrar-libro {
  display: inline-block;
  background-color: rgb(255, 0, 0);
  color: white;
  padding: 12px 25px;
  font-weight: bold;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 2px solid rgb(255, 0, 0);
  cursor: pointer;
  text-align: center;
}

.btn-borrar-libro:hover {
  background-color: transparent;
  color: rgb(255, 0, 0);
}

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
</style>
