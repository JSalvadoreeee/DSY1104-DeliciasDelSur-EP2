// Formulario para crear o editar un producto contra la API, según si la URL trae un id
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { productosServicio } from '../../servicios/productosServicio'
import { categoriasServicio } from '../../servicios/categoriasServicio'
import { mensajeError } from '../../servicios/api'

const VACIO = {
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  oferta: '0',
  categoriaId: '',
  imagenUrl: '',
}

function textoError(e) {
  return e.response ? mensajeError(e, 'No se pudo guardar el producto') : 'No se pudo conectar con el servidor'
}

function AdminProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState(VACIO)
  const [categorias, setCategorias] = useState([])
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [cargando, setCargando] = useState(true)
  const [noExiste, setNoExiste] = useState(false)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        setCategorias(await categoriasServicio.listar())
        if (id) {
          const p = await productosServicio.obtener(id)
          setForm({
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: String(p.precio),
            stock: String(p.stock),
            oferta: String(p.oferta),
            categoriaId: String(p.categoriaId),
            imagenUrl: p.imagen ?? '',
          })
        }
      } catch (e) {
        if (e.response?.status === 404) setNoExiste(true)
        else setErrorGeneral(textoError(e))
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validar = () => {
    const nuevos = {}
    const precio = Number(form.precio)
    const stock = Number(form.stock)
    const oferta = Number(form.oferta)

    if (form.nombre.trim().length < 3) nuevos.nombre = 'Mínimo 3 caracteres'
    if (!Number.isInteger(precio) || precio <= 0) nuevos.precio = 'Ingresa un precio entero mayor a 0'
    if (form.stock === '' || !Number.isInteger(stock) || stock < 0) nuevos.stock = 'Ingresa un stock entero desde 0'
    if (!Number.isInteger(oferta) || oferta < 0 || oferta > 100) nuevos.oferta = 'Ingresa un porcentaje entre 0 y 100'
    if (!form.categoriaId) nuevos.categoriaId = 'Selecciona la categoría'
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
      descripcion: form.descripcion.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      oferta: Number(form.oferta),
      categoriaId: Number(form.categoriaId),
      imagenUrl: form.imagenUrl.trim(),
    }

    setGuardando(true)
    try {
      if (id) await productosServicio.actualizar(id, datos)
      else await productosServicio.crear(datos)
      navigate('/admin/productos')
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
        <h2>Producto no encontrado</h2>
        <Link to="/admin/productos">Volver a los productos</Link>
      </div>
    )
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
      <h1 className="mb-3">{id ? 'Editar producto' : 'Nuevo producto'}</h1>

      {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

      <form onSubmit={enviar} noValidate>
        {campo('nombre', 'Nombre')}

        <div className="mb-3">
          <label className="form-label" htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            rows="3"
            className="form-control"
            value={form.descripcion}
            onChange={cambiar}
          />
        </div>

        {campo('precio', 'Precio', 'number')}
        {campo('stock', 'Stock', 'number')}
        {campo('oferta', 'Oferta (% de descuento, 0 si no tiene)', 'number')}

        <div className="mb-3">
          <label className="form-label" htmlFor="categoriaId">Categoría</label>
          <select
            id="categoriaId"
            name="categoriaId"
            className={`form-select ${errores.categoriaId ? 'is-invalid' : ''}`}
            value={form.categoriaId}
            onChange={cambiar}
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
          {errores.categoriaId && <div className="invalid-feedback">{errores.categoriaId}</div>}
        </div>

        {campo('imagenUrl', 'URL de la imagen')}

        <button type="submit" className="btn btn-success me-2" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        <Link className="btn btn-outline-secondary" to="/admin/productos">Cancelar</Link>
      </form>
    </div>
  )
}

export default AdminProductoForm