// Formulario para crear o editar un usuario contra la API, según si la URL trae un id
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { usuariosServicio } from '../../servicios/usuariosServicio'
import { mensajeError } from '../../servicios/api'
import { useSesion } from '../../contexto/SesionContexto'
import { validarNombre, validarCorreo, validarPassword } from '../../utilidades/validaciones'

const VACIO = {
  nombre: '',
  correo: '',
  password: '',
  rol: 'CLIENTE',
  direccion: '',
  telefono: '',
  estado: true,
}

function textoError(e) {
  return e.response ? mensajeError(e, 'No se pudo guardar el usuario') : 'No se pudo conectar con el servidor'
}

function AdminUsuarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario: actual } = useSesion()

  const [form, setForm] = useState(VACIO)
  const [esPropio, setEsPropio] = useState(false)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(Boolean(id))
  const [noExiste, setNoExiste] = useState(false)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (!id) return
    usuariosServicio
      .obtener(id)
      .then((u) => {
        setForm({
          nombre: u.nombre,
          correo: u.correo,
          password: '',
          rol: u.rol,
          direccion: u.direccion ?? '',
          telefono: u.telefono ?? '',
          estado: u.estado,
        })
        setEsPropio(actual?.id === u.id)
      })
      .catch((e) => {
        if (e.response?.status === 404) setNoExiste(true)
        else setErrorGeneral(textoError(e))
      })
      .finally(() => setCargando(false))
  }, [id, actual?.id])

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const validar = () => {
    const nuevos = {}
    if (!validarNombre(form.nombre)) nuevos.nombre = 'Ingresa el nombre'
    if (!validarCorreo(form.correo)) nuevos.correo = 'Correo inválido'
    const requierePassword = !id || form.password !== ''
    if (requierePassword && !validarPassword(form.password)) nuevos.password = 'Mínimo 8 caracteres'
    return nuevos
  }

  const enviar = async (e) => {
    e.preventDefault()
    setErrorGeneral('')
    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const datos = {
      nombre: form.nombre.trim(),
      correo: form.correo.trim(),
      rol: form.rol,
      direccion: form.direccion.trim(),
      telefono: form.telefono.trim(),
      estado: form.estado,
    }
    if (form.password !== '') datos.password = form.password

    setGuardando(true)
    try {
      if (id) await usuariosServicio.actualizar(id, datos)
      else await usuariosServicio.crear(datos)
      navigate('/admin/usuarios')
    } catch (err) {
      if (err.response?.data?.errores) setErrores(err.response.data.errores)
      setErrorGeneral(textoError(err))
    } finally {
      setGuardando(false)
    }
  }

  if (cargando) return <p>Cargando...</p>

  if (noExiste) {
    return (
      <div>
        <h2>Usuario no encontrado</h2>
        <Link to="/admin/usuarios">Volver a los usuarios</Link>
      </div>
    )
  }

  const campo = (nombre, etiqueta, tipo = 'text') => (
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
      <h1 className="mb-3">{id ? 'Editar usuario' : 'Nuevo usuario'}</h1>

      {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

      <form onSubmit={enviar} noValidate>
        {campo('nombre', 'Nombre')}
        {campo('correo', 'Correo', 'email')}
        {campo('password', id ? 'Contraseña (déjala vacía para no cambiarla)' : 'Contraseña', 'password')}

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
            <option value="CLIENTE">Cliente</option>
            <option value="VENDEDOR">Vendedor</option>
            <option value="ADMINISTRADOR">Administrador</option>
          </select>
          {esPropio && <div className="form-text">No puedes cambiar tu propio rol.</div>}
        </div>

        {campo('direccion', 'Dirección (opcional)')}
        {campo('telefono', 'Teléfono (opcional)')}

        <div className="form-check mb-3">
          <input
            id="estado"
            name="estado"
            type="checkbox"
            className="form-check-input"
            checked={form.estado}
            onChange={cambiar}
            disabled={esPropio}
          />
          <label className="form-check-label" htmlFor="estado">Usuario activo</label>
        </div>

        <button type="submit" className="btn btn-success me-2" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        <Link className="btn btn-outline-secondary" to="/admin/usuarios">Cancelar</Link>
      </form>
    </div>
  )
}

export default AdminUsuarioForm