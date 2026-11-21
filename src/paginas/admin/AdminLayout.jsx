// Menú lateral del panel: cada enlace indica qué roles lo pueden ver
import { NavLink, Outlet } from 'react-router-dom'
import { useSesion } from '../../contexto/SesionContexto'

const ENLACES = [
  { to: '/admin', etiqueta: 'Dashboard', end: true, roles: ['ADMINISTRADOR'] },
  { to: '/admin/productos', etiqueta: 'Productos', roles: ['ADMINISTRADOR', 'VENDEDOR'] },
  { to: '/admin/categorias', etiqueta: 'Categorías', roles: ['ADMINISTRADOR'] },
  { to: '/admin/ordenes', etiqueta: 'Órdenes', roles: ['ADMINISTRADOR', 'VENDEDOR'] },
  { to: '/admin/lotes', etiqueta: 'Lotes de calidad', roles: ['ADMINISTRADOR'] },
  { to: '/admin/usuarios', etiqueta: 'Usuarios', roles: ['ADMINISTRADOR'] },
  { to: '/admin/reportes', etiqueta: 'Reportes', roles: ['ADMINISTRADOR'] },
  { to: '/admin/perfil', etiqueta: 'Perfil', roles: ['ADMINISTRADOR'] },
]

function AdminLayout() {
  const { usuario } = useSesion()
  const visibles = ENLACES.filter((e) => e.roles.includes(usuario?.rol))

  return (
    <div className="row g-4">
      <aside className="col-md-3 col-lg-2">
        <div className="list-group">
          {visibles.map((e) => (
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