// src/paginas/tienda/Carrito.jsx
import { useCarrito } from "../../contexto/CarritoContexto";
import { Link } from "react-router-dom";

export default function Carrito() {
  const { carrito, eliminarDelCarrito, limpiarCarrito, total } = useCarrito();

  if (carrito.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>Tu carrito está vacío</h3>
        <p className="text-muted">Agrega productos desde el catálogo para continuar.</p>
        <Link to="/productos" className="btn btn-danger mt-3">Ver Productos</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-danger fw-bold">Carrito de Compras</h2>
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {carrito.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre} ({item.codigo})</td>
                <td>${item.precio.toLocaleString("es-CL")}</td>
                <td>{item.cantidad}</td>
                <td>${(item.precio * item.cantidad).toLocaleString("es-CL")}</td>
                <td>
                  <button 
                    className="btn btn-outline-danger btn-sm" 
                    onClick={() => eliminarDelCarrito(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button className="btn btn-outline-secondary" onClick={limpiarCarrito}>Vaciar Carrito</button>
        <div>
          <h4>Total: <span className="text-danger fw-bold">${total.toLocaleString("es-CL")} CLP</span></h4>
          <Link to="/checkout" className="btn btn-warning btn-lg mt-2 fw-semibold w-100">
            Proceder al Pago
          </Link>
        </div>
      </div>
    </div>
  );
}