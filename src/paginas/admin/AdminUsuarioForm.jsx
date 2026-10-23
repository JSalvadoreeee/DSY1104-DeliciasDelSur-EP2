// Formulario para crear o editar un usuario, según si la URL trae un id
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  crearUsuario,
  actualizarUsuario,
  obtenerUsuarioPorId,
  obtenerUsuarios,
} from '../../datos/usuariosdb'
import { useSesion } from '../../contexto/SesionContexto'
import {
  validarRun,
  validarNombre,
  validarCorreo,
  validarPassword,
} from '../../utilidades/validaciones'

function AdminUsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario: actual } = useSesion()
  const existente = id ? obtenerUsuarioPorId(id) : null
  const esPropio = Boolean(existente) && actual?.id === existente.id

  const [form, setForm] = useState(
    existente
      ? { run: existente.run, nombre: existente.nombre, correo: existente.correo, password: '', rol: existente.rol }
      : { run: '', nombre: '', correo: '', password: '', rol: 'cliente' }
  )
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  if (id && !existente) {
    return (
      <div>
        <h2>Usuario no encontrado</h2>
        <Link to="/admin/usuarios">Volver a los usuarios</Link>
      </div>
    )
  }

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validar = () => {
    const nuevos = {}
    const otros = obtenerUsuarios().filter((u) => !existente || u.id !== existente.id)
    const runLimpio = form.run.replace(/[.\-\s]/g, '').toUpperCase()

    if (!validarRun(form.run)) nuevos.run = 'RUN inválido (ej: 12345678-5)'
    else if (otros.some((u) => u.run === runLimpio)) nuevos.run = 'El RUN ya está registrado'

    if (!validarNombre(form.nombre)) nuevos.nombre = 'Ingresa el nombre'

    if (!validarCorreo(form.correo)) nuevos.correo = 'Correo inválido'
    else if (otros.some((u) => u.correo === form.correo.trim())) nuevos.correo = 'El correo ya está registrado'

    const requierePassword = !existente || form.password !== ''
    if (requierePassword && !validarPassword(form.password)) nuevos.password = 'Mínimo 8 caracteres'

    return nuevos
  }

  const enviar = (e) => {
    e.preventDefault()
    setErrorGeneral('')
    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const datos = {
      run: form.run.replace(/[.\-\s]/g, '').toUpperCase(),
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      rol: form.rol,
    }

    try {
      if (existente) {
        if (form.password !== '') datos.password = form.password
        actualizarUsuario(existente.id, datos)
      } else {
        crearUsuario({ ...datos, password: form.password })
      }
      navigate('/admin/usuarios')
    } catch (err) {
      setErrorGeneral(err.message)
    }
  }

  const campo = (nombre, etiqueta, tipo = 'text', extra = {}) => (
    <div className="mb-3">
      <label className="form-label" htmlFor={nombre}>{etiqueta}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        className={`form-control ${errores[nombre] ? 'is-invalid' : ''}`}
        value={form[nombre]}
        onChange={cambiar}
        {...extra}
      />
      {errores[nombre] && <div className="invalid-feedback">{errores[nombre]}</div>}
    </div>
  )

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 className="mb-3">{existente ? 'Editar usuario' : 'Nuevo usuario'}</h1>

      {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

      <form onSubmit={enviar} noValidate>
        {campo('run', 'RUN', 'text', { placeholder: '12345678-5' })}
        {campo('nombre', 'Nombre')}
        {campo('correo', 'Correo', 'email')}
        {campo(
          'password',
          existente ? 'Contraseña (déjala vacía para no cambiarla)' : 'Contraseña',
          'password'
        )}

        <div className="mb-3">
          <label className="form-label" htmlFor="rol">Rol</label>
          <select
            id="rol"
            name="rol"
            className="form-select"
            value={form.rol}
            onChange={cambiar}
            disabled={esPropio}
          >
            <option value="cliente">Cliente</option>
            <option value="admin">Admin</option>
          </select>
          {esPropio && <div className="form-text">No puedes cambiar tu propio rol.</div>}
        </div>

        <button type="submit" className="btn btn-success me-2">Guardar</button>
        <Link className="btn btn-outline-secondary" to="/admin/usuarios">Cancelar</Link>
      </form>
    </div>
  )
}

export default AdminUsuarioForm