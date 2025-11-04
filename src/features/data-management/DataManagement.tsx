import './DataManagement.css';
import { useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  errors: string[];
}

const DataManagement = () => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(true);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);
  
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
          <span className="toolbar-label">Estadísticas</span>
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
            title={rightSidebarCollapsed ? "Mostrar estadísticas" : "Ocultar estadísticas"}
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
                
                {selectedNews && (
                  <div className="error-indicators">
                    <span className="error-count">
                      {selectedNews.errors.length} error(es) detectado(s)
                    </span>
                    <div className="error-list">
                      {selectedNews.errors.map((error, index) => (
                        <span key={index} className="error-tag">
                          {error}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                          <span className="changes-text">✏️ Contenido modificado</span>
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
            <div className='sidebar-title-expanded'>Estadísticas</div>
          )}

          <div className='sidebar-content'>
            <div className="stats-grid">
              <div className="stat-item">
                <img src="src/features/data-management/data/grafico1.svg" alt="Gráfico 1" className="stat-image" />
              </div>
              
              <div className="stat-item">
                <img src="src/features/data-management/data/grafico2.svg" alt="Gráfico 2" className="stat-image" />
              </div>
              
              <div className="stat-item">
                <img src="src/features/data-management/data/grafico3.svg" alt="Gráfico 3" className="stat-image" />
              </div>
              
              <div className="stat-item">
                <img src="src/features/data-management/data/grafico4.svg" alt="Gráfico 4" className="stat-image" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DataManagement;