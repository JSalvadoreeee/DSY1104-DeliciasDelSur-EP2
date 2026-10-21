// src/paginas/tienda/PagoError.jsx
import { Link } from "react-router-dom";

export default function PagoError() {
  return (
    <div className="text-center py-5">
      <h2 className="text-danger fw-bold display-5">Ocurrió un error con el pago</h2>
      <p className="lead text-muted mt-3">No se pudo procesar la transacción. Intenta nuevamente.</p>
      <Link to="/checkout" className="btn btn-danger mt-3">Reintentar Pago</Link>
    </div>
  );
}