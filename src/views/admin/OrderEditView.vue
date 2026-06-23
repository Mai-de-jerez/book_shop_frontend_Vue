<template>
  <section class="form-container">
    <h2 class="titulo-seccion-form">EDITAR PEDIDO</h2>

    <form @submit="onSubmit" novalidate>
      <div class="form-content">
        <label>Usuario:</label>
        <input type="text" :value="nombreUsuario" disabled style="background-color: #f0f0f0" />

        <label>Fecha del Pedido:</label>
        <input type="text" :value="fechaFormateada" disabled style="background-color: #f0f0f0" />

        <label for="direccion">Dirección de Envío:</label>
        <textarea
          id="direccion"
          name="direccion"
          v-model="direccion"
          :class="{ 'input-error': errorDireccion }"
        ></textarea>
        <span class="mensaje-error-campo">{{ errorDireccion }}</span>

        <div class="form-row-especial">
          <div class="form-col-especial">
            <label>Método de Pago:</label>
            <input type="text" :value="metodoPago" disabled style="background-color: #f0f0f0" />
          </div>
          <div class="form-col-especial">
            <label for="estado">Estado:</label>
            <select id="estado" v-model="estado" :class="{ 'input-error': errorEstado }">
              <option value="PENDIENTE">Pendiente</option>
              <option value="ENVIADO">Enviado</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
            <span class="mensaje-error-campo">{{ errorEstado }}</span>
          </div>
          <div class="form-col-especial">
            <label>Total (€):</label>
            <input
              type="text"
              :value="totalFormateado"
              disabled
              style="background-color: #f0f0f0"
            />
          </div>
        </div>

        <label for="descripcion">Descripción / Notas Internas:</label>
        <textarea
          id="descripcion"
          name="descripcion"
          v-model="descripcion"
          :class="{ 'input-error': errorDescripcion }"
        ></textarea>
        <span class="mensaje-error-campo">{{ errorDescripcion }}</span>

        <div style="background: #f8f9fa; border-radius: 10px">
          <h3>Productos del Pedido</h3>
          <p
            v-for="item in detalles"
            :key="item.tituloLibro"
            style="margin: 5px 0; font-size: 0.9em"
          >
            • {{ item.tituloLibro }} (x{{ item.cantidad }})
          </p>
        </div>
      </div>

      <div class="form-buttons">
        <button type="submit" class="btn-enviar" :disabled="cargando">
          {{ cargando ? 'GUARDANDO...' : 'Actualizar Cambios' }}
        </button>
        <button type="button" class="btn-cancelar btn-cancelar-accion" @click="cancelar">
          Descartar
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useOrderStore } from '@/stores/orders'
import { formatDate } from '@/utils/dateFormatter'
import { useNotificacion } from '@/composables/useNotificacion'

const notificacion = useNotificacion()
const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()
const cargando = ref(false)

// Estados para los campos deshabilitados
const nombreUsuario = ref('')
const fechaFormateada = ref('')
const metodoPago = ref('')
const totalFormateado = ref('')
const detalles = ref<any[]>([])

const { handleSubmit, setValues } = useForm({
  validationSchema: yup.object({
    direccion: yup.string().required('La dirección es obligatoria').min(5, 'Mínimo 5 caracteres'),
    estado: yup.string().required('El estado es obligatorio'),
    descripcion: yup.string().nullable(),
  }),
})

// Mapeo de campos editables
const { value: direccion, errorMessage: errorDireccion } = useField<string>('direccion')
const { value: estado, errorMessage: errorEstado } = useField<string>('estado')
const { value: descripcion, errorMessage: errorDescripcion } = useField<string>('descripcion')

const onSubmit = handleSubmit(async (valores) => {
  cargando.value = true
  try {
    const id = Number(route.params.id)
    await orderStore.actualizarPedido(id, {
      direccion: valores.direccion,
      estado: valores.estado,
      descripcion: valores.descripcion || '',
    })
    notificacion.exito('Pedido actualizado correctamente')
    router.push({ name: 'admin-pedidos' })
  } catch (error: any) {
    // Aquí es donde el notificacion realmente trabaja
    notificacion.error(error.message || 'Error al actualizar el pedido')
  } finally {
    cargando.value = false
  }
})

function cancelar() {
  router.push({ name: 'admin-pedidos' })
}

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    const p = await orderStore.obtenerPedido(id)

    if (p) {
      nombreUsuario.value = p.nombreUsuario
      fechaFormateada.value = formatDate(p.fecha)
      metodoPago.value = p.metodoPago
      totalFormateado.value = p.total.toFixed(2) + ' €'
      detalles.value = p.detalles

      setValues({
        direccion: p.direccion,
        estado: p.estado,
        descripcion: p.descripcion,
      })
    } else {
      throw new Error('No se ha podido encontrar el pedido.')
    }
  } catch (error: any) {
    notificacion.error(error.message || 'Error al cargar los datos del pedido')
    router.push({ name: 'admin-pedidos' })
  }
})
</script>
<style scoped>
textarea {
  margin-bottom: 0;
}
</style>
