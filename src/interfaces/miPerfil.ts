export interface Usuario {
  id: number
  nombre: string
  email: string | null
  password: string | null
  rol: number
  foto: string | null
}

export interface Pedido {
  id: number
  usuario: Usuario
  fecha: number
  total: number
  direccion: string
  metodoPago: string
  estado: string
  descripcion: string | null
  detalles: any[]
}

export interface PedidoDetalle {
  id: number
  fecha: number
  total: number
  direccion: string
  metodoPago: string
  estado: string
  descripcion: string | null
  lineas?: Array<{
    libroId: number
    titulo: string
    cantidad: number
    precioUnitario: number
  }>
}
