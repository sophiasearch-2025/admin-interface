import './DataManagement.css';
import { useState, useEffect } from 'react';
import { getNewsMetrics, calculateNewsStats, type NewsMetrics } from '../../services/metrics';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  errors: string[];
}

const DataManagement = () => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  const [metrics, setMetrics] = useState<NewsMetrics | null>(null);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  
  // Cargar métricas al montar el componente
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      const response = await getNewsMetrics();
      if (response.success && response.data) {
        setMetrics(response.data as NewsMetrics);
      }
      setLoadingMetrics(false);
    };
    
    fetchMetrics();
    // Actualizar métricas cada 30 segundos
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Noticias con errores hardcodeadas
  const [newsWithErrors] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Noticia sobre tecnología con errores",
      content: "Esta es una noticia que tiene algunos errores de redacción y necesita ser corregida antes de su publicación.",
      errors: ["Error de ortografía", "Falta información"]
    },
    {
      id: 2,
      title: "Actualización del mercado financiero",
      content: "Los mercados han mostrado volatilidad en las últimas semanas debido a factores económicos globales.",
      errors: ["Datos desactualizados", "Fuente no verificada"]
    },
    {
      id: 3,
      title: "Desarrollo en inteligencia artificial",
      content: "Nuevos avances en IA prometen revolucionar la industria tecnológica en los próximos años.",
      errors: ["Información incompleta"]
    }
  ]);

  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [editedContent, setEditedContent] = useState('');

  const handleNewsSelect = (newsId: string) => {
    const selected = newsWithErrors.find(news => news.id === parseInt(newsId));
    if (selected) {
      setSelectedNews(selected);
      setEditedContent(selected.content);
    }
  };

  const handleSaveChanges = () => {
    if (selectedNews) {
      // Aquí implementarías la lógica para guardar los cambios
      console.log('Guardando cambios para noticia:', selectedNews.id);
      console.log('Contenido editado:', editedContent);
      alert('Cambios guardados correctamente');
    }
  };

  return (
    <div className="data-feature">
      {/* Nueva barra superior con los botones de colapso */}
      <div className="toolbar">
        <div className="toolbar-section toolbar-section-left">
          <button 
            className='toolbar-button' 
            onClick={() => {
              if (leftSidebarCollapsed) {
                setRightSidebarCollapsed(true);
                setLeftSidebarCollapsed(false);
              } else {
                setLeftSidebarCollapsed(true);
              }
            }}
            title={leftSidebarCollapsed ? "Mostrar corrección de errores" : "Ocultar corrección de errores"}
          >
            {leftSidebarCollapsed ? '>' : '<'}
          </button>
          <span className="toolbar-label">Correcciones</span>
        </div>

        <div className="toolbar-center">
          <span>Gestor de datos</span>
        </div>

        <div className="toolbar-section toolbar-section-right">
          <span className="toolbar-label">Métricas</span>
          <button 
            className='toolbar-button' 
            onClick={() => {
              if (rightSidebarCollapsed) {
                setLeftSidebarCollapsed(true);
                setRightSidebarCollapsed(false);
              } else {
                setRightSidebarCollapsed(true);
              }
            }}
            title={rightSidebarCollapsed ? "Mostrar Métricas" : "Ocultar Métricas"}
          >
            {rightSidebarCollapsed ? '<' : '>'}
          </button>
        </div>
      </div>

      {/* Container principal */}
      <div className="main-content">
        <aside className={`sidebar-left ${leftSidebarCollapsed ? 'collapsed' : ''}`}>        
          {/* Solo mostrar título cuando NO esté colapsada */}
          {!leftSidebarCollapsed && (
            <div className='sidebar-title-expanded'>Corregir errores</div>
          )}
          
          <div className='sidebar-content'>
            <div className="error-correction-container">
              {/* Select de noticias con errores */}
              <div className="news-selector">
                <label htmlFor="news-select" className="selector-label">
                  Seleccionar noticia:
                </label>
                <select 
                  id="news-select"
                  className="news-select"
                  onChange={(e) => handleNewsSelect(e.target.value)}
                  value={selectedNews?.id || ''}
                >
                  <option value="">-- Selecciona una noticia --</option>
                  {newsWithErrors.map(news => (
                    <option key={news.id} value={news.id}>
                      {news.title}
                    </option>
                  ))}
                </select>
                
              </div>

              {/* Editor de contenido */}
              {selectedNews && (
                <div className="content-editor">
                  <div className="editor-header">
                    <h3>Editar contenido</h3>
                    <button 
                      className="save-button"
                      onClick={handleSaveChanges}
                    >
                      Guardar cambios
                    </button>
                  </div>
                  
                  <div className="editor-body">
                    <div className="unified-editor">
                      <label htmlFor="content-editor" className="content-label">
                        Contenido de la noticia:
                      </label>
                      <textarea
                        id="content-editor"
                        className="unified-textarea"
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder="Edita el contenido de la noticia aquí..."
                      />
                      
                      {/* Indicador de cambios */}
                      {editedContent !== selectedNews.content && (
                        <div className="changes-indicator">
                          <span className="changes-text"> Contenido modificado</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* existe para mantener el contenido central. NO TOCAR */}
        <div className="data-container">
          <h1></h1>
          <p></p>
        </div>

        <aside className={`sidebar-right ${rightSidebarCollapsed ? 'collapsed' : ''}`}>
          {/* Solo mostrar título cuando NO esté colapsada */}
          {!rightSidebarCollapsed && (
            <div className='sidebar-title-expanded'>Métricas</div>
          )}

          <div className='sidebar-content'>
            {loadingMetrics ? (
              <div className="metrics-loading">
                <div className="loading-spinner"></div>
                <p>Cargando métricas...</p>
              </div>
            ) : metrics ? (
              <div className="metrics-container">
                {/* Métricas de Crawler */}
                {metrics.crawler_metrics && (
                  <div className="metrics-section">
                    <h3 className="metrics-title"> Crawler</h3>
                    {Object.entries(metrics.crawler_metrics).map(([sitio, data]) => (
                      <div key={sitio} className="metric-card">
                        <h4 className="metric-site">{sitio}</h4>
                        <div className="metric-row">
                          <span className="metric-label">URLs encontradas:</span>
                          <span className="metric-value">{data.total_urls_encontradas.toLocaleString()}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Categorías:</span>
                          <span className="metric-value">{data.total_categorias}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Velocidad:</span>
                          <span className="metric-value">{data.urls_por_minuto.toFixed(2)} urls/min</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Duración:</span>
                          <span className="metric-value">{(data.duracion_segundos / 60).toFixed(1)} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Métricas de Scraper */}
                {metrics.scraper_metrics && (
                  <div className="metrics-section">
                    <h3 className="metrics-title"> Scraper</h3>
                    {Object.entries(metrics.scraper_metrics).map(([sitio, data]) => (
                      <div key={sitio} className="metric-card">
                        <h4 className="metric-site">{sitio}</h4>
                        <div className="metric-row">
                          <span className="metric-label">Procesadas:</span>
                          <span className="metric-value">{data.total_urls_procesadas.toLocaleString()}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Exitosas:</span>
                          <span className="metric-value success">{data.scrape_exitosos.toLocaleString()}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Fallidas:</span>
                          <span className="metric-value error">{data.scrape_fallidos}</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Tasa de éxito:</span>
                          <span className="metric-value success">{data.porcentaje_exito.toFixed(2)}%</span>
                        </div>
                        <div className="metric-row">
                          <span className="metric-label">Velocidad:</span>
                          <span className="metric-value">{data.noticias_por_minuto.toFixed(2)} noticias/min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Progreso del Crawler */}
                {metrics.crawler_progress && (
                  <div className="metrics-section">
                    <h3 className="metrics-title"> Progreso Actual</h3>
                    <div className="metric-card">
                      <h4 className="metric-site">{metrics.crawler_progress.sitio}</h4>
                      <div className="metric-row">
                        <span className="metric-label">Estado:</span>
                        <span className={`metric-status ${metrics.crawler_progress.status}`}>
                          {metrics.crawler_progress.status}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${metrics.crawler_progress.porcentaje}%`}}
                        ></div>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">Progreso:</span>
                        <span className="metric-value">
                          {metrics.crawler_progress.categorias_procesadas} / {metrics.crawler_progress.total_categorias}
                        </span>
                      </div>
                      <div className="metric-row">
                        <span className="metric-label">URLs encontradas:</span>
                        <span className="metric-value">{metrics.crawler_progress.urls_encontradas}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Resumen General */}
                {(metrics.crawler_metrics || metrics.scraper_metrics) && (
                  <div className="metrics-section">
                    <h3 className="metrics-title"> Resumen General</h3>
                    <div className="metric-card summary">
                      {(() => {
                        const stats = calculateNewsStats(metrics);
                        return (
                          <>
                            <div className="metric-row highlight">
                              <span className="metric-label">Total URLs:</span>
                              <span className="metric-value">{stats.totalUrlsEncontradas.toLocaleString()}</span>
                            </div>
                            <div className="metric-row highlight">
                              <span className="metric-label">Noticias procesadas:</span>
                              <span className="metric-value">{stats.totalNoticiasProcesadas.toLocaleString()}</span>
                            </div>
                            <div className="metric-row highlight">
                              <span className="metric-label">Tasa éxito promedio:</span>
                              <span className="metric-value success">{stats.tasaExitoPromedio.toFixed(2)}%</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="metrics-error">
                <p> No se pudieron cargar las métricas</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DataManagement;