export interface PedidoResumen {
  id: number
  nombreUsuario: string
  fecha: string
  total: number
  estado: string
  metodoPago: string
}

export interface PedidoDetalle {
  id: number
  nombreUsuario: string
  fecha: string
  total: number
  estado: string
  metodoPago: string
  direccion: string
  descripcion: string
  detalles: DetalleItem[]
}

export interface DetalleItem {
  tituloLibro: string
  autorLibro: string
  imagen: string
  cantidad: number
  precioVenta: number
}

export interface PedidoPaginado {
  contenido: PedidoResumen[]
  total: number
  pagina: number
  porPagina: number
}

export interface PedidoPost {
  direccion: string
  estado: string
  descripcion: string
}
