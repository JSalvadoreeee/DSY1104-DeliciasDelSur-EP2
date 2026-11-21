// Catálogo de productos con búsqueda por nombre o código y filtro por categoría
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCatalogo } from '../../utilidades/useCatalogo'
import { useCarrito } from '../../contexto/CarritoContexto'
import { useSesion } from '../../contexto/SesionContexto'

export default function Productos() {
  const { productos, categorias, cargando, error } = useCatalogo()
  const { agregarAlCarrito } = useCarrito()
  const { usuario } = useSesion()
  const puedeComprar = usuario?.rol !== 'VENDEDOR'

  const [busqueda, setBusqueda] = useState('')
  const [categoriaSel, setCategoriaSel] = useState('Todas')

  const productosFiltrados = productos.filter((prod) => {
    const texto = busqueda.toLowerCase()
    const coincideNombre =
      prod.nombre.toLowerCase().includes(texto) || prod.codigo.toLowerCase().includes(texto)
    const coincideCategoria = categoriaSel === 'Todas' || prod.categoria === categoriaSel
    return coincideNombre && coincideCategoria
  })

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-center text-danger fw-bold">Catálogo de Alimentos Procesados</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o código (ej: PR001)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={categoriaSel}
            onChange={(e) => setCategoriaSel(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {cargando && <p className="text-center">Cargando productos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {!cargando && !error && productosFiltrados.length === 0 && (
          <div className="col-12 text-center py-4">
            <p className="text-muted fs-5">No se encontraron productos con esos criterios de búsqueda.</p>
          </div>
        )}
        {productosFiltrados.map((prod) => (
          <div className="col" key={prod.id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={prod.imagen}
                className="card-img-top"
                alt={prod.nombre}
                style={{ height: '220px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title fw-bold">{prod.nombre} ({prod.codigo})</h5>
                <p className="card-text text-muted mb-2 small">
                  Categoría: <strong>{prod.categoria}</strong> | Stock: <strong>{prod.stock}</strong>
                </p>
                {prod.precioOferta ? (
                  <p className="card-text mb-3">
                    <span className="text-muted text-decoration-line-through me-2">
                      ${prod.precio.toLocaleString('es-CL')}
                    </span>
                    <span className="text-danger fw-bold fs-5">
                      ${prod.precioOferta.toLocaleString('es-CL')} CLP
                    </span>
                  </p>
                ) : (
                  <p className="card-text text-danger fw-bold fs-5 mb-3">
                    ${prod.precio.toLocaleString('es-CL')} CLP
                  </p>
                )}

                <div className="d-grid gap-2 mt-auto">
                  <Link to={`/producto/${prod.id}`} className="btn btn-outline-danger fw-semibold">
                    Ver Detalle
                  </Link>
                  {puedeComprar && (
                    <button
                      onClick={() => agregarAlCarrito(prod)}
                      className="btn btn-warning fw-semibold"
                      disabled={prod.stock === 0}
                    >
                      {prod.stock === 0 ? 'Sin stock' : 'Añadir al Carrito'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}