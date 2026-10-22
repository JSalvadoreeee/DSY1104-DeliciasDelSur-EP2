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