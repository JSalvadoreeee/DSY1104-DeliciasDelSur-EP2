// Carrito global: usa el precio con oferta, respeta el stock y se guarda al recargar la página
import { createContext, useContext, useEffect, useState } from 'react'

const CarritoContexto = createContext()
const CLAVE = 'dds_carrito'

export const useCarrito = () => useContext(CarritoContexto)

function sanitizarItem(item) {
  return {
    id: Number(item.id),
    nombre: String(item.nombre ?? ''),
    precio: Number(item.precio) || 0,
    precioFinal: item.precioFinal != null ? Number(item.precioFinal) : Number(item.precio) || 0,
    oferta: Number(item.oferta) || 0,
    imagen: String(item.imagen ?? ''),
    imagenUrl: String(item.imagenUrl ?? ''),
    stock: Number(item.stock) || 0,
    cantidad: Math.max(1, Number(item.cantidad) || 1),
  }
}

function leerCarrito() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    if (!guardado) return []
    const parsed = JSON.parse(guardado)
    return Array.isArray(parsed) ? parsed.map(sanitizarItem) : []
  } catch {
    return []
  }
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarrito)

  useEffect(() => {
    try {
      const seguro = carrito.map(sanitizarItem)
      localStorage.setItem(CLAVE, JSON.stringify(seguro))
    } catch {
      // sin almacenamiento disponible, el carrito solo dura la sesión
    }
  }, [carrito])

  const agregarAlCarrito = (producto) => {
    const limpio = sanitizarItem(producto)
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === limpio.id)
      if (existe) {
        if (existe.cantidad >= limpio.stock) return prev
        return prev.map((item) =>
          item.id === limpio.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      }
      if (limpio.stock < 1) return prev
      return [...prev, { ...limpio, cantidad: 1 }]
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