// src/paginas/tienda/Productos.jsx
import { obtenerProductos } from "../../datos/productosdb";
import { useCarrito } from "../../contexto/CarritoContexto";

export default function Productos() {
  const listaProductos = obtenerProductos();
  const { agregarAlCarrito } = useCarrito();

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-center text-danger fw-bold">Catálogo de Alimentos Procesados</h2>
      
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {listaProductos.map((prod) => (
          <div className="col" key={prod.id}>
            <div className="card h-100 shadow-sm border-0">
              <img 
                src={prod.imagen} 
                className="card-img-top" 
                alt={prod.nombre} 
                style={{ height: "220px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column text-center">
                <h5 className="card-title fw-bold">{prod.nombre} ({prod.codigo})</h5>
                <p className="card-text text-muted mb-2 small">
                  Categoría: <strong>{prod.categoria}</strong> | Vida útil: <strong>{prod.vidaUtil}</strong>
                </p>
                <p className="card-text text-danger fw-bold fs-5 mb-3">${prod.precio.toLocaleString("es-CL")} CLP</p>
                
                <button 
                  onClick={() => agregarAlCarrito(prod)} 
                  className="btn btn-warning mt-auto w-100 fw-semibold"
                >
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}