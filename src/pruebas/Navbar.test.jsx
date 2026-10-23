import { describe, test, expect } from 'vitest'
import { obtenerProductos, obtenerProductoPorId } from '../datos/productosdb'

describe('Pruebas del Catálogo y Productos', () => {
  test('5. Permite buscar y obtener un producto específico por su ID', () => {
    const producto = obtenerProductoPorId(1)
    expect(producto).toBeDefined()
    expect(producto.id).toBe(1)
  })

  test('6. Verifica que todos los productos tengan precio y nombre definidos', () => {
    const productos = obtenerProductos()
    productos.forEach((p) => {
      expect(p.nombre).toBeTruthy()
      expect(p.precio).toBeGreaterThan(0)
    })
  })
})