import './ScrapingConfig.css';
import { useState } from 'react';

type TabType = 'fuentes' | 'reglas' | 'programacion' | 'errores';

interface Fuente {
  id: number;
  nombre: string;
  url: string;
}

const mockRows = Array(60).fill("Información de error");

const ScrapingConfig = () => {
  const [activeTab, setActiveTab] = useState<TabType>('fuentes');
  const [fuentes, setFuentes] = useState<Fuente[]>([]);
  const [nombreFuente, setNombreFuente] = useState('');
  const [urlFuente, setUrlFuente] = useState('');
  const [nextId, setNextId] = useState(1);
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false);
  
  // Estados para programación
  const [frecuencia, setFrecuencia] = useState('');
  const [diaSeleccionado, setDiaSeleccionado] = useState('');
  const [horaEjecucion, setHoraEjecucion] = useState('');
  const [diaDelMes, setDiaDelMes] = useState('');
  const [scrapingIniciado, setScrapingIniciado] = useState(false);
  
  // Estados para archivo Python
  const [archivoPython, setArchivoPython] = useState<File | null>(null);
  const [codigoPython, setCodigoPython] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const agregarFuente = () => {
    if (nombreFuente.trim() && urlFuente.trim()) {
      const nuevaFuente: Fuente = {
        id: nextId,
        nombre: nombreFuente.trim(),
        url: urlFuente.trim()
      };
      setFuentes([...fuentes, nuevaFuente]);
      setNombreFuente('');
      setUrlFuente('');
      setNextId(nextId + 1);
    }
  };

  const eliminarFuente = (id: number) => {
    setFuentes(fuentes.filter(fuente => fuente.id !== id));
  };

  const iniciarScrapingManual = () => {
    setScrapingIniciado(true);
  };

  const confirmarScraping = () => {
    alert('Scraping iniciado manualmente');
    setScrapingIniciado(false);
  };

  const programarScraping = () => {
    let mensaje = `Scraping programado - Frecuencia: ${frecuencia}`;
    if (frecuencia === 'diario') {
      mensaje += `, Hora: ${horaEjecucion}`;
    } else if (frecuencia === 'semanal') {
      mensaje += `, Día: ${diaSeleccionado}, Hora: ${horaEjecucion}`;
    } else if (frecuencia === 'mensual') {
      mensaje += `, Día del mes: ${diaDelMes}, Hora: ${horaEjecucion}`;
    }
    alert(mensaje);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.py')) {
        setArchivoPython(file);
        
        // Leer el contenido del archivo
        const reader = new FileReader();
        reader.onload = (event) => {
          setCodigoPython(event.target?.result as string || '');
        };
        reader.readAsText(file);
      } else {
        alert('Por favor, selecciona solo archivos Python (.py)');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.py')) {
      setArchivoPython(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setCodigoPython(event.target?.result as string || '');
      };
      reader.readAsText(file);
    } else {
      alert('Por favor, selecciona un archivo Python (.py)');
    }
  };

  const limpiarArchivo = () => {
    setArchivoPython(null);
    setCodigoPython('');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'fuentes':
        return (
          <div className="tab-content">
            <h3>Gestión de Fuentes</h3>
            
            {/* Formulario para agregar nueva fuente */}
            <div className="add-source-section">
              <h4>Agregar Nueva Fuente</h4>
              <div className="sources-section">
                <div className="source-item">
                  <label>Nombre de la fuente:</label>
                  <input 
                    type="text" 
                    placeholder="Nombre descriptivo" 
                    className="input-field"
                    value={nombreFuente}
                    onChange={(e) => setNombreFuente(e.target.value)}
                  />
                </div>
                <div className="source-item">
                  <label>URL de la fuente:</label>
                  <input 
                    type="url" 
                    placeholder="https://ejemplo.com" 
                    className="input-field"
                    value={urlFuente}
                    onChange={(e) => setUrlFuente(e.target.value)}
                  />
                </div>
                <button 
                  className="btn-primary"
                  onClick={agregarFuente}
                  disabled={!nombreFuente.trim() || !urlFuente.trim()}
                >
                  Agregar Fuente
                </button>
              </div>
            </div>

            {/* Lista de fuentes existentes - Colapsable */}
            <div className="sources-list">
              <div 
                className="collapsible-header"
                onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
              >
                <h4>Fuentes Configuradas ({fuentes.length})</h4>
                <span className={`collapse-arrow ${isSourcesExpanded ? 'expanded' : ''}`}>
                  ▼
                </span>
              </div>
              
              {isSourcesExpanded && (
                <div className="collapsible-content">
                  {fuentes.length === 0 ? (
                    <p className="no-sources">No hay fuentes configuradas. Agrega una nueva fuente usando el formulario de arriba.</p>
                  ) : (
                    <div className="sources-grid">
                      {fuentes.map((fuente) => (
                        <div key={fuente.id} className="source-card">
                          <div className="source-info">
                            <h5 className="source-name">{fuente.nombre}</h5>
                            <p className="source-url">{fuente.url}</p>
                          </div>
                          <button 
                            className="btn-delete"
                            onClick={() => eliminarFuente(fuente.id)}
                            title="Eliminar fuente"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      case 'reglas':
        return (
          <div className="tab-content">
            <h3>Código Python de Extracción</h3>
            
            {/* Área de drag & drop */}
            <div 
              className={`drop-zone ${isDragging ? 'dragging' : ''} ${archivoPython ? 'has-file' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!archivoPython ? (
                <div className="drop-content">
                  <div className="drop-icon">🐍</div>
                  <h4>Arrastra tu archivo Python aquí</h4>
                  <p>o haz clic para seleccionar</p>
                  <input 
                    type="file" 
                    accept=".py"
                    onChange={handleFileInput}
                    className="file-input"
                    id="python-file"
                  />
                  <label htmlFor="python-file" className="file-label">
                    Seleccionar archivo .py
                  </label>
                  <div className="file-requirements">
                    <small>Solo archivos Python (.py) son permitidos</small>
                  </div>
                </div>
              ) : (
                <div className="file-info">
                  <div className="file-header">
                    <div className="file-details">
                      <span className="file-icon">📄</span>
                      <div>
                        <h5 className="file-name">{archivoPython.name}</h5>
                        <small className="file-size">{(archivoPython.size / 1024).toFixed(2)} KB</small>
                      </div>
                    </div>
                    <button 
                      className="btn-delete"
                      onClick={limpiarArchivo}
                      title="Eliminar archivo"
                    >
                      🗑️
                    </button>
                  </div>
                  
                  {/* Preview del código */}
                  <div className="code-preview">
                    <h6>Vista previa del código:</h6>
                    <pre className="code-content">
                      <code>{codigoPython}</code>
                    </pre>
                  </div>
                  
                  <button className="btn-primary">
                    Cargar Código Python
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      case 'programacion':
        return (
          <div className="tab-content">
            <h3>Programación de Scraping</h3>
            <div className="schedule-section">
              {/* Selección de frecuencia */}
              <div className="schedule-item">
                <label>Frecuencia:</label>
                <select 
                  className="select-field"
                  value={frecuencia}
                  onChange={(e) => {
                    setFrecuencia(e.target.value);
                    setDiaSeleccionado('');
                    setScrapingIniciado(false);
                  }}
                >
                  <option value="">Seleccionar frecuencia</option>
                  <option value="manual">Manual</option>
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>

              {/* Contenido condicional según la frecuencia */}
              {frecuencia === 'manual' && (
                <div className="manual-section">
                  {!scrapingIniciado ? (
                    <button 
                      className="btn-primary"
                      onClick={iniciarScrapingManual}
                    >
                      Iniciar Scraping
                    </button>
                  ) : (
                    <div className="confirm-section">
                      <p className="confirm-message">¿Confirmar inicio del scraping?</p>
                      <div className="button-group">
                        <button 
                          className="btn-primary"
                          onClick={confirmarScraping}
                        >
                          Confirmar Scraping
                        </button>
                        <button 
                          className="btn-secondary"
                          onClick={() => setScrapingIniciado(false)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {frecuencia === 'diario' && (
                <>
                  <div className="schedule-item">
                    <label>Hora de ejecución:</label>
                    <input 
                      type="time" 
                      className="input-field"
                      value={horaEjecucion}
                      onChange={(e) => setHoraEjecucion(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={programarScraping}
                    disabled={!horaEjecucion}
                  >
                    Programar Scraping Diario
                  </button>
                </>
              )}

              {frecuencia === 'semanal' && (
                <>
                  <div className="schedule-item">
                    <label>Día de la semana:</label>
                    <div className="radio-group">
                      {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day) => (
                        <label key={day} className="radio-item">
                          <input 
                            type="radio" 
                            name="diaSemanal"
                            value={day}
                            checked={diaSeleccionado === day}
                            onChange={(e) => setDiaSeleccionado(e.target.value)}
                          /> {day}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="schedule-item">
                    <label>Hora de ejecución:</label>
                    <input 
                      type="time" 
                      className="input-field"
                      value={horaEjecucion}
                      onChange={(e) => setHoraEjecucion(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={programarScraping}
                    disabled={!diaSeleccionado || !horaEjecucion}
                  >
                    Programar Scraping Semanal
                  </button>
                </>
              )}

              {frecuencia === 'mensual' && (
                <>
                  <div className="schedule-item">
                    <label>Día del mes:</label>
                    <select 
                      className="select-field"
                      value={diaDelMes}
                      onChange={(e) => setDiaDelMes(e.target.value)}
                    >
                      <option value="">Seleccionar día</option>
                      {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <div className="schedule-item">
                    <label>Hora de ejecución:</label>
                    <input 
                      type="time" 
                      className="input-field"
                      value={horaEjecucion}
                      onChange={(e) => setHoraEjecucion(e.target.value)}
                    />
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={programarScraping}
                    disabled={!diaDelMes || !horaEjecucion}
                  >
                    Programar Scraping Mensual
                  </button>
                </>
              )}
            </div>
          </div>
        );
        case 'errores':
        return (
          <div className="error-table-scroll">
              <table className="error-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                </tr>
                </thead>
                <tbody>
                  {mockRows.map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{row}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <div className="data-feature">
      <h1>Gestión de Scraping</h1>
      
      {/* Barra de pestañas */}
      <div className="tab-bar">
        <button 
          className={`tab-button ${activeTab === 'programacion' ? 'active' : ''}`}
          onClick={() => setActiveTab('programacion')}
        >
          Programacion
        </button>
        <button 
          className={`tab-button ${activeTab === 'fuentes' ? 'active' : ''}`}
          onClick={() => setActiveTab('fuentes')}
        >
          Fuentes
        </button>
        <button 
          className={`tab-button ${activeTab === 'reglas' ? 'active' : ''}`}
          onClick={() => setActiveTab('reglas')}
        >
          Script Python
        </button>
        <button 
          className={`tab-button ${activeTab === 'errores' ? 'active' : ''}`}
          onClick={() => setActiveTab('errores')}
        >
          Errores
        </button>
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="tab-container">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ScrapingConfig;