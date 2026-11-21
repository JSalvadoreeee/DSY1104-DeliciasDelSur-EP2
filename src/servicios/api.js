// Cliente axios único: apunta al gateway y agrega el token JWT a cada petición
import axios from 'axios'

export const CLAVE_TOKEN = 'dds_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/delicias/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(CLAVE_TOKEN)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export function mensajeError(error, porDefecto = 'No se pudo completar la operación') {
  return error.response?.data?.mensaje || porDefecto
}

export default api