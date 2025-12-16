// Servicio para manejar métricas del sistema
import { API_CONFIG, ENDPOINTS } from '../config/api';

// Tipos de datos para las métricas del sistema
export interface SystemMetrics {
  timestamp: string;
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network?: {
    bytesIn: number;
    bytesOut: number;
  };
  uptime?: number;
}

// Tipos para métricas de crawler y scraper
export interface CrawlerMetrics {
  [sitio: string]: {
    total_categorias: number;
    total_urls_encontradas: number;
    urls_por_categoria: number;
    duracion_segundos: number;
    urls_por_minuto: number;
  };
}

export interface ScraperMetrics {
  [sitio: string]: {
    total_urls_procesadas: number;
    scrape_exitosos: number;
    scrape_fallidos: number;
    porcentaje_exito: number;
    duracion_segundos: number;
    noticias_por_minuto: number;
    tiempo_promedio_scrape: number;
    publicaciones_por_fecha?: { [fecha: string]: number };
  };
}

export interface CrawlerProgress {
  sitio: string;
  status: string;
  total_categorias: number;
  categorias_procesadas: number;
  porcentaje: number;
  urls_encontradas: number;
}

export interface NewsMetrics {
  crawler_metrics?: CrawlerMetrics;
  scraper_metrics?: ScraperMetrics;
  crawler_progress?: CrawlerProgress;
}

export interface MetricsResponse {
  success: boolean;
  data?: SystemMetrics | NewsMetrics;
  message?: string;
  error?: string;
}

// Función principal para hacer peticiones a la API de métricas
async function makeMetricsRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_CONFIG.MEDIA_DATA_COLLECTOR}${endpoint}`;
  
  console.log('Haciendo petición a Métricas API:', url);
  
  // Crear AbortController para manejar timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
  
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);
    
    console.log('Respuesta de Métricas API:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Métricas recibidas:', data);
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Timeout: La petición tardó más de ${API_CONFIG.TIMEOUT / 1000} segundos`);
    }
    
    console.error('Error en petición a Métricas API:', error);
    throw error;
  }
}

// Obtener información básica de la API
export async function getMetricsApiInfo() {
  return makeMetricsRequest(ENDPOINTS.METRICS_ROOT, { method: 'GET' });
}

// Obtener métricas del sistema
export async function getSystemMetrics(): Promise<MetricsResponse> {
  try {
    const data = await makeMetricsRequest(ENDPOINTS.METRICS_GET, { method: 'GET' });
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// Obtener métricas de noticias (crawler y scraper)
export async function getNewsMetrics(): Promise<MetricsResponse> {
  try {
    const data = await makeMetricsRequest(ENDPOINTS.METRICS_GET, { method: 'GET' });
    return {
      success: true,
      data: data as NewsMetrics,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

// Verificar conexión con la API de métricas
export async function testMetricsApiConnection(): Promise<boolean> {
  try {
    await getMetricsApiInfo();
    console.log('✓ Conexión exitosa con Métricas API');
    return true;
  } catch (error) {
    console.error('✗ Error al conectar con Métricas API:', error);
    return false;
  }
}

// Calcular estadísticas agregadas de métricas de noticias
export function calculateNewsStats(metrics: NewsMetrics) {
  const stats = {
    totalUrlsEncontradas: 0,
    totalNoticiasProcesadas: 0,
    totalNoticiasExitosas: 0,
    tasaExitoPromedio: 0,
    sitiosActivos: 0,
    velocidadPromedioCrawler: 0,
    velocidadPromedioScraper: 0,
  };

  if (metrics.crawler_metrics) {
    const crawlers = Object.values(metrics.crawler_metrics);
    stats.sitiosActivos = crawlers.length;
    stats.totalUrlsEncontradas = crawlers.reduce((sum, c) => sum + c.total_urls_encontradas, 0);
    stats.velocidadPromedioCrawler = crawlers.reduce((sum, c) => sum + c.urls_por_minuto, 0) / crawlers.length;
  }

  if (metrics.scraper_metrics) {
    const scrapers = Object.values(metrics.scraper_metrics);
    stats.totalNoticiasProcesadas = scrapers.reduce((sum, s) => sum + s.total_urls_procesadas, 0);
    stats.totalNoticiasExitosas = scrapers.reduce((sum, s) => sum + s.scrape_exitosos, 0);
    stats.tasaExitoPromedio = scrapers.reduce((sum, s) => sum + s.porcentaje_exito, 0) / scrapers.length;
    stats.velocidadPromedioScraper = scrapers.reduce((sum, s) => sum + s.noticias_por_minuto, 0) / scrapers.length;
  }

  return stats;
}
