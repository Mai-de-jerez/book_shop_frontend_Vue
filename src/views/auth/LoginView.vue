<template>
  <main id="contenedor-principal">
    <h2 class="titulo-seccion-login">INICIAR SESIÓN</h2>

    <section class="form-login">
      <form @submit="onSubmit">
        <div class="form-content">
          <label for="usuario">Usuario:</label>
          <input
            type="text"
            id="usuario"
            v-model="usuario"
            placeholder="Tu usuario"
            :class="{ 'input-error': errorUsuario }"
          />
          <span class="mensaje-error-campo">{{ errorUsuario }}</span>

          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Tu clave"
            :class="{ 'input-error': errorPassword }"
          />
          <span class="mensaje-error-campo">{{ errorPassword }}</span>

          <div class="link-registro">
            <p>¿No tienes cuenta? <router-link to="/auth/registro">Regístrate</router-link></p>
          </div>
        </div>

        <div class="form-buttons form-buttons-login">
          <button type="submit" class="btn-enviar" :disabled="cargando">
            {{ cargando ? 'ENTRANDO...' : 'ENTRAR' }}
          </button>
          <button type="button" class="btn-cancelar" @click="router.push('/')">
            VOLVER AL INICIO
          </button>
          <router-link to="/recuperar" class="link-login">
            ¿Has olvidado la contraseña?
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
    usuario: yup
      .string()
      .required('El usuario es obligatorio')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    password: yup
      .string()
      .required('La contraseña es obligatoria')
      .min(6, 'Mínimo 6 caracteres')
      .matches(/(?=.*[A-Z])/, 'Debe contener al menos una mayúscula')
      .matches(/(?=.*\d)/, 'Debe contener al menos un número'),
  }),
})

const { value: usuario, errorMessage: errorUsuario } = useField<string>('usuario')
const { value: password, errorMessage: errorPassword } = useField<string>('password')

const onSubmit = handleSubmit(async (valores) => {
  cargando.value = true
  try {
    await authStore.login(valores.usuario, valores.password)
    router.push(authStore.esAdmin ? '/admin' : '/')
  } catch (error: any) {
    notificacion.error(error.message || 'Credenciales incorrectas')
  } finally {
    cargando.value = false
  }
})

onMounted(() => {
  const state = history.state
  if (state?.mensaje) {
    notificacion[state.tipo as 'exito' | 'error' | 'info'](state.mensaje)
  }
})
</script>

<style scoped>
main {
  background-color: #333;
  color: #474747;
}

.titulo-seccion-login {
  text-align: center;
  color: white;
}

.form-login {
  width: 90%;
  max-width: 350px;
  margin: 40px auto;
  background-color: #f9f9f9;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.link-registro {
  text-align: center;
  margin-top: 10px;
  font-family: sans-serif;
}

.link-registro a {
  color: #3ca243;
  font-weight: bold;
  text-decoration: none;
}

.link-login {
  display: block;
  font-size: 0.9rem;
  color: #666;
  text-decoration: none;
  margin-bottom: 20px;
  text-align: center;
}

.link-login:hover {
  color: #3ca243;
}

.form-buttons-login {
  flex-direction: column;
  gap: 15px;
}
</style>
