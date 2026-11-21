// Detalle de un producto cargado desde la API
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { productosServicio } from '../../servicios/productosServicio'
import { useCarrito } from '../../contexto/CarritoContexto'
import { useSesion } from '../../contexto/SesionContexto'

export default function DetalleProducto() {
  const { id } = useParams()
  const { agregarAlCarrito } = useCarrito()
  const { usuario } = useSesion()
  const puedeComprar = usuario?.rol !== 'VENDEDOR'
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setCargando(true)
    productosServicio
      .obtener(id)
      .then((p) => {
        setProducto(p)
        setError('')
      })
      .catch((e) => {
        setProducto(null)
        if (e.response?.status !== 404) {
          setError(e.response ? 'No se pudo cargar el producto' : 'No se pudo conectar con el servidor')
        }
      })
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) return <p className="text-center py-5">Cargando producto...</p>

  if (error) return <div className="alert alert-danger my-5">{error}</div>

  if (!producto) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger">Producto no encontrado</h3>
        <p className="text-muted">El producto solicitado no existe en nuestro catálogo.</p>
        <Link to="/productos" className="btn btn-danger mt-3">Volver al Catálogo</Link>
      </div>
    )
  }

  return (
    <div className="container my-5" style={{ maxWidth: '850px' }}>
      <div className="card border-0 shadow-sm p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded shadow-sm w-100"
              style={{ maxHeight: '380px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-6">
            <span className="badge bg-danger mb-2">{producto.categoria}</span>
            <h2 className="fw-bold text-dark">{producto.nombre}</h2>
            <p className="text-muted">Código de Producto: <strong>{producto.codigo}</strong></p>
            <hr />
            {producto.precioOferta ? (
              <p className="fs-3 mb-0">
                <span className="text-muted text-decoration-line-through me-2 fs-5">
                  ${producto.precio.toLocaleString('es-CL')}
                </span>
                <span className="fw-bold text-danger">
                  ${producto.precioOferta.toLocaleString('es-CL')} CLP
                </span>
              </p>
            ) : (
              <p className="fs-3 fw-bold text-danger mb-0">
                ${producto.precio.toLocaleString('es-CL')} CLP
              </p>
            )}

            <p className="mt-3 text-secondary">{producto.descripcion}</p>

            <ul className="list-unstyled my-3 text-secondary">
              <li><strong>Categoría:</strong> {producto.categoria}</li>
              <li><strong>Stock:</strong> {producto.stock} unidades</li>
              <li><strong>Estado:</strong> {producto.stock > 0 ? 'Disponible' : 'Sin stock'}</li>
            </ul>

            <div className="d-flex gap-2 mt-4">
              {puedeComprar && (
                <button
                  onClick={() => agregarAlCarrito(producto)}
                  className="btn btn-warning btn-lg fw-semibold flex-grow-1"
                  disabled={producto.stock === 0}
                >
                  {producto.stock === 0 ? 'Sin stock' : 'Añadir al Carrito'}
                </button>
              )}
              <Link to="/productos" className="btn btn-outline-secondary btn-lg">
                Volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}