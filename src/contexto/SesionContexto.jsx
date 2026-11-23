// Sesión global: guarda el token JWT y los datos públicos del usuario, y los mantiene al recargar
import { createContext, useContext, useEffect, useState } from 'react'
import { autenticacionServicio } from '../servicios/autenticacionServicio'
import { CLAVE_SESION, CLAVE_TOKEN, EVENTO_SESION_EXPIRADA, mensajeError } from '../servicios/api'

const SesionContexto = createContext(null)
const ROLES = ['ADMINISTRADOR', 'VENDEDOR', 'CLIENTE']

function datosSesion(u) {
  return {
    id: Number(u.id),
    nombre: String(u.nombre ?? ''),
    correo: String(u.correo ?? ''),
    rol: ROLES.includes(u.rol) ? u.rol : 'CLIENTE',
  }
}

function leerSesion() {
  try {
    const guardado = localStorage.getItem(CLAVE_SESION)
    const token = localStorage.getItem(CLAVE_TOKEN)
    return guardado && token ? datosSesion(JSON.parse(guardado)) : null
  } catch {
    return null
  }
}

function textoError(error, porDefecto) {
  if (!error.response) return 'No se pudo conectar con el servidor'
  return mensajeError(error, porDefecto)
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerSesion)

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE_SESION)
    localStorage.removeItem(CLAVE_TOKEN)
    setUsuario(null)
  }

  useEffect(() => {
    const manejarExpiracion = () => cerrarSesion()
    window.addEventListener(EVENTO_SESION_EXPIRADA, manejarExpiracion)
    return () => window.removeEventListener(EVENTO_SESION_EXPIRADA, manejarExpiracion)
  }, [])

  const abrirSesion = (respuesta) => {
    const sesion = datosSesion(respuesta)
    localStorage.setItem(CLAVE_TOKEN, respuesta.token)
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
    setUsuario(sesion)
    return sesion
  }

  const iniciarSesion = async (correo, password) => {
    try {
      const respuesta = await autenticacionServicio.login(correo, password)
      return abrirSesion(respuesta)
    } catch (error) {
      throw new Error(textoError(error, 'Correo o contraseña incorrectos'))
    }
  }

  const registrar = async (datos) => {
    try {
      const respuesta = await autenticacionServicio.registro(datos)
      return abrirSesion(respuesta)
    } catch (error) {
      throw new Error(textoError(error, 'No se pudo crear la cuenta'))
    }
  }

  return (
    <SesionContexto.Provider value={{ usuario, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </SesionContexto.Provider>
  )
}

export function useSesion() {
  return useContext(SesionContexto)
}