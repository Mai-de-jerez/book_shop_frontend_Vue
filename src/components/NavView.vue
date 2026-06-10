<template>
  <nav>
    <router-link to="/">Inicio</router-link>
    <router-link to="/tienda">Tienda</router-link>

    <template v-if="authStore.estaLogueado">
      <template v-if="authStore.esCliente">
        <router-link to="/perfil/ver">Mi Perfil</router-link>
        <router-link to="/carrito">
          🛒 Carrito <span v-if="totalItems > 0" class="badge">({{ totalItems }})</span>
        </router-link>
      </template>

      <template v-if="authStore.esAdmin">
        <router-link to="/admin">Admin</router-link>
      </template>

      <a href="#" @click.prevent="logout">Cerrar sesión</a>
    </template>

    <template v-else>
      <router-link to="/auth/login">Login</router-link>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const totalItems = computed(() => cartStore.totalItems)

onMounted(() => {
  if (authStore.estaLogueado && authStore.esCliente) {
    cartStore.cargar()
  }
})

function logout() {
  authStore.logout()
  router.push('/auth/login')
}
</script>
