<template>
  <nav>
    <template v-if="!authStore.estaLogueado || authStore.esCliente">
      <router-link to="/">Inicio</router-link>
      <router-link to="/tienda">Tienda</router-link>
    </template>

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

<style scoped>
nav {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 25px;
}

nav a {
  text-decoration: none;
  color: lightgrey;
}

nav a:hover {
  color: #3ca243;
}

nav a.router-link-exact-active {
  color: #3ca243;
}

.badge {
  background-color: #ff5722;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  margin-left: 4px;
}

/* --- ESTILOS PARA TABLETS Y MÓVILES --- */
@media (max-width: 768px) {
  nav {
    display: flex;
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  nav {
    gap: 15px;
  }

  nav a {
    font-size: 14px;
  }
}
</style>
