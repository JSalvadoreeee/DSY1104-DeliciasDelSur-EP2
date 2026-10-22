// Productos en oferta con precio original tachado y porcentaje de descuento
import { Link } from 'react-router-dom'
import { obtenerOfertas } from '../../datos/productosdb'

function Ofertas() {
  const ofertas = obtenerOfertas()

  return (
    <div>
      <h1 className="text-success mb-4">Ofertas</h1>

      {ofertas.length === 0 && <p>No hay ofertas disponibles por ahora.</p>}

      <div className="row g-3">
        {ofertas.map((p) => {
          const descuento = Math.round((1 - p.precioOferta / p.precio) * 100)
          return (
            <div className="col-6 col-md-4 col-lg-3" key={p.id}>
              <div className="card h-100">
                <span className="badge bg-danger position-absolute m-2">-{descuento}%</span>
                <img src={p.imagen} className="card-img-top" alt={p.nombre} style={{ height: '160px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h6 className="card-title">{p.nombre}</h6>
                  <p className="mb-2">
                    <span className="text-muted text-decoration-line-through me-2">
                      ${p.precio.toLocaleString('es-CL')}
                    </span>
                    <span className="fw-bold text-danger">
                      ${p.precioOferta.toLocaleString('es-CL')}
                    </span>
                  </p>
                  <Link className="btn btn-outline-success btn-sm" to={`/producto/${p.id}`}>
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Ofertas