import { useState, useEffect } from 'react';
import './UserManagement.css';
import { getAllUsers, testUsersApiConnection, updateUserStatus, getComprobanteUrl } from '../../services/users';
import type { User } from '../../services/users';
import { API_CONFIG } from '../../config/api';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  estado: 'activo' | 'suspendido';
  avatar?: string;
  company?: string;
  comprobanteUrl?: string | null;
  solicitudAprobada?: boolean;
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'suspendido' | 'pendientes'>('todos');
  const [cargando, setCargando] = useState(true);
  const [mostrarModalBoleta, setMostrarModalBoleta] = useState(false);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState<string | null>(null);

  // Función para convertir usuarios de la API a formato Usuario
  const convertirUserAUsuario = (user: User): Usuario => {
    return {
      id: user.id,
      nombre: user.name || user.username || `Usuario-${user.id.slice(0, 8)}`,
      email: user.email,
      estado: user.estado === 'active' ? 'activo' : 'suspendido',
      company: user.company || undefined,
      comprobanteUrl: user.comprobanteUrl || null,
      solicitudAprobada: user.solicitudAprobada ?? true // Por defecto true para usuarios antiguos
    };
  };

  // Carga real de datos desde la API
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    setCargando(true);
    
    try {
      console.log('📋 Intentando conectar con la API de usuarios...');
      
      // Primero probar si la API está disponible
      const apiDisponible = await testUsersApiConnection();
      
      if (apiDisponible) {
        console.log('✅ API disponible, obteniendo usuarios...');
        
        // Obtener usuarios reales
        const usersDesdeAPI = await getAllUsers();
        
        // Convertir usuarios a formato Usuario
        const usuariosDesdeAPI = usersDesdeAPI.map(convertirUserAUsuario);
        
        setUsuarios(usuariosDesdeAPI);
        setUsuariosFiltrados(usuariosDesdeAPI);
        
        console.log('✅ Datos cargados:', usuariosDesdeAPI.length, 'usuarios');
      } else {
        console.log('❌ API no disponible, mostrando mensaje de error');
        setUsuarios([]);
        setUsuariosFiltrados([]);
      }
      
    } catch (error) {
      console.error('❌ Error al cargar usuarios:', error);
      setUsuarios([]);
      setUsuariosFiltrados([]);
    } finally {
      setCargando(false);
    }
  };

  // Filtrar usuarios basado en la búsqueda y el estado
  useEffect(() => {
    let filtrados = usuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Aplicar filtro de estado
    if (filtroEstado === 'pendientes') {
      filtrados = filtrados.filter(usuario => usuario.solicitudAprobada === false);
    } else if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(usuario => usuario.estado === filtroEstado);
    }

    setUsuariosFiltrados(filtrados);
  }, [busqueda, filtroEstado, usuarios]);

  const verLogs = (usuario: Usuario) => {
    alert(`Ver logs de ${usuario.nombre}`);
    // Aquí abrir modal o navegar a página de logs
  };

  const cambiarEstadoUsuario = async (id: string) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    const nuevoEstado: 'activo' | 'suspendido' = usuario.estado === 'activo' ? 'suspendido' : 'activo';
    const accion = nuevoEstado === 'suspendido' ? 'suspender' : 'reactivar';
    
    // Confirmar la acción con el usuario
    if (!confirm(`¿Estás seguro de que deseas ${accion} la cuenta de ${usuario.nombre}?`)) {
      return;
    }

    try {
      const estadoAPI = nuevoEstado === 'suspendido' ? 'suspended' : 'active';
      
      console.log(`🔄 Intentando ${accion} usuario (PATCH estado=${estadoAPI}):`, id);
      const updated = await updateUserStatus(id, estadoAPI);

      if (updated) {
        console.log('✅ Estado actualizado:', updated.estado);
        
        // Recargar los usuarios desde la API
        await cargarUsuarios();
        
        const mensajeExito = nuevoEstado === 'suspendido' ? 'suspendida' : 'reactivada';
        alert(`✅ Cuenta ${mensajeExito} exitosamente para ${usuario.nombre}`);
      } else {
        alert(`❌ Error al ${accion} la cuenta. La API no respondió correctamente.`);
      }
    } catch (error) {
      console.error('❌ Error al cambiar estado del usuario:', error);
      alert(
        `❌ ERROR DE CONEXIÓN\n\n` +
        `No se pudo ${accion} la cuenta de ${usuario.nombre}.\n\n` +
        `Posibles causas:\n` +
        `• La API no está disponible\n` +
        `• Problemas de red\n` +
        `• El endpoint no existe\n\n` +
        `Verifica la consola del navegador (F12) para más detalles.`
      );
    }
  };

  const aprobarUsuario = async (id: string) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    if (!confirm(`¿Aprobar la solicitud de ${usuario.nombre}?\n\nSe enviará un email de bienvenida automáticamente.`)) {
      return;
    }

    try {
      console.log('✅ Aprobando usuario:', id);
      
      const response = await fetch(`${API_CONFIG.USER_MANAGEMENT}/api/users/${id}/approve`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Usuario aprobado:', data);

      // Recargar los usuarios desde la API
      await cargarUsuarios();
      
      alert(`✅ Usuario aprobado exitosamente: ${usuario.nombre}\n\nSe ha enviado un email de bienvenida.`);
    } catch (error: any) {
      console.error('❌ Error al aprobar usuario:', error);
      alert(`❌ Error al aprobar usuario:\n\n${error.message || 'Error desconocido'}`);
    }
  };

  const rechazarUsuario = async (id: string) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;

    const motivo = prompt(`¿Rechazar la solicitud de ${usuario.nombre}?\n\nIngresa el motivo (opcional):`);
    if (motivo === null) return; // Usuario canceló

    try {
      console.log('❌ Rechazando usuario:', id);
      
      const response = await fetch(`${API_CONFIG.USER_MANAGEMENT}/api/users/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motivo: motivo || 'Sin motivo especificado' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Usuario rechazado:', data);

      // Recargar los usuarios desde la API
      await cargarUsuarios();
      
      alert(`✅ Solicitud rechazada para: ${usuario.nombre}`);
    } catch (error: any) {
      console.error('❌ Error al rechazar usuario:', error);
      alert(`❌ Error al rechazar usuario:\n\n${error.message || 'Error desconocido'}`);
    }
  };

  const verBoleta = (usuario: Usuario) => {
    // Usar el endpoint de la API para obtener la imagen
    const comprobanteUrl = getComprobanteUrl(usuario.id);
    console.log('🖼️ Abriendo boleta para usuario:', usuario.id);
    console.log('🔗 URL del comprobante:', comprobanteUrl);
    //setBoletaSeleccionada(comprobanteUrl); esto tiene problemas de CORS
    //setMostrarModalBoleta(true);
    window.open(comprobanteUrl, '_blank');
  };

  const cerrarModalBoleta = () => {
    setMostrarModalBoleta(false);
    setBoletaSeleccionada(null);
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
          <button
            className={`filter-btn ${filtroEstado === 'pendientes' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('pendientes')}
          >
            Pendientes ({usuarios.filter(u => u.solicitudAprobada === false).length})
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
                  {usuario.solicitudAprobada === false ? (
                    <>
                      <button 
                        className="btn-aprobar"
                        onClick={() => aprobarUsuario(usuario.id)}
                      >
                        ✅ Aprobar
                      </button>
                      <button 
                        className="btn-rechazar"
                        onClick={() => rechazarUsuario(usuario.id)}
                      >
                        ❌ Rechazar
                      </button>
                    </>
                  ) : (
                    <button 
                      className={usuario.estado === 'activo' ? 'btn-suspend' : 'btn-reactivate'}
                      onClick={() => cambiarEstadoUsuario(usuario.id)}
                    >
                      {usuario.estado === 'activo' ? '⛔ Suspender' : '✅ Reactivar'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para ver boleta */}
      {mostrarModalBoleta && boletaSeleccionada && (
        <div className="modal-overlay" onClick={cerrarModalBoleta}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Comprobante de Pago</h2>
              <button className="modal-close" onClick={cerrarModalBoleta}>✕</button>
            </div>
            <div className="modal-body">
              <img 
                src={boletaSeleccionada} 
                alt="Comprobante de pago" 
                className="boleta-imagen"
                onLoad={() => console.log('✅ Imagen cargada correctamente')}
                onError={(e) => console.error('❌ Error al cargar imagen:', boletaSeleccionada, e)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;