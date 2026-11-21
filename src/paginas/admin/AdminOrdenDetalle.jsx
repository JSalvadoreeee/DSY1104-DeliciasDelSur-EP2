// Detalle de una orden: datos del cliente, productos comprados y total
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { boletasServicio } from '../../servicios/boletasServicio'
import { mensajeError } from '../../servicios/api'

function AdminOrdenDetalle() {
  const { id } = useParams()
  const [orden, setOrden] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    boletasServicio
      .obtener(id)
      .then(setOrden)
      .catch((e) => setError(mensajeError(e, 'No se pudo cargar la orden')))
  }, [id])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!orden) return <p>Cargando orden...</p>

  return (
    <div>
      <Link to="/admin/ordenes" className="btn btn-outline-secondary btn-sm mb-3">Volver a órdenes</Link>
      <h2 className="mb-1">Orden N° {orden.id}</h2>
      <p className="text-muted">
        {new Date(orden.fecha).toLocaleString('es-CL')} - <span className="badge bg-success">{orden.estado}</span>
      </p>

      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Cliente</h5>
          <p className="mb-1"><strong>Nombre:</strong> {orden.usuario?.nombre}</p>
          <p className="mb-1"><strong>Correo:</strong> {orden.usuario?.correo}</p>
          <p className="mb-1"><strong>Dirección:</strong> {orden.usuario?.direccion || '-'}</p>
          <p className="mb-0"><strong>Teléfono:</strong> {orden.usuario?.telefono || '-'}</p>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th className="text-end">Cantidad</th>
              <th className="text-end">Precio unitario</th>
              <th className="text-end">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orden.detalles.map((d) => (
              <tr key={d.id}>
                <td>{d.producto?.nombre}</td>
                <td className="text-end">{d.cantidad}</td>
                <td className="text-end">${d.precioUnitario.toLocaleString('es-CL')}</td>
                <td className="text-end">${d.subtotal.toLocaleString('es-CL')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th colSpan="3" className="text-end">Total</th>
              <th className="text-end">${orden.total.toLocaleString('es-CL')}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default AdminOrdenDetalle