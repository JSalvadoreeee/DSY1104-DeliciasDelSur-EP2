
const CLAVE = 'dds_usuarios'

const USUARIOS_INICIALES = [
  {
    id: 1,
    run: '111111111',
    nombre: 'Administrador',
    correo: 'admin@deliciasdelsur.cl',
    password: 'admin1234',
    rol: 'admin',
  },
]

function leer() {
  const guardado = localStorage.getItem(CLAVE)
  if (!guardado) {
    localStorage.setItem(CLAVE, JSON.stringify(USUARIOS_INICIALES))
    return [...USUARIOS_INICIALES]
  }
  return JSON.parse(guardado)
}

function guardar(usuarios) {
  localStorage.setItem(CLAVE, JSON.stringify(usuarios))
}

export function obtenerUsuarios() {
  return leer()
}

export function obtenerUsuarioPorId(id) {
  return leer().find((u) => u.id === Number(id))
}

export function crearUsuario(datos) {
  const usuarios = leer()
  if (usuarios.some((u) => u.correo === datos.correo)) {
    throw new Error('El correo ya está registrado')
  }
  if (usuarios.some((u) => u.run === datos.run)) {
    throw new Error('El RUN ya está registrado')
  }
  const nuevo = { ...datos, id: Date.now(), rol: datos.rol || 'cliente' }
  guardar([...usuarios, nuevo])
  return nuevo
}

export function actualizarUsuario(id, cambios) {
  const usuarios = leer()
  const indice = usuarios.findIndex((u) => u.id === Number(id))
  if (indice === -1) throw new Error('Usuario no encontrado')
  usuarios[indice] = { ...usuarios[indice], ...cambios }
  guardar(usuarios)
  return usuarios[indice]
}

export function eliminarUsuario(id) {
  guardar(leer().filter((u) => u.id !== Number(id)))
}

export function autenticar(correo, password) {
  return leer().find((u) => u.correo === correo && u.password === password) || null
}