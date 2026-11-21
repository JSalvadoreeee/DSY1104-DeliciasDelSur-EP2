// Detalle de un producto en solo lectura para administrador y vendedor
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productosServicio } from '../../servicios/productosServicio'
import { mensajeError } from '../../servicios/api'
import { useSesion } from '../../contexto/SesionContexto'

function AdminProductoDetalle() {
  const { id } = useParams()
  const { usuario } = useSesion()
  const [producto, setProducto] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    productosServicio
      .obtener(id)
      .then(setProducto)
      .catch((e) => setError(e.response ? mensajeError(e, 'No se pudo cargar el producto') : 'No se pudo conectar con el servidor'))
  }, [id])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!producto) return <p>Cargando producto...</p>

  return (
    <div style={{ maxWidth: '800px' }}>
      <Link to="/admin/productos" className="btn btn-outline-secondary btn-sm mb-3">Volver a productos</Link>

      <div className="card">
        <div className="row g-0">
          <div className="col-md-5">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded-start w-100"
              style={{ maxHeight: '320px', objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body">
              <h3 className="card-title">{producto.nombre}</h3>
              <p className="text-muted mb-2">{producto.codigo} - {producto.categoria}</p>
              <p>{producto.descripcion}</p>
              <ul className="list-unstyled mb-3">
                <li><strong>Precio:</strong> ${producto.precio.toLocaleString('es-CL')}</li>
                <li>
                  <strong>Oferta:</strong>{' '}
                  {producto.precioOferta
                    ? `${producto.oferta}% de descuento ($${producto.precioOferta.toLocaleString('es-CL')})`
                    : 'Sin oferta'}
                </li>
                <li><strong>Stock:</strong> {producto.stock} unidades</li>
              </ul>
              {usuario?.rol === 'ADMINISTRADOR' && (
                <Link className="btn btn-outline-primary" to={`/admin/productos/editar/${producto.id}`}>
                  Editar
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProductoDetalle