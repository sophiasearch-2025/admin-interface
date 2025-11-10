import { useState, useEffect } from 'react';
import './UserManagement.css';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  estado: 'activo' | 'suspendido';
  avatar?: string;
  boletaUrl?: string;
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'suspendido'>('todos');
  const [cargando, setCargando] = useState(true);
  const [boletaModal, setBoletaModal] = useState<{ visible: boolean; url: string; nombre: string }>({
    visible: false,
    url: '',
    nombre: ''
  });

  // Simulación de datos de usuarios (en producción vendría de una API)
  const usuariosMock: Usuario[] = [
    { id: 1, nombre: 'Ana García', email: 'ana.garcia@email.com', estado: 'activo', boletaUrl: '/boletas/ana_garcia.png' },
    { id: 2, nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', estado: 'activo', boletaUrl: '/boletas/carlos_rodriguez.png' },
    { id: 3, nombre: 'María López', email: 'maria.lopez@email.com', estado: 'suspendido', boletaUrl: '/boletas/maria_lopez.png' },
    { id: 4, nombre: 'Juan Pérez', email: 'juan.perez@email.com', estado: 'activo', boletaUrl: '/boletas/juan_perez.png' },
    { id: 5, nombre: 'Sofia Martínez', email: 'sofia.martinez@email.com', estado: 'activo', boletaUrl: '/boletas/sofia_martinez.png' },
    { id: 6, nombre: 'Diego Fernández', email: 'diego.fernandez@email.com', estado: 'suspendido', boletaUrl: '/boletas/diego_fernandez.png' },
    { id: 7, nombre: 'Laura Castro', email: 'laura.castro@email.com', estado: 'activo', boletaUrl: '/boletas/laura_castro.png' },
    { id: 8, nombre: 'Roberto Silva', email: 'roberto.silva@email.com', estado: 'activo', boletaUrl: '/boletas/roberto_silva.png' },
    { id: 9, nombre: 'Carmen Jiménez', email: 'carmen.jimenez@email.com', estado: 'activo', boletaUrl: '/boletas/carmen_jimenez.png' },
    { id: 10, nombre: 'Pedro Morales', email: 'pedro.morales@email.com', estado: 'suspendido', boletaUrl: '/boletas/pedro_morales.png' },
    { id: 11, nombre: 'Isabel Torres', email: 'isabel.torres@email.com', estado: 'activo', boletaUrl: '/boletas/isabel_torres.png' },
    { id: 12, nombre: 'Miguel Herrera', email: 'miguel.herrera@email.com', estado: 'activo', boletaUrl: '/boletas/miguel_herrera.png' }
  ];

  // Simulación de carga de datos desde API
  useEffect(() => {
    const cargarUsuarios = async () => {
      setCargando(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En producción sería algo como:
      // const response = await fetch('/api/usuarios');
      // const data = await response.json();
      
      setUsuarios(usuariosMock);
      setUsuariosFiltrados(usuariosMock);
      setCargando(false);
    };

    cargarUsuarios();
  }, []);

  // Filtrar usuarios basado en la búsqueda y el estado
  useEffect(() => {
    let filtrados = usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Aplicar filtro de estado
    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(usuario => usuario.estado === filtroEstado);
    }

    setUsuariosFiltrados(filtrados);
  }, [busqueda, filtroEstado, usuarios]);

  const verLogs = (usuario: Usuario) => {
    alert(`Ver logs de ${usuario.nombre}`);
    // Aquí abrir modal o navegar a página de logs
  };

  const verBoleta = (usuario: Usuario) => {
    if (usuario.boletaUrl) {
      setBoletaModal({
        visible: true,
        url: usuario.boletaUrl,
        nombre: usuario.nombre
      });
    } else {
      alert(`No hay boleta disponible para ${usuario.nombre}`);
    }
  };

  const cerrarModal = () => {
    setBoletaModal({
      visible: false,
      url: '',
      nombre: ''
    });
  };

  const cambiarEstadoUsuario = (id: number) => {
    const usuariosActualizados = usuarios.map(usuario => {
      if (usuario.id === id) {
        const nuevoEstado: 'activo' | 'suspendido' = usuario.estado === 'activo' ? 'suspendido' : 'activo';
        const accion = nuevoEstado === 'suspendido' ? 'suspendida' : 'reactivada';
        
        alert(`Cuenta ${accion} exitosamente para ${usuario.nombre}`);
        
        return { ...usuario, estado: nuevoEstado };
      }
      return usuario;
    });
    
    setUsuarios(usuariosActualizados);
  };

  const getIniciales = (nombre: string) => {
    return nombre
      .split(' ')
      .map(palabra => palabra[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-management">
      <h1>Gestión de Usuarios</h1>
      
      {/* Barra de búsqueda fija */}
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar usuarios por nombre o email..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Filtros de estado */}
      <div className="filter-bar">
        <label className="filter-label">Filtrar por estado:</label>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filtroEstado === 'todos' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('todos')}
          >
            Todos ({usuarios.length})
          </button>
          <button
            className={`filter-btn ${filtroEstado === 'activo' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('activo')}
          >
            Activos ({usuarios.filter(u => u.estado === 'activo').length})
          </button>
          <button
            className={`filter-btn ${filtroEstado === 'suspendido' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('suspendido')}
          >
            Suspendidos ({usuarios.filter(u => u.estado === 'suspendido').length})
          </button>
        </div>
      </div>

      {/* Contenedor de usuarios con scroll */}
      <div className="users-container">
        {cargando ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            Cargando usuarios...
          </div>
        ) : usuariosFiltrados.length === 0 ? (
          <div className="no-users">
            {busqueda ? 'No se encontraron usuarios que coincidan con la búsqueda.' : 'No hay usuarios registrados.'}
          </div>
        ) : (
          <div className="users-grid">
            {usuariosFiltrados.map((usuario) => (
              <div key={usuario.id} className="user-card">
                {/* Avatar */}
                <div className="user-avatar">
                  {getIniciales(usuario.nombre)}
                </div>
                
                {/* Nombre del usuario */}
                <h3 className="user-name">{usuario.nombre}</h3>
                <p className="user-email">{usuario.email}</p>
                
                {/* Botones de acción */}
                <div className="user-actions">
                  <button 
                    className="btn-logs"
                    onClick={() => verLogs(usuario)}
                  >
                    📋 Logs
                  </button>
                  <button 
                    className="btn-boleta"
                    onClick={() => verBoleta(usuario)}
                  >
                    🎫 Ver Boleta
                  </button>
                  <button 
                    className={usuario.estado === 'activo' ? 'btn-suspend' : 'btn-reactivate'}
                    onClick={() => cambiarEstadoUsuario(usuario.id)}
                  >
                    {usuario.estado === 'activo' ? '⛔ Suspender' : '✅ Reactivar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para mostrar la boleta */}
      {boletaModal.visible && (
        <div className="boleta-modal-overlay" onClick={cerrarModal}>
          <div className="boleta-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="boleta-modal-header">
              <h2>Boleta de {boletaModal.nombre}</h2>
              <button className="btn-close-modal" onClick={cerrarModal}>
                ✕
              </button>
            </div>
            <div className="boleta-modal-body">
              <img 
                src={boletaModal.url} 
                alt={`Boleta de ${boletaModal.nombre}`}
                className="boleta-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;