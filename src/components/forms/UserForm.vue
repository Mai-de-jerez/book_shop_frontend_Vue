<template>
  <section class="form-container">
    <h2 class="titulo-seccion-form">
      {{ esEdicion ? 'EDITAR USUARIO' : 'REGISTRAR USUARIO' }}
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

        <div class="form-row-especial">
          <div class="form-col-especial">
            <label for="rol">Rol del Usuario:</label>
            <select id="rol" v-model="rol">
              <option value="3">Usuario Estándar</option>
              <option value="2">Editor</option>
              <option value="1">Superuser</option>
            </select>
            <span class="mensaje-error-campo">{{ errorRol }}</span>
          </div>
        </div>

        <label for="foto">{{ esEdicion ? 'Cambiar Foto de Usuario:' : 'Foto:' }}</label>
        <input
          type="file"
          id="foto"
          accept="image/*"
          class="input-file-bonito"
          @change="manejarSubidaFoto"
        />
        <p class="ayuda-file" id="texto-ayuda-img">
          {{
            fotoActual ? 'Foto actual: ' + fotoActual : 'Permitido jpg, gif y png. Menores de 5 Mb'
          }}
        </p>
        <span class="mensaje-error-campo">{{ errorFoto }}</span>
        <!-- Vista previa -->
        <div v-if="previewUrl" style="margin-bottom: 10px">
          <img
            :src="previewUrl"
            alt="Vista previa"
            style="max-height: 150px; border-radius: 4px; object-fit: cover"
          />
        </div>
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
                : 'Crear Usuario'
          }}
        </button>
        <button type="button" class="btn-cancelar" @click="cancelar">Cancelar</button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import { useUserStore } from '@/stores/user'
import * as yup from 'yup'
import { useNotificacion } from '@/composables/useNotificacion'

const props = defineProps<{
  id?: string
}>()

const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
}>()

const router = useRouter()
const userStore = useUserStore()
const notificacion = useNotificacion()
const esEdicion = computed(() => !!props.id)

const cargando = ref(false)
const archivoFoto = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const fotoActual = ref('')

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
    password: esEdicion
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
    confirmPassword: esEdicion
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
    rol: yup
      .number()
      .required('El rol es obligatorio')
      .min(1, 'Rol no válido')
      .max(3, 'Rol no válido'),
  }),
})

const { value: nombre, errorMessage: errorNombre } = useField<string>('nombre')
const { value: email, errorMessage: errorEmail } = useField<string>('email')
const { value: password, errorMessage: errorPassword } = useField<string>('password')
const { value: confirmPassword, errorMessage: errorConfirmPassword } =
  useField<string>('confirmPassword')
const { value: rol, errorMessage: errorRol } = useField<number>('rol')
const { errorMessage: errorFoto } = useField('foto')

function manejarSubidaFoto(evento: Event) {
  const target = evento.target as HTMLInputElement
  const file = target.files?.[0] ?? null

  if (!file) {
    archivoFoto.value = null
    previewUrl.value = null
    return
  }

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const tamañoMax = 2 * 1024 * 1024

  if (!tiposPermitidos.includes(file.type)) {
    notificacion.error(
      'Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG, GIF o WEBP.',
    )
    target.value = ''
    archivoFoto.value = null
    previewUrl.value = null
    return
  }

  if (file.size > tamañoMax) {
    notificacion.error('La foto no puede superar 2MB.')
    archivoFoto.value = null
    target.value = ''
    previewUrl.value = null
    return
  }
  archivoFoto.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const onSubmit = handleSubmit((valores) => {
  cargando.value = true
  try {
    const formData = new FormData()

    formData.append('nombre', valores.nombre)
    formData.append('email', valores.email)
    formData.append('rol', String(valores.rol))

    if (props.id) {
      formData.append('password', valores.password ?? '')
      formData.append('confirm_password', valores.confirmPassword ?? '')
      formData.append('foto_actual', fotoActual.value)
    } else {
      formData.append('pass1', valores.password ?? '')
      formData.append('pass2', valores.confirmPassword ?? '')
    }

    if (archivoFoto.value) {
      formData.append('foto', archivoFoto.value)
    }

    emit('submit', formData)
  } catch (error) {
    notificacion.error('Error al preparar el formulario')
  } finally {
    cargando.value = false
  }
})

function cancelar() {
  router.push('/admin/usuarios')
}

onMounted(async () => {
  // cargar datos del usuario si es edición
  if (props.id) {
    try {
      await userStore.obtenerUsuario(Number(props.id))
      const usuario = userStore.usuarioDetalle
      if (usuario) {
        fotoActual.value = usuario.foto || ''

        setValues({
          nombre: usuario.nombre,
          email: usuario.email,
          password: '',
          confirmPassword: '',
          rol: usuario.rol,
        })
      }
    } catch (error) {
      notificacion.error('Error al cargar los datos del usuario')
    }
  }
})
</script>
