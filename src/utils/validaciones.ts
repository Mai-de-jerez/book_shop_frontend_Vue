// src/utils/validaciones.ts

// Patrones regex
const esEmailValido = (email: string) => /^[\w.-]+@[\w.-]+\.[a-z]{2,8}$/.test(email.trim())
const esTextoValido = (texto: string) =>
  /^[a-zA-ZÀ-ÿ0-9@\s\-\.\,\:\;\!\?\(\)\'\"]{3,100}$/.test(texto.trim())
const esPasswordSegura = (pass: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(pass)

// Validar archivo de foto
export const validarArchivoFoto = (file: File | null): { valido: boolean; msg: string } => {
  if (!file) return { valido: true, msg: '' }

  const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  const tamañoMax = 2 * 1024 * 1024 // 2MB

  if (!tiposPermitidos.includes(file.type)) {
    return { valido: false, msg: 'Solo se permiten jpg, png, gif y webp.' }
  }
  if (file.size > tamañoMax) {
    return { valido: false, msg: 'La foto no puede superar 2MB.' }
  }
  return { valido: true, msg: '' }
}

// Funciones base
export const validarNombre = (nombre: string): string | null => {
  if (nombre.length < 3 || nombre.length > 100) {
    return 'El nombre debe tener entre 3 y 100 caracteres.'
  }
  if (!esTextoValido(nombre)) {
    return 'Has introducido caracteres especiales no aceptados.'
  }
  return null
}

export const validarEmail = (email: string): string | null => {
  if (!esEmailValido(email)) return 'Formato de email no válido.'
  return null
}

export const validarPassword = (password: string): string | null => {
  if (!esPasswordSegura(password)) {
    return 'Mínimo 6 caracteres, una mayúscula y un número.'
  }
  return null
}

export const validarConfirmPassword = (password: string, confirm: string): string | null => {
  if (password !== confirm || confirm === '') {
    return 'Las contraseñas no coinciden.'
  }
  return null
}

// --- VALIDACIONES FORMULARIOS COMPLETOS ---

export interface ValidacionLibros {
  titulo: string
  autor: string
  descripcion: string
  precio: number
  stock: number
  idCategoria: number | string
  imagen?: File | null
  accion: 'alta' | 'editar'
}

export const validarFormularioLibros = (datos: ValidacionLibros): Record<string, string> => {
  const errores: Record<string, string> = {}

  // Título
  const errorTitulo = validarNombre(datos.titulo)
  if (errorTitulo) errores.titulo = errorTitulo

  // Autor
  const errorAutor = validarNombre(datos.autor)
  if (errorAutor) errores.autor = errorAutor

  // Imagen (solo obligatoria en alta)
  if (datos.accion === 'alta' && !datos.imagen) {
    errores.imagen = 'La portada es obligatoria para nuevos libros.'
  } else if (datos.imagen) {
    const checkImg = validarArchivoFoto(datos.imagen)
    if (!checkImg.valido) errores.imagen = checkImg.msg
  }

  // Descripción
  if (
    datos.descripcion.trim().length === 0 ||
    datos.descripcion.length > 2000 ||
    datos.descripcion.length < 20
  ) {
    errores.descripcion = 'La descripción es obligatoria (20-2000 caracteres).'
  }

  // Precio
  if (datos.precio <= 0 || datos.precio > 500) {
    errores.precio = 'Precio entre 0.01 y 500€.'
  }

  // Stock
  if (datos.stock < 0 || datos.stock > 999) {
    errores.stock = 'Stock entre 0 y 999.'
  }

  // Categoría
  if (!datos.idCategoria || datos.idCategoria === '') {
    errores.idCategoria = 'Selecciona una categoría.'
  }

  return errores
}

// Validación categoría
export const validarFormularioCategoria = (nombre: string): Record<string, string> => {
  const errores: Record<string, string> = {}
  const errorNombre = validarNombre(nombre)
  if (errorNombre) errores.nombre = errorNombre
  return errores
}

// Validación usuarios (admin)
export interface ValidacionUsuario {
  nombre: string
  email: string
  password: string
  confirmPassword: string
  rol: number
  foto?: File | null
  accion: 'alta' | 'editar'
}

export const validarFormularioUsuarios = (datos: ValidacionUsuario): Record<string, string> => {
  const errores: Record<string, string> = {}

  const errorNombre = validarNombre(datos.nombre)
  if (errorNombre) errores.nombre = errorNombre

  const errorEmail = validarEmail(datos.email)
  if (errorEmail) errores.email = errorEmail

  if (datos.foto) {
    const checkFoto = validarArchivoFoto(datos.foto)
    if (!checkFoto.valido) errores.foto = checkFoto.msg
  }

  if (datos.accion === 'alta' || datos.password.length > 0) {
    const errorPass = validarPassword(datos.password)
    if (errorPass) errores.password = errorPass

    const errorConfirm = validarConfirmPassword(datos.password, datos.confirmPassword)
    if (errorConfirm) errores.confirmPassword = errorConfirm
  }

  if (!datos.rol || datos.rol < 1 || datos.rol > 3) {
    errores.rol = 'Selecciona un rol válido.'
  }

  return errores
}

// Validación perfil (usuario normal)
export const validarFormularioPerfil = (
  datos: Omit<ValidacionUsuario, 'rol' | 'accion'>,
): Record<string, string> => {
  const errores: Record<string, string> = {}

  const errorNombre = validarNombre(datos.nombre)
  if (errorNombre) errores.nombre = errorNombre

  const errorEmail = validarEmail(datos.email)
  if (errorEmail) errores.email = errorEmail

  if (datos.foto) {
    const checkFoto = validarArchivoFoto(datos.foto)
    if (!checkFoto.valido) errores.foto = checkFoto.msg
  }

  if (datos.password.length > 0) {
    const errorPass = validarPassword(datos.password)
    if (errorPass) errores.password = errorPass

    const errorConfirm = validarConfirmPassword(datos.password, datos.confirmPassword)
    if (errorConfirm) errores.confirmPassword = errorConfirm
  }

  return errores
}

// Validación login
export const validarFormularioLogin = (
  usuario: string,
  password: string,
): Record<string, string> => {
  const errores: Record<string, string> = {}

  const errorUsuario = validarNombre(usuario)
  if (errorUsuario) errores.usuario = errorUsuario

  const errorPass = validarPassword(password)
  if (errorPass) errores.password = errorPass

  return errores
}

// Validación registro público
export const validarFormularioRegistro = (
  datos: Omit<ValidacionUsuario, 'rol' | 'accion'>,
): Record<string, string> => {
  const errores: Record<string, string> = {}

  const errorNombre = validarNombre(datos.nombre)
  if (errorNombre) errores.nombre = errorNombre

  const errorEmail = validarEmail(datos.email)
  if (errorEmail) errores.email = errorEmail

  const errorPass = validarPassword(datos.password)
  if (errorPass) errores.password = errorPass

  const errorConfirm = validarConfirmPassword(datos.password, datos.confirmPassword)
  if (errorConfirm) errores.confirmPassword = errorConfirm

  if (datos.foto) {
    const checkFoto = validarArchivoFoto(datos.foto)
    if (!checkFoto.valido) errores.foto = checkFoto.msg
  }

  return errores
}
