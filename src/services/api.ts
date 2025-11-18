// Función básica para hacer peticiones HTTP a la API de user-management
import { API_CONFIG } from '../config/api';

// Función principal para hacer peticiones
export async function makeApiRequest(endpoint: string, options: RequestInit = {}, timeout: number = API_CONFIG.TIMEOUT) {
  // Construir la URL completa
  const url = `${API_CONFIG.USER_MANAGEMENT}${endpoint}`;
  
  console.log('Haciendo petición a:', url); // Para debug
  
  // Crear AbortController para manejar timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal, // Agregar signal para timeout
      ...options,
    });

    // Limpiar el timeout si la petición fue exitosa
    clearTimeout(timeoutId);
    
    console.log('Respuesta recibida:', response.status, response.statusText);

    // Verificar si la petición fue exitosa
    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    // Intentar parsear la respuesta como JSON
    const data = await response.json();
    console.log('Datos recibidos:', data);
    
    return data;
  } catch (error) {
    // Limpiar el timeout en caso de error
    clearTimeout(timeoutId);
    
    // Verificar si es un error de timeout
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Timeout: La petición tardó más de ${timeout / 1000} segundos`);
    }
    
    console.error('Error en la petición:', error);
    throw error;
  }
}

// Funciones específicas para cada tipo de petición
export async function apiGet(endpoint: string) {
  return makeApiRequest(endpoint, { method: 'GET' });
}

export async function apiPost(endpoint: string, data?: any) {
  return makeApiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export async function apiDelete(endpoint: string) {
  return makeApiRequest(endpoint, { method: 'DELETE' });
}

export async function apiPatch(endpoint: string, data?: any) {
  return makeApiRequest(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });
}