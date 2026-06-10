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
  nombreUsuario: string
  fecha: number
  total: number
  direccion: string
  metodoPago: string
  estado: string
  descripcion: string | null
  detalles: Array<{
    tituloLibro: string
    autorLibro: string
    imagen: string
    cantidad: number
    precioVenta: number
  }>
}
