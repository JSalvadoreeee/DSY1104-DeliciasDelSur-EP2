// Carga productos y categorías desde la API con estado de carga y de error
import { useEffect, useState } from 'react'
import { productosServicio } from '../servicios/productosServicio'
import { categoriasServicio } from '../servicios/categoriasServicio'
import { mensajeError } from '../servicios/api'

export function useCatalogo() {
  const [datos, setDatos] = useState({ productos: [], categorias: [] })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([productosServicio.listar(), categoriasServicio.listar()])
      .then(([productos, categorias]) => setDatos({ productos, categorias }))
      .catch((e) =>
        setError(e.response ? mensajeError(e, 'No se pudo cargar el catálogo') : 'No se pudo conectar con el servidor')
      )
      .finally(() => setCargando(false))
  }, [])

  return { ...datos, cargando, error }
}