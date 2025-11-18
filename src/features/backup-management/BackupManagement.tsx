import { useState, useRef } from 'react';
import './BackupManagement.css';

const BackupManagement = () => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportBackup = () => {
    // Abrir explorador de archivos
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowImportModal(true);
      
      // Simular proceso de importación
      setTimeout(() => {
        setShowImportModal(false);
        setSelectedFile(null);
        // Limpiar el input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 3000);
    }
  };

  const handleCreateBackup = () => {
    setShowCreateModal(true);
    // Simular proceso de creación
    setTimeout(() => {
      setShowCreateModal(false);
    }, 3000);
  };

  return (
    <div className="Backup-container">
      <div className="Backup-header">
        <h1 className="Backup-title">Respaldos</h1>
        <div className="Backup-actions">
          <button className="Backup-btn" onClick={handleImportBackup}>Importar Respaldo</button>
          <button className="Backup-btn" onClick={handleCreateBackup}>Crear Respaldo</button>
          {/* Input de archivo oculto */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelected}
            accept=".zip,.tar.gz,.sql,.bak"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    <div className='Backup-table-container'>
    <table className="Backup-table">
      <thead>
        <tr>
          <th>Fecha respaldo</th>
          <th>Tipo de respaldo</th>
          <th>Tamaño</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: 50 }).map((_, idx) => (
          <tr key={idx}>
            <td>10-01-2025</td>
            <td>Noticias</td>
            <td>500 MB</td>
            <td>
              <button className="link">Eliminar</button> /{" "}
              <button className="link">Restaurar</button> /{" "}
              <button className="link">Descargar</button>
            </td>
          </tr>
        ))}
      </tbody>
      </table>
    </div>

    {/* Modal para Importar Respaldo */}
    {showImportModal && (
      <div className="backup-modal-overlay">
        <div className="backup-modal-content">
          <div className="backup-modal-header">
            <h3>Importando Respaldo</h3>
          </div>
          <div className="backup-modal-body">
            <div className="backup-loading-spinner"></div>
            {selectedFile && (
              <div className="backup-file-info">
                <p><strong>Archivo:</strong> {selectedFile.name}</p>
                <p><strong>Tamaño:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            )}
            <p>Procesando archivo de respaldo...</p>
            <p>Este proceso puede tomar unos momentos.</p>
          </div>
          <div className="backup-modal-success">
            ✅ Respaldo importado exitosamente
          </div>
        </div>
      </div>
    )}

    {/* Modal para Crear Respaldo */}
    {showCreateModal && (
      <div className="backup-modal-overlay">
        <div className="backup-modal-content">
          <div className="backup-modal-header">
            <h3>Creando Respaldo</h3>
          </div>
          <div className="backup-modal-body">
            <div className="backup-loading-spinner"></div>
            <p>Generando respaldo de la base de datos...</p>
            <p>Comprimiendo archivos...</p>
          </div>
          <div className="backup-modal-success">
            ✅ Respaldo creado exitosamente
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default BackupManagement;