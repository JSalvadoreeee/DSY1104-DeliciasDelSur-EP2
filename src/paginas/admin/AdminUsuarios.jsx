// Lista de usuarios del panel conectada a la API, con editar y eliminar
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { usuariosServicio } from '../../servicios/usuariosServicio'
import { mensajeError } from '../../servicios/api'
import { useSesion } from '../../contexto/SesionContexto'

const COLORES = { ADMINISTRADOR: 'bg-primary', VENDEDOR: 'bg-info text-dark', CLIENTE: 'bg-secondary' }

function AdminUsuarios() {
  const { usuario: actual } = useSesion()
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    usuariosServicio
      .listar()
      .then(setUsuarios)
      .catch((e) => setError(e.response ? mensajeError(e, 'No se pudieron cargar los usuarios') : 'No se pudo conectar con el servidor'))
      .finally(() => setCargando(false))
  }, [])

  const eliminar = async (u) => {
    if (!window.confirm(`¿Eliminar a "${u.nombre}"?`)) return
    setError('')
    try {
      await usuariosServicio.eliminar(u.id)
      setUsuarios((prev) => prev.filter((x) => x.id !== u.id))
    } catch (e) {
      setError(mensajeError(e, 'No se pudo eliminar el usuario'))
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Usuarios</h1>
        <Link className="btn btn-success" to="/admin/usuarios/nuevo">Nuevo usuario</Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {cargando && <p>Cargando usuarios...</p>}

      {!cargando && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td><span className={`badge ${COLORES[u.rol] ?? 'bg-secondary'}`}>{u.rol}</span></td>
                  <td>{u.estado ? 'Activo' : 'Inactivo'}</td>
                  <td className="text-end">
                    <Link className="btn btn-outline-primary btn-sm me-2" to={`/admin/usuarios/editar/${u.id}`}>
                      Editar
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => eliminar(u)}
                      disabled={actual?.id === u.id}
                      title={actual?.id === u.id ? 'No puedes eliminar tu propio usuario' : ''}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">No hay usuarios.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminUsuarios