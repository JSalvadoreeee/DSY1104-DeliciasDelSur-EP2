// Perfil del usuario con sesión: permite cambiar el nombre y la contraseña
import { useState } from 'react'
import { useSesion } from '../../contexto/SesionContexto'
import { obtenerUsuarioPorId } from '../../datos/usuariosdb'
import { validarNombre, validarPassword } from '../../utilidades/validaciones'

function AdminPerfil() {
  const { usuario, actualizarPerfil } = useSesion()
  const completo = obtenerUsuarioPorId(usuario.id)

  const [form, setForm] = useState({ nombre: usuario.nombre, password: '', confirmar: '' })
  const [errores, setErrores] = useState({})
  const [guardado, setGuardado] = useState(false)

  const cambiar = (e) => {
    setGuardado(false)
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const enviar = (e) => {
    e.preventDefault()
    setGuardado(false)

    const nuevos = {}
    if (!validarNombre(form.nombre)) nuevos.nombre = 'Ingresa tu nombre'
    if (form.password !== '') {
      if (!validarPassword(form.password)) nuevos.password = 'Mínimo 8 caracteres'
      if (form.password !== form.confirmar) nuevos.confirmar = 'Las contraseñas no coinciden'
    }
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const cambios = { nombre: form.nombre.trim() }
    if (form.password !== '') cambios.password = form.password

    actualizarPerfil(cambios)
    setForm({ ...form, password: '', confirmar: '' })
    setGuardado(true)
  }

  const campoTexto = (nombre, etiqueta, tipo = 'text') => (
    <div className="mb-3">
      <label className="form-label" htmlFor={nombre}>{etiqueta}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        className={`form-control ${errores[nombre] ? 'is-invalid' : ''}`}
        value={form[nombre]}
        onChange={cambiar}
      />
      {errores[nombre] && <div className="invalid-feedback">{errores[nombre]}</div>}
    </div>
  )

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 className="mb-3">Perfil</h1>

      {guardado && <div className="alert alert-success">Perfil actualizado.</div>}

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">RUN</label>
          <input className="form-control" value={completo?.run ?? ''} disabled />
        </div>
        <div className="col-md-6">
          <label className="form-label">Rol</label>
          <input className="form-control" value={usuario.rol} disabled />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Correo</label>
        <input className="form-control" value={usuario.correo} disabled />
      </div>

      <form onSubmit={enviar} noValidate>
        {campoTexto('nombre', 'Nombre')}
        {campoTexto('password', 'Nueva contraseña (déjala vacía para no cambiarla)', 'password')}
        {campoTexto('confirmar', 'Confirmar nueva contraseña', 'password')}

        <button type="submit" className="btn btn-success">Guardar cambios</button>
      </form>
    </div>
  )
}

export default AdminPerfil