<template>
  <!-- Hero -->
  <section class="hero">
    <h1>¡BIENVENIDO A LIBRERÍA LA IGUANA!</h1>
    <p>
      Bienvenido a Librería La Iguana, el refugio donde las historias cobran vida sin filtros ni
      pretensiones. Aquí no creemos en las lecturas desnatadas ni en los algoritmos que intentan
      decirte qué pensar; creemos en la sustancia, en la gnosis personal y en el placer de encontrar
      ese libro que parece haber sido escrito justo para ti. Hemos construido este espacio pensando
      rápido y actuando con precisión, seleccionando cada título de nuestro catálogo con el mismo
      cuidado con el que se trabajan los bastos y las espadas: con intención y sin miedo al
      conflicto de una buena trama. No sabemos hacia dónde gira el mundo, pero sí sabemos que en
      nuestras estanterías virtuales te espera una calidad que no entiende de modas pasajeras.
      Olvídate de las esperas infinitas y de las webs complicadas; entra, elige tu próxima gran
      aventura y recíbela con la rapidez de quien sabe que el momento de leer es ahora. Porque en La
      Iguana, lo único que nos importa es que hoy cierres el día con un libro inolvidable entre las
      manos.
    </p>
    <router-link to="/tienda" class="btn-productos">VER PRODUCTOS</router-link>
  </section>

  <!-- Top ventas (slider) -->
  <h2 class="titulo-seccion">TOP VENTAS: DESTACADOS DE LA SEMANA</h2>
  <section class="slider-container">
    <div class="slider-wrapper">
      <button class="slider-btn prev" @click="prevSlide">&#10094;</button>
      <div class="slider-content" ref="sliderContent">
        <div v-for="libro in tiendaStore.topVentas" :key="libro.id" class="slider-card">
          <img :src="`/media/libros/${libro.imagen}`" :alt="libro.titulo" />
          <h3>{{ libro.titulo }}</h3>
          <p class="precio">{{ libro.precio }}€</p>
          <router-link :to="`/tienda/${libro.id}`" class="btn-ver">Ver más</router-link>
        </div>
      </div>
      <button class="slider-btn next" @click="nextSlide">&#10095;</button>
    </div>
  </section>

  <!-- Segundo hero -->
  <section class="hero">
    <h2>¡LOS PRIMEROS EN LLEGAR A TODAS PARTES!</h2>
    <p>
      En Librería La Iguana no solo vendemos libros, hacemos historia: fuimos la primera plataforma
      a nivel mundial en llevar la magia de las letras al entorno digital, mucho antes de que el
      resto del mundo supiera siquiera lo que era un carrito de compra. Nuestra herencia como
      pioneros nos permite ofrecerte hoy lo que nadie más puede: acceso exclusivo a primeras
      ediciones custodiadas en cámaras de alta seguridad, ejemplares descatalogados que se creían
      perdidos y un sistema de envío ultra-rápido basado en redes logísticas que solo nosotros
      conocemos. No somos una tienda más, somos el origen del comercio literario online. Al
      elegirnos, no solo compras un libro, accedes a un club selecto donde la calidad es
      innegociable y el conocimiento se trata con el respeto que merece. Deja de buscar en sitios
      corrientes; únete a la leyenda de la Iguana y descubre por qué los coleccionistas más
      exigentes del planeta confían únicamente en nuestra visión para alimentar sus estanterías. La
      verdad está en las páginas, y el primer ejemplar siempre salió de aquí.
    </p>
  </section>

  <!-- Novedades -->
  <h2 class="titulo-seccion">ESTA ES NUESTRA SECCIÓN DE NOVEDADES</h2>
  <section class="contenedor-grid">
    <div v-for="libro in tiendaStore.novedades" :key="libro.id" class="producto-card">
      <img :src="`/media/libros/${libro.imagen}`" :alt="libro.titulo" />
      <h3>{{ libro.titulo }}</h3>
      <p class="precio">{{ libro.precio }}€</p>
      <router-link :to="`/tienda/${libro.id}`" class="btn-ver">Ver más</router-link>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useShopStore } from '@/stores/shop'

const tiendaStore = useShopStore()
const sliderContent = ref<HTMLElement | null>(null)
let posicion = 0
const cardWidth = 220

function nextSlide() {
  const contenedor = sliderContent.value
  const padre = contenedor?.parentElement as HTMLElement | null
  if (!contenedor || !padre) return

  const maxPosicion = contenedor.scrollWidth - padre.offsetWidth
  posicion = Math.min(posicion + cardWidth, maxPosicion)
  contenedor.style.transform = `translateX(-${posicion}px)`
}

function prevSlide() {
  const contenedor = sliderContent.value
  if (!contenedor) return

  posicion = Math.max(posicion - cardWidth, 0)
  contenedor.style.transform = `translateX(-${posicion}px)`
}

onMounted(() => {
  tiendaStore.cargarTopVentas()
  tiendaStore.cargarNovedades()
})
</script>

<style scoped>
/* Slider */
.slider-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto 40px;
  overflow: hidden;
  position: relative;
}

.slider-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.slider-content {
  display: flex;
  gap: 20px;
  width: 100%;
  justify-content: flex-start;
  flex-wrap: nowrap;
  overflow: visible;
  transition: transform 0.3s ease;
}

.slider-btn {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 15px;
  cursor: pointer;
  position: absolute;
  z-index: 10;
  border-radius: 50%;
  font-size: 1.2rem;
}

.slider-btn:hover {
  background: #800080;
}

.prev {
  left: -10px;
}

.next {
  right: -10px;
}

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
</style>
