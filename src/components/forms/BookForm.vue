<template>
  <section id="vista-formulario">
    <h2 class="titulo-seccion-form">{{ esEdicion ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO' }}</h2>
    <section class="form-container">
      <form id="formulario" enctype="multipart/form-data" @submit.prevent="onSubmit">
        <input type="hidden" id="id_libro" name="id_libro" v-model="idLibro" />
        <input type="hidden" id="imagen_actual" name="imagen_actual" v-model="imagenActual" />
        <input type="hidden" id="accion-form" name="accion" value="editar" />

        <div class="form-content">
          <label for="titulo">Título del Libro:</label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            v-model="titulo"
            :class="{ 'input-error': errorTitulo }"
          />
          <span id="error-titulo" class="mensaje-error-campo">{{ errorTitulo }}</span>

          <label for="autor">Autor:</label>
          <input
            type="text"
            id="autor"
            name="autor"
            v-model="autor"
            :class="{ 'input-error': errorAutor }"
          />
          <span id="error-autor" class="mensaje-error-campo">{{ errorAutor }}</span>

          <label for="descripcion">Descripción completa:</label>
          <textarea
            id="descripcion"
            name="descripcion"
            v-model="descripcion"
            :class="{ 'input-error': errorDescripcion }"
          ></textarea>
          <span id="error-descripcion" class="mensaje-error-campo">{{ errorDescripcion }}</span>

          <label for="imagen">Portada del Libro:</label>
          <input
            type="file"
            id="imagen"
            name="imagen"
            accept="image/*"
            class="input-file-bonito"
            @change="handleFile"
          />
          <p class="ayuda-file" id="texto-ayuda-img">
            {{
              imagenActual
                ? 'Imagen actual: ' + imagenActual
                : 'Permitido jpg, gif y png. Menores de 5 Mb'
            }}
          </p>
          <span id="error-imagen" class="mensaje-error-campo">{{ errorImagen }}</span
          ><br />

          <!-- Vista previa -->
          <div v-if="previewUrl" style="margin-bottom: 10px">
            <img
              :src="previewUrl"
              alt="Vista previa"
              style="max-height: 150px; border-radius: 4px"
            />
          </div>

          <div class="form-row-especial">
            <div class="form-col-especial">
              <label for="precio">Precio (€):</label>
              <input
                type="number"
                id="precio"
                name="precio"
                step="0.01"
                v-model.number="precio"
                :class="{ 'input-error': errorPrecio }"
              />
              <span id="error-precio" class="mensaje-error-campo">{{ errorPrecio }}</span>
            </div>
            <div class="form-col-especial">
              <label for="stock">Stock:</label>
              <input
                type="number"
                id="stock"
                name="stock"
                v-model.number="stock"
                :class="{ 'input-error': errorStock }"
              />
              <span id="error-stock" class="mensaje-error-campo">{{ errorStock }}</span>
            </div>
            <div class="form-col-especial">
              <label for="id_categoria">Categoría:</label>
              <select
                id="id_categoria"
                name="id_categoria"
                v-model="idCategoria"
                :class="{ 'input-error': errorCategoria }"
              >
                <option value="">Selecciona...</option>
                <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                  {{ cat.nombre }}
                </option>
              </select>
              <span id="error-id_categoria" class="mensaje-error-campo">{{ errorCategoria }}</span>
            </div>
          </div>
        </div>

        <div class="form-buttons">
          <button type="submit" class="btn-enviar" :disabled="cargando">
            {{ cargando ? 'Guardando...' : esEdicion ? 'Guardar Cambios' : 'Crear Libro' }}
          </button>
          <button type="button" class="btn-cancelar btn-cancelar-accion" @click="cancelar">
            Cancelar
          </button>
        </div>
      </form>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useLibroStore } from '@/stores/book'
import { useCategoriaStore } from '@/stores/categories'
import { useNotificacion } from '@/composables/useNotificacion'

const props = defineProps<{
  id?: string
}>()

const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
}>()

const router = useRouter()
const libroStore = useLibroStore()
const categoriaStore = useCategoriaStore()
const notificacion = useNotificacion()
const esEdicion = computed(() => !!props.id)

const cargando = ref(false)
const archivoImagen = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const imagenActual = ref('')
const idLibro = ref('')

// Cargar categorías
const categorias = ref<any[]>([])

const regexTextoValido = /^[a-zA-ZÀ-ÿ\s\-.,]+$/

const { handleSubmit, setValues } = useForm({
  validationSchema: yup.object({
    titulo: yup
      .string()
      .required('El título es obligatorio')
      .min(3, 'Mínimo 3 caracteres')
      .max(200, 'Máximo 200 caracteres')
      .matches(regexTextoValido, 'Caracteres no válidos'),
    autor: yup
      .string()
      .required('El autor es obligatorio')
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres')
      .matches(regexTextoValido, 'Caracteres no válidos'),
    descripcion: yup
      .string()
      .required('La descripción es obligatoria')
      .min(10, 'Mínimo 10 caracteres')
      .max(2000, 'Máximo 2000 caracteres'),
    precio: yup
      .number()
      .required('El precio es obligatorio')
      .min(0.01, 'El precio debe ser mayor que 0')
      .typeError('Debe ser un número'),
    stock: yup
      .number()
      .required('El stock es obligatorio')
      .min(0, 'El stock no puede ser negativo')
      .integer('Debe ser un número entero')
      .typeError('Debe ser un número'),
    idCategoria: yup
      .number()
      .required('La categoría es obligatoria')
      .min(1, 'Selecciona una categoría'),
    imagen: yup.mixed().nullable(),
  }),
})

const { value: titulo, errorMessage: errorTitulo } = useField<string>('titulo')
const { value: autor, errorMessage: errorAutor } = useField<string>('autor')
const { value: descripcion, errorMessage: errorDescripcion } = useField<string>('descripcion')
const { value: precio, errorMessage: errorPrecio } = useField<number>('precio')
const { value: stock, errorMessage: errorStock } = useField<number>('stock')
const { value: idCategoria, errorMessage: errorCategoria } = useField<number>('idCategoria')
const { errorMessage: errorImagen } = useField('imagen')

function handleFile(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0] ?? null

  if (!file) {
    archivoImagen.value = null
    previewUrl.value = null
    return
  }

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const tamañoMax = 5 * 1024 * 1024 // 5MB

  if (!tiposPermitidos.includes(file.type)) {
    notificacion.error('Solo se permiten jpg, png, gif y webp.')
    target.value = ''
    archivoImagen.value = null
    previewUrl.value = null
    return
  }

  if (file.size > tamañoMax) {
    notificacion.error('La imagen no puede superar 5MB.')
    target.value = ''
    archivoImagen.value = null
    previewUrl.value = null
    return
  }

  archivoImagen.value = file
  previewUrl.value = URL.createObjectURL(file)
}

const onSubmit = handleSubmit(async () => {
  cargando.value = true

  try {
    const formData = new FormData()
    formData.append('id_libro', idLibro.value)
    formData.append('titulo', titulo.value)
    formData.append('autor', autor.value)
    formData.append('descripcion', descripcion.value)
    formData.append('precio', String(precio.value))
    formData.append('stock', String(stock.value))
    formData.append('id_categoria', String(idCategoria.value))
    formData.append('imagen_actual', imagenActual.value)

    if (archivoImagen.value) {
      formData.append('imagen', archivoImagen.value)
    }

    emit('submit', formData)
  } catch (error) {
    notificacion.error('Error al preparar el formulario')
  } finally {
    cargando.value = false
  }
})

function cancelar() {
  router.push({ name: 'admin-libros' })
}

onMounted(async () => {
  // Cargar categorías
  try {
    await categoriaStore.listarCategorias()
    categorias.value = categoriaStore.categorias
  } catch (error) {
    notificacion.error('Error al cargar categorías')
  }

  // Cargar datos del libro si es edición
  if (props.id) {
    try {
      await libroStore.obtenerLibroPorId(Number(props.id))
      const libro = libroStore.libroDetalle
      if (libro) {
        idLibro.value = String(libro.id)
        imagenActual.value = libro.imagen || ''

        setValues({
          titulo: libro.titulo,
          autor: libro.autor,
          descripcion: libro.descripcion,
          precio: libro.precio,
          stock: libro.stock,
          idCategoria: libro.idCategoria,
        })
      }
    } catch (error) {
      notificacion.error('Error al cargar los datos del libro')
    }
  }
})
</script>
