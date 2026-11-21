// Checkout: envía la compra real a POST /boletas y redirige según la respuesta
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../../contexto/CarritoContexto'
import { useSesion } from '../../contexto/SesionContexto'
import { boletasServicio } from '../../servicios/boletasServicio'
import { mensajeError } from '../../servicios/api'

function textoError(e) {
  if (!e.response) return 'No se pudo conectar con el servidor'
  if (e.response.status === 401 || e.response.status === 403) {
    return 'Tu sesión expiró o no tienes permiso para comprar. Inicia sesión nuevamente.'
  }
  return mensajeError(e, 'No se pudo procesar la compra')
}

export default function Checkout() {
  const { carrito, total, limpiarCarrito } = useCarrito()
  const { usuario } = useSesion()
  const navigate = useNavigate()
  const [procesando, setProcesando] = useState(false)

  if (carrito.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>No hay productos para pagar</h3>
        <Link to="/productos" className="btn btn-danger mt-3">Ver Productos</Link>
      </div>
    )
  }

  const pagar = async () => {
    setProcesando(true)
    try {
      const items = carrito.map((item) => ({ productoId: item.id, cantidad: item.cantidad }))
      const boleta = await boletasServicio.crear(items)
      limpiarCarrito()
      navigate('/pago-exitoso', { state: { boleta: { id: boleta.id, total: boleta.total } } })
    } catch (e) {
      navigate('/pago-error', { state: { mensaje: textoError(e) } })
    } finally {
      setProcesando(false)
    }
  }

  return (
    <div className="container mt-4 mb-5" style={{ maxWidth: '700px' }}>
      <h2 className="mb-4 text-center text-danger fw-bold">Finalizar Compra</h2>

      <div className="card p-4 shadow-sm border-0">
        <h5 className="mb-3">Cliente</h5>
        <p className="mb-1"><strong>Nombre:</strong> {usuario?.nombre}</p>
        <p className="mb-3"><strong>Correo:</strong> {usuario?.correo}</p>

        <h5 className="mb-3">Resumen del pedido</h5>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-end">Cantidad</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>{item.nombre}</td>
                  <td className="text-end">{item.cantidad}</td>
                  <td className="text-end">
                    ${((item.precioFinal ?? item.precio) * item.cantidad).toLocaleString('es-CL')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h5 className="text-end">
          Monto Total: <span className="text-danger fw-bold">${total.toLocaleString('es-CL')} CLP</span>
        </h5>

        <div className="d-grid gap-2 mt-4">
          <button className="btn btn-success btn-lg fw-semibold" onClick={pagar} disabled={procesando}>
            {procesando ? 'Procesando pago...' : 'Confirmar y pagar'}
          </button>
          <Link to="/carrito" className="btn btn-outline-secondary">Volver al carrito</Link>
        </div>
      </div>
    </div>
  )
}