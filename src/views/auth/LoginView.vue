<template>
  <main id="contenedor-principal">
    <h2 class="titulo-seccion-form">INICIAR SESIÓN</h2>

    <!-- Mensajes de error/éxito -->
    <div id="mensaje-container"></div>

    <section class="form-login">
      <form @submit.prevent="handleSubmit">
        <div class="form-content">
          <label for="usuario">Usuario:</label>
          <input type="text" id="usuario" v-model="usuario" placeholder="Tu usuario" required />
          <span id="error-usuario" class="mensaje-error-campo">{{ errores.usuario }}</span>

          <label for="password">Contraseña:</label>
          <input type="password" id="password" v-model="password" placeholder="Tu clave" required />
          <span id="error-password" class="mensaje-error-campo">{{ errores.password }}</span>

          <div class="link-registro">
            <p>¿No tienes cuenta? <router-link to="/registro">Regístrate</router-link></p>
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
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const usuario = ref('')
const password = ref('')
const cargando = ref(false)
const errores = ref({ usuario: '', password: '' })

// Función para mostrar mensajes (simula mostrarMensaje del HTML)
function mostrarMensaje(texto: string, tipo: 'error' | 'success') {
  const container = document.getElementById('mensaje-container')
  if (!container) return

  const div = document.createElement('div')
  div.className = `mensaje-alerta mensaje-${tipo}`
  div.textContent = texto
  container.appendChild(div)

  setTimeout(() => div.remove(), 4000)
}

// Validación del formulario (simula validarFormularioLogin)
function validarFormulario(): boolean {
  let valido = true
  errores.value = { usuario: '', password: '' }

  if (!usuario.value.trim()) {
    errores.value.usuario = 'El usuario es obligatorio'
    valido = false
  }
  if (!password.value.trim()) {
    errores.value.password = 'La contraseña es obligatoria'
    valido = false
  }
  return valido
}

// Manejar errores de URL (simula la lógica de errores/estados)
function manejarParametrosURL() {
  const params = new URLSearchParams(window.location.search)
  const errorParam = params.get('error')
  const statusParam =
    params.get('status') ||
    params.get('logout') ||
    (params.get('registro') === 'ok' ? 'registro' : null)

  const erroresMap: Record<string, string> = {
    '1': '❌ Usuario o contraseña incorrectos',
    '500': '⚠️ Error del servidor. Inténtalo de nuevo.',
    session: '🔒 Debes iniciar sesión para acceder',
  }

  const estadosMap: Record<string, string> = {
    email_sent: '📧 Te hemos enviado un correo para recuperar tu clave.',
    password_updated: '✅ ¡Contraseña actualizada! Ya puedes entrar.',
    ok: '✅ Sesión cerrada correctamente',
    registro: '🎉 ¡Registro completado! Ya puedes entrar.',
  }

  if (errorParam && erroresMap[errorParam]) {
    mostrarMensaje(erroresMap[errorParam], 'error')
  } else if (statusParam && estadosMap[statusParam]) {
    mostrarMensaje(estadosMap[statusParam], 'success')
  }

  // Limpiar URL
  window.history.replaceState({}, document.title, window.location.pathname)
}

async function handleSubmit() {
  if (!validarFormulario()) return

  cargando.value = true

  try {
    await authStore.login(usuario.value, password.value)

    if (authStore.esAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (error: any) {
    mostrarMensaje(error.message || 'Credenciales incorrectas', 'error')
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  manejarParametrosURL()
})
</script>

<style scoped>
/* Estilos específicos para el login */
main {
  background-color: #333;
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
  text-align: right;
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
