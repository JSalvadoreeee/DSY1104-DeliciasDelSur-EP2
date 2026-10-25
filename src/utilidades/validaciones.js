// Validaciones reutilizables para los formularios
export function validarRun(run) {
  const limpio = String(run).replace(/[.\-\s]/g, '').toUpperCase()
  if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false

  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  let suma = 0
  let multiplo = 2

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }

  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dv === esperado
}

export function validarCorreo(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)
}

export function validarPassword(password) {
  return typeof password === 'string' && password.length >= 8
}

export function validarNombre(nombre) {
  return typeof nombre === 'string' && nombre.trim().length >= 2
}

// Lista de ciudades de Chile y metrópolis del mundo (en minúsculas)
const ciudadesMundo = new Set([
  // Chile
  'valparaíso', 'valparaiso', 'viña del mar', 'vina del mar', 'concepción', 'concepcion',
  'la serena', 'coquimbo', 'antofagasta', 'temuco', 'rancagua', 'talca', 'arica', 'iquique',
  'puerto montt', 'chillán', 'chillan', 'valdivia', 'osorno', 'copiapó', 'copiapo', 'curicó',
  'curico', 'punta arenas', 'calama', 'san fernando', 'quillota', 'san bernardo', 'puente alto',
  'linares', 'los ángeles', 'los angeles', 'melipilla', 'ovalle', 'vallenar', 'coyhaique',
  // América y Mundo
  'buenos aires', 'lima', 'bogota', 'bogotá', 'quito', 'caracas', 'montevideo', 'asuncion',
  'la paz', 'brasilia', 'rio de janeiro', 'sao paulo', 'mexico', 'méxico', 'miami',
  'new york', 'nueva york', 'los angeles', 'chicago', 'toronto', 'vancouver',
  'madrid', 'barcelona', 'paris', 'parís', 'londres', 'roma', 'berlin', 'lisboa',
  'tokio', 'tokyo', 'seul', 'sidney', 'dubai'
]);

export const esNombreCiudad = (nombre) => {
  if (!nombre) return false;
  
  const nombreLimpio = nombre.trim().toLowerCase();
  const palabras = nombreLimpio.split(/\s+/); // Separa el texto por espacios

  // Si el usuario ingresó 2 o más palabras (ej: "Santiago Pérez" o "María La Serena"),
  // se asume que es un nombre completo legítimo y SE PERMITE.
  if (palabras.length > 1) {
    // Excepción: Solo bloquea si las 2 palabras juntas forman una ciudad de dos palabras (ej: "Punta Arenas" o "Buenos Aires")
    return ciudadesMundo.has(nombreLimpio);
  }

  // Si es solo 1 palabra (ej: "Santiago", "Arica", "Madrid"), se bloquea si coincide con una ciudad.
  return ciudadesMundo.has(nombreLimpio);
};