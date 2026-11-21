// Protege rutas por rol: sin sesión va al login y sin permiso vuelve al inicio
import { Navigate } from 'react-router-dom'
import { useSesion } from '../contexto/SesionContexto'

function RutaAdmin({ roles = ['ADMINISTRADOR'], children }) {
  const { usuario } = useSesion()

  if (!usuario) return <Navigate to="/login" replace />
  if (!roles.includes(usuario.rol)) return <Navigate to="/" replace />

  return children
}

export default RutaAdmin