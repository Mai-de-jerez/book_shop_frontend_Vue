<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
/* --- ESTILOS GENERALES Y RESET --- */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Playfair Display', serif;
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin-bottom: 15px;
}

html,
body {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

main {
  min-height: calc(100vh - 80px - 100px);
  padding: 20px;
  margin: 0 auto;
}

.mensaje-alerta {
  width: 90%;
  max-width: 350px;
  margin: 0 auto 20px;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-family: sans-serif;
  font-size: 0.95rem;
}

.mensaje-error {
  background: #fed7d7;
  color: #c53030;
  border: 1px solid #fc8181;
}

.mensaje-success {
  background: #c6f6d5;
  color: #22543d;
  border: 1px solid #68d391;
}

.mensaje-error-campo {
  color: #d93025;
  font-size: 0.85em;
  font-weight: bold;
  display: block;
  min-height: 1.2em;
  margin-bottom: 10px;
}

.input-error {
  border: 2px solid #d93025 !important;
  background-color: #fff8f7 !important;
  outline: none;
}

.form-buttons {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 30px;
  width: 100%;
}

.btn-enviar {
  width: 100%;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 40px;
  font-size: 1.2rem;
  border-radius: 6px;
  font-weight: bold;
  background-color: #333;
  color: white;
  transition: background-color 0.2s;
}

.btn-enviar:hover:not(:disabled) {
  background-color: #3ca243;
}

.btn-enviar:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button {
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 40px;
  font-size: 1.2rem;
  border-radius: 6px;
  font-weight: bold;
  background-color: #333;
  color: white;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #3ca243;
}

.btn-cancelar {
  background-color: #ccc;
  color: #333;
}

.btn-cancelar:hover {
  background-color: #bbb;
}

.form-content {
  text-align: center;
}

.form-content label {
  display: block;
  color: #333;
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-content input {
  width: 100%;
  background-color: white;
  border: 1px solid #ccc;
  color: #333;
  padding: 12px;
  margin-bottom: 20px;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-content input:focus {
  outline: none;
  border-color: #57d35d;
  background-color: #fff;
  box-shadow: 0 0 4px #3ca243;
  transition: all 0.2s ease-in-out;
}

.titulo-seccion-form {
  text-align: center;
  margin-bottom: 20px;
  font-family: 'Playfair Display', serif;
  color: white;
}
</style>
