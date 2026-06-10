export interface Categoria {
  id: number
  nombre: string
}

export interface Libro {
  id: number
  titulo: string
  autor: string
  descripcion: string
  precio: number
  stock: number
  imagen: string
  categoria: Categoria
}

export interface DetallePedido {
  id: number
  pedido: any | null
  libro: Libro
  cantidad: number
  precioVenta: number
}

export interface CartResponse {
  total: number
  carrito: DetallePedido[]
}
