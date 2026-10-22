
const BLOGS = [
  {
    id: 1,
    titulo: 'Cómo elaboramos nuestras conservas',
    fecha: '2026-10-01',
    resumen: 'Un recorrido por el proceso artesanal, desde la cosecha hasta el frasco.',
    contenido: [
      'Cada temporada seleccionamos frutas y verduras frescas de productores locales del sur de Chile.',
      'Después se lavan, se preparan y se envasan en lotes pequeños para cuidar la calidad.',
      'Antes de salir a la venta, cada lote pasa por controles de pH, acidez y humedad.',
    ],
  },
  {
    id: 2,
    titulo: 'Por qué importa el control de calidad',
    fecha: '2026-10-08',
    resumen: 'Cómo la trazabilidad por lote nos permite asegurar productos confiables.',
    contenido: [
      'Registrar cada lote nos permite saber qué materia prima se usó y cuándo se produjo.',
      'Si un parámetro sale fuera de rango, el lote se retiene y no llega a las tiendas.',
      'Esto reduce las devoluciones y protege a quienes consumen nuestros productos.',
    ],
  },
]

export function obtenerBlogs() {
  return BLOGS
}

export function obtenerBlogPorId(id) {
  return BLOGS.find((b) => b.id === Number(id))
}