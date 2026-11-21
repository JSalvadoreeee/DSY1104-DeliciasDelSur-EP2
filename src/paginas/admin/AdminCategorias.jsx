// Mantenedor de categorías para el administrador: lista, crea, edita y elimina contra la API
import { useEffect, useState } from 'react'
import { categoriasServicio } from '../../servicios/categoriasServicio'
import { mensajeError } from '../../servicios/api'

const VACIO = { nombre: '', descripcion: '' }

function textoError(e, porDefecto) {
  return e.response ? mensajeError(e, porDefecto) : 'No se pudo conectar con el servidor'
}

function AdminCategorias() {
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)
  const [errorNombre, setErrorNombre] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    categoriasServicio
      .listar()
      .then(setCategorias)
      .catch((e) => setError(textoError(e, 'No se pudieron cargar las categorías')))
      .finally(() => setCargando(false))
  }, [])

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const cancelar = () => {
    setForm(VACIO)
    setEditandoId(null)
    setErrorNombre('')
  }

  const editar = (categoria) => {
    setEditandoId(categoria.id)
    setForm({ nombre: categoria.nombre, descripcion: categoria.descripcion ?? '' })
    setErrorNombre('')
    setError('')
  }

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.nombre.trim()) {
      setErrorNombre('El nombre es obligatorio')
      return
    }
    setErrorNombre('')

    const datos = { nombre: form.nombre.trim(), descripcion: form.descripcion.trim() }
    setGuardando(true)
    try {
      if (editandoId) {
        const actualizada = await categoriasServicio.actualizar(editandoId, datos)
        setCategorias((prev) => prev.map((c) => (c.id === editandoId ? actualizada : c)))
      } else {
        const creada = await categoriasServicio.crear(datos)
        setCategorias((prev) => [...prev, creada])
      }
      cancelar()
    } catch (err) {
      setError(textoError(err, 'No se pudo guardar la categoría'))
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (categoria) => {
    if (!window.confirm(`¿Eliminar "${categoria.nombre}"?`)) return
    setError('')
    try {
      await categoriasServicio.eliminar(categoria.id)
      setCategorias((prev) => prev.filter((c) => c.id !== categoria.id))
      if (editandoId === categoria.id) cancelar()
    } catch (err) {
      setError(textoError(err, 'No se pudo eliminar la categoría'))
    }
  }

  return (
    <div>
      <h1 className="mb-3">Categorías</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={guardar} noValidate className="card card-body mb-4">
        <h5>{editandoId ? 'Editar categoría' : 'Nueva categoría'}</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label" htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              className={`form-control ${errorNombre ? 'is-invalid' : ''}`}
              value={form.nombre}
              onChange={cambiar}
            />
            {errorNombre && <div className="invalid-feedback">{errorNombre}</div>}
          </div>
          <div className="col-md-8">
            <label className="form-label" htmlFor="descripcion">Descripción</label>
            <input
              id="descripcion"
              name="descripcion"
              className="form-control"
              value={form.descripcion}
              onChange={cambiar}
            />
          </div>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-success me-2" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          {editandoId && (
            <button type="button" className="btn btn-outline-secondary" onClick={cancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {cargando ? (
        <p>Cargando categorías...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.nombre}</td>
                  <td>{c.descripcion}</td>
                  <td className="text-end">
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => editar(c)}>
                      Editar
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => eliminar(c)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-muted">No hay categorías.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminCategorias