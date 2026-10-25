// Pruebas unitarias del CRUD de lotes de calidad
import {
  obtenerLotes,
  obtenerLotePorId,
  crearLote,
  actualizarLote,
  eliminarLote,
} from '../datos/lotesdb'

const loteValido = {
  productoId: 1,
  parametro: 'pH',
  valor: 3.8,
  estado: 'Conforme',
  fecha: '2026-10-25',
  observaciones: '',
}

describe('CRUD de lotes', () => {
  it('carga los lotes iniciales y busca uno por id', () => {
    expect(obtenerLotes().length).toBeGreaterThan(0)
    expect(obtenerLotePorId(1).codigo).toBe('L-0001')
  })

  it('crea un lote con código automático y luego lo elimina', () => {
    const nuevo = crearLote(loteValido)
    expect(nuevo.codigo).toMatch(/^L-\d{4}$/)
    expect(obtenerLotePorId(nuevo.id)).toBeDefined()

    eliminarLote(nuevo.id)
    expect(obtenerLotePorId(nuevo.id)).toBeUndefined()
  })

  it('no crea un lote Conforme con el valor fuera de rango', () => {
    expect(() => crearLote({ ...loteValido, valor: 9 })).toThrowError(/fuera del rango/)
  })

  it('actualiza el estado de un lote en revisión', () => {
    const nuevo = crearLote({ ...loteValido, estado: 'En revisión' })
    const actualizado = actualizarLote(nuevo.id, { estado: 'Conforme' })
    expect(actualizado.estado).toBe('Conforme')
    eliminarLote(nuevo.id)
  })

  it('no actualiza un lote a Conforme si el valor está fuera de rango', () => {
    const nuevo = crearLote({ ...loteValido, valor: 9, estado: 'En revisión' })
    expect(() => actualizarLote(nuevo.id, { estado: 'Conforme' })).toThrowError(/fuera del rango/)
    eliminarLote(nuevo.id)
  })

  it('lanza un error al actualizar un lote que no existe', () => {
    expect(() => actualizarLote(9999, { estado: 'Conforme' })).toThrowError('Lote no encontrado')
  })
})