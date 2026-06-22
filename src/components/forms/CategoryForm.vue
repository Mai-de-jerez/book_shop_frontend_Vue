<template>
  <section class="form-container">
    <h2 class="titulo-seccion-form">
      {{ titulo ?? (esEdicion ? 'EDITAR CATEGORÍA' : 'NUEVA CATEGORÍA') }}
    </h2>
    <form @submit.prevent="onSubmit" autocomplete="off" novalidate>
      <div class="form-content">
        <label for="nombre">Nombre de la Categoría:</label>
        <input
          type="text"
          id="nombre"
          v-model="nombre"
          placeholder="Ej: Fantasía, Ciencia Ficción, etc."
          :class="{ 'input-error': errorNombre }"
        />
        <span class="mensaje-error-campo">{{ errorNombre }}</span>
        <p class="ayuda-file">Asegúrate de que no exista ya una con el mismo nombre.</p>
      </div>

      <div class="form-buttons">
        <button type="submit" class="btn-enviar" :disabled="cargando">
          {{ cargando ? 'Guardando...' : esEdicion ? 'Guardar Cambios' : 'Guardar' }}
        </button>
        <button type="button" class="btn-cancelar btn-cancelar-accion" @click="cancelar">
          Cancelar
        </button>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useCategoriaStore } from '@/stores/categories'
import { useNotificacion } from '@/composables/useNotificacion'

const props = defineProps<{
  id?: string
  titulo?: string
}>()

const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
}>()

const router = useRouter()
const categoriaStore = useCategoriaStore()
const notificacion = useNotificacion()
const esEdicion = computed(() => !!props.id)

const cargando = ref(false)

// Expresión regular para validar caracteres permitidos
const regexTextoValido = /^[a-zA-ZÀ-ÿ\s\-.,]+$/

const { handleSubmit, setValues } = useForm({
  validationSchema: yup.object({
    nombre: yup
      .string()
      .required('El nombre es obligatorio')
      .min(2, 'Mínimo 2 caracteres')
      .max(100, 'Máximo 100 caracteres')
      .matches(regexTextoValido, 'Caracteres no válidos'),
  }),
})

const { value: nombre, errorMessage: errorNombre } = useField<string>('nombre')

const onSubmit = handleSubmit(() => {
  cargando.value = true
  try {
    const formData = new FormData()
    if (props.id) {
      formData.append('id', props.id)
    }
    formData.append('nombre', nombre.value)
    emit('submit', formData)
  } catch (error) {
    notificacion.error('Error al preparar el formulario')
  } finally {
    cargando.value = false
  }
})

function cancelar() {
  router.push({ name: 'admin-categorias' })
}

onMounted(() => {
  if (props.id) {
    const categoria = categoriaStore.categorias.find((c) => c.id === Number(props.id))
    if (categoria) {
      setValues({ nombre: categoria.nombre })
    } else {
      categoriaStore
        .obtenerCategoria(Number(props.id))
        .then((cat) => {
          if (cat) {
            setValues({ nombre: cat.nombre })
          }
        })
        .catch(() => {
          notificacion.error('Error al cargar los datos de la categoría')
        })
    }
  }
})
</script>
