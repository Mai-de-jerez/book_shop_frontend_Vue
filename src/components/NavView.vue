<template>
  <nav>
    <router-link to="/">Inicio</router-link>
    <router-link to="/tienda">Tienda</router-link>

    <template v-if="authStore.estaLogueado">
      <template v-if="authStore.esCliente">
        <router-link to="/perfil">Mi Perfil</router-link>
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
    const res = await fetch('http://localhost:8080/book-shop/api/carrito/ver', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ carrito: carritoActual }),
    })

    if (!res.ok) return

    const data = await res.json()
    if (data.carrito && data.carrito.length > 0) {
      totalItems.value = data.carrito.reduce((acc: number, item: any) => acc + item.cantidad, 0)
    } else {
      totalItems.value = 0
    }
  } catch (err) {
    console.error('Error al actualizar contador:', err)
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

.badge {
  background-color: #ff5722;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  margin-left: 4px;
}

@media (max-width: 768px) {
  nav {
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
