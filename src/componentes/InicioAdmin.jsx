// Entrada del panel: el administrador ve el dashboard y el vendedor va directo a productos
import { Navigate } from 'react-router-dom'
import { useSesion } from '../contexto/SesionContexto'
import Dashboard from '../paginas/admin/Dashboard'

function InicioAdmin() {
  const { usuario } = useSesion()

  if (usuario?.rol === 'VENDEDOR') return <Navigate to="/admin/productos" replace />
  return <Dashboard />
}

export default InicioAdmin