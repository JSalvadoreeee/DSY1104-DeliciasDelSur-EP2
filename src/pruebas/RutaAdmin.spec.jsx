// Pruebas de la ruta protegida del panel: solo el admin puede entrar
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RutaAdmin from '../componentes/RutaAdmin'
import { SesionProvider } from '../contexto/SesionContexto'

function montar() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <SesionProvider>
        <Routes>
          <Route path="/admin" element={<RutaAdmin><p>Zona admin</p></RutaAdmin>} />
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route path="/" element={<p>Inicio</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>
  )
}

describe('RutaAdmin', () => {
  afterEach(() => {
    cleanup()
    localStorage.removeItem('dds_sesion')
  })

  it('redirige al login si no hay sesión iniciada', () => {
    montar()
    expect(screen.getByText('Pantalla de login')).not.toBeNull()
  })

  it('redirige al inicio si el usuario no es admin', () => {
    localStorage.setItem('dds_sesion', JSON.stringify({ id: 2, nombre: 'Ana', correo: 'ana@correo.cl', rol: 'cliente' }))
    montar()
    expect(screen.getByText('Inicio')).not.toBeNull()
  })

  it('muestra el contenido si el usuario es admin', () => {
    localStorage.setItem('dds_sesion', JSON.stringify({ id: 1, nombre: 'Admin', correo: 'admin@deliciasdelsur.cl', rol: 'admin' }))
    montar()
    expect(screen.getByText('Zona admin')).not.toBeNull()
  })
})