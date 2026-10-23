
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Carousel } from 'bootstrap'
import { obtenerCategorias, obtenerProductos } from '../../datos/productosdb'

const SLIDES = [
  {
    titulo: 'Delicias del Sur',
    texto: 'Conservas y productos artesanales del sur de Chile.',
    fondo: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
    boton: { etiqueta: 'Ver productos', to: '/productos' },
  },
  {
    titulo: 'Ofertas de la semana',
    texto: 'Aprovecha los descuentos en productos seleccionados.',
    fondo: 'linear-gradient(135deg, #c62828, #ef6c00)',
    boton: { etiqueta: 'Ver ofertas', to: '/ofertas' },
  },
  {
    titulo: 'Calidad en cada lote',
    texto: 'Controlamos cada lote para que llegue seguro a tu mesa.',
    fondo: 'linear-gradient(135deg, #1565c0, #26a69a)',
    boton: { etiqueta: 'Conócenos', to: '/nosotros' },
  },
]

function Home() {
  const carruselRef = useRef(null)
  const categorias = obtenerCategorias()
  const productos = obtenerProductos()

  useEffect(() => {
    const carrusel = new Carousel(carruselRef.current, { interval: 4000, ride: 'carousel' })
    return () => carrusel.dispose()
  }, [])

  return (
    <div>
      <div id="carruselHome" className="carousel slide mb-5" ref={carruselRef}>
        <div className="carousel-indicators">
          {SLIDES.map((s, i) => (
            <button
              key={s.titulo}
              type="button"
              data-bs-target="#carruselHome"
              data-bs-slide-to={i}
              className={i === 0 ? 'active' : ''}
              aria-label={s.titulo}
            />
          ))}
        </div>

        <div className="carousel-inner rounded overflow-hidden">
          {SLIDES.map((s, i) => (
            <div key={s.titulo} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <div
                className="d-flex flex-column justify-content-center align-items-center text-center text-white px-4"
                style={{ background: s.fondo, height: '300px' }}
              >
                <h2 className="display-5 fw-bold">{s.titulo}</h2>
                <p className="lead">{s.texto}</p>
                <Link className="btn btn-light" to={s.boton.to}>{s.boton.etiqueta}</Link>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carruselHome" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carruselHome" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      <h2 className="text-center mb-4">Categorías</h2>
      <div className="row g-3 justify-content-center">
        {categorias.map((cat) => {
          const deCategoria = productos.filter((p) => p.categoria === cat)
          return (
            <div className="col-12 col-sm-6 col-lg-4" key={cat}>
              <div className="card h-100 text-center shadow-sm">
                <img
                  src={deCategoria[0]?.imagen}
                  className="card-img-top"
                  alt={cat}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{cat}</h5>
                  <p className="text-muted">{deCategoria.length} producto(s)</p>
                  <Link className="btn btn-outline-success btn-sm" to={`/categoria/${cat}`}>
                    Ver productos
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Home