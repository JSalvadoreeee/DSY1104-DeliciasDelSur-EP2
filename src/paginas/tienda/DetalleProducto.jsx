// src/paginas/tienda/DetalleProducto.jsx
import { useParams, Link } from "react-router-dom";
import { obtenerProductoPorId } from "../../datos/productosdb";
import { useCarrito } from "../../contexto/CarritoContexto";

export default function DetalleProducto() {
  const { id } = useParams();
  const producto = obtenerProductoPorId(id);
  const { agregarAlCarrito } = useCarrito();

  if (!producto) {
    return (
      <div className="container text-center py-5">
        <h3 className="text-danger">Producto no encontrado</h3>
        <p className="text-muted">El producto solicitado no existe en nuestro catálogo.</p>
        <Link to="/productos" className="btn btn-danger mt-3">Volver al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container my-5" style={{ maxWidth: "850px" }}>
      <div className="card border-0 shadow-sm p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-6">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="img-fluid rounded shadow-sm w-100"
              style={{ maxHeight: "380px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-6">
            <span className="badge bg-danger mb-2">{producto.categoria}</span>
            <h2 className="fw-bold text-dark">{producto.nombre}</h2>
            <p className="text-muted">Código de Producto: <strong>{producto.codigo}</strong></p>
            <hr />
            <p className="fs-3 fw-bold text-danger">${producto.precio.toLocaleString("es-CL")} CLP</p>
            
            <ul className="list-unstyled my-3 text-secondary">
              <li><strong>Categoría:</strong> {producto.categoria}</li>
              <li><strong>Vida útil:</strong> {producto.vidaUtil}</li>
              <li><strong>Estado:</strong> Disponible</li>
            </ul>

            <div className="d-flex gap-2 mt-4">
              <button
                onClick={() => agregarAlCarrito(producto)}
                className="btn btn-warning btn-lg fw-semibold flex-grow-1"
              >
                Añadir al Carrito
              </button>
              <Link to="/productos" className="btn btn-outline-secondary btn-lg">
                Volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}