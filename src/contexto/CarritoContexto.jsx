// Carrito global: usa el precio con oferta, respeta el stock y se guarda al recargar la página
import { createContext, useContext, useEffect, useState } from 'react'

const CarritoContexto = createContext()
const CLAVE = 'dds_carrito'

export const useCarrito = () => useContext(CarritoContexto)

function sanitizarTexto(valor) {
  return String(valor ?? '').replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s.,\-()/]/g, '')
}

function sanitizarUrl(valor) {
  return String(valor ?? '').replace(/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/g, '')
}

function sanitizarItem(item) {
  const precio = Number(item.precio) || 0
  return {
    id: Number(item.id) || 0,
    nombre: sanitizarTexto(item.nombre),
    precio,
    precioFinal: item.precioFinal != null ? Number(item.precioFinal) || 0 : precio,
    oferta: Number(item.oferta) || 0,
    imagen: sanitizarUrl(item.imagen),
    imagenUrl: sanitizarUrl(item.imagenUrl),
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
      const limpio = carrito.map((item) => ({
        id: Number(item.id) || 0,
        nombre: sanitizarTexto(item.nombre),
        precio: Number(item.precio) || 0,
        precioFinal: item.precioFinal != null ? Number(item.precioFinal) || 0 : Number(item.precio) || 0,
        oferta: Number(item.oferta) || 0,
        imagen: sanitizarUrl(item.imagen),
        imagenUrl: sanitizarUrl(item.imagenUrl),
        stock: Number(item.stock) || 0,
        cantidad: Math.max(1, Number(item.cantidad) || 1),
      }))
      localStorage.setItem(CLAVE, JSON.stringify(limpio))
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