
import { Link } from 'react-router-dom'
import { obtenerBlogs } from '../../datos/blogsdb'

function Blogs() {
  const blogs = obtenerBlogs()

  return (
    <div>
      <h1 className="text-success mb-4">Blogs</h1>
      <div className="row g-3">
        {blogs.map((blog) => (
          <div className="col-md-6" key={blog.id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{blog.titulo}</h5>
                <p className="text-muted small">{blog.fecha}</p>
                <p className="card-text">{blog.resumen}</p>
                <Link className="btn btn-outline-success btn-sm" to={`/blog/${blog.id}`}>
                  Leer más
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Blogs