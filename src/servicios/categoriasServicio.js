// Servicio de categorías: lectura pública y mantenedor del administrador
import api from './api'

export const categoriasServicio = {
  listar: () => api.get('/categorias').then((r) => r.data),
  obtener: (id) => api.get(`/categorias/${id}`).then((r) => r.data),
  crear: (datos) => api.post('/categorias', datos).then((r) => r.data),
  actualizar: (id, datos) => api.put(`/categorias/${id}`, datos).then((r) => r.data),
  eliminar: (id) => api.delete(`/categorias/${id}`),
}