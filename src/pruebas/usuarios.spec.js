// Pruebas unitarias del CRUD de usuarios y de la autenticación
import {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  autenticar,
} from '../datos/usuariosdb'

const datosBase = {
  run: '12.345.678-5',
  nombre: 'Ana Perez',
  correo: 'ana@correo.cl',
  password: 'clave1234',
}

describe('CRUD de usuarios', () => {
  beforeEach(() => localStorage.removeItem('dds_usuarios'))
  afterEach(() => localStorage.removeItem('dds_usuarios'))

  it('parte con el usuario administrador de prueba', () => {
    const usuarios = obtenerUsuarios()
    expect(usuarios.length).toBe(1)
    expect(usuarios[0].rol).toBe('admin')
  })

  it('crea un usuario con rol cliente y el RUN limpio', () => {
    const nuevo = crearUsuario(datosBase)
    expect(nuevo.rol).toBe('cliente')
    expect(nuevo.run).toBe('123456785')
    expect(obtenerUsuarioPorId(nuevo.id).correo).toBe('ana@correo.cl')
  })

  it('no permite crear un usuario con un correo repetido', () => {
    crearUsuario(datosBase)
    expect(() => crearUsuario({ ...datosBase, run: '9.999.999-3' })).toThrowError('El correo ya está registrado')
  })

  it('no permite crear un usuario con un RUN repetido', () => {
    crearUsuario(datosBase)
    expect(() => crearUsuario({ ...datosBase, correo: 'otra@correo.cl' })).toThrowError('El RUN ya está registrado')
  })

  it('actualiza el nombre de un usuario', () => {
    const nuevo = crearUsuario(datosBase)
    const actualizado = actualizarUsuario(nuevo.id, { nombre: 'Ana Gomez' })
    expect(actualizado.nombre).toBe('Ana Gomez')
    expect(obtenerUsuarioPorId(nuevo.id).nombre).toBe('Ana Gomez')
  })

  it('lanza un error al actualizar un usuario que no existe', () => {
    expect(() => actualizarUsuario(9999, { nombre: 'X' })).toThrowError('Usuario no encontrado')
  })

  it('elimina un usuario', () => {
    const nuevo = crearUsuario(datosBase)
    eliminarUsuario(nuevo.id)
    expect(obtenerUsuarioPorId(nuevo.id)).toBeUndefined()
  })

  it('no permite asignar un rol inválido', () => {
    const nuevo = crearUsuario({ ...datosBase, rol: 'superusuario' })
    expect(nuevo.rol).toBe('cliente')
  })
})

describe('Autenticación', () => {
  beforeEach(() => localStorage.removeItem('dds_usuarios'))
  afterEach(() => localStorage.removeItem('dds_usuarios'))

  it('entrega el usuario cuando el correo y la contraseña coinciden', () => {
    const usuario = autenticar('admin@deliciasdelsur.cl', 'admin1234')
    expect(usuario.rol).toBe('admin')
  })

  it('entrega null cuando la contraseña es incorrecta', () => {
    expect(autenticar('admin@deliciasdelsur.cl', 'otra-clave')).toBeNull()
  })
})