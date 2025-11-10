// Función básica para hacer peticiones HTTP a la API de user-management
import { API_CONFIG } from '../config/api';

// Función principal para hacer peticiones
export async function makeApiRequest(endpoint: string, options: RequestInit = {}) {
  // Construir la URL completa
  const url = `${API_CONFIG.USER_MANAGEMENT}${endpoint}`;
  
  console.log('Haciendo petición a:', url); // Para debug
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

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