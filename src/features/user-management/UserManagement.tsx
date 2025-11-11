import { useState, useEffect } from 'react';
import './UserManagement.css';
import { getAllSubscriptions, testApiConnection, cancelSubscription, renewSubscription, getSubscriptionById } from '../../services/subscriptions';
import type { Subscription } from '../../services/subscriptions';

interface Usuario {
  id: string; // Cambiado a string para coincidir con Subscription
  nombre: string;
  email: string;
  estado: 'activo' | 'suspendido';
  avatar?: string;
  plan?: string; // Agregamos plan de suscripción
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'suspendido'>('todos');
  const [cargando, setCargando] = useState(true);

  // Función para convertir suscripciones de la API a formato Usuario
  const convertirSuscripcionAUsuario = (subscription: Subscription): Usuario => {
    return {
      id: subscription.id,
      nombre: subscription.userId || `Usuario-${subscription.id.slice(0, 8)}`, // Usar userId o parte del ID
      email: subscription.userId || 'sin-email@ejemplo.com', // Por ahora usar userId como email
      estado: subscription.status === 'active' ? 'activo' : 'suspendido',
      plan: subscription.plan || subscription.description || 'No definido'
    };
  };

  // Carga real de datos desde la API
  useEffect(() => {
    const cargarSuscripciones = async () => {
      setCargando(true);
      
      try {
        console.log('Intentando conectar con la API...');
        
        // Primero probar si la API está disponible
        const apiDisponible = await testApiConnection();
        
        if (apiDisponible) {
          console.log('API disponible, obteniendo suscripciones...');
          
          // Obtener suscripciones reales
          const suscripciones = await getAllSubscriptions();
          
          // Convertir suscripciones a formato Usuario
          const usuariosDesdeAPI = suscripciones.map(convertirSuscripcionAUsuario);
          
          setUsuarios(usuariosDesdeAPI);
          setUsuariosFiltrados(usuariosDesdeAPI);
          
          console.log('Datos cargados:', usuariosDesdeAPI.length, 'suscripciones');
        } else {
          console.log('API no disponible, mostrando mensaje de error');
          setUsuarios([]);
          setUsuariosFiltrados([]);
        }
        
      } catch (error) {
        console.error('Error al cargar suscripciones:', error);
        setUsuarios([]);
        setUsuariosFiltrados([]);
      } finally {
        setCargando(false);
      }
    };

    cargarSuscripciones();
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
      let resultado = false;
      let estadoCambioEnAPI = false;

      if (nuevoEstado === 'suspendido') {
        // Suspender = Cancelar suscripción en la API
        console.log('🔴 Intentando suspender suscripción:', id);
        resultado = await cancelSubscription(id);
        
        // Verificar si realmente cambió en la base de datos
        if (resultado) {
          console.log('⏳ Esperando 1 segundo para verificar el cambio...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const suscripcionActualizada = await getSubscriptionById(id);
          console.log('🔍 Estado después de cancelar:', suscripcionActualizada?.status);
          
          if (suscripcionActualizada?.status === 'cancelled' || suscripcionActualizada?.status === 'canceled') {
            console.log('✅ El status SÍ cambió a cancelled/canceled');
            estadoCambioEnAPI = true;
          } else {
            console.log('⚠️ ADVERTENCIA: El status NO cambió. Sigue como:', suscripcionActualizada?.status);
            console.log('⚠️ Esto indica que la API no está actualizando el campo status en Firestore');
            estadoCambioEnAPI = false;
          }
        }
      } else {
        // Reactivar = Renovar suscripción en la API (30 días por defecto)
        console.log('🟢 Intentando reactivar suscripción:', id);
        resultado = await renewSubscription(id, 30);
        
        // Verificar si realmente cambió
        if (resultado) {
          console.log('⏳ Esperando 1 segundo para verificar el cambio...');
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const suscripcionActualizada = await getSubscriptionById(id);
          console.log('🔍 Estado después de renovar:', suscripcionActualizada?.status);
          
          if (suscripcionActualizada?.status === 'active') {
            console.log('✅ El status SÍ cambió a active');
            estadoCambioEnAPI = true;
          } else {
            console.log('⚠️ ADVERTENCIA: El status NO cambió después de renovar');
            estadoCambioEnAPI = false;
          }
        }
      }

      // Recargar las suscripciones desde la API
      console.log('🔄 Recargando datos desde la API...');
      const suscripcionesActualizadas = await getAllSubscriptions();
      const usuariosActualizados = suscripcionesActualizadas.map(convertirSuscripcionAUsuario);
      setUsuarios(usuariosActualizados);

      if (resultado && estadoCambioEnAPI) {
        // Todo funcionó correctamente
        const mensajeExito = nuevoEstado === 'suspendido' ? 'suspendida' : 'reactivada';
        alert(`✅ Cuenta ${mensajeExito} exitosamente para ${usuario.nombre}`);
      } else if (resultado && !estadoCambioEnAPI) {
        // La API respondió OK pero no actualizó el campo status
        alert(
          `PROBLEMA CON LA API DE SUSCRIPCIONES\n\n` +
          `La solicitud fue enviada exitosamente, pero el campo "status" NO se actualizó en la base de datos.\n\n` +
          `CAUSA: La API no tiene implementado un endpoint PATCH para actualizar el estado de las suscripciones.\n\n`
        );
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
                    onClick={() => {/* Funcionalidad pendiente de implementar */}}
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
    </div>
  );
};

export default UserManagement;