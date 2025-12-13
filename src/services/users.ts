// Servicio para manejar usuarios
import { API_CONFIG } from '../config/api';

// Tipos de datos basados en la respuesta de la API /api/users
export interface User {
  id: string;
  uid: string;
  email: string;
  name?: string;
  username?: string;
  company?: string | null;
  estado: 'active' | 'suspended';
  stripeCustomerId?: string | null;
  role?: string;
  photoURL?: string | null;
  comprobanteUrl?: string | null;
  comprobanteInfo?: {
    filename: string;
    mimetype: string;
    size: number;
    uploadedAt: string;
  };
  solicitudAprobada?: boolean;
  createdAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedAt?: {
    _seconds: number;
    _nanoseconds: number;
  };
}

// Función para obtener todos los usuarios
export async function getAllUsers(): Promise<User[]> {
  try {
    console.log('📋 Obteniendo lista de usuarios...');
    
    const response = await fetch(`${API_CONFIG.USER_MANAGEMENT}/api/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Usuarios obtenidos:', data);

    // La API devuelve formato: { success: true, data: [...] }
    if (data && data.success && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    return [];
  }
}

// Función para actualizar el estado de un usuario (suspender/reactivar)
export async function updateUserStatus(userId: string, estado: 'active' | 'suspended'): Promise<User | null> {
  try {
    console.log(`🔄 Actualizando estado del usuario ${userId} a: ${estado}`);
    
    const response = await fetch(`${API_CONFIG.USER_MANAGEMENT}/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ estado }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error del servidor:', errorData);
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Estado actualizado:', data);

    // Retornar el usuario actualizado
    if (data && data.success && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error('❌ Error al actualizar estado:', error);
    throw error;
  }
}

// Función para obtener la URL del comprobante de un usuario
export function getComprobanteUrl(userId: string): string {
  return `${API_CONFIG.USER_MANAGEMENT}/api/users/${userId}/comprobante`;
}

// Función para obtener usuarios con solicitudes pendientes
export async function getPendingUsers(): Promise<User[]> {
  try {
    console.log('📋 Obteniendo usuarios pendientes...');
    
    const response = await fetch(`${API_CONFIG.USER_MANAGEMENT}/api/users/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Usuarios pendientes obtenidos:', data);

    if (data && data.success && Array.isArray(data.data)) {
      return data.data;
    } else if (Array.isArray(data)) {
      return data;
    }

    return [];
  } catch (error) {
    console.error('❌ Error al obtener usuarios pendientes:', error);
    return [];
  }
}

// Función para aprobar un usuario (cambia solicitudAprobada a true y envía email)
export async function approveUser(userId: string): Promise<User | null> {
  try {
    console.log(`✅ Aprobando usuario ${userId}...`);
    
    const response = await fetch(`${API_CONFIG.USER_MANAGEMENT}/api/users/${userId}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('📡 Status de respuesta al aprovar:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error del servidor:', errorData);
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Usuario aprobado exitosamente:', data);

    if (data && data.success && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error('❌ Error al aprobar usuario:', error);
    throw error;
  }
}

// Función para rechazar un usuario
export async function rejectUser(userId: string, motivo?: string): Promise<User | null> {
  try {
    console.log(`❌ Rechazando usuario ${userId}...`);
    
    const response = await fetch(`${API_CONFIG.USER_MANAGEMENT}/api/users/${userId}/reject`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: motivo ? JSON.stringify({ motivo }) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Error del servidor:', errorData);
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Usuario rechazado exitosamente:', data);

    if (data && data.success && data.data) {
      return data.data;
    }

    return null;
  } catch (error) {
    console.error('❌ Error al rechazar usuario:', error);
    throw error;
  }
}

// Función para probar la conexión con la API de usuarios
export async function testUsersApiConnection(): Promise<boolean> {
  try {
    console.log('🔌 Probando conexión con la API de usuarios...');
    
    const response = await fetch(`${API_CONFIG.USER_MANAGEMENT}/health`, {
      method: 'GET',
    });

    if (response.ok) {
      console.log('✅ API de usuarios disponible');
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ API de usuarios no disponible:', error);
    return false;
  }
}
