// Funciones específicas para manejar suscripciones
import { apiGet, apiDelete, apiPost } from './api';
import { ENDPOINTS } from '../config/api';

// Tipos de datos basados en la respuesta real de la API
export interface Subscription {
  id: string;
  userId?: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  plan?: string;
  description?: string;
  price?: number;
  status?: string;
  currentPeriodStart?: {
    _seconds: number;
    _nanoseconds: number;
  };
  currentPeriodEnd?: {
    _seconds: number;
    _nanoseconds: number;
  };
  cancelAtPeriodEnd?: boolean;
  metadata?: any;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

// Función para obtener todas las suscripciones
export async function getAllSubscriptions(): Promise<Subscription[]> {
  try {
    console.log('Obteniendo lista de suscripciones...');
    
    // Hacer petición GET al endpoint SUBSCRIPTIONS_LIST
    const data = await apiGet(ENDPOINTS.SUBSCRIPTIONS_LIST);
    
    console.log('🔍 DEBUG - Respuesta completa de la API:', data);
    console.log('🔍 DEBUG - Tipo de datos:', typeof data);
    console.log('🔍 DEBUG - Es array?:', Array.isArray(data));
    console.log('🔍 DEBUG - Claves del objeto:', Object.keys(data || {}));
    console.log('🔍 DEBUG - Tiene subscriptions?:', 'subscriptions' in (data || {}));
    
    // La API devuelve formato: { success: true, data: [...] }
    if (Array.isArray(data)) {
      console.log('✅ Data es array directo, length:', data.length);
      return data;
    } else if (data && data.success && Array.isArray(data.data)) {
      console.log('✅ Data tiene formato success/data, length:', data.data.length);
      return data.data;
    } else if (data && data.subscriptions) {
      console.log('✅ Data tiene propiedad subscriptions, length:', data.subscriptions.length);
      return data.subscriptions;
    } else {
      console.log('❌ Data no contiene suscripciones reconocibles');
      return [];
    }
    
  } catch (error) {
    console.error('Error al obtener suscripciones:', error);
    
    // Devolver array vacío en caso de error (para que no crashee la app)
    return [];
  }
}

// Función para probar la conexión con un health check
export async function testApiConnection(): Promise<boolean> {
  try {
    console.log('Probando conexión con la API...');
    
    const data = await apiGet(ENDPOINTS.HEALTH_CHECK);
    
    console.log('API disponible:', data);
    return true;
    
  } catch (error) {
    console.error('API no disponible:', error);
    return false;
  }
}

// Función para cancelar/suspender una suscripción
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    console.log('🔴 Cancelando suscripción:', subscriptionId);
    
    // Construir el endpoint con el ID
    const endpoint = ENDPOINTS.SUBSCRIPTIONS_DELETE.replace(':id', subscriptionId);
    console.log('🔴 Endpoint DELETE:', endpoint);
    
    // Hacer petición DELETE
    const data = await apiDelete(endpoint);
    
    console.log('🔴 Respuesta completa de DELETE:', JSON.stringify(data, null, 2));
    console.log('🔴 ¿Success?:', data.success);
    console.log('🔴 Data recibida:', data.data);
    
    return data.success === true;
    
  } catch (error) {
    console.error('❌ Error al cancelar suscripción:', error);
    return false;
  }
}

// Función para renovar/reactivar una suscripción
export async function renewSubscription(subscriptionId: string, duration: number = 30): Promise<boolean> {
  try {
    console.log('🟢 Renovando suscripción:', subscriptionId, 'por', duration, 'días');
    
    // Construir el endpoint con el ID
    const endpoint = ENDPOINTS.SUBSCRIPTIONS_RENEW.replace(':id', subscriptionId);
    console.log('🟢 Endpoint RENEW:', endpoint);
    
    // Hacer petición POST con la duración
    const data = await apiPost(endpoint, { duration });
    
    console.log('🟢 Respuesta completa de RENEW:', JSON.stringify(data, null, 2));
    console.log('🟢 ¿Success?:', data.success);
    console.log('🟢 Data recibida:', data.data);
    
    return data.success === true;
    
  } catch (error) {
    console.error('❌ Error al renovar suscripción:', error);
    return false;
  }
}

// Función para obtener una suscripción específica por ID (para verificar cambios)
export async function getSubscriptionById(subscriptionId: string): Promise<Subscription | null> {
  try {
    console.log('🔍 Obteniendo suscripción por ID:', subscriptionId);
    
    // Construir el endpoint con el ID
    const endpoint = ENDPOINTS.SUBSCRIPTIONS_GET.replace(':id', subscriptionId);
    
    // Hacer petición GET
    const data = await apiGet(endpoint);
    
    console.log('🔍 Suscripción obtenida:', data);
    
    if (data.success && data.data) {
      return data.data;
    }
    
    return null;
    
  } catch (error) {
    console.error('❌ Error al obtener suscripción:', error);
    return null;
  }
}