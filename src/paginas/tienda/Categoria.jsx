// Productos de una categoría según el nombre de la URL
import { Link, useParams } from 'react-router-dom'
import { useCatalogo } from '../../utilidades/useCatalogo'

function Categoria() {
  const { nombre } = useParams()
  const { productos: todos, cargando, error } = useCatalogo()
  const productos = todos.filter((p) => p.categoria === nombre)

  return (
    <div>
      <Link to="/categorias" className="small">← Volver a las categorías</Link>
      <h1 className="text-success my-3">{nombre}</h1>

      {cargando && <p>Cargando productos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!cargando && !error && productos.length === 0 && <p>No hay productos en esta categoría.</p>}

      <div className="row g-3">
        {productos.map((p) => (
          <div className="col-6 col-md-4 col-lg-3" key={p.id}>
            <div className="card h-100">
              <img src={p.imagen} className="card-img-top" alt={p.nombre} style={{ height: '160px', objectFit: 'cover' }} />
              <div className="card-body">
                <h6 className="card-title">{p.nombre}</h6>
                <p className="fw-bold mb-2">${p.precioFinal.toLocaleString('es-CL')}</p>
                <Link className="btn btn-outline-success btn-sm" to={`/producto/${p.id}`}>
                  Ver detalle
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Categoria