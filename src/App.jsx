import { Routes, Route } from 'react-router-dom'
import { CarritoProvider } from './contexto/CarritoContexto'
import Navbar from './componentes/Navbar'
import Productos from './paginas/tienda/Productos'
import Carrito from './paginas/tienda/Carrito'
import Checkout from './paginas/tienda/Checkout'
import PagoExitoso from './paginas/tienda/PagoExitoso'
import PagoError from './paginas/tienda/PagoError'

function App() {
  return (
    <CarritoProvider>
      <Navbar />
      <main className="container my-4">
        <Routes>
          {/* Ruta Principal / Inicio */}
          <Route path="/" element={
            <div className="text-center py-5">
              <h1 className="display-4 fw-bold text-success">Delicias del Sur</h1>
              <p className="lead">Bienvenido a nuestra tienda de productos artesanales.</p>
            </div>
          } />

          {/* Rutas de la Tienda */}
          <Route path="/productos" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/pago-error" element={<PagoError />} />
        </Routes>
      </main>
    </CarritoProvider>
  )
}

export default App