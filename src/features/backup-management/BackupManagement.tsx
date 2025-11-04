import './BackupManagement.css';

const BackupManagement = () => {
  return (
    <div className="Backup-container">
      <div className="Backup-header">
        <h1 className="Backup-title">Respaldos</h1>
        <div className="Backup-actions">
          <button className="Backup-btn">Importar Respaldo</button>
          <button className="Backup-btn">Crear Respaldo</button>
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
    </div>
  );
};

export default BackupManagement;