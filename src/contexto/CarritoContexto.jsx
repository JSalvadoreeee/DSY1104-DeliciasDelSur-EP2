// Carrito global: usa el precio con oferta, respeta el stock y se guarda al recargar la página
import { createContext, useContext, useEffect, useState } from 'react'

const CarritoContexto = createContext()
const CLAVE = 'dds_carrito'

export const useCarrito = () => useContext(CarritoContexto)

function leerCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarrito)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(carrito))
    } catch {
      // sin almacenamiento disponible, el carrito solo dura la sesión
    }
  }, [carrito])

  const agregarAlCarrito = (producto) => {
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
  }

  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id))
  }

  const limpiarCarrito = () => setCarrito([])

  const total = carrito.reduce((acc, item) => acc + (item.precioFinal ?? item.precio) * item.cantidad, 0)

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0)

  return (
    <CarritoContexto.Provider
      value={{ carrito, agregarAlCarrito, eliminarDelCarrito, limpiarCarrito, total, cantidadTotal }}
    >
      {children}
    </CarritoContexto.Provider>
  )
}