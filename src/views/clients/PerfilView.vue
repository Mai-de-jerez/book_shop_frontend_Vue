<template>
  <main id="contenedor-principal">
    <section v-if="clientStore.perfil" id="vista-detalle" class="detalle-contenedor">
      <div class="detalle-imagen-usuario">
        <img
          :src="
            clientStore.perfil.foto
              ? `/media/usuarios/${clientStore.perfil.foto}`
              : '/media/usuarios/default-user.png'
          "
          alt="Foto de perfil"
        />
      </div>

      <div class="detalle-info">
        <h1 class="detalle-titulo" style="text-align: left">Perfil de Usuario</h1>

        <p class="nombre_usuario">
          <strong>Nombre Completo: </strong>
          <span>{{ clientStore.perfil.nombre }}</span>
        </p>

        <p class="email_usuario">
          <strong>Correo Electrónico: </strong>
          <span>{{ clientStore.perfil.email || 'No especificado' }}</span>
        </p>

        <p class="rol_usuario">
          <strong>Rol: </strong>
          <span>{{ obtenerTextoRol(clientStore.perfil.rol) }}</span>
        </p>

        <div class="form-buttons">
          <button type="button" class="btn-mis-pedidos" @click="irAMisPedidos">
            <span>MIS PEDIDOS</span>
          </button>

          <button type="button" class="btn-comprar btn-mostrar-editar" @click="irAEditar">
            <span>EDITAR PERFIL</span>
          </button>

          <RouterLink to="/" class="btn-volver">VOLVER</RouterLink>
        </div>
      </div>
    </section>

    <section v-else-if="clientStore.cargando" class="detalle-contenedor">
      <div class="detalle-info">
        <p>Cargando datos de perfil...</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useClientStore } from '@/stores/perfil'
import { useNotificacion } from '@/composables/useNotificacion'

const clientStore = useClientStore()
const router = useRouter()
const toast = useNotificacion()

// Mapeo tonto para los roles del sistema que te devuelve tu Servlet
function obtenerTextoRol(rol: number): string {
  switch (rol) {
    case 1:
      return 'SuperAdmin'
    case 2:
      return 'Admin'
    case 3:
      return 'Cliente'
    default:
      return 'Usuario'
  }
}

function irAEditar() {
  toast.info('Abriendo edición de perfil...')
  router.push('/perfil/editar')
}

onMounted(async () => {
  try {
    await clientStore.cargarPerfil()
  } catch (err) {
    console.error('Fallo real:', err)
    toast.error('Error al obtener los datos del servidor.')
  }
})

function irAMisPedidos() {
  toast.info('Abriendo mis pedidos...')
  router.push('/perfil/pedidos')
}
</script>

<style scoped>
.btn-mis-pedidos {
  display: inline-block;
  background-color: white;
  color: #2e7d32;
  padding: 12px 25px;
  text-decoration: none;
  font-weight: bold;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border: 2px solid #2e7d32;
  margin-top: 0;
  text-align: center;
  box-sizing: border-box;
}

.btn-mis-pedidos:hover {
  background-color: #2e7d32;
  color: white;
}

.btn-mostrar-editar {
  margin-top: 0;
  cursor: pointer;
}
</style>
