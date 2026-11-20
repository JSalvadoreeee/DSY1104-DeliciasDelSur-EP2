// Servicio de productos: catálogo público y mantenedor del administrador
import api from './api'

export const productosServicio = {
  listar: (params) => api.get('/productos', { params }).then((r) => r.data),
  obtener: (id) => api.get(`/productos/${id}`).then((r) => r.data),
  crear: (datos) => api.post('/productos', datos).then((r) => r.data),
  actualizar: (id, datos) => api.put(`/productos/${id}`, datos).then((r) => r.data),
  eliminar: (id) => api.delete(`/productos/${id}`),
}