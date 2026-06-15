<template>
  <main id="contenedor-principal">
    <section id="vista-formulario" class="form-container">
      <h2 class="titulo-seccion-form">EDITAR MI PERFIL</h2>
      <form @submit="onSubmit" enctype="multipart/form-data" novalidate>
        <div class="form-content">
          <label for="nombre">Nombre Completo:</label>
          <input type="text" id="nombre" v-model="nombre" :class="{ 'input-error': errorNombre }" />
          <span class="mensaje-error-campo">{{ errorNombre }}</span>

          <label for="email">Correo Electrónico:</label>
          <input type="email" id="email" v-model="email" :class="{ 'input-error': errorEmail }" />
          <span class="mensaje-error-campo">{{ errorEmail }}</span>

          <label for="password">Nueva Contraseña:</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Dejar en blanco para no cambiar"
            autocomplete="new-password"
            :class="{ 'input-error': errorPassword }"
          />
          <span class="mensaje-error-campo">{{ errorPassword }}</span>

          <label for="confirm_password">Repite la Nueva Contraseña:</label>
          <input
            type="password"
            id="confirm_password"
            v-model="confirmPassword"
            placeholder="Repite la contraseña"
            autocomplete="new-password"
            :class="{ 'input-error': errorConfirmPassword }"
          />
          <span class="mensaje-error-campo">{{ errorConfirmPassword }}</span>

          <label for="foto">Cambiar Foto de Perfil:</label>
          <input
            type="file"
            id="foto"
            accept="image/*"
            class="input-file-bonito"
            @change="manejarSubidaFoto"
          />
          <span class="mensaje-error-campo">{{ errorFoto }}</span>
          <p class="ayuda-file">Foto actual: {{ clientStore.perfil?.foto ?? 'Sin foto' }}</p>
        </div>

        <div class="form-buttons">
          <button type="submit" class="btn-enviar" :disabled="clientStore.cargando">
            {{ clientStore.cargando ? 'GUARDANDO...' : 'Guardar Cambios' }}
          </button>
          <button type="button" class="btn-cancelar" @click="router.push('/perfil/ver')">
            Cancelar
          </button>
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
import { useClientStore } from '@/stores/perfil'
import { useNotificacion } from '@/composables/useNotificacion'

const router = useRouter()
const clientStore = useClientStore()
const notificacion = useNotificacion()
const archivoFoto = ref<File | null>(null)
const errorFoto = ref('')
// Expresión regular para validar caracteres permitidos en los campos de texto
const regexTextoValido = /^[a-zA-ZÀ-ÿ\s\-]+$/

const { handleSubmit, setValues } = useForm({
  validationSchema: yup.object({
    nombre: yup
      .string()
      .required('El nombre es obligatorio')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres')
      .matches(regexTextoValido, 'Has introducido caracteres especiales no aceptados'),
    email: yup
      .string()
      .required('El correo electrónico es obligatorio')
      .email('Introduce un formato de correo válido'),
    password: yup
      .string()
      .nullable()
      .transform((v) => (v === '' ? null : v))
      .min(6, 'Mínimo 6 caracteres')
      .matches(/(?=.*[A-Z])/, {
        message: 'Debe contener al menos una mayúscula',
        excludeEmptyString: true,
      })
      .matches(/(?=.*\d)/, {
        message: 'Debe contener al menos un número',
        excludeEmptyString: true,
      }),
    confirmPassword: yup
      .string()
      .nullable()
      .transform((v) => (v === '' ? null : v))
      .when('password', {
        is: (val: string | null) => !!val,
        then: (schema) =>
          schema
            .required('Debes confirmar la contraseña')
            .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
      }),
  }),
})

const { value: nombre, errorMessage: errorNombre } = useField<string>('nombre')
const { value: email, errorMessage: errorEmail } = useField<string>('email')
const { value: password, errorMessage: errorPassword } = useField<string>('password')
const { value: confirmPassword, errorMessage: errorConfirmPassword } =
  useField<string>('confirmPassword')

function manejarSubidaFoto(evento: Event) {
  const target = evento.target as HTMLInputElement
  const file = target.files?.[0] ?? null

  if (!file) {
    errorFoto.value = ''
    archivoFoto.value = null
    return
  }

  // Las reglas exactas que tenías en tu 'validaciones.ts'
  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const tamañoMax = 2 * 1024 * 1024 // 2MB

  if (!tiposPermitidos.includes(file.type)) {
    errorFoto.value = 'Solo se permiten jpg, png, gif y webp.'
    archivoFoto.value = null
    target.value = '' // Resetea el input en el HTML
    return
  }

  if (file.size > tamañoMax) {
    errorFoto.value = 'La foto no puede superar 2MB.'
    archivoFoto.value = null
    target.value = '' // Resetea el input en el HTML
    return
  }

  // Si pasa los dos filtros, la foto es buena
  errorFoto.value = ''
  archivoFoto.value = file
}

const onSubmit = handleSubmit(async (valores) => {
  const formData = new FormData()
  formData.append('nombre', valores.nombre)
  formData.append('email', valores.email)
  formData.append('password', valores.password ?? '')
  formData.append('confirm_password', valores.confirmPassword ?? '')
  formData.append('foto_actual', clientStore.perfil?.foto ?? '')

  if (archivoFoto.value) {
    formData.append('foto', archivoFoto.value)
  }

  try {
    await clientStore.actualizarPerfil(formData)
    notificacion.exito('Perfil actualizado correctamente')
    router.push('/perfil/ver')
  } catch (error: any) {
    notificacion.error(error.message || 'Error al actualizar el perfil')
  }
})

onMounted(async () => {
  if (!clientStore.perfil) {
    await clientStore.cargarPerfil()
  }
  setValues({
    nombre: clientStore.perfil?.nombre ?? '',
    email: clientStore.perfil?.email ?? '',
    password: '',
    confirmPassword: '',
  })
})
</script>
