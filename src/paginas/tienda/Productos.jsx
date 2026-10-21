// src/paginas/tienda/Productos.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { obtenerProductos } from "../../datos/productosdb";
import { useCarrito } from "../../contexto/CarritoContexto";

export default function Productos() {
  const listaProductos = obtenerProductos();
  const { agregarAlCarrito } = useCarrito();

  const [busqueda, setBusqueda] = useState("");
  const [categoriaSel, setCategoriaSel] = useState("Todas");

  // Filtro en tiempo real por búsqueda y categoría
  const productosFiltrados = listaProductos.filter((prod) => {
    const coincideNombre = 
      prod.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.codigo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaSel === "Todas" || prod.categoria === categoriaSel;
    return coincideNombre && coincideCategoria;
  });

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4 text-center text-danger fw-bold">Catálogo de Alimentos Procesados</h2>

      {/* Filtros de Búsqueda y Categoría */}
      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o código (ej: PR001)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={categoriaSel}
            onChange={(e) => setCategoriaSel(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            <option value="Conservas">Conservas</option>
            <option value="Salsas">Salsas</option>
            <option value="Deshidratados">Deshidratados</option>
          </select>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
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
                  
                  <div className="d-grid gap-2 mt-auto">
                    <Link to={`/producto/${prod.id}`} className="btn btn-outline-danger fw-semibold">
                      Ver Detalle
                    </Link>
                    <button 
                      onClick={() => agregarAlCarrito(prod)} 
                      className="btn btn-warning fw-semibold"
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-4">
            <p className="text-muted fs-5">No se encontraron productos con esos criterios de búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
}