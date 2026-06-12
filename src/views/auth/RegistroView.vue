<template>
  <main id="contenedor-principal">
    <h2 class="titulo-seccion-registro">REGÍSTRATE GRATIS</h2>
    <section class="form-container">
      <form id="form-registro" @submit="onSubmit" autocomplete="off" novalidate>
        <div class="form-content">
          <label for="nombre">Nombre Completo:</label>
          <input
            type="text"
            id="nombre"
            v-model="nombre"
            placeholder="Tu nombre real"
            :class="{ 'input-error': errorNombre }"
          />
          <span class="mensaje-error-campo">{{ errorNombre }}</span>

          <label for="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Ej: mamen@correo.com"
            :class="{ 'input-error': errorEmail }"
          />
          <span class="mensaje-error-campo">{{ errorEmail }}</span>

          <label for="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Mínimo 6 caracteres"
            autocomplete="new-password"
            :class="{ 'input-error': errorPassword }"
          />
          <span class="mensaje-error-campo">{{ errorPassword }}</span>

          <label for="confirm_password">Repite la Contraseña:</label>
          <input
            type="password"
            id="confirm_password"
            v-model="confirmPassword"
            placeholder="Repite tu contraseña"
            autocomplete="new-password"
            :class="{ 'input-error': errorConfirmPassword }"
          />
          <span class="mensaje-error-campo">{{ errorConfirmPassword }}</span>

          <label for="foto">Tu Foto:</label>
          <input
            type="file"
            id="foto"
            accept="image/*"
            class="input-file-bonito"
            @change="manejarSubidaFoto"
          />
          <span class="mensaje-error-campo">{{ errorFoto }}</span>
        </div>

        <div class="form-buttons">
          <button type="submit" class="btn-enviar" :disabled="cargando">
            {{ cargando ? 'CREANDO...' : 'Crear mi Cuenta' }}
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

// Guardamos el archivo de la foto de forma reactiva nativa
const archivoFoto = ref<File | null>(null)

// --- ESQUEMA DE VALIDACIÓN CON YUP ---
const { handleSubmit } = useForm({
  validationSchema: yup.object({
    nombre: yup
      .string()
      .required('El nombre es obligatorio')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres'),
    email: yup
      .string()
      .required('El correo electrónico es obligatorio')
      .email('Introduce un formato de correo válido'),
    password: yup
      .string()
      .required('La contraseña es obligatoria')
      .min(6, 'Mínimo 6 caracteres')
      .matches(/(?=.*[A-Z])/, 'Debe contener al menos una mayúscula')
      .matches(/(?=.*\d)/, 'Debe contener al menos un número'),
    confirmPassword: yup
      .string()
      .required('Debes confirmar tu contraseña')
      .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
  }),
})

// --- ENLACE DE CAMPOS CON VEE-VALIDATE ---
const { value: nombre, errorMessage: errorNombre } = useField<string>('nombre')
const { value: email, errorMessage: errorEmail } = useField<string>('email')
const { value: password, errorMessage: errorPassword } = useField<string>('password')
const { value: confirmPassword, errorMessage: errorConfirmPassword } =
  useField<string>('confirmPassword')
const errorFoto = ref('') // Error manual para controlar el archivo si se requiere

function manejarSubidaFoto(evento: Event) {
  const target = evento.target as HTMLInputElement
  const file = target.files?.[0]
  archivoFoto.value = file || null
  errorFoto.value = ''
}

// --- ENVÍO DEL FORMULARIO CON FORMDATA ---
const onSubmit = handleSubmit(async (valores) => {
  cargando.value = true
  try {
    // Instanciamos el FormData que requiere tu backend en Java
    const formData = new FormData()
    formData.append('nombre', valores.nombre)
    formData.append('email', valores.email)
    formData.append('pass1', valores.password)
    formData.append('pass2', valores.confirmPassword)

    // Si la usuaria seleccionó una foto, la adjuntamos
    if (archivoFoto.value) {
      formData.append('foto', archivoFoto.value)
    }

    // Llamada directa al método de registro de tu useAuthStore
    await authStore.registro(formData)

    // Redirigimos al Login pasando el mensaje de éxito a través del state de la historia
    router.push({
      path: '/auth/login',
      state: {
        mensaje: '¡Cuenta creada con éxito! Ya puedes iniciar sesión.',
        tipo: 'exito',
      },
    })
  } catch (error: any) {
    notificacion.error(error.message || 'Error al procesar el registro')
  } finally {
    cargando.value = false
  }
})
</script>
<style scoped>
main {
  background-color: #333;
  color: #474747;
}
.titulo-seccion-registro {
  text-align: center;
  color: white;
}
/* enlaces */
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
</style>
