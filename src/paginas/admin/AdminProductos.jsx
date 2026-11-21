// Lista de productos del panel: el administrador gestiona, el vendedor solo consulta
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productosServicio } from '../../servicios/productosServicio'
import { mensajeError } from '../../servicios/api'
import { useSesion } from '../../contexto/SesionContexto'

function AdminProductos() {
  const { usuario } = useSesion()
  const esAdmin = usuario?.rol === 'ADMINISTRADOR'

  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    productosServicio
      .listar()
      .then(setProductos)
      .catch((e) => setError(e.response ? mensajeError(e, 'No se pudieron cargar los productos') : 'No se pudo conectar con el servidor'))
      .finally(() => setCargando(false))
  }, [])

  const eliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
    setError('')
    try {
      await productosServicio.eliminar(producto.id)
      setProductos((prev) => prev.filter((p) => p.id !== producto.id))
    } catch (e) {
      setError(mensajeError(e, 'No se pudo eliminar el producto'))
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Productos</h1>
        {esAdmin && <Link className="btn btn-success" to="/admin/productos/nuevo">Nuevo producto</Link>}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {cargando && <p>Cargando productos...</p>}

      {!cargando && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Oferta</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.codigo}</td>
                  <td>{p.nombre}</td>
                  <td>{p.categoria}</td>
                  <td>${p.precio.toLocaleString('es-CL')}</td>
                  <td>{p.stock}</td>
                  <td>{p.precioOferta ? `$${p.precioOferta.toLocaleString('es-CL')} (-${p.oferta}%)` : '-'}</td>
                  <td className="text-end">
                    <Link className="btn btn-outline-secondary btn-sm me-2" to={`/admin/productos/${p.id}`}>
                      Ver detalle
                    </Link>
                    {esAdmin && (
                      <>
                        <Link className="btn btn-outline-primary btn-sm me-2" to={`/admin/productos/editar/${p.id}`}>
                          Editar
                        </Link>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(p)}>
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center text-muted">No hay productos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminProductos