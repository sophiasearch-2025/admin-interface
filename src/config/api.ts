// Configuración básica de las APIs
const SERVER_IP = '172.105.21.15';
const IS_DEVELOPMENT = import.meta.env.DEV;

export const API_CONFIG = {
  // Puertos de los servicios
  USER_MANAGEMENT_PORT: 3000,
  MEDIA_DATA_COLLECTOR_PORT: 3010,
  
  // URLs completas
  // En desarrollo usa proxy local para evitar CORS
  // En producción usa la URL directa del servidor
  USER_MANAGEMENT: IS_DEVELOPMENT 
    ? '/api/user-management' 
    : `http://${SERVER_IP}:3000`,
  MEDIA_DATA_COLLECTOR: IS_DEVELOPMENT 
    ? '' // Usar ruta relativa para aprovechar el proxy
    : `http://${SERVER_IP}:3010`,
  
  // Configuración de timeouts (en milisegundos)
  TIMEOUT: 30000, // 30 segundos por defecto
  TIMEOUT_LONG: 60000, // 1 minuto para operaciones largas
};

// Endpoints de las APIs
export const ENDPOINTS = {
  // USER-MANAGEMENT API (puerto 3000) - Maneja SUSCRIPCIONES
  HEALTH_CHECK: '/health',                          // GET: verificar estado de la API
  API_INFO: '/',                                    // GET: información de la API
  SUBSCRIPTIONS_LIST: '/api/subscriptions',         // GET: listar suscripciones
  SUBSCRIPTIONS_CREATE: '/api/subscriptions',       // POST: crear suscripción
  SUBSCRIPTIONS_GET: '/api/subscriptions/:id',      // GET: obtener suscripción por ID
  SUBSCRIPTIONS_RENEW: '/api/subscriptions/:id/renew', // POST: renovar suscripción
  SUBSCRIPTIONS_DELETE: '/api/subscriptions/:id',   // DELETE: cancelar suscripción
  SUBSCRIPTIONS_CHECK_EXPIRING: '/api/subscriptions/check-expiring', // POST: verificar expiración
  ADMIN_RUN_NOTIFICATIONS: '/api/admin/run-notifications', // POST: ejecutar notificaciones

  // METRICS API (puerto 3010) - API Métricas Sophia
  METRICS_ROOT: '/',                                // GET: información básica de la API
  METRICS_GET: '/api/metrics/',                     // GET: obtener métricas del sistema
};