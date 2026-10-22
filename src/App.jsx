// App principal: rutas de la tienda con sesión, carrito, Navbar y Footer
import { Routes, Route } from 'react-router-dom'
import { SesionProvider } from './contexto/SesionContexto'
import { CarritoProvider } from './contexto/CarritoContexto'
import Navbar from './componentes/Navbar'
import Footer from './componentes/Footer'
import Productos from './paginas/tienda/Productos'
import DetalleProducto from './paginas/tienda/DetalleProducto'
import Carrito from './paginas/tienda/Carrito'
import Checkout from './paginas/tienda/Checkout'
import PagoExitoso from './paginas/tienda/PagoExitoso'
import PagoError from './paginas/tienda/PagoError'
import Registro from './paginas/tienda/Registro'
import Login from './paginas/tienda/Login'
import Nosotros from './paginas/tienda/Nosotros'
import Contacto from './paginas/tienda/Contacto'
import Blogs from './paginas/tienda/Blogs'
import DetalleBlog from './paginas/tienda/DetalleBlog'
import Categorias from './paginas/tienda/Categorias'
import Categoria from './paginas/tienda/Categoria'
import Ofertas from './paginas/tienda/Ofertas'

function App() {
  return (
    <SesionProvider>
      <CarritoProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="container my-4 flex-grow-1">
            <Routes>
              <Route path="/" element={
                <div className="text-center py-5">
                  <h1 className="display-4 fw-bold text-success">Delicias del Sur</h1>
                  <p className="lead">Bienvenido a nuestra tienda de productos artesanales.</p>
                </div>
              } />

              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pago-exitoso" element={<PagoExitoso />} />
              <Route path="/pago-error" element={<PagoError />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/login" element={<Login />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blog/:id" element={<DetalleBlog />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/categoria/:nombre" element={<Categoria />} />
              <Route path="/ofertas" element={<Ofertas />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CarritoProvider>
    </SesionProvider>
  )
}

export default App