import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const BASE_URL = 'http://localhost:8080/book-shop/api'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const token = ref<string | null>(sessionStorage.getItem('token'))
  const rol = ref<number | null>(Number(sessionStorage.getItem('rol')) || null)
  const nombre = ref<string | null>(sessionStorage.getItem('nombre'))
  const userId = ref<number | null>(Number(sessionStorage.getItem('userId')) || null)

  const estaLogueado = computed(() => !!token.value)
  const esAdmin = computed(() => rol.value === 1 || rol.value === 2)
  const esSuperAdmin = computed(() => rol.value === 1)
  const esCliente = computed(() => rol.value === 3)

  function limpiarSesionLocal() {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('rol')
    sessionStorage.removeItem('nombre')
    sessionStorage.removeItem('userId')
    token.value = null
    rol.value = null
    nombre.value = null
    userId.value = null
    router.push('/login')
  }

  async function apiFetch(url: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    }

    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    if (token.value) {
      headers['Authorization'] = `Bearer ${token.value}`
    }

    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      limpiarSesionLocal()
      throw new Error('Sesión expirada')
    }

    if (!response.ok) {
      const texto = await response.text()
      let error
      try {
        error = JSON.parse(texto)
      } catch {
        throw new Error(`Error HTTP ${response.status}: ${texto}`)
      }
      throw new Error(error.mensaje || 'Error del servidor')
    }

    return response.json()
  }

  async function login(usuario: string, password: string) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.mensaje || 'Credenciales incorrectas')
    }

    const data = await response.json()
    token.value = data.token
    rol.value = data.rol
    nombre.value = data.nombre
    userId.value = data.id
    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('rol', String(data.rol))
    sessionStorage.setItem('nombre', data.nombre)
    sessionStorage.setItem('userId', String(data.id))
    // cargar el carrito del nuevo usuario
    const { useCartStore } = await import('./cart')
    const cartStore = useCartStore()
    cartStore.cargarDesdeStorage()
    // resetear la tienda para evitar mostrar datos del usuario anterior
    const { useShopStore } = await import('./shop')
    const shopStore = useShopStore()
    shopStore.reset()
  }

  function logout() {
    limpiarSesionLocal()
  }

  async function registro(formData: FormData) {
    const response = await fetch(`${BASE_URL}/auth/registro`, {
      method: 'POST',
      body: formData,
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.mensaje || 'Error al registrarse')
    }
    return response.json()
  }

  async function solicitarRecuperacion(email: string) {
    return apiFetch('/auth/recuperar', {
      method: 'POST',
      body: JSON.stringify({ email }),
    })
  }

  async function confirmarRecuperacion(token: string, pass1: string, pass2: string) {
    return apiFetch('/auth/recuperar/confirmar', {
      method: 'POST',
      body: JSON.stringify({ token, pass1, pass2 }),
    })
  }

  return {
    token,
    rol,
    nombre,
    userId,
    estaLogueado,
    esAdmin,
    esSuperAdmin,
    esCliente,
    login,
    logout,
    registro,
    solicitarRecuperacion,
    confirmarRecuperacion,
    apiFetch,
    limpiarSesionLocal,
  }
})
