// Servicio de usuarios: solo lo usa el administrador
import api from './api'

export const usuariosServicio = {
  listar: () => api.get('/usuarios').then((r) => r.data),
  obtener: (id) => api.get(`/usuarios/${id}`).then((r) => r.data),
  crear: (datos) => api.post('/usuarios', datos).then((r) => r.data),
  actualizar: (id, datos) => api.put(`/usuarios/${id}`, datos).then((r) => r.data),
  eliminar: (id) => api.delete(`/usuarios/${id}`),
}