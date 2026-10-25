// Pruebas unitarias
import {
  validarRun,
  validarCorreo,
  validarPassword,
  validarNombre,
  esNombreCiudad,
} from '../utilidades/validaciones'

describe('Validaciones', () => {
  it('acepta un RUN chileno válido', () => {
    expect(validarRun('12345678-5')).toBe(true)
  })

  it('rechaza un RUN con dígito verificador incorrecto', () => {
    expect(validarRun('12345678-0')).toBe(false)
  })

  it('valida el formato del correo', () => {
    expect(validarCorreo('usuario@deliciasdelsur.cl')).toBe(true)
    expect(validarCorreo('correo-invalido')).toBe(false)
  })

  it('exige una contraseña de al menos 8 caracteres', () => {
    expect(validarPassword('admin1234')).toBe(true)
    expect(validarPassword('123')).toBe(false)
  })

  it('exige un nombre de al menos 2 caracteres', () => {
    expect(validarNombre('Ana')).toBe(true)
    expect(validarNombre(' ')).toBe(false)
  })

  it('bloquea nombres que son ciudades y permite nombres completos', () => {
    expect(esNombreCiudad('Arica')).toBe(true)
    expect(esNombreCiudad('Santiago Perez')).toBe(false)
  })
})