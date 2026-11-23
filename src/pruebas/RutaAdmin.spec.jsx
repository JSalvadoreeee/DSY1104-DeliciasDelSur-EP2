// Pruebas de la ruta protegida del panel: valida sesión con token y rol permitido
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RutaAdmin from '../componentes/RutaAdmin'
import { SesionProvider } from '../contexto/SesionContexto'
import { CLAVE_SESION, CLAVE_TOKEN } from '../servicios/api'

function montar(roles) {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <SesionProvider>
        <Routes>
          <Route
            path="/admin"
            element={
              <RutaAdmin roles={roles}>
                <p>Zona admin</p>
              </RutaAdmin>
            }
          />
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route path="/" element={<p>Inicio</p>} />
        </Routes>
      </SesionProvider>
    </MemoryRouter>
  )
}

describe('RutaAdmin', () => {
  beforeEach(() => {
    localStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_TOKEN)
  })

  afterEach(() => {
    cleanup()
    localStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_TOKEN)
  })

  it('redirige al login si no hay sesión iniciada', () => {
    montar()
    expect(screen.getByText('Pantalla de login')).not.toBeNull()
  })

  it('redirige al inicio si el usuario es CLIENTE', () => {
    localStorage.setItem(CLAVE_TOKEN, 'token-cliente')
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({ id: 2, nombre: 'Ana', correo: 'ana@correo.cl', rol: 'CLIENTE' })
    )
    montar()
    expect(screen.getByText('Inicio')).not.toBeNull()
  })

  it('muestra el contenido si el usuario es ADMINISTRADOR', () => {
    localStorage.setItem(CLAVE_TOKEN, 'token-admin')
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({ id: 1, nombre: 'Admin', correo: 'admin@deliciasdelsur.cl', rol: 'ADMINISTRADOR' })
    )
    montar()
    expect(screen.getByText('Zona admin')).not.toBeNull()
  })

  it('permite acceso al VENDEDOR en rutas habilitadas para ambos roles', () => {
    localStorage.setItem(CLAVE_TOKEN, 'token-vendedor')
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({ id: 3, nombre: 'Vendedor', correo: 'vendedor@deliciasdelsur.cl', rol: 'VENDEDOR' })
    )
    montar(['ADMINISTRADOR', 'VENDEDOR'])
    expect(screen.getByText('Zona admin')).not.toBeNull()
  })
})