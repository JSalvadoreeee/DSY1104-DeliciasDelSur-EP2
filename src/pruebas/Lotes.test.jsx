import { describe, test, expect } from 'vitest'
import { obtenerProductos } from '../datos/productosdb'

describe('Pruebas de Datos y Control de Calidad', () => {
  test('9. Carga la lista inicial de productos simulados correctamente', () => {
    const productos = obtenerProductos()
    expect(Array.isArray(productos)).toBe(true)
    expect(productos.length).toBeGreaterThan(0)
  })

  test('10. Guarda y recupera registros en localStorage sin alteración', () => {
    const lotePrueba = { id: 'L-999', producto: 'Mermelada Test', estado: 'Conforme' }
    localStorage.setItem('lote_test', JSON.stringify(lotePrueba))

    const guardado = JSON.parse(localStorage.getItem('lote_test'))
    expect(guardado.id).toBe('L-999')
    expect(guardado.estado).toBe('Conforme')

    localStorage.removeItem('lote_test')
  })
})