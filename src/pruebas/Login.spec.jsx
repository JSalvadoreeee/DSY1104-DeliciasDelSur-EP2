// Pruebas del componente Login: validaciones, mensaje de error y uso de un espía (mock) sobre localStorage
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../paginas/tienda/Login'
import { SesionProvider } from '../contexto/SesionContexto'

function montar() {
  return render(
    <MemoryRouter>
      <SesionProvider>
        <Login />
      </SesionProvider>
    </MemoryRouter>
  )
}

function escribir(correo, password) {
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } })
  fireEvent.click(screen.getByText('Entrar'))
}

describe('Componente Login', () => {
  afterEach(() => {
    cleanup()
    localStorage.removeItem('dds_sesion')
  })

  it('muestra errores de validación si se envía el formulario vacío', () => {
    montar()
    fireEvent.click(screen.getByText('Entrar'))
    expect(screen.getByText('Correo inválido')).not.toBeNull()
    expect(screen.getByText('Mínimo 8 caracteres')).not.toBeNull()
  })

  it('muestra un aviso si las credenciales son incorrectas', () => {
    montar()
    escribir('admin@deliciasdelsur.cl', 'clave-equivocada')
    expect(screen.getByText('Correo o contraseña incorrectos')).not.toBeNull()
  })

  it('guarda la sesión usando un espía sobre localStorage al entrar como admin', () => {
    const espia = spyOn(Storage.prototype, 'setItem').and.callThrough()
    montar()
    escribir('admin@deliciasdelsur.cl', 'admin1234')
    expect(espia).toHaveBeenCalledWith('dds_sesion', jasmine.any(String))
  })
})