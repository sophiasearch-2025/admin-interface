// Configuración básica de las APIs
const SERVER_IP = '172.105.21.15';
const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  // Cambia estos puertos por los correctos de tu servidor
  USER_MANAGEMENT_PORT: 3000,
  MEDIA_DATA_COLLECTOR_PORT: 3010,
  
  // URLs completas - en desarrollo usa proxy, en producción usa IP directa
  USER_MANAGEMENT: `http://${SERVER_IP}:3000`,
  MEDIA_DATA_COLLECTOR: isDevelopment ? '' : `http://${SERVER_IP}:3010`,
  
  // Configuración de timeouts (en milisegundos)
  TIMEOUT: 60000, // 60 segundos por defecto
  TIMEOUT_LONG: 120000, // 120 segundos para operaciones largas
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

  // Para media-data-collector API (puerto 3010) - Maneja MÉTRICAS
  METRICS_ROOT: '/api/metrics',                     // GET: información de la API de métricas
  METRICS_GET: '/api/metrics/',                     // GET: obtener métricas del sistema y noticias

};