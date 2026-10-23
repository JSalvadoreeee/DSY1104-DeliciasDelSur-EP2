// App principal: rutas de la tienda y del panel admin con sesión y carrito
import { Routes, Route } from 'react-router-dom'
import { SesionProvider } from './contexto/SesionContexto'
import { CarritoProvider } from './contexto/CarritoContexto'
import Navbar from './componentes/Navbar'
import Footer from './componentes/Footer'
import RutaAdmin from './componentes/RutaAdmin'
import Home from './paginas/tienda/Home'
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
import AdminLayout from './paginas/admin/AdminLayout'
import Dashboard from './paginas/admin/Dashboard'
import AdminProductos from './paginas/admin/AdminProductos'
import AdminProductoForm from './paginas/admin/AdminProductoForm'
import AdminLotes from './paginas/admin/AdminLotes'
import AdminLoteForm from './paginas/admin/AdminLoteForm'
import AdminUsuarios from './paginas/admin/AdminUsuarios'
import AdminUsuarioForm from './paginas/admin/AdminUsuarioForm'
import AdminReportes from './paginas/admin/AdminReportes'
import AdminPerfil from './paginas/admin/AdminPerfil'

function App() {
  return (
    <SesionProvider>
      <CarritoProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="container my-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />

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

              <Route path="/admin" element={<RutaAdmin><AdminLayout /></RutaAdmin>}>
                <Route index element={<Dashboard />} />
                <Route path="productos" element={<AdminProductos />} />
                <Route path="productos/nuevo" element={<AdminProductoForm />} />
                <Route path="productos/editar/:id" element={<AdminProductoForm />} />
                <Route path="lotes" element={<AdminLotes />} />
                <Route path="lotes/nuevo" element={<AdminLoteForm />} />
                <Route path="lotes/editar/:id" element={<AdminLoteForm />} />
                <Route path="usuarios" element={<AdminUsuarios />} />
                <Route path="usuarios/nuevo" element={<AdminUsuarioForm />} />
                <Route path="usuarios/editar/:id" element={<AdminUsuarioForm />} />
                <Route path="reportes" element={<AdminReportes />} />
                <Route path="perfil" element={<AdminPerfil />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </CarritoProvider>
    </SesionProvider>
  )
}

export default App