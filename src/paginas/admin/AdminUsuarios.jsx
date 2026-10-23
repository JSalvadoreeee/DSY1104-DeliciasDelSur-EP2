// Lista de usuarios del panel con acciones de editar y eliminar
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerUsuarios, eliminarUsuario } from '../../datos/usuariosdb'
import { useSesion } from '../../contexto/SesionContexto'

function AdminUsuarios() {
  const { usuario: actual } = useSesion()
  const [usuarios, setUsuarios] = useState(obtenerUsuarios())

  const eliminar = (u) => {
    if (!window.confirm(`¿Eliminar a "${u.nombre}"?`)) return
    eliminarUsuario(u.id)
    setUsuarios(obtenerUsuarios())
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Usuarios</h1>
        <Link className="btn btn-success" to="/admin/usuarios/nuevo">Nuevo usuario</Link>
      </div>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.run}</td>
                <td>{u.nombre}</td>
                <td>{u.correo}</td>
                <td>
                  <span className={`badge ${u.rol === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                    {u.rol}
                  </span>
                </td>
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
    </div>
  )
}

export default AdminUsuarios