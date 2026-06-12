<template>
  <section class="slider-container">
    <div class="slider-wrapper">
      <button class="slider-btn prev" @click="prevSlide">&#10094;</button>
      <div class="slider-content" ref="sliderContent">
        <BookCard v-for="libro in libros" :key="libro.id" :libro="libro" variant="slider-card" />
      </div>
      <button class="slider-btn next" @click="nextSlide">&#10095;</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BookCard from '@/components/BookCard.vue'

defineProps<{
  libros: {
    id: number
    titulo: string
    imagen: string
    precio: number
  }[]
}>()

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

@media (max-width: 768px) {
  .slider-content {
    gap: 10px;
  }
  .slider-container {
    width: 95%;
  }
}
</style>
