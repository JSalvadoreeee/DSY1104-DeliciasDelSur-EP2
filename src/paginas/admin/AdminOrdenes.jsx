// Lista de órdenes (boletas) para administrador y vendedor, solo lectura
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { boletasServicio } from '../../servicios/boletasServicio'
import { mensajeError } from '../../servicios/api'

function AdminOrdenes() {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    boletasServicio
      .listar()
      .then(setOrdenes)
      .catch((e) => setError(mensajeError(e, 'No se pudieron cargar las órdenes')))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <p>Cargando órdenes...</p>
  if (error) return <div className="alert alert-danger">{error}</div>

  return (
    <div>
      <h2 className="mb-3">Órdenes</h2>
      {ordenes.length === 0 ? (
        <p className="text-muted">Todavía no hay órdenes registradas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>N°</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{new Date(o.fecha).toLocaleString('es-CL')}</td>
                  <td>{o.usuario?.nombre}</td>
                  <td>${o.total.toLocaleString('es-CL')}</td>
                  <td><span className="badge bg-success">{o.estado}</span></td>
                  <td className="text-end">
                    <Link className="btn btn-outline-primary btn-sm" to={`/admin/ordenes/${o.id}`}>
                      Ver detalle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminOrdenes