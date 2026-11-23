// Cliente axios único: apunta al gateway, agrega el token JWT y cierra sesión si el servidor responde 401
import axios from 'axios'

export const CLAVE_TOKEN = 'dds_token'
export const CLAVE_SESION = 'dds_sesion'
export const EVENTO_SESION_EXPIRADA = 'dds:sesion-expirada'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/delicias/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const esAuth = url.includes('/auth/login') || url.includes('/auth/registro')
    if (error.response?.status === 401 && !esAuth) {
      localStorage.removeItem(CLAVE_TOKEN)
      localStorage.removeItem(CLAVE_SESION)
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
    }
    return Promise.reject(error)
  }
)

export function mensajeError(error, porDefecto = 'No se pudo completar la operación') {
  return error.response?.data?.mensaje || porDefecto
}

export default api