// Formulario para crear o editar un producto, según si la URL trae un id
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  agregarProducto,
  actualizarProducto,
  obtenerProductoPorId,
  obtenerCategorias,
} from '../../datos/productosdb'

const VACIO = {
  codigo: '',
  nombre: '',
  precio: '',
  precioOferta: '',
  categoria: '',
  vidaUtil: '',
  imagen: '',
}

function AdminProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const existente = id ? obtenerProductoPorId(id) : null

  const [form, setForm] = useState(
    existente
      ? { ...VACIO, ...existente, precioOferta: existente.precioOferta ?? '' }
      : VACIO
  )
  const [errores, setErrores] = useState({})

  if (id && !existente) {
    return (
      <div>
        <h2>Producto no encontrado</h2>
        <Link to="/admin/productos">Volver a los productos</Link>
      </div>
    )
  }

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validar = () => {
    const nuevos = {}
    const precio = Number(form.precio)
    const oferta = form.precioOferta === '' ? null : Number(form.precioOferta)

    if (!form.codigo.trim()) nuevos.codigo = 'Ingresa el código'
    if (form.nombre.trim().length < 3) nuevos.nombre = 'Mínimo 3 caracteres'
    if (!precio || precio <= 0) nuevos.precio = 'Ingresa un precio mayor a 0'
    if (oferta !== null && (oferta <= 0 || oferta >= precio)) {
      nuevos.precioOferta = 'Debe ser mayor a 0 y menor al precio normal'
    }
    if (!form.categoria.trim()) nuevos.categoria = 'Ingresa la categoría'
    return nuevos
  }

  const enviar = (e) => {
    e.preventDefault()
    const nuevos = validar()
    setErrores(nuevos)
    if (Object.keys(nuevos).length > 0) return

    const datos = {
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      precioOferta: form.precioOferta === '' ? undefined : Number(form.precioOferta),
      categoria: form.categoria.trim(),
      vidaUtil: form.vidaUtil.trim(),
      imagen: form.imagen.trim(),
    }

    if (existente) {
      actualizarProducto(existente.id, datos)
    } else {
      agregarProducto(datos)
    }
    navigate('/admin/productos')
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
      <h1 className="mb-3">{existente ? 'Editar producto' : 'Nuevo producto'}</h1>

      <form onSubmit={enviar} noValidate>
        {campo('codigo', 'Código')}
        {campo('nombre', 'Nombre')}
        {campo('precio', 'Precio', 'number')}
        {campo('precioOferta', 'Precio de oferta (opcional)', 'number')}
        {campo('categoria', 'Categoría', 'text', { list: 'categorias-lista' })}
        <datalist id="categorias-lista">
          {obtenerCategorias().map((c) => <option key={c} value={c} />)}
        </datalist>
        {campo('vidaUtil', 'Vida útil', 'text', { placeholder: '365 días' })}
        {campo('imagen', 'URL de la imagen')}

        <button type="submit" className="btn btn-success me-2">Guardar</button>
        <Link className="btn btn-outline-secondary" to="/admin/productos">Cancelar</Link>
      </form>
    </div>
  )
}

export default AdminProductoForm