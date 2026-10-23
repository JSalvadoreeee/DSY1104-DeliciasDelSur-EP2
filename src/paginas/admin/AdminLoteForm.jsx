// Formulario para registrar o editar un lote, aplicando la regla de conformidad
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  crearLote,
  actualizarLote,
  obtenerLotePorId,
  validarConformidad,
  PARAMETROS,
  ESTADOS,
} from '../../datos/lotesdb'
import { obtenerProductos } from '../../datos/productosdb'

function AdminLoteForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existente = id ? obtenerLotePorId(id) : null
  const productos = obtenerProductos()

  const [form, setForm] = useState(
    existente
      ? { ...existente, productoId: String(existente.productoId), valor: String(existente.valor) }
      : {
          productoId: '',
          parametro: 'pH',
          valor: '',
          estado: 'En revisión',
          fecha: new Date().toISOString().slice(0, 10),
          observaciones: '',
        }
  )
  const [errores, setErrores] = useState({})

  if (id && !existente) {
    return (
      <div>
        <h2>Lote no encontrado</h2>
        <Link to="/admin/lotes">Volver a los lotes</Link>
      </div>
    )
  }

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validar = () => {
    const nuevos = {}
    const valor = Number(form.valor)

    if (!form.productoId) nuevos.productoId = 'Selecciona un producto'
    if (form.valor === '' || Number.isNaN(valor)) nuevos.valor = 'Ingresa el valor medido'
    if (!form.fecha) nuevos.fecha = 'Ingresa la fecha'

    if (!nuevos.valor) {
      const error = validarConformidad({ ...form, valor })
      if (error) {
        if (form.estado === 'No conforme') nuevos.observaciones = error
        else nuevos.estado = error
      }
    }
    return nuevos
  }

  const enviar = (e) => {
    e.preventDefault()
    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const datos = {
      productoId: Number(form.productoId),
      parametro: form.parametro,
      valor: Number(form.valor),
      estado: form.estado,
      fecha: form.fecha,
      observaciones: form.observaciones.trim(),
    }

    if (existente) {
      actualizarLote(existente.id, datos)
    } else {
      crearLote(datos)
    }
    navigate('/admin/lotes')
  }

  const rango = PARAMETROS[form.parametro]

  return (
    <div style={{ maxWidth: '600px' }}>
      <h1 className="mb-3">{existente ? `Editar lote ${existente.codigo}` : 'Nuevo lote'}</h1>

      <form onSubmit={enviar} noValidate>
        <div className="mb-3">
          <label className="form-label" htmlFor="productoId">Producto</label>
          <select
            id="productoId"
            name="productoId"
            className={`form-select ${errores.productoId ? 'is-invalid' : ''}`}
            value={form.productoId}
            onChange={cambiar}
          >
            <option value="">Selecciona...</option>
            {productos.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
          </select>
          {errores.productoId && <div className="invalid-feedback">{errores.productoId}</div>}
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="parametro">Parámetro</label>
            <select id="parametro" name="parametro" className="form-select" value={form.parametro} onChange={cambiar}>
              {Object.keys(PARAMETROS).map((p) => <option key={p}>{p}</option>)}
            </select>
            <div className="form-text">
              Rango permitido: {rango.min} - {rango.max} {rango.unidad}
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="valor">Valor medido</label>
            <input
              id="valor"
              name="valor"
              type="number"
              step="any"
              className={`form-control ${errores.valor ? 'is-invalid' : ''}`}
              value={form.valor}
              onChange={cambiar}
            />
            {errores.valor && <div className="invalid-feedback">{errores.valor}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              className={`form-select ${errores.estado ? 'is-invalid' : ''}`}
              value={form.estado}
              onChange={cambiar}
            >
              {ESTADOS.map((e) => <option key={e}>{e}</option>)}
            </select>
            {errores.estado && <div className="invalid-feedback">{errores.estado}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label" htmlFor="fecha">Fecha</label>
            <input
              id="fecha"
              name="fecha"
              type="date"
              className={`form-control ${errores.fecha ? 'is-invalid' : ''}`}
              value={form.fecha}
              onChange={cambiar}
            />
            {errores.fecha && <div className="invalid-feedback">{errores.fecha}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            rows="3"
            className={`form-control ${errores.observaciones ? 'is-invalid' : ''}`}
            value={form.observaciones}
            onChange={cambiar}
          />
          {errores.observaciones && <div className="invalid-feedback">{errores.observaciones}</div>}
        </div>

        <button type="submit" className="btn btn-success me-2">Guardar</button>
        <Link className="btn btn-outline-secondary" to="/admin/lotes">Cancelar</Link>
      </form>
    </div>
  )
}

export default AdminLoteForm