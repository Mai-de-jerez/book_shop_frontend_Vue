//book_models.ts
// interfaces para la solicitud y respuesta de la API de libros
export interface LibroResponse {
  id: number
  titulo: string
  autor: string
  descripcion: string
  precio: number
  stock: number
  imagen: string | null
  idCategoria: number
  nombreCategoria: string
}
export interface PaginaLibros {
  contenido: LibroResponse[]
  pagina: number
  porPagina: number
  total: number
}
