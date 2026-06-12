<template>
  <article :class="variant ?? 'producto-card'">
    <img :src="`/media/libros/${libro.imagen}`" :alt="`Portada de ${libro.titulo}`" />
    <h3>{{ libro.titulo }}</h3>
    <p class="precio">{{ libro.precio?.toFixed(2) ?? '0.00' }}€</p>
    <router-link :to="`/tienda/${libro.id}`" class="btn-ver">Ver más</router-link>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  libro: {
    id: number
    titulo: string
    imagen: string
    precio: number
  }
  variant?: string
}>()
</script>

<style scoped>
.slider-card {
  flex: 0 0 200px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.3s ease;
}

.slider-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.slider-card img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 10px;
}

.slider-card h3 {
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.producto-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 30px;
  text-align: center;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: box-shadow 0.3s ease;
}

.producto-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.producto-card img {
  width: 100%;
  height: auto;
  max-height: 350px;
  object-fit: contain;
  margin-bottom: 15px;
}

.producto-card h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.precio {
  font-weight: bold;
  color: #e67e22;
  margin-bottom: 15px;
}

.btn-ver {
  display: block;
  background-color: #333;
  color: white;
  padding: 10px;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
}

.btn-ver:hover {
  background-color: #555;
}
</style>
