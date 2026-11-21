// Dashboard del administrador con datos reales de la API
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { productosServicio } from '../../servicios/productosServicio'
import { boletasServicio } from '../../servicios/boletasServicio'
import { usuariosServicio } from '../../servicios/usuariosServicio'
import { mensajeError } from '../../servicios/api'

const STOCK_BAJO = 10

function Dashboard() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([productosServicio.listar(), boletasServicio.listar(), usuariosServicio.listar()])
      .then(([productos, ordenes, usuarios]) => setDatos({ productos, ordenes, usuarios }))
      .catch((e) =>
        setError(e.response ? mensajeError(e, 'No se pudo cargar el resumen') : 'No se pudo conectar con el servidor')
      )
  }, [])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!datos) return <p>Cargando resumen...</p>

  const { productos, ordenes, usuarios } = datos
  const totalVendido = ordenes.reduce((acc, o) => acc + o.total, 0)
  const tarjetas = [
    { titulo: 'Productos', valor: productos.length, color: 'success', to: '/admin/productos' },
    { titulo: 'En oferta', valor: productos.filter((p) => p.oferta > 0).length, color: 'danger', to: '/admin/productos' },
    { titulo: `Stock bajo (menos de ${STOCK_BAJO})`, valor: productos.filter((p) => p.stock < STOCK_BAJO).length, color: 'warning', to: '/admin/productos' },
    { titulo: 'Órdenes', valor: ordenes.length, color: 'primary', to: '/admin/ordenes' },
    { titulo: 'Total vendido', valor: `$${totalVendido.toLocaleString('es-CL')}`, color: 'dark', to: '/admin/ordenes' },
    { titulo: 'Usuarios', valor: usuarios.length, color: 'secondary', to: '/admin/usuarios' },
  ]
  const recientes = ordenes.slice(0, 5)

  return (
    <div>
      <h1 className="mb-1">Dashboard</h1>
      <p className="text-muted">Resumen de la tienda</p>

      <div className="row g-3 mb-4">
        {tarjetas.map((t) => (
          <div className="col-sm-6 col-lg-4" key={t.titulo}>
            <div className={`card text-bg-${t.color}`}>
              <div className="card-body">
                <h6 className="card-title">{t.titulo}</h6>
                <p className="display-6 mb-2">{t.valor}</p>
                <Link to={t.to} className="link-light small">Ver detalle</Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h4>Últimas órdenes</h4>
      {recientes.length === 0 ? (
        <p className="text-muted">Todavía no hay órdenes registradas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th>N°</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {recientes.map((o) => (
                <tr key={o.id}>
                  <td><Link to={`/admin/ordenes/${o.id}`}>{o.id}</Link></td>
                  <td>{new Date(o.fecha).toLocaleString('es-CL')}</td>
                  <td>{o.usuario?.nombre}</td>
                  <td className="text-end">${o.total.toLocaleString('es-CL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Dashboard