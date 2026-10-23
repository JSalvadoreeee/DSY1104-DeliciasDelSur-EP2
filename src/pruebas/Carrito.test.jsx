import { describe, test, expect } from 'vitest'

describe('Pruebas del Carrito de Compras', () => {
  test('7. Calcula correctamente el subtotal según cantidad y precio del producto', () => {
    const item = { precio: 2500, cantidad: 3 }
    const subtotal = item.precio * item.cantidad
    expect(subtotal).toBe(7500)
  })

  test('8. Aplica correctamente el porcentaje de descuento en ofertas', () => {
    const precioOriginal = 2500
    const descuentoPorcentaje = 20
    const precioFinal = precioOriginal * (1 - descuentoPorcentaje / 100)
    expect(precioFinal).toBe(2000)
  })
})