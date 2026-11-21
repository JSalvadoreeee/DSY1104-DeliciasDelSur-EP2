// Pantalla de error de compra con el mensaje que respondió el servidor
import { Link, useLocation } from 'react-router-dom'

export default function PagoError() {
  const { state } = useLocation()

  return (
    <div className="text-center py-5">
      <h2 className="text-danger fw-bold display-5">Ocurrió un error con el pago</h2>
      <p className="lead text-muted mt-3">
        {state?.mensaje || 'No se pudo procesar la transacción. Intenta nuevamente.'}
      </p>
      <Link to="/carrito" className="btn btn-danger mt-3 me-2">Revisar carrito</Link>
      <Link to="/checkout" className="btn btn-outline-danger mt-3">Reintentar Pago</Link>
    </div>
  )
}