
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSesion } from '../../contexto/SesionContexto'
import { validarCorreo, validarPassword } from '../../utilidades/validaciones'

function Login() {
  const { iniciarSesion } = useSesion()
  const navigate = useNavigate()

  const [form, setForm] = useState({ correo: '', password: '' })
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const enviar = (e) => {
    e.preventDefault()
    setErrorGeneral('')

    const nuevos = {}
    if (!validarCorreo(form.correo)) nuevos.correo = 'Correo inválido'
    if (!validarPassword(form.password)) nuevos.password = 'Mínimo 8 caracteres'
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const ok = iniciarSesion(form.correo.trim(), form.password)
    if (!ok) {
      setErrorGeneral('Correo o contraseña incorrectos')
      return
    }
    navigate('/')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6 col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Iniciar sesión</h2>

            {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

            <form onSubmit={enviar} noValidate>
              <div className="mb-3">
                <label className="form-label" htmlFor="correo">Correo</label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                  value={form.correo}
                  onChange={cambiar}
                />
                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`form-control ${errores.password ? 'is-invalid' : ''}`}
                  value={form.password}
                  onChange={cambiar}
                />
                {errores.password && <div className="invalid-feedback">{errores.password}</div>}
              </div>

              <button type="submit" className="btn btn-success w-100">Entrar</button>
            </form>

            <p className="text-center small mt-3 mb-0">
              ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login