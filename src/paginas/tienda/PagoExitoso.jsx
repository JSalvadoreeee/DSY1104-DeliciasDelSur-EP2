// Pantalla de compra exitosa con el número de boleta devuelto por la API
import { Link, useLocation } from 'react-router-dom'

export default function PagoExitoso() {
  const { state } = useLocation()
  const boleta = state?.boleta

  return (
    <div className="text-center py-5">
      <h2 className="text-success fw-bold display-5">¡Pago Realizado con Éxito!</h2>
      {boleta ? (
        <p className="lead text-muted mt-3">
          Tu boleta N° <strong>{boleta.id}</strong> por un total de{' '}
          <strong>${boleta.total.toLocaleString('es-CL')} CLP</strong> fue registrada correctamente.
        </p>
      ) : (
        <p className="lead text-muted mt-3">Tu pedido ha sido procesado correctamente.</p>
      )}
      <Link to="/productos" className="btn btn-warning mt-3 fw-semibold">Volver a la Tienda</Link>
    </div>
  )
}