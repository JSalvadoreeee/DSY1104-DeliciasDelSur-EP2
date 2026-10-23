import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSesion } from '../../contexto/SesionContexto'
import {
  validarRun,
  validarNombre,
  validarCorreo,
  validarPassword,
  esNombreCiudad,
} from '../../utilidades/validaciones'

function Registro() {
  const { registrar } = useSesion()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    run: '',
    nombre: '',
    correo: '',
    password: '',
    confirmar: '',
  })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validar = () => {
    const nuevos = {}
    if (!validarRun(form.run)) nuevos.run = 'RUN inválido (ej: 12345678-5)'
    
    // Validación de nombre y bloqueo de ciudades
    if (!validarNombre(form.nombre)) {
      nuevos.nombre = 'Ingresa tu nombre'
    } else if (esNombreCiudad(form.nombre)) {
      nuevos.nombre = 'El nombre de usuario no puede coincidir con el nombre de una ciudad'
    }

    if (!validarCorreo(form.correo)) nuevos.correo = 'Correo inválido'
    if (!validarPassword(form.password)) nuevos.password = 'Mínimo 8 caracteres'
    if (form.password !== form.confirmar) nuevos.confirmar = 'Las contraseñas no coinciden'
    
    return nuevos
  }

  const enviar = (e) => {
    e.preventDefault()
    setErrorGeneral('')
    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    try {
      registrar({
        run: form.run.replace(/[.\-\s]/g, '').toUpperCase(),
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        password: form.password,
      })
      navigate('/')
    } catch (err) {
      setErrorGeneral(err.message)
    }
  }

  const campo = (nombre, etiqueta, tipo = 'text', ayuda = '') => (
    <div className="mb-3">
      <label className="form-label" htmlFor={nombre}>{etiqueta}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        placeholder={ayuda}
        className={`form-control ${errores[nombre] ? 'is-invalid' : ''}`}
        value={form[nombre]}
        onChange={cambiar}
      />
      {errores[nombre] && <div className="invalid-feedback">{errores[nombre]}</div>}
    </div>
  )

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Crear cuenta</h2>

            {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

            <form onSubmit={enviar} noValidate>
              {campo('run', 'RUN', 'text', '12345678-5')}
              {campo('nombre', 'Nombre')}
              {campo('correo', 'Correo', 'email')}
              {campo('password', 'Contraseña', 'password')}
              {campo('confirmar', 'Confirmar contraseña', 'password')}

              <button type="submit" className="btn btn-success w-100">Registrarme</button>
            </form>

            <p className="text-center small mt-3 mb-0">
              ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Registro