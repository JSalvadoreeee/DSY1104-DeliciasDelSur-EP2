// Lista de categorías con enlace a los productos de cada una
import { Link } from 'react-router-dom'
import { obtenerCategorias, obtenerProductos } from '../../datos/productosdb'

function Categorias() {
  const categorias = obtenerCategorias()
  const productos = obtenerProductos()

  return (
    <div>
      <h1 className="text-success mb-4">Categorías</h1>
      <div className="row g-3">
        {categorias.map((cat) => {
          const cantidad = productos.filter((p) => p.categoria === cat).length
          return (
            <div className="col-md-4" key={cat}>
              <div className="card h-100 text-center">
                <div className="card-body">
                  <h5 className="card-title">{cat}</h5>
                  <p className="text-muted">{cantidad} producto(s)</p>
                  <Link className="btn btn-outline-success btn-sm" to={`/categoria/${cat}`}>
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