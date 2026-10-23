// Sesión global: guarda solo los datos públicos del usuario y los mantiene al recargar
import { createContext, useContext, useState } from 'react'
import { autenticar, crearUsuario, actualizarUsuario } from '../datos/usuariosdb'

const SesionContexto = createContext(null)
const CLAVE = 'dds_sesion'

function datosSesion(u) {
  return {
    id: Number(u.id),
    nombre: String(u.nombre ?? ''),
    correo: String(u.correo ?? ''),
    rol: u.rol === 'admin' ? 'admin' : 'cliente',
  }
}

function leerSesion() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return guardado ? datosSesion(JSON.parse(guardado)) : null
  } catch {
    return null
  }
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion)

  const abrirSesion = (u) => {
    const sesion = datosSesion(u)
    localStorage.setItem(CLAVE, JSON.stringify(sesion))
    setUsuario(sesion)
  }

  const iniciarSesion = (correo, password) => {
    const encontrado = autenticar(correo, password)
    if (!encontrado) return false
    abrirSesion(encontrado)
    return true
  }

  const registrar = (datos) => {
    const nuevo = crearUsuario(datos)
    abrirSesion(nuevo)
    return nuevo
  }

  const actualizarPerfil = (cambios) => {
    const actualizado = actualizarUsuario(usuario.id, cambios)
    abrirSesion(actualizado)
    return actualizado
  }

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE)
    setUsuario(null)
  }

  return (
    <SesionContexto.Provider
      value={{ usuario, iniciarSesion, registrar, actualizarPerfil, cerrarSesion }}
    >
      {children}
    </SesionContexto.Provider>
  )
}

export function useSesion() {
  return useContext(SesionContexto)
}