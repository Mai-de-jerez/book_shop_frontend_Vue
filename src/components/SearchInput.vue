<template>
  <section class="buscador-seccion">
    <input
      class="busqueda-input"
      type="text"
      :value="modelValue"
      :placeholder="placeholder"
      @input="onInput"
    />
    <button type="button" class="btn-limpiar" @click="onLimpiar">Limpiar</button>
  </section>
</template>

<script setup lang="ts">
let debounceTimer: ReturnType<typeof setTimeout>

const props = defineProps<{
  modelValue: string
  placeholder?: string
  debounce?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  buscar: [value: string]
  limpiar: []
}>()

function onInput(e: Event) {
  const valor = (e.target as HTMLInputElement).value
  emit('update:modelValue', valor)
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    emit('buscar', valor)
  }, props.debounce ?? 300)
}

function onLimpiar() {
  emit('update:modelValue', '')
  emit('limpiar')
}
</script>

<style scoped>
.busqueda-input {
  padding: 10px;
  width: 300px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.buscador-seccion {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
}
.btn-limpiar {
  display: block;
  background-color: #333;
  color: white;
  padding: 10px;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
}

.btn-limpiar:hover {
  background-color: #555;
}
@media (max-width: 480px) {
  /* Buscador: */
  .busqueda-input {
    width: 150px;
    min-width: 100px;
  }
}
</style>
