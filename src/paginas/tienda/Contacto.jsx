// Formulario de contacto con validaciones
import { useState } from 'react'
import { validarNombre, validarCorreo } from '../../utilidades/validaciones'

function Contacto() {
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' })
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const enviar = (e) => {
    e.preventDefault()
    setEnviado(false)

    const nuevos = {}
    if (!validarNombre(form.nombre)) nuevos.nombre = 'Ingresa tu nombre'
    if (!validarCorreo(form.correo)) nuevos.correo = 'Correo inválido'
    if (form.mensaje.trim().length < 10) nuevos.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    setForm({ nombre: '', correo: '', mensaje: '' })
    setEnviado(true)
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '600px' }}>
      <h1 className="text-success mb-4">Contacto</h1>

      {enviado && <div className="alert alert-success">¡Mensaje enviado! Te responderemos pronto.</div>}

      <form onSubmit={enviar} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
            value={form.nombre}
            onChange={cambiar}
          />
          {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
        </div>

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
          <label className="form-label" htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="4"
            className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
            value={form.mensaje}
            onChange={cambiar}
          />
          {errores.mensaje && <div className="invalid-feedback">{errores.mensaje}</div>}
        </div>

        <button type="submit" className="btn btn-success">Enviar mensaje</button>
      </form>
    </div>
  )
}

export default Contacto