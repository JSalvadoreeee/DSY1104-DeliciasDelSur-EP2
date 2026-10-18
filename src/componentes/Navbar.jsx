
import { NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container">
        <NavLink className="navbar-brand fw-bold text-success" to="/">
          Delicias del Sur
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuPrincipal"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuPrincipal">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/productos">Productos</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/ofertas">Ofertas</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/nosotros">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/blogs">Blogs</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contacto">Contacto</NavLink></li>
          </ul>

          <div className="d-flex gap-2">
            <NavLink className="btn btn-outline-primary btn-sm" to="/login">Iniciar sesión</NavLink>
            <NavLink className="btn btn-primary btn-sm" to="/registro">Crear cuenta</NavLink>
            <NavLink className="btn btn-success btn-sm" to="/carrito">Carrito $0</NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar