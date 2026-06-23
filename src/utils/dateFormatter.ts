// src/utils/dateFormatter.ts
export function formatDate(dateString: string | Date): string {
  if (!dateString) return 'N/A'

  const date = new Date(dateString)

  // Verificamos si es una fecha válida
  if (isNaN(date.getTime())) return 'Fecha inválida'

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}
