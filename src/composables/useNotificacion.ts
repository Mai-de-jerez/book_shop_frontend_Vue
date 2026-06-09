import { useToast } from 'vue-toastification'

export function useNotificacion() {
  const toast = useToast()

  return {
    exito: (msg: string) => toast.success(msg),
    error: (msg: string) => toast.error(msg),
    info: (msg: string) => toast.info(msg),
  }
}
