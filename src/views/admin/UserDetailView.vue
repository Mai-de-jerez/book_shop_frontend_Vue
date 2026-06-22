<template>
  <div v-if="userStore.cargando">Cargando...</div>

  <section v-else-if="userStore.usuarioDetalle" id="vista-detalle">
    <h1 class="detalle-titulo">{{ userStore.usuarioDetalle.nombre }}</h1>
    <section class="detalle-contenedor">
      <div class="detalle-imagen-usuario">
        <img :src="`/media/usuarios/${userStore.usuarioDetalle.foto}`" alt="Usuario" />
      </div>
      <div class="detalle-info">
        <p><strong>ID interno:</strong> {{ userStore.usuarioDetalle.id }}</p>
        <p><strong>Nombre:</strong> {{ userStore.usuarioDetalle.nombre }}</p>
        <p><strong>Email:</strong> {{ userStore.usuarioDetalle.email }}</p>
        <p><strong>Rol:</strong> {{ getRolNombre(userStore.usuarioDetalle.rol) }}</p>

        <RouterLink
          :to="`/admin/usuarios/editar/${userStore.usuarioDetalle.id}`"
          class="btn-comprar"
          ><span class="icon-cart">✏️</span> <span>EDITAR USUARIO</span></RouterLink
        >
        <button @click="confirmarEliminar" class="btn-borrar-usuario">ELIMINAR</button>
        <RouterLink to="/admin/usuarios" class="btn-ver">VOLVER</RouterLink>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

onMounted(async () => {
  await userStore.obtenerUsuario(Number(route.params.id))
})

function getRolNombre(rol: number): string {
  const roles: Record<number, string> = {
    1: 'Super Admin',
    2: 'Admin',
    3: 'Cliente',
  }
  return roles[rol] || 'Desconocido'
}

async function confirmarEliminar() {
  if (!userStore.usuarioDetalle) return
  router.push(`/admin/usuarios/eliminar/${userStore.usuarioDetalle.id}`)
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

.detalle-imagen-usuario {
  flex: 1;
}

.detalle-imagen-usuario img {
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

.btn-borrar-usuario {
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

.btn-borrar-usuario:hover {
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
