
import { Link, useParams } from 'react-router-dom'
import { obtenerBlogPorId } from '../../datos/blogsdb'

function DetalleBlog() {
  const { id } = useParams()
  const blog = obtenerBlogPorId(id)

  if (!blog) {
    return (
      <div className="text-center py-5">
        <h2>Blog no encontrado</h2>
        <Link to="/blogs">Volver a los blogs</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '800px' }}>
      <Link to="/blogs" className="small">← Volver a los blogs</Link>
      <h1 className="text-success mt-3">{blog.titulo}</h1>
      <p className="text-muted small">{blog.fecha}</p>
      {blog.contenido.map((parrafo, i) => (
        <p key={i}>{parrafo}</p>
      ))}
    </div>
  )
}

export default DetalleBlog