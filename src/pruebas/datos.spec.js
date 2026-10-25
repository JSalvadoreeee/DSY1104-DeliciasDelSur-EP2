// Pruebas unitarias del CRUD de productos
import {
  obtenerProductos,
  obtenerProductoPorId,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
} from '../datos/productosdb'
import { validarConformidad, enRango } from '../datos/lotesdb'

describe('CRUD de productos', () => {
  it('carga la lista inicial y busca un producto por id', () => {
    expect(obtenerProductos().length).toBeGreaterThan(0)
    expect(obtenerProductoPorId(1).codigo).toBe('PR001')
  })

  it('crea, actualiza y elimina un producto', () => {
    const nuevo = agregarProducto({
      codigo: 'PR900',
      nombre: 'Producto de prueba',
      precio: 1000,
      categoria: 'Conservas',
    })
    expect(obtenerProductoPorId(nuevo.id).nombre).toBe('Producto de prueba')

    actualizarProducto(nuevo.id, { precio: 1500 })
    expect(obtenerProductoPorId(nuevo.id).precio).toBe(1500)

    eliminarProducto(nuevo.id)
    expect(obtenerProductoPorId(nuevo.id)).toBeUndefined()
  })

  it('lanza un error al actualizar un producto que no existe', () => {
    expect(() => actualizarProducto(9999, { precio: 1 })).toThrowError('Producto no encontrado')
  })
})

describe('Reglas de calidad de lotes', () => {
  it('detecta si un valor está dentro del rango del parámetro', () => {
    expect(enRango('pH', 3.8)).toBe(true)
    expect(enRango('pH', 5.5)).toBe(false)
  })

  it('no permite marcar Conforme un lote fuera de rango', () => {
    const error = validarConformidad({ parametro: 'pH', valor: 5.5, estado: 'Conforme', observaciones: '' })
    expect(error).toContain('fuera del rango')
  })

  it('exige observaciones para un lote No conforme', () => {
    const error = validarConformidad({ parametro: 'pH', valor: 5.5, estado: 'No conforme', observaciones: '' })
    expect(error).toContain('observaciones')
  })
})