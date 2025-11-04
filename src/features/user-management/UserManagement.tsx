import { useState, useEffect } from 'react';
import './UserManagement.css';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  estado: 'activo' | 'suspendido';
  avatar?: string;
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(true);

  // Simulación de datos de usuarios (en producción vendría de una API)
  const usuariosMock: Usuario[] = [
    { id: 1, nombre: 'Ana García', email: 'ana.garcia@email.com', estado: 'activo' },
    { id: 2, nombre: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', estado: 'activo' },
    { id: 3, nombre: 'María López', email: 'maria.lopez@email.com', estado: 'suspendido' },
    { id: 4, nombre: 'Juan Pérez', email: 'juan.perez@email.com', estado: 'activo' },
    { id: 5, nombre: 'Sofia Martínez', email: 'sofia.martinez@email.com', estado: 'activo' },
    { id: 6, nombre: 'Diego Fernández', email: 'diego.fernandez@email.com', estado: 'suspendido' },
    { id: 7, nombre: 'Laura Castro', email: 'laura.castro@email.com', estado: 'activo' },
    { id: 8, nombre: 'Roberto Silva', email: 'roberto.silva@email.com', estado: 'activo' },
    { id: 9, nombre: 'Carmen Jiménez', email: 'carmen.jimenez@email.com', estado: 'activo' },
    { id: 10, nombre: 'Pedro Morales', email: 'pedro.morales@email.com', estado: 'suspendido' },
    { id: 11, nombre: 'Isabel Torres', email: 'isabel.torres@email.com', estado: 'activo' },
    { id: 12, nombre: 'Miguel Herrera', email: 'miguel.herrera@email.com', estado: 'activo' }
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

  // Filtrar usuarios basado en la búsqueda
  useEffect(() => {
    const filtrados = usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );
    setUsuariosFiltrados(filtrados);
  }, [busqueda, usuarios]);

  const verLogs = (usuario: Usuario) => {
    alert(`Ver logs de ${usuario.nombre}`);
    // Aquí abrir modal o navegar a página de logs
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
                
                {/* Estado del usuario */}
                <span className={`user-status ${usuario.estado}`}>
                  {usuario.estado === 'activo' ? 'Activo' : 'Suspendido'}
                </span>
                
                {/* Botones de acción */}
                <div className="user-actions">
                  <button 
                    className="btn-logs"
                    onClick={() => verLogs(usuario)}
                  >
                    📋 Logs
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
    </div>
  );
};

export default UserManagement;