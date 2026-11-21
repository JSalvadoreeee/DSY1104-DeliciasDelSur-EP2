// Servicio de productos: traduce la respuesta del backend a la forma que usan las pantallas
import api from './api'

function adaptar(p) {
  const oferta = p.oferta ?? 0
  const precioFinal = Math.floor((p.precio * (100 - oferta)) / 100)
  return {
    id: p.id,
    codigo: `PR${String(p.id).padStart(3, '0')}`,
    nombre: p.nombre,
    descripcion: p.descripcion ?? '',
    precio: p.precio,
    stock: p.stock,
    oferta,
    precioOferta: oferta > 0 ? precioFinal : null,
    precioFinal,
    imagen: p.imagenUrl,
    categoria: p.categoria?.nombre ?? '',
    categoriaId: p.categoria?.id,
  }
}

export const productosServicio = {
  listar: (params) => api.get('/productos', { params }).then((r) => r.data.map(adaptar)),
  obtener: (id) => api.get(`/productos/${id}`).then((r) => adaptar(r.data)),
  crear: (datos) => api.post('/productos', datos).then((r) => adaptar(r.data)),
  actualizar: (id, datos) => api.put(`/productos/${id}`, datos).then((r) => adaptar(r.data)),
  eliminar: (id) => api.delete(`/productos/${id}`),
}