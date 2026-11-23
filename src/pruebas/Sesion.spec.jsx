// Pruebas de la sesión global: login con JWT, cierre de sesión y expiración de token
import { render, screen, fireEvent, cleanup, waitFor, act } from '@testing-library/react'
import { SesionProvider, useSesion } from '../contexto/SesionContexto'
import { autenticacionServicio } from '../servicios/autenticacionServicio'
import { CLAVE_SESION, CLAVE_TOKEN, EVENTO_SESION_EXPIRADA } from '../servicios/api'

function Panel() {
  const { usuario, iniciarSesion, cerrarSesion } = useSesion()

  const manejarLogin = async (correo, clave) => {
    try {
      await iniciarSesion(correo, clave)
    } catch {
      // El error lo maneja la vista de Login
    }
  }

  return (
    <div>
      <span data-testid="nombre">{usuario ? usuario.nombre : 'sin sesión'}</span>
      <button onClick={() => manejarLogin('admin@deliciasdelsur.cl', 'admin123')}>entrar</button>
      <button onClick={() => manejarLogin('admin@deliciasdelsur.cl', 'mala')}>entrar mal</button>
      <button onClick={cerrarSesion}>salir</button>
    </div>
  )
}

function montar() {
  return render(
    <SesionProvider>
      <Panel />
    </SesionProvider>
  )
}

describe('Sesión global', () => {
  beforeEach(() => {
    localStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_TOKEN)
  })

  afterEach(() => {
    cleanup()
    localStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_TOKEN)
  })

  it('parte sin sesión iniciada', () => {
    montar()
    expect(screen.getByTestId('nombre').textContent).toBe('sin sesión')
  })

  it('inicia sesión con credenciales correctas y guarda el token sin la contraseña', async () => {
    spyOn(autenticacionServicio, 'login').and.resolveTo({
      token: 'jwt-token-prueba',
      id: 1,
      nombre: 'Administrador Delicias',
      correo: 'admin@deliciasdelsur.cl',
      rol: 'ADMINISTRADOR',
    })

    montar()
    fireEvent.click(screen.getByText('entrar'))

    await screen.findByText('Administrador Delicias')
    expect(localStorage.getItem(CLAVE_TOKEN)).toBe('jwt-token-prueba')
    expect(localStorage.getItem(CLAVE_SESION)).not.toContain('admin123')
  })

  it('no inicia sesión si el servidor rechaza las credenciales', async () => {
    const loginSpy = spyOn(autenticacionServicio, 'login').and.rejectWith({
      response: { data: { mensaje: 'Correo o contraseña incorrectos' } },
    })

    montar()
    fireEvent.click(screen.getByText('entrar mal'))

    await waitFor(() => {
      if (loginSpy.calls.count() === 0) throw new Error('Esperando respuesta')
    })
    expect(screen.getByTestId('nombre').textContent).toBe('sin sesión')
    expect(localStorage.getItem(CLAVE_TOKEN)).toBeNull()
  })

  it('cierra la sesión y borra los datos guardados', async () => {
    spyOn(autenticacionServicio, 'login').and.resolveTo({
      token: 'jwt-token-prueba',
      id: 1,
      nombre: 'Administrador Delicias',
      correo: 'admin@deliciasdelsur.cl',
      rol: 'ADMINISTRADOR',
    })

    montar()
    fireEvent.click(screen.getByText('entrar'))
    await screen.findByText('Administrador Delicias')

    fireEvent.click(screen.getByText('salir'))
    expect(screen.getByTestId('nombre').textContent).toBe('sin sesión')
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
    expect(localStorage.getItem(CLAVE_TOKEN)).toBeNull()
  })

  it('cierra la sesión automáticamente cuando expira el token (401)', () => {
    localStorage.setItem(CLAVE_TOKEN, 'jwt-expirado')
    localStorage.setItem(
      CLAVE_SESION,
      JSON.stringify({ id: 1, nombre: 'Admin', correo: 'admin@deliciasdelsur.cl', rol: 'ADMINISTRADOR' })
    )

    montar()
    expect(screen.getByTestId('nombre').textContent).toBe('Admin')

    act(() => {
      window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
    })

    expect(screen.getByTestId('nombre').textContent).toBe('sin sesión')
    expect(localStorage.getItem(CLAVE_TOKEN)).toBeNull()
  })
})