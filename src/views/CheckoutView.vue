<template>
  <main id="contenedor-principal">
    <h1 class="detalle-titulo">Finalizar Compra</h1>

    <section class="form-container">
      <form @submit="onSubmit" novalidate>
        <div class="form-content">
          <h2 class="titulo-seccion-form">Datos de Envío y Pago</h2>

          <label for="direccion">Dirección Completa:</label>
          <input
            type="text"
            id="direccion"
            v-model="direccion"
            placeholder="Calle, número, piso, ciudad..."
            :class="{ 'input-error': errorDireccion }"
          />
          <span class="mensaje-error-campo">{{ errorDireccion }}</span>

          <label for="metodo_pago">Método de Pago:</label>
          <select id="metodo_pago" v-model="metodoPago" :class="{ 'input-error': errorMetodoPago }">
            <option value="" disabled>Selecciona una opción...</option>
            <option value="TARJETA">Tarjeta de Crédito / Débito</option>
            <option value="PAYPAL">PayPal</option>
            <option value="BIZUM">Bizum</option>
            <option value="TRANSFERENCIA">Transferencia Bancaria</option>
          </select>
          <span class="mensaje-error-campo">{{ errorMetodoPago }}</span>

          <!-- Campos dinámicos TARJETA -->
          <template v-if="metodoPago === 'TARJETA'">
            <label for="tarjeta_num">Número de Tarjeta:</label>
            <input
              type="text"
              id="tarjeta_num"
              v-model="tarjetaNum"
              placeholder="0000-0000-0000-0000"
              :class="{ 'input-error': errorTarjetaNum }"
            />
            <span class="mensaje-error-campo">{{ errorTarjetaNum }}</span>

            <div class="form-row-especial" style="display: flex; gap: 20px">
              <div class="form-col-especial" style="flex: 1">
                <label for="tarjeta_exp">Caducidad:</label>
                <input
                  type="text"
                  id="tarjeta_exp"
                  v-model="tarjetaExp"
                  placeholder="MM/AA"
                  :class="{ 'input-error': errorTarjetaExp }"
                />
                <span class="mensaje-error-campo">{{ errorTarjetaExp }}</span>
              </div>
              <div class="form-col-especial" style="flex: 1">
                <label for="tarjeta_cvv">CVV:</label>
                <input
                  type="text"
                  id="tarjeta_cvv"
                  v-model="tarjetaCvv"
                  placeholder="123"
                  :class="{ 'input-error': errorTarjetaCvv }"
                />
                <span class="mensaje-error-campo">{{ errorTarjetaCvv }}</span>
              </div>
            </div>
          </template>

          <!-- Campos dinámicos BIZUM -->
          <template v-if="metodoPago === 'BIZUM'">
            <p class="ayuda-file">Envía el pago al número: <strong>600 000 000</strong></p>
            <label for="bizum_tlf">Tu número de teléfono Bizum:</label>
            <input
              type="text"
              id="bizum_tlf"
              v-model="bizumTlf"
              placeholder="600123456"
              :class="{ 'input-error': errorBizumTlf }"
            />
            <span class="mensaje-error-campo">{{ errorBizumTlf }}</span>
          </template>

          <!-- Info TRANSFERENCIA -->
          <template v-if="metodoPago === 'TRANSFERENCIA'">
            <div class="mensaje-alerta mensaje-warning">
              <strong>IBAN:</strong> ES21 1234 5678 9012 3456 7890<br />
              Indica tu nombre en el concepto.
            </div>
          </template>
        </div>

        <div class="form-buttons">
          <button type="submit" class="btn-comprar" :disabled="cargando">
            {{ cargando ? 'PROCESANDO...' : 'Confirmar Pedido' }}
          </button>
          <RouterLink to="/carrito" class="btn-checkout-volver">Volver al Carrito</RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useNotificacion } from '@/composables/useNotificacion'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const notificacion = useNotificacion()
const cargando = ref(false)

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: yup.object({
    direccion: yup
      .string()
      .required('Introduce una dirección completa')
      .min(10, 'Mínimo 10 caracteres'),
    metodoPago: yup.string().required('Selecciona un método de pago'),
    tarjetaNum: yup.string().nullable(),
    tarjetaExp: yup.string().nullable(),
    tarjetaCvv: yup.string().nullable(),
    bizumTlf: yup.string().nullable(),
  }),
})

const { value: direccion, errorMessage: errorDireccion } = useField<string>('direccion')
const { value: metodoPago, errorMessage: errorMetodoPago } = useField<string>('metodoPago')
const { value: tarjetaNum, errorMessage: errorTarjetaNum } = useField<string>('tarjetaNum')
const { value: tarjetaExp, errorMessage: errorTarjetaExp } = useField<string>('tarjetaExp')
const { value: tarjetaCvv, errorMessage: errorTarjetaCvv } = useField<string>('tarjetaCvv')
const { value: bizumTlf, errorMessage: errorBizumTlf } = useField<string>('bizumTlf')

watch(metodoPago, () => {
  setFieldValue('tarjetaNum', '')
  setFieldValue('tarjetaExp', '')
  setFieldValue('tarjetaCvv', '')
  setFieldValue('bizumTlf', '')
})

function validarCamposDinamicos(): boolean {
  const metodo = metodoPago.value

  if (metodo === 'TARJETA') {
    const regexTarjeta = /^(\d[\s-]?){16}$/
    const regexExp = /^(0[1-9]|1[0-2])\/\d{2}$/
    const regexCvv = /^\d{3}$/

    if (!regexTarjeta.test((tarjetaNum.value ?? '').trim())) {
      notificacion.error('Número de tarjeta inválido (16 dígitos)')
      return false
    }
    if (!regexExp.test((tarjetaExp.value ?? '').trim())) {
      notificacion.error('Formato de caducidad incorrecto (MM/AA)')
      return false
    }
    if (!regexCvv.test((tarjetaCvv.value ?? '').trim())) {
      notificacion.error('CVV inválido (3 dígitos)')
      return false
    }
  }

  if (metodo === 'BIZUM') {
    if (!/^[67]\d{8}$/.test((bizumTlf.value ?? '').trim())) {
      notificacion.error('Número de móvil no válido (9 dígitos)')
      return false
    }
  }

  return true
}

const onSubmit = handleSubmit(async (valores) => {
  if (!validarCamposDinamicos()) return

  cargando.value = true
  try {
    const data = await authStore.apiFetch('/carrito/finalizar', {
      method: 'POST',
      body: JSON.stringify({
        carrito: cartStore.carrito,
        direccion: valores.direccion,
        metodo_pago: valores.metodoPago,
      }),
    })

    if (data.resultado === 'OK') {
      sessionStorage.removeItem('carrito')
      cartStore.carrito = []
      notificacion.exito('¡Pedido realizado con éxito! ID: ' + data.id_pedido)
      router.push('/')
    }
  } catch (error: any) {
    notificacion.error(error.message || 'Error al procesar el pedido')
  } finally {
    cargando.value = false
  }
})
</script>
