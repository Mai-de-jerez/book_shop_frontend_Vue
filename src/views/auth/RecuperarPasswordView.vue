<template>
  <main id="contenedor-principal">
    <h2 class="titulo-seccion-recuperar">¿HAS OLVIDADO TU CLAVE?</h2>

    <section class="form-recuperar">
      <p>
        Introduce tu correo electrónico y te enviaremos un enlace seguro para que puedas cambiar tu
        contraseña.
      </p>

      <form @submit="onSubmit" novalidate>
        <div class="form-content">
          <label for="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="tu-email@ejemplo.com"
            :class="{ 'input-error': errorEmail }"
          />
          <span class="mensaje-error-campo">{{ errorEmail }}</span>
        </div>

        <div class="form-buttons">
          <button type="submit" class="btn-enviar" :disabled="cargando">
            {{ cargando ? 'ENVIANDO...' : 'Enviar Enlace' }}
          </button>
          <button type="button" class="btn-cancelar" @click="router.push('/auth/login')">
            Cancelar
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useNotificacion } from '@/composables/useNotificacion'

const router = useRouter()
const authStore = useAuthStore()
const notificacion = useNotificacion()
const cargando = ref(false)

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup
      .string()
      .required('El correo electrónico es obligatorio')
      .email('Formato de email no válido'),
  }),
})

const { value: email, errorMessage: errorEmail } = useField<string>('email')

const onSubmit = handleSubmit(async (valores) => {
  cargando.value = true
  try {
    await authStore.solicitarRecuperacion(valores.email)
    notificacion.exito('Revisa tu email para restablecer la contraseña')
    router.push('/auth/login')
  } catch (error: any) {
    notificacion.error(error.message || 'Error al enviar el email')
  } finally {
    cargando.value = false
  }
})
</script>
<style scoped>
main {
  background-color: #333;
  color: #474747;
  padding-bottom: 1px;
}

.form-recuperar {
  width: 95%;
  max-width: 700px;
  margin: 40px auto;
  margin-bottom: 166px;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
.titulo-seccion-recuperar {
  text-align: center;
  color: white;
  margin-top: 40px;
}
</style>
