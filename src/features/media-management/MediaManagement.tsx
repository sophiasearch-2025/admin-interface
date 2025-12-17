import { useState, useEffect } from "react";
import "./MediaManegment.css";
import { getNewsMetrics } from "../../services/metrics";
import type { NewsMetrics } from "../../services/metrics";

interface MediaInfo {
  nombre: string;
  url: string;
  pais: string;
  categoria: string;
  descripcion: string;
  totalCategorias?: number;
  urlsEncontradas?: number;
  noticiasExitosas?: number;
  noticiasFallidas?: number;
  tasaExito?: number;
  velocidadCrawler?: number;
  velocidadScraper?: number;
}

const MediaManagement = () => {
  // Base de datos estática de información de medios
  const mediaInfoDatabase: Record<string, { url: string; pais: string; categoria: string; descripcion: string }> = {
    'biobiochile': {
      url: 'https://www.biobiochile.cl',
      pais: 'Chile',
      categoria: 'General',
      descripcion: 'Medio digital chileno de noticias generales'
    },
    'latercera': {
      url: 'https://www.latercera.com',
      pais: 'Chile',
      categoria: 'General',
      descripcion: 'Periódico chileno de actualidad'
    },
    'emol': {
      url: 'https://www.emol.com',
      pais: 'Chile',
      categoria: 'General',
      descripcion: 'El Mercurio Online, principal medio digital de Chile'
    },
    'elmercurio': {
      url: 'https://www.elmercurio.com',
      pais: 'Chile',
      categoria: 'General',
      descripcion: 'Diario chileno tradicional'
    },
    'cnnchile': {
      url: 'https://www.cnnchile.com',
      pais: 'Chile',
      categoria: 'Televisión',
      descripcion: 'Canal de noticias chileno'
    },
    'cooperativa': {
      url: 'https://www.cooperativa.cl',
      pais: 'Chile',
      categoria: 'Radio',
      descripcion: 'Radio y medio digital chileno'
    },
    'elpais': {
      url: 'https://elpais.com',
      pais: 'España',
      categoria: 'General',
      descripcion: 'Diario español de información general'
    },
    'bbc': {
      url: 'https://www.bbc.com',
      pais: 'Reino Unido',
      categoria: 'Internacional',
      descripcion: 'Servicio de noticias de la BBC'
    },
    'cnn': {
      url: 'https://www.cnn.com',
      pais: 'Estados Unidos',
      categoria: 'Televisión',
      descripcion: 'Canal de noticias 24 horas'
    },
    'clarin': {
      url: 'https://www.clarin.com',
      pais: 'Argentina',
      categoria: 'General',
      descripcion: 'Principal diario de Argentina'
    },
    'lanacion': {
      url: 'https://www.lanacion.com.ar',
      pais: 'Argentina',
      categoria: 'General',
      descripcion: 'Diario argentino tradicional'
    },
    'eltiempo': {
      url: 'https://www.eltiempo.com',
      pais: 'Colombia',
      categoria: 'General',
      descripcion: 'Periódico colombiano líder'
    },
    'elperu': {
      url: 'https://elcomercio.pe',
      pais: 'Perú',
      categoria: 'General',
      descripcion: 'Principal diario peruano'
    }
  };

  const [mediaSamples, setMediaSamples] = useState<MediaInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Función para cargar métricas de medios desde la API
  const loadMediaMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getNewsMetrics();
      
      if (response.success && response.data) {
        const newsData = response.data as NewsMetrics;
        const mediaList: MediaInfo[] = [];
        
        // Obtener todos los sitios únicos desde crawler y scraper
        const crawlerSites = newsData.crawler_metrics ? Object.keys(newsData.crawler_metrics) : [];
        const scraperSites = newsData.scraper_metrics ? Object.keys(newsData.scraper_metrics) : [];
        const allSites = [...new Set([...crawlerSites, ...scraperSites])];
        
        // Construir información de cada medio desde la API
        allSites.forEach(siteName => {
          const crawlerData = newsData.crawler_metrics?.[siteName];
          const scraperData = newsData.scraper_metrics?.[siteName];
          
          // Buscar información estática del medio (case-insensitive)
          const siteKey = siteName.toLowerCase().replace(/\s+/g, '');
          const staticInfo = mediaInfoDatabase[siteKey] || {
            url: '-',
            pais: '-',
            categoria: '-',
            descripcion: '-'
          };
          
          mediaList.push({
            nombre: siteName,
            ...staticInfo,
            totalCategorias: crawlerData?.total_categorias,
            urlsEncontradas: crawlerData?.total_urls_encontradas,
            noticiasExitosas: scraperData?.scrape_exitosos,
            noticiasFallidas: scraperData?.scrape_fallidos,
            tasaExito: scraperData?.porcentaje_exito,
            velocidadCrawler: crawlerData?.urls_por_minuto,
            velocidadScraper: scraperData?.noticias_por_minuto,
          });
        });
        
        setMediaSamples(mediaList);
        setLastUpdate(new Date());
      } else {
        setError(response.error || 'Error al obtener métricas');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      console.error('Error cargando métricas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadMediaMetrics();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadMediaMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="media-container">
      <div className="media-header"> 
        <h1 className="media-title">Medios de Prensa</h1>
        <div className="media-actions">
          <button 
            className="media-btn" 
            onClick={loadMediaMetrics}
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </button>
          {lastUpdate && (
            <span className="last-update">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      <div className="media-table-container">
        <table className="media-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>URL</th>
              <th>País</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Categorías</th>
            </tr>
          </thead>
          <tbody>
            {loading && mediaSamples.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  Cargando métricas...
                </td>
              </tr>
            ) : mediaSamples.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                  No hay medios configurados
                </td>
              </tr>
            ) : (
              mediaSamples.map((medio, idx) => (
                <tr key={idx}>
                  <td><strong>{medio.nombre}</strong></td>
                  <td>{medio.url !== '-' ? <a href={medio.url} target="_blank" rel="noopener noreferrer">{medio.url}</a> : '-'}</td>
                  <td>{medio.pais}</td>
                  <td>{medio.categoria}</td>
                  <td>{medio.descripcion}</td>
                  <td>{medio.totalCategorias ?? '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MediaManagement;