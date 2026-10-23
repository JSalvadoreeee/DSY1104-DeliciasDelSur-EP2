import { describe, test, expect } from 'vitest'
import {
  validarRun,
  validarNombre,
  validarCorreo,
  validarPassword,
} from '../utilidades/validaciones'

describe('Pruebas de Utilidades de Validación', () => {
  test('1. validarRun debe aceptar un RUN chileno válido', () => {
    expect(validarRun('12345678-5')).toBe(true)
  })

  test('2. validarRun debe rechazar un RUN chileno inválido', () => {
    expect(validarRun('11111111-9')).toBe(false)
  })

  test('3. validarCorreo debe verificar formato válido con @ y dominio', () => {
    expect(validarCorreo('usuario@deliciasdelsur.cl')).toBe(true)
    expect(validarCorreo('correo-invalido')).toBe(false)
  })

  test('4. validarPassword debe exigir un mínimo de 8 caracteres', () => {
    expect(validarPassword('admin1234')).toBe(true)
    expect(validarPassword('123')).toBe(false)
  })
})