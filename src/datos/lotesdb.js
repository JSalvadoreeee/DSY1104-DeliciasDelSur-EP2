
export const PARAMETROS = {
  pH: { min: 3.0, max: 4.6, unidad: '' },
  Brix: { min: 55, max: 68, unidad: '°Bx' },
  Acidez: { min: 0.5, max: 1.5, unidad: '%' },
  Humedad: { min: 0, max: 25, unidad: '%' },
  Microbiología: { min: 0, max: 100, unidad: 'UFC/g' },
}

export const ESTADOS = ['Conforme', 'No conforme', 'En revisión']

let lotes = [
  { id: 1, codigo: 'L-0001', productoId: 1, parametro: 'pH', valor: 3.8, estado: 'Conforme', fecha: '2026-10-10', observaciones: '' },
  { id: 2, codigo: 'L-0002', productoId: 3, parametro: 'pH', valor: 4.9, estado: 'No conforme', fecha: '2026-10-12', observaciones: 'pH sobre el máximo, se retiene el lote.' },
  { id: 3, codigo: 'L-0003', productoId: 4, parametro: 'Humedad', valor: 18, estado: 'Conforme', fecha: '2026-10-14', observaciones: '' },
  { id: 4, codigo: 'L-0004', productoId: 6, parametro: 'Humedad', valor: 28, estado: 'En revisión', fecha: '2026-10-15', observaciones: '' },
]

export const enRango = (parametro, valor) => {
  const p = PARAMETROS[parametro]
  return Boolean(p) && valor >= p.min && valor <= p.max
}

export const validarConformidad = ({ parametro, valor, estado, observaciones }) => {
  if (estado === 'Conforme' && !enRango(parametro, valor)) {
    return 'No se puede marcar Conforme: el valor está fuera del rango permitido'
  }
  if (estado === 'No conforme' && !String(observaciones || '').trim()) {
    return 'Las observaciones son obligatorias para un lote No conforme'
  }
  return ''
}

export const obtenerLotes = () => lotes

export const obtenerLotePorId = (id) => lotes.find((l) => l.id === parseInt(id))

export const crearLote = (datos) => {
  const error = validarConformidad(datos)
  if (error) throw new Error(error)

  const id = lotes.length ? Math.max(...lotes.map((l) => l.id)) + 1 : 1
  const nuevo = { ...datos, id, codigo: `L-${String(id).padStart(4, '0')}` }
  lotes.push(nuevo)
  return nuevo
}

export const actualizarLote = (id, cambios) => {
  const indice = lotes.findIndex((l) => l.id === parseInt(id))
  if (indice === -1) throw new Error('Lote no encontrado')

  const actualizado = { ...lotes[indice], ...cambios }
  const error = validarConformidad(actualizado)
  if (error) throw new Error(error)

  lotes[indice] = actualizado
  return actualizado
}

export const eliminarLote = (id) => {
  lotes = lotes.filter((l) => l.id !== parseInt(id))
}