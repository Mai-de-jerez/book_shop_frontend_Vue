<template>
  <section class="admin-panel-listado">
    <div class="barra-superior">
      <Buscador
        v-model="userStore.textoBusqueda"
        placeholder="Buscar usuario..."
        :debounce="300"
        @buscar="manejarBuscar"
        @limpiar="manejarLimpiar"
      />
      <router-link to="/admin/usuarios/nuevo" class="btn-nuevo-admin"> NUEVO USUARIO </router-link>
    </div>

    <h2 class="titulo-seccion-admin">LISTADO DE USUARIOS</h2>

    <table class="tabla-admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Foto</th>
          <th>Nombre</th>
          <th>Email</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="tabla-body">
        <tr v-for="usuario in userStore.usuarios" :key="usuario.id">
          <td>{{ usuario.id }}</td>
          <td>
            <img
              v-if="usuario.foto"
              :src="`/media/usuarios/${usuario.foto}`"
              :alt="`Foto de ${usuario.nombre}`"
              class="foto-usuario"
            />
            <img v-else :src="`/media/usuarios/sin-foto.png`" alt="Sin foto" class="foto-usuario" />
          </td>
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.email }}</td>
          <td>
            <strong>{{ getRolNombre(usuario.rol) }}</strong>
          </td>
          <td class="celda-acciones">
            <router-link
              :to="`/admin/usuarios/editar/${usuario.id}`"
              class="btn-edit"
              title="Editar"
              >✏️</router-link
            >
            <router-link
              :to="`/admin/usuarios/${usuario.id}`"
              class="btn-ver-detalle"
              title="Ver detalle"
              >👁️</router-link
            >
            <a href="#" class="btn-borrar" title="Eliminar" @click.prevent="irAEliminar(usuario.id)"
              >🗑️</a
            >
          </td>
        </tr>

        <tr v-if="!userStore.cargando && userStore.usuarios.length === 0">
          <td colspan="6" style="text-align: center; color: white; padding: 20px">
            No hay usuarios que mostrar.
          </td>
        </tr>
        <tr v-if="userStore.cargando">
          <td colspan="6" style="text-align: center; color: white; padding: 20px">
            Cargando usuarios...
          </td>
        </tr>
      </tbody>
    </table>

    <Paginator
      :pagina-actual="userStore.paginaActual"
      :total-paginas="totalPaginas"
      @cambiar-pagina="manejarCambioPagina"
    />
  </section>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import Buscador from '@/components/SearchInput.vue'
import Paginator from '@/components/Paginator.vue'

const userStore = useUserStore()
const router = useRouter()

const totalPaginas = computed(() => {
  return Math.ceil(userStore.totalUsuarios / userStore.porPagina) || 1
})

onMounted(() => {
  userStore.listarUsuarios(userStore.textoBusqueda, userStore.paginaActual, userStore.porPagina)
})

function getRolNombre(rol: number): string {
  const roles: Record<number, string> = {
    1: 'Super Admin',
    2: 'Admin',
    3: 'Cliente',
  }
  return roles[rol] || 'Desconocido'
}

function manejarBuscar(valor: string) {
  userStore.textoBusqueda = valor
  userStore.listarUsuarios(userStore.textoBusqueda, 1, userStore.porPagina)
}

function manejarLimpiar() {
  userStore.textoBusqueda = ''
  userStore.listarUsuarios('', 1, userStore.porPagina)
}

function manejarCambioPagina(nuevaPagina: number) {
  userStore.listarUsuarios(userStore.textoBusqueda, nuevaPagina, userStore.porPagina)
}

function irAEliminar(id: number) {
  router.push(`/admin/usuarios/eliminar/${id}`)
}
</script>
<style scoped>
.barra-superior {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.admin-panel-listado {
  padding-top: 0;
}

.foto-usuario {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

@media (max-width: 700px) {
  .barra-superior {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    margin-bottom: 20px;
  }

  .btn-nuevo-admin {
    width: 100%;
    text-align: center;
  }
}
</style>
