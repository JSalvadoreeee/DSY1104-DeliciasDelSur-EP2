// Servicio de boletas: el cliente compra, el administrador y el vendedor consultan
import api from './api'

export const boletasServicio = {
  crear: (items) => api.post('/boletas', { items }).then((r) => r.data),
  misBoletas: () => api.get('/boletas/mis-boletas').then((r) => r.data),
  listar: () => api.get('/boletas').then((r) => r.data),
  obtener: (id) => api.get(`/boletas/${id}`).then((r) => r.data),
}