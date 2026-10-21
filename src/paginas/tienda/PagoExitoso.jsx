// src/paginas/tienda/PagoExitoso.jsx
import { Link } from "react-router-dom";

export default function PagoExitoso() {
  return (
    <div className="text-center py-5">
      <h2 className="text-success fw-bold display-5">¡Pago Realizado con Éxito!</h2>
      <p className="lead text-muted mt-3">Tu pedido ha sido procesado correctamente. Recibirás un comprobante en tu correo.</p>
      <Link to="/productos" className="btn btn-warning mt-3 fw-semibold">Volver a la Tienda</Link>
    </div>
  );
}