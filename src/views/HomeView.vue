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

  <BookSlider :libros="tiendaStore.topVentas" />

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
    <BookCard v-for="libro in tiendaStore.novedades" :key="libro.id" :libro="libro" />
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useShopStore } from '@/stores/shop'
import BookCard from '@/components/BookCard.vue'
import BookSlider from '@/components/BookSlider.vue'

const tiendaStore = useShopStore()

onMounted(() => {
  tiendaStore.cargarTopVentas()
  tiendaStore.cargarNovedades()
})
</script>

<style scoped>
.btn-productos {
  display: inline-block;
  padding: 15px 35px;
  background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%);
  color: white;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.btn-productos:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(46, 204, 113, 0.5);
  background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
}
</style>
