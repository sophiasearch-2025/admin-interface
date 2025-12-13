// Funciones específicas para manejar suscripciones
import { apiGet, apiPatch } from './api';
import { ENDPOINTS, API_CONFIG } from '../config/api';

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
// NOTE: Old cancelSubscription and renewSubscription helpers removed.
// Use `updateSubscription(id, { status: 'cancelled' })` or
// `updateSubscription(id, { status: 'active' })` instead.

// Función para actualizar (PATCH) una suscripción — útil para cambiar el `status` u otros campos
export async function updateSubscription(subscriptionId: string, updates: any): Promise<Subscription | null> {
  try {
    console.log('🔧 Actualizando suscripción (PATCH):', subscriptionId, updates);
    const endpoint = ENDPOINTS.SUBSCRIPTIONS_GET.replace(':id', subscriptionId);
    console.log('🔧 Endpoint PATCH:', endpoint);
    const data = await apiPatch(endpoint, updates);
    console.log('🔧 Respuesta PATCH:', JSON.stringify(data, null, 2));

    if (data && data.success && data.data) {
      return data.data as Subscription;
    }

    // Algunas implementaciones devuelven success + data.status, manejamos casos generales
    if (data && data.success && data.data === undefined) {
      return null;
    }

    return null;
  } catch (error) {
    console.error('❌ Error al actualizar suscripción:', error);
    return null;
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

// Función para crear una nueva suscripción
export interface CreateSubscriptionData {
  userId: string;
  planId: string;
  userEmail: string;
  userName?: string;
  planName?: string;
  precio?: number;
}

export async function createSubscription(data: CreateSubscriptionData): Promise<Subscription | null> {
  try {
    const url = `${API_CONFIG.USER_MANAGEMENT}${ENDPOINTS.SUBSCRIPTIONS_CREATE}`;
    console.log('➕ Creando nueva suscripción...');
    console.log('📍 URL completa:', url);
    console.log('📦 Datos a enviar:', JSON.stringify(data, null, 2));
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('📡 Status de respuesta:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
      console.error('❌ Error del servidor:', errorData);
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Respuesta completa del servidor:', JSON.stringify(result, null, 2));

    if (result && result.success && result.data) {
      console.log('✅ Suscripción creada con ID:', result.data.id || result.data.subscriptionId);
      return result.data;
    }

    console.warn('⚠️ Respuesta exitosa pero sin data:', result);
    return null;
  } catch (error) {
    console.error('❌ Error al crear suscripción:', error);
    throw error;
  }
}