
import { Navigate } from 'react-router-dom'
import { useSesion } from '../contexto/SesionContexto'

function RutaAdmin({ children }) {
  const { usuario } = useSesion()

  if (!usuario) return <Navigate to="/login" replace />
  if (usuario.rol !== 'admin') return <Navigate to="/" replace />

  return children
}

export default RutaAdmin