// Reportes del panel: resumen de productos, lotes de calidad y usuarios con datos reales
import { obtenerProductos } from '../../datos/productosdb'
import { obtenerLotes, ESTADOS } from '../../datos/lotesdb'
import { obtenerUsuarios } from '../../datos/usuariosdb'

const COLORES = {
  Conforme: 'bg-success',
  'No conforme': 'bg-danger',
  'En revisión': 'bg-warning',
}

function Barra({ etiqueta, valor, total, color = 'bg-success' }) {
  const porcentaje = total > 0 ? Math.round((valor / total) * 100) : 0
  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between small">
        <span>{etiqueta}</span>
        <span>{valor} ({porcentaje}%)</span>
      </div>
      <div className="progress">
        <div className={`progress-bar ${color}`} style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  )
}

function AdminReportes() {
  const productos = obtenerProductos()
  const lotes = obtenerLotes()
  const usuarios = obtenerUsuarios()

  const categorias = [...new Set(productos.map((p) => p.categoria))]
  const conformes = lotes.filter((l) => l.estado === 'Conforme').length
  const conformidad = lotes.length > 0 ? Math.round((conformes / lotes.length) * 100) : 0

  const criticos = productos
    .map((p) => ({
      producto: p,
      noConformes: lotes.filter((l) => l.productoId === p.id && l.estado === 'No conforme').length,
    }))
    .filter((c) => c.noConformes > 0)

  return (
    <div>
      <h1 className="mb-3">Reportes</h1>

      <div className="row g-3">
        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Productos por categoría</h5>
              {categorias.map((c) => (
                <Barra
                  key={c}
                  etiqueta={c}
                  valor={productos.filter((p) => p.categoria === c).length}
                  total={productos.length}
                />
              ))}
              <p className="small text-muted mb-0 mt-3">
                En oferta: {productos.filter((p) => p.precioOferta).length} de {productos.length}
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Lotes por estado</h5>
              {ESTADOS.map((e) => (
                <Barra
                  key={e}
                  etiqueta={e}
                  valor={lotes.filter((l) => l.estado === e).length}
                  total={lotes.length}
                  color={COLORES[e]}
                />
              ))}
              <p className="small text-muted mb-0 mt-3">
                Conformidad general: {conformidad}% ({conformes} de {lotes.length} lotes)
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Usuarios por rol</h5>
              {['admin', 'cliente'].map((r) => (
                <Barra
                  key={r}
                  etiqueta={r}
                  valor={usuarios.filter((u) => u.rol === r).length}
                  total={usuarios.length}
                  color="bg-primary"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Productos críticos</h5>
              <p className="small text-muted">Productos con lotes No conformes.</p>
              {criticos.length === 0 && <p className="mb-0">No hay productos críticos.</p>}
              <ul className="list-group">
                {criticos.map((c) => (
                  <li
                    key={c.producto.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {c.producto.nombre}
                    <span className="badge bg-danger">{c.noConformes} lote(s)</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminReportes