// Lista de productos del panel con acciones de editar y eliminar
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerProductos, eliminarProducto } from '../../datos/productosdb'

function AdminProductos() {
  const [productos, setProductos] = useState([...obtenerProductos()])

  const eliminar = (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
    eliminarProducto(producto.id)
    setProductos([...obtenerProductos()])
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Productos</h1>
        <Link className="btn btn-success" to="/admin/productos/nuevo">Nuevo producto</Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
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
                <td>{p.precioOferta ? `$${p.precioOferta.toLocaleString('es-CL')}` : '-'}</td>
                <td className="text-end">
                  <Link className="btn btn-outline-primary btn-sm me-2" to={`/admin/productos/editar/${p.id}`}>
                    Editar
                  </Link>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(p)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {productos.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted">No hay productos.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminProductos