<template>
  <section class="form-container">
    <h2 class="titulo-seccion-form">
      {{ titulo ?? (esEdicion ? 'EDITAR MI PERFIL' : 'REGÍSTRATE GRATIS') }}
    </h2>
    <form @submit="onSubmit" autocomplete="off" novalidate>
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

        <label for="password">{{ esEdicion ? 'Nueva Contraseña:' : 'Contraseña:' }}</label>
        <input
          type="password"
          id="password"
          v-model="password"
          :placeholder="esEdicion ? 'Dejar en blanco para no cambiar' : 'Mínimo 6 caracteres'"
          autocomplete="new-password"
          :class="{ 'input-error': errorPassword }"
        />
        <span class="mensaje-error-campo">{{ errorPassword }}</span>

        <label for="confirm_password">Repite la {{ esEdicion ? 'Nueva ' : '' }}Contraseña:</label>
        <input
          type="password"
          id="confirm_password"
          v-model="confirmPassword"
          placeholder="Repite tu contraseña"
          autocomplete="new-password"
          :class="{ 'input-error': errorConfirmPassword }"
        />
        <span class="mensaje-error-campo">{{ errorConfirmPassword }}</span>

        <label for="foto">{{ esEdicion ? 'Cambiar Foto de Perfil:' : 'Tu Foto:' }}</label>
        <input
          type="file"
          id="foto"
          accept="image/*"
          class="input-file-bonito"
          @change="manejarSubidaFoto"
        />
        <span class="mensaje-error-campo">{{ errorFoto }}</span>
        <p v-if="esEdicion && fotoActual" class="ayuda-file">Foto actual: {{ fotoActual }}</p>
      </div>

      <div class="form-buttons">
        <button type="submit" class="btn-enviar" :disabled="cargando">
          {{
            cargando
              ? esEdicion
                ? 'GUARDANDO...'
                : 'CREANDO...'
              : esEdicion
                ? 'Guardar Cambios'
                : 'Crear mi Cuenta'
          }}
        </button>
        <button type="button" class="btn-cancelar" @click="cancelar">Cancelar</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useNotificacion } from '@/composables/useNotificacion'

const props = defineProps<{
  esEdicion?: boolean
  fotoActual?: string | null
  titulo?: string
  initialValues?: {
    nombre?: string
    email?: string
  }
  cargando?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
}>()

const router = useRouter()
const notificacion = useNotificacion()
const archivoFoto = ref<File | null>(null)
const errorFoto = ref('')

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
    password: props.esEdicion
      ? yup
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
          })
      : yup
          .string()
          .required('La contraseña es obligatoria')
          .min(6, 'Mínimo 6 caracteres')
          .matches(/(?=.*[A-Z])/, 'Debe contener al menos una mayúscula')
          .matches(/(?=.*\d)/, 'Debe contener al menos un número'),
    confirmPassword: props.esEdicion
      ? yup
          .string()
          .nullable()
          .transform((v) => (v === '' ? null : v))
          .when('password', {
            is: (val: string | null) => !!val,
            then: (schema) =>
              schema
                .required('Debes confirmar la contraseña')
                .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
          })
      : yup
          .string()
          .required('Debes confirmar tu contraseña')
          .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
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

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const tamañoMax = 2 * 1024 * 1024

  if (!tiposPermitidos.includes(file.type)) {
    errorFoto.value = 'Solo se permiten jpg, png, gif y webp.'
    archivoFoto.value = null
    target.value = ''
    return
  }

  if (file.size > tamañoMax) {
    errorFoto.value = 'La foto no puede superar 2MB.'
    archivoFoto.value = null
    target.value = ''
    return
  }

  errorFoto.value = ''
  archivoFoto.value = file
}

const onSubmit = handleSubmit((valores) => {
  const formData = new FormData()
  formData.append('nombre', valores.nombre)
  formData.append('email', valores.email)

  if (props.esEdicion) {
    formData.append('password', valores.password ?? '')
    formData.append('confirm_password', valores.confirmPassword ?? '')
    formData.append('foto_actual', props.fotoActual ?? '')
  } else {
    formData.append('pass1', valores.password ?? '')
    formData.append('pass2', valores.confirmPassword ?? '')
  }

  if (archivoFoto.value) {
    formData.append('foto', archivoFoto.value)
  }

  emit('submit', formData)
})

function cancelar() {
  if (props.esEdicion) {
    router.push('/perfil/ver')
  } else {
    router.push('/auth/login')
  }
}

onMounted(() => {
  if (props.initialValues) {
    setValues({
      nombre: props.initialValues.nombre ?? '',
      email: props.initialValues.email ?? '',
      password: '',
      confirmPassword: '',
    })
  }
})
</script>
