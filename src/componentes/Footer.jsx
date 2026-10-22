// Pie de página de la tienda
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <div className="container">
        <div className="row gy-3">
          <div className="col-md-4">
            <h5 className="text-success">Delicias del Sur</h5>
            <p className="small mb-0">Conservas y productos del sur de Chile, con control de calidad en cada lote.</p>
          </div>
          <div className="col-md-4">
            <h6>Navegación</h6>
            <ul className="list-unstyled small mb-0">
              <li><Link className="text-light text-decoration-none" to="/productos">Productos</Link></li>
              <li><Link className="text-light text-decoration-none" to="/nosotros">Nosotros</Link></li>
              <li><Link className="text-light text-decoration-none" to="/contacto">Contacto</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h6>Contacto</h6>
            <p className="small mb-0">contacto@deliciasdelsur.cl</p>
          </div>
        </div>
        <hr className="border-secondary" />
        <p className="text-center small mb-0">© 2026 Delicias del Sur. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer