
import { createContext, useContext, useState } from 'react'
import { autenticar, crearUsuario } from '../datos/usuariosdb'

const SesionContexto = createContext(null)
const CLAVE = 'dds_sesion'

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : null
  })

  const iniciarSesion = (correo, password) => {
    const encontrado = autenticar(correo, password)
    if (!encontrado) return false
    localStorage.setItem(CLAVE, JSON.stringify(encontrado))
    setUsuario(encontrado)
    return true
  }

  const registrar = (datos) => {
    const nuevo = crearUsuario(datos)
    localStorage.setItem(CLAVE, JSON.stringify(nuevo))
    setUsuario(nuevo)
    return nuevo
  }

  const cerrarSesion = () => {
    localStorage.removeItem(CLAVE)
    setUsuario(null)
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