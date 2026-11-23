// Pruebas del componente Login: validaciones, mensaje de error y guardado de sesión JWT
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../paginas/tienda/Login'
import { SesionProvider } from '../contexto/SesionContexto'
import { autenticacionServicio } from '../servicios/autenticacionServicio'
import { CLAVE_SESION, CLAVE_TOKEN } from '../servicios/api'

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
  beforeEach(() => {
    localStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_TOKEN)
  })

  afterEach(() => {
    cleanup()
    localStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_TOKEN)
  })

  it('muestra errores de validación si se envía el formulario vacío', () => {
    montar()
    fireEvent.click(screen.getByText('Entrar'))
    expect(screen.getByText('Correo inválido')).not.toBeNull()
    expect(screen.getByText('Mínimo 8 caracteres')).not.toBeNull()
  })

  it('muestra un aviso si las credenciales son incorrectas', async () => {
    spyOn(autenticacionServicio, 'login').and.rejectWith({
      response: { data: { mensaje: 'Correo o contraseña incorrectos' } },
    })

    montar()
    escribir('admin@deliciasdelsur.cl', 'clave-equivocada')

    const alerta = await screen.findByText('Correo o contraseña incorrectos')
    expect(alerta).not.toBeNull()
  })

  it('guarda el token y la sesión en localStorage al entrar como admin', async () => {
    spyOn(autenticacionServicio, 'login').and.resolveTo({
      token: 'jwt-token-admin',
      id: 1,
      nombre: 'Administrador Delicias',
      correo: 'admin@deliciasdelsur.cl',
      rol: 'ADMINISTRADOR',
    })
    const espia = spyOn(Storage.prototype, 'setItem').and.callThrough()

    montar()
    escribir('admin@deliciasdelsur.cl', 'admin123')

    await waitFor(() => {
      if (!localStorage.getItem(CLAVE_SESION)) throw new Error('Esperando sesión')
    })

    expect(espia).toHaveBeenCalledWith(CLAVE_TOKEN, 'jwt-token-admin')
    expect(espia).toHaveBeenCalledWith(CLAVE_SESION, jasmine.any(String))
  })
})