// Lista de lotes con resumen por estado, filtro y acciones de editar y eliminar
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerLotes, eliminarLote, PARAMETROS, ESTADOS } from '../../datos/lotesdb'
import { obtenerProductoPorId } from '../../datos/productosdb'

const COLORES = {
  Conforme: 'bg-success',
  'No conforme': 'bg-danger',
  'En revisión': 'bg-warning text-dark',
}

function AdminLotes() {
  const [lotes, setLotes] = useState([...obtenerLotes()])
  const [filtro, setFiltro] = useState('Todos')

  const eliminar = (lote) => {
    if (!window.confirm(`¿Eliminar el lote ${lote.codigo}?`)) return
    eliminarLote(lote.id)
    setLotes([...obtenerLotes()])
  }

  const visibles = filtro === 'Todos' ? lotes : lotes.filter((l) => l.estado === filtro)

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Lotes de calidad</h1>
        <Link className="btn btn-success" to="/admin/lotes/nuevo">Nuevo lote</Link>
      </div>

      <div className="row g-2 mb-3">
        {ESTADOS.map((e) => (
          <div className="col-sm-4" key={e}>
            <div className="card">
              <div className="card-body py-2 d-flex justify-content-between align-items-center">
                <span>{e}</span>
                <span className={`badge ${COLORES[e]}`}>
                  {lotes.filter((l) => l.estado === e).length}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-3" style={{ maxWidth: '240px' }}>
        <select className="form-select" value={filtro} onChange={(e) => setFiltro(e.target.value)}>
          <option>Todos</option>
          {ESTADOS.map((e) => <option key={e}>{e}</option>)}
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Lote</th>
              <th>Producto</th>
              <th>Parámetro</th>
              <th>Valor</th>
              <th>Rango</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((l) => {
              const p = PARAMETROS[l.parametro]
              const producto = obtenerProductoPorId(l.productoId)
              return (
                <tr key={l.id}>
                  <td>{l.codigo}</td>
                  <td>{producto ? producto.nombre : 'Producto eliminado'}</td>
                  <td>{l.parametro}</td>
                  <td>{l.valor} {p?.unidad}</td>
                  <td>{p ? `${p.min} - ${p.max}` : '-'}</td>
                  <td><span className={`badge ${COLORES[l.estado]}`}>{l.estado}</span></td>
                  <td>{l.fecha}</td>
                  <td className="text-end">
                    <Link className="btn btn-outline-primary btn-sm me-2" to={`/admin/lotes/editar/${l.id}`}>
                      Editar
                    </Link>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(l)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
            {visibles.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted">No hay lotes con ese filtro.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminLotes