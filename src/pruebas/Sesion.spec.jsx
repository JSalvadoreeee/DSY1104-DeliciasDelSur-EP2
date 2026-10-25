// Pruebas de la sesión global: iniciar sesión, actualizar el perfil y cerrar sesión
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { SesionProvider, useSesion } from '../contexto/SesionContexto'

function Panel() {
  const { usuario, iniciarSesion, actualizarPerfil, cerrarSesion } = useSesion()
  return (
    <div>
      <span data-testid="nombre">{usuario ? usuario.nombre : 'sin sesión'}</span>
      <button onClick={() => iniciarSesion('admin@deliciasdelsur.cl', 'admin1234')}>entrar</button>
      <button onClick={() => iniciarSesion('admin@deliciasdelsur.cl', 'mala')}>entrar mal</button>
      <button onClick={() => actualizarPerfil({ nombre: 'Jefe de Calidad' })}>renombrar</button>
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
    localStorage.removeItem('dds_sesion')
    localStorage.removeItem('dds_usuarios')
  })
  afterEach(() => {
    cleanup()
    localStorage.removeItem('dds_sesion')
    localStorage.removeItem('dds_usuarios')
  })

  it('parte sin sesión iniciada', () => {
    montar()
    expect(screen.getByTestId('nombre').textContent).toBe('sin sesión')
  })

  it('inicia sesión con credenciales correctas y no guarda la contraseña', () => {
    montar()
    fireEvent.click(screen.getByText('entrar'))
    expect(screen.getByTestId('nombre').textContent).toBe('Administrador')
    expect(localStorage.getItem('dds_sesion')).not.toContain('admin1234')
  })

  it('no inicia sesión con credenciales incorrectas', () => {
    montar()
    fireEvent.click(screen.getByText('entrar mal'))
    expect(screen.getByTestId('nombre').textContent).toBe('sin sesión')
  })

  it('actualiza el nombre del perfil en la sesión', () => {
    montar()
    fireEvent.click(screen.getByText('entrar'))
    fireEvent.click(screen.getByText('renombrar'))
    expect(screen.getByTestId('nombre').textContent).toBe('Jefe de Calidad')
  })

  it('cierra la sesión y borra los datos guardados', () => {
    montar()
    fireEvent.click(screen.getByText('entrar'))
    fireEvent.click(screen.getByText('salir'))
    expect(screen.getByTestId('nombre').textContent).toBe('sin sesión')
    expect(localStorage.getItem('dds_sesion')).toBeNull()
  })
})