// Carrito global: usa el precio con oferta, respeta el stock y persiste solo IDs y cantidades
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { productosServicio } from '../servicios/productosServicio'

const CarritoContexto = createContext()
const CLAVE = 'dds_carrito'

export const useCarrito = () => useContext(CarritoContexto)

function leerCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (!guardado) return []
    const parsed = JSON.parse(guardado)
    if (!Array.isArray(parsed)) return []
    return parsed
      .map((item) => ({
        id: Number(item.id) || 0,
        cantidad: Math.max(1, Number(item.cantidad) || 1),
      }))
      .filter((item) => item.id > 0)
  } catch {
    return []
  }
}

function hidratarItem(item, catalogo) {
  const prod = catalogo.find((p) => p.id === item.id)
  if (!prod || prod.stock < 1) return null
  return {
    ...prod,
    cantidad: Math.min(item.cantidad, prod.stock),
  }
}

function hidratarLista(prev, catalogo) {
  return prev.map((item) => hidratarItem(item, catalogo)).filter(Boolean)
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarrito)

  useEffect(() => {
    const pendientes = leerCarrito()
    if (pendientes.length === 0) return

    const cargarCatalogo = async () => {
      try {
        const catalogo = await productosServicio.listar()
        setCarrito((prev) => hidratarLista(prev, catalogo))
      } catch {
        // Sin conexión al recargar, el carrito queda vacío hasta que responda la API
      }
    }
    void cargarCatalogo()
  }, [])

  useEffect(() => {
    try {
      const resumen = carrito.map((item) => ({
        id: Number(item.id) || 0,
        cantidad: Math.max(1, Number(item.cantidad) || 1),
      }))
      localStorage.setItem(CLAVE, JSON.stringify(resumen))
    } catch {
      // sin almacenamiento disponible, el carrito solo dura la sesión
    }
  }, [carrito])

  const agregarAlCarrito = useCallback((producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id)
      if (existe) {
        if (existe.cantidad >= producto.stock) return prev
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      if (producto.stock < 1) return prev
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }, [])

  const eliminarDelCarrito = useCallback((id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const limpiarCarrito = useCallback(() => setCarrito([]), [])

  const carritoActivo = useMemo(
    () => carrito.filter((item) => Boolean(item.nombre)),
    [carrito]
  )

  const total = useMemo(
    () =>
      carritoActivo.reduce(
        (acc, item) => acc + (Number(item.precioFinal ?? item.precio) || 0) * item.cantidad,
        0
      ),
    [carritoActivo]
  )

  const cantidadTotal = useMemo(
    () => carritoActivo.reduce((acc, item) => acc + item.cantidad, 0),
    [carritoActivo]
  )

  const valor = useMemo(
    () => ({
      carrito: carritoActivo,
      agregarAlCarrito,
      eliminarDelCarrito,
      limpiarCarrito,
      total,
      cantidadTotal,
    }),
    [carritoActivo, agregarAlCarrito, eliminarDelCarrito, limpiarCarrito, total, cantidadTotal]
  )

  return (
    <CarritoContexto.Provider value={valor}>
      {children}
    </CarritoContexto.Provider>
  )
}