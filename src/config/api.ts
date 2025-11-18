// Configuración básica de las APIs
const SERVER_IP = '172.105.21.15';

export const API_CONFIG = {
  // Cambia estos puertos por los correctos de tu servidor
  USER_MANAGEMENT_PORT: 3000,
  
  // URLs completas
  USER_MANAGEMENT: `http://${SERVER_IP}:3000`,
  
  // Configuración de timeouts (en milisegundos)
  TIMEOUT: 10000, // 10 segundos por defecto
  TIMEOUT_LONG: 10000, // 10 segundos para operaciones largas
};

// Endpoints de las APIs
export const ENDPOINTS = {
  // Para user-management API (puerto 3000) - Maneja SUSCRIPCIONES
  HEALTH_CHECK: '/health',                          // GET: verificar estado de la API
  API_INFO: '/',                                    // GET: información de la API
  SUBSCRIPTIONS_LIST: '/api/subscriptions',         // GET: listar suscripciones
  SUBSCRIPTIONS_CREATE: '/api/subscriptions',       // POST: crear suscripción
  SUBSCRIPTIONS_GET: '/api/subscriptions/:id',      // GET: obtener suscripción por ID
  SUBSCRIPTIONS_RENEW: '/api/subscriptions/:id/renew', // POST: renovar suscripción
  SUBSCRIPTIONS_DELETE: '/api/subscriptions/:id',   // DELETE: cancelar suscripción
  SUBSCRIPTIONS_CHECK_EXPIRING: '/api/subscriptions/check-expiring', // POST: verificar expiración
  ADMIN_RUN_NOTIFICATIONS: '/api/admin/run-notifications', // POST: ejecutar notificaciones


};