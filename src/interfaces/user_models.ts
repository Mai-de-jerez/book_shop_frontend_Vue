export interface Usuario {
  id: number
  nombre: string
  email: string
  rol: number
  foto?: string
}

export interface UsuarioPaginado {
  pagina: number
  total: number
  porPagina: number
  usuarios: Usuario[]
}
