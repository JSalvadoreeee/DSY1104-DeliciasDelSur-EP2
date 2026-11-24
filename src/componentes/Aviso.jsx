// Aviso flotante arriba a la derecha, con enlace al carrito cuando es de éxito
import { Link } from 'react-router-dom'

export default function Aviso({ aviso }) {
  if (!aviso) return null

  return (
    <div className="toast-container position-fixed end-0 p-3" style={{ zIndex: 1100, top: '70px' }}>
      <div className={`toast show align-items-center text-bg-${aviso.tipo} border-0`} role="status" aria-live="polite">
        <div className="toast-body">
          {aviso.texto}
          {aviso.tipo === 'success' && (
            <Link to="/carrito" className="ms-2 link-light fw-semibold">Ver carrito</Link>
          )}
        </div>
      </div>
    </div>
  )
}