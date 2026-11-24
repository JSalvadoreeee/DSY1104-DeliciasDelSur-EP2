// Maneja un aviso temporal que se oculta solo después de unos segundos
import { useCallback, useEffect, useRef, useState } from 'react'

export function useAviso(duracion = 2500) {
  const [aviso, setAviso] = useState(null)
  const temporizador = useRef(null)

  const mostrar = useCallback(
    (texto, tipo = 'success') => {
      clearTimeout(temporizador.current)
      setAviso({ texto, tipo })
      temporizador.current = setTimeout(() => setAviso(null), duracion)
    },
    [duracion]
  )

  useEffect(() => () => clearTimeout(temporizador.current), [])

  return { aviso, mostrar }
}