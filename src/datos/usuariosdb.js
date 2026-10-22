// Base de datos simulada de usuarios con CRUD; limpia los datos antes de guardarlos
const CLAVE = 'dds_usuarios'
const ROLES = ['admin', 'cliente']

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

function limpiarUsuario(u) {
  return {
    id: Number(u.id),
    run: String(u.run ?? '').replace(/[^0-9kK]/g, '').toUpperCase(),
    nombre: String(u.nombre ?? '').replace(/[<>]/g, '').trim(),
    correo: String(u.correo ?? '').replace(/[<>\s]/g, ''),
    password: String(u.password ?? ''),
    rol: ROLES.includes(u.rol) ? u.rol : 'cliente',
  }
}

function leer() {
  const guardado = localStorage.getItem(CLAVE)
  if (!guardado) {
    localStorage.setItem(CLAVE, JSON.stringify(USUARIOS_INICIALES))
    return [...USUARIOS_INICIALES]
  }
  return JSON.parse(guardado).map(limpiarUsuario)
}

function guardar(usuarios) {
  const limpios = usuarios.map(limpiarUsuario)
  localStorage.setItem(CLAVE, JSON.stringify(limpios))
}

export function obtenerUsuarios() {
  return leer()
}

export function obtenerUsuarioPorId(id) {
  return leer().find((u) => u.id === Number(id))
}

export function crearUsuario(datos) {
  const usuarios = leer()
  const nuevo = limpiarUsuario({ ...datos, id: Date.now() })
  if (usuarios.some((u) => u.correo === nuevo.correo)) {
    throw new Error('El correo ya está registrado')
  }
  if (usuarios.some((u) => u.run === nuevo.run)) {
    throw new Error('El RUN ya está registrado')
  }
  guardar([...usuarios, nuevo])
  return nuevo
}

export function actualizarUsuario(id, cambios) {
  const usuarios = leer()
  const indice = usuarios.findIndex((u) => u.id === Number(id))
  if (indice === -1) throw new Error('Usuario no encontrado')
  usuarios[indice] = { ...usuarios[indice], ...cambios }
  guardar(usuarios)
  return limpiarUsuario(usuarios[indice])
}

export function eliminarUsuario(id) {
  guardar(leer().filter((u) => u.id !== Number(id)))
}

export function autenticar(correo, password) {
  return leer().find((u) => u.correo === correo && u.password === password) || null
}