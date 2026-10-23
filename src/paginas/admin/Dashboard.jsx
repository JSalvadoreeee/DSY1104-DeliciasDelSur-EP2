
import { Link } from 'react-router-dom'
import { obtenerProductos } from '../../datos/productosdb'
import { obtenerUsuarios } from '../../datos/usuariosdb'

function Dashboard() {
  const productos = obtenerProductos()
  const usuarios = obtenerUsuarios()
  const enOferta = productos.filter((p) => p.precioOferta).length

  const tarjetas = [
    { titulo: 'Productos', valor: productos.length, color: 'success', to: '/admin/productos' },
    { titulo: 'Usuarios', valor: usuarios.length, color: 'primary', to: '/admin/usuarios' },
    { titulo: 'En oferta', valor: enOferta, color: 'danger', to: '/admin/productos' },
  ]

  return (
    <div>
      <h1 className="mb-1">Dashboard</h1>
      <p className="text-muted">Resumen de la tienda</p>

      <div className="row g-3">
        {tarjetas.map((t) => (
          <div className="col-sm-6 col-lg-4" key={t.titulo}>
            <div className={`card text-bg-${t.color}`}>
              <div className="card-body">
                <h6 className="card-title">{t.titulo}</h6>
                <p className="display-5 mb-2">{t.valor}</p>
                <Link to={t.to} className="link-light small">Ver detalle</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard