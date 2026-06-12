<template>
  <main id="contenedor-principal">
    <h2 class="titulo-seccion-form">RESTABLECER CONTRASEÑA</h2>

    <section class="form-nueva-password">
      <p class="instrucciones-olvido">
        Por favor, introduce tu nueva contraseña. Asegúrate de que sea segura.
      </p>

      <form @submit="onSubmit" novalidate>
        <div class="form-content">
          <label for="password">Nueva Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Mínimo 6 caracteres"
            :class="{ 'input-error': errorPassword }"
          />
          <span class="mensaje-error-campo">{{ errorPassword }}</span>

          <label for="confirm_password">Repite la Contraseña:</label>
          <input
            type="password"
            id="confirm_password"
            v-model="confirmPassword"
            placeholder="Repite tu nueva contraseña"
            :class="{ 'input-error': errorConfirmPassword }"
          />
          <span class="mensaje-error-campo">{{ errorConfirmPassword }}</span>
        </div>

        <div class="form-buttons">
          <button type="submit" class="btn-enviar" :disabled="cargando">
            {{ cargando ? 'CAMBIANDO...' : 'Cambiar Contraseña' }}
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/stores/auth'
import { useNotificacion } from '@/composables/useNotificacion'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificacion = useNotificacion()
const cargando = ref(false)
const token = ref('')

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    password: yup
      .string()
      .required('La contraseña es obligatoria')
      .min(6, 'Mínimo 6 caracteres')
      .matches(/(?=.*[A-Z])/, 'Debe contener al menos una mayúscula')
      .matches(/(?=.*\d)/, 'Debe contener al menos un número'),
    confirmPassword: yup
      .string()
      .required('Debes confirmar la contraseña')
      .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
  }),
})

const { value: password, errorMessage: errorPassword } = useField<string>('password')
const { value: confirmPassword, errorMessage: errorConfirmPassword } =
  useField<string>('confirmPassword')

onMounted(() => {
  const tokenParam = route.query.token as string
  if (!tokenParam) {
    notificacion.error('Token inválido o expirado')
    router.push('/auth/login')
    return
  }
  token.value = tokenParam
})

const onSubmit = handleSubmit(async (valores) => {
  cargando.value = true
  try {
    await authStore.confirmarRecuperacion(token.value, valores.password, valores.confirmPassword)
    notificacion.exito('Contraseña actualizada correctamente')
    router.push('/auth/login')
  } catch (error: any) {
    notificacion.error(error.message || 'Error al cambiar la contraseña')
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
.titulo-seccion-form {
  text-align: center;
  color: white;
  margin-top: 40px;
}
.form-nueva-password {
  width: 95%;
  max-width: 700px;
  margin: 40px auto;
  margin-bottom: 68px;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
</style>
