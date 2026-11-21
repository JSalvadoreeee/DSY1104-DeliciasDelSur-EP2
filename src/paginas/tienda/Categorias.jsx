// Lista de categorías con enlace a los productos de cada una
import { Link } from 'react-router-dom'
import { useCatalogo } from '../../utilidades/useCatalogo'

function Categorias() {
  const { productos, categorias, cargando, error } = useCatalogo()

  return (
    <div>
      <h1 className="text-success mb-4">Categorías</h1>
      {cargando && <p>Cargando categorías...</p>}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        {categorias.map((cat) => {
          const cantidad = productos.filter((p) => p.categoria === cat.nombre).length
          return (
            <div className="col-md-4" key={cat.id}>
              <div className="card h-100 text-center">
                <div className="card-body">
                  <h5 className="card-title">{cat.nombre}</h5>
                  <p className="text-muted">{cantidad} producto(s)</p>
                  <Link className="btn btn-outline-success btn-sm" to={`/categoria/${cat.nombre}`}>
                    Ver productos
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

export default Categorias