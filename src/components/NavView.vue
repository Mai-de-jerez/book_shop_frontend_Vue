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
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const totalItems = ref(0)

async function actualizarContadorCarrito() {
  const carritoActual = JSON.parse(localStorage.getItem('carrito') || '[]')
  if (!authStore.token) return

  try {
    const data = await authStore.apiFetch('/carrito/ver', {
      method: 'POST',
      body: JSON.stringify({ carrito: carritoActual }),
    })
    totalItems.value = data.carrito?.reduce((acc: number, item: any) => acc + item.cantidad, 0) ?? 0
  } catch {
    totalItems.value = 0
  }
}

function logout() {
  authStore.logout()
  router.push('/auth/login')
}

onMounted(() => {
  if (authStore.estaLogueado && authStore.esCliente) {
    actualizarContadorCarrito()
  }
})

// Actualizar cuando cambie el carrito (por si se añaden productos)
watch(
  () => localStorage.getItem('carrito'),
  () => {
    if (authStore.estaLogueado && authStore.esCliente) {
      actualizarContadorCarrito()
    }
  },
)
</script>
