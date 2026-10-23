
import { NavLink, Outlet } from 'react-router-dom'

const ENLACES = [
  { to: '/admin', etiqueta: 'Dashboard', end: true },
  { to: '/admin/productos', etiqueta: 'Productos' },
  { to: '/admin/lotes', etiqueta: 'Lotes de calidad' },
  { to: '/admin/usuarios', etiqueta: 'Usuarios' },
  { to: '/admin/reportes', etiqueta: 'Reportes' },
  { to: '/admin/perfil', etiqueta: 'Perfil' },
]

function AdminLayout() {
  return (
    <div className="row g-4">
      <aside className="col-md-3 col-lg-2">
        <div className="list-group">
          {ENLACES.map((e) => (
            <NavLink
              key={e.to}
              to={e.to}
              end={e.end}
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${isActive ? 'active' : ''}`
              }
            >
              {e.etiqueta}
            </NavLink>
          ))}
          <NavLink to="/" className="list-group-item list-group-item-action text-success">
            Ir a la tienda
          </NavLink>
        </div>
      </aside>

      <section className="col-md-9 col-lg-10">
        <Outlet />
      </section>
    </div>
  )
}

export default AdminLayout