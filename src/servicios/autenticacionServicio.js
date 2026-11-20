// Servicio de autenticación: login y registro contra /auth
import api from './api'

export const autenticacionServicio = {
  login: (correo, password) => api.post('/auth/login', { correo, password }).then((r) => r.data),
  registro: (datos) => api.post('/auth/registro', datos).then((r) => r.data),
}