import { useState, useEffect } from 'react';
import './UserManagement.css';
import { getAllSubscriptions, testApiConnection, createSubscription, updateSubscription, type CreateSubscriptionData } from '../../services/subscriptions';
import type { Subscription } from '../../services/subscriptions';
import { getAllUsers, testUsersApiConnection, getPendingUsers, approveUser, rejectUser } from '../../services/users';
import type { User } from '../../services/users';

interface Usuario {
  uid: string; // ID del usuario
  nombre: string;
  email: string;
  username?: string;
  company?: string;
  estado: 'activo' | 'suspendido';
  solicitudAprobada?: boolean; // Si la solicitud está pendiente o aprobada
  avatar?: string;
  plan?: string; // Plan de suscripción
  subscriptionId?: string; // ID de la suscripción
  subscriptionStatus?: string; // Estado de la suscripción
}

const UserManagement = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosPendientes, setUsuariosPendientes] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'activo' | 'suspendido' | 'pendiente'>('todos');
  const [cargando, setCargando] = useState(true);
  const [cargandoAprobacion, setCargandoAprobacion] = useState(false);

  // Carga real de datos desde ambas APIs
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      
      try {
        console.log('🔌 Intentando conectar con las APIs...');
        
        // Verificar disponibilidad de ambas APIs
        const [usersApiDisponible, subsApiDisponible] = await Promise.all([
          testUsersApiConnection(),
          testApiConnection()
        ]);
        
        if (!usersApiDisponible && !subsApiDisponible) {
          console.log('❌ Ninguna API disponible');
          setUsuarios([]);
          setUsuariosFiltrados([]);
          setCargando(false);
          return;
        }

        // Obtener datos de las tres fuentes en paralelo
        const [usuariosAPI, suscripcionesAPI, pendientesAPI] = await Promise.all([
          usersApiDisponible ? getAllUsers() : Promise.resolve([]),
          subsApiDisponible ? getAllSubscriptions() : Promise.resolve([]),
          usersApiDisponible ? getPendingUsers() : Promise.resolve([])
        ]);

        console.log('📊 Datos obtenidos:');
        console.log('  - Usuarios:', usuariosAPI.length);
        console.log('  - Suscripciones:', suscripcionesAPI.length);
        console.log('  - Pendientes:', pendientesAPI.length);

        // Crear un mapa de suscripciones por userId para búsqueda rápida
        const subscripcionesPorUsuario = new Map<string, Subscription>();
        suscripcionesAPI.forEach(sub => {
          if (sub.userId) {
            subscripcionesPorUsuario.set(sub.userId, sub);
          }
        });

        // Combinar datos de usuarios con sus suscripciones (solo usuarios aprobados)
        const usuariosCombinados: Usuario[] = usuariosAPI
          .filter((user: User) => user.solicitudAprobada !== false) // Excluir pendientes
          .map((user: User) => {
            const suscripcion = subscripcionesPorUsuario.get(user.uid);
            
            // Determinar el estado desde la suscripción
            let estadoUsuario: 'activo' | 'suspendido' = 'activo';
            if (suscripcion?.status) {
              // Estados activos: 'active', 'trialing'
              // Estados suspendidos: 'cancelled', 'canceled', 'paused', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid'
              estadoUsuario = (suscripcion.status === 'active' || suscripcion.status === 'trialing') 
                ? 'activo' 
                : 'suspendido';
            }
            
            return {
              uid: user.uid,
              nombre: user.name || user.username || user.email.split('@')[0],
              email: user.email,
              username: user.username,
              company: user.company || undefined,
              estado: estadoUsuario,
              solicitudAprobada: user.solicitudAprobada,
              plan: suscripcion?.plan || suscripcion?.description || 'Sin plan',
              subscriptionId: suscripcion?.id,
              subscriptionStatus: suscripcion?.status
            };
          });

        // Mapear usuarios pendientes
        const usuariosPendientesMapeados: Usuario[] = pendientesAPI.map((user: User) => ({
          uid: user.uid,
          nombre: user.name || user.username || user.email.split('@')[0],
          email: user.email,
          username: user.username,
          company: user.company || undefined,
          estado: user.estado === 'active' ? 'activo' : 'suspendido',
          solicitudAprobada: false,
          plan: 'Pendiente de aprobación'
        }));

        console.log('✅ Usuarios aprobados:', usuariosCombinados.length);
        console.log('✅ Usuarios pendientes:', usuariosPendientesMapeados.length);
        
        setUsuarios(usuariosCombinados);
        setUsuariosPendientes(usuariosPendientesMapeados);
        setUsuariosFiltrados([...usuariosPendientesMapeados, ...usuariosCombinados]);
        
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
        setUsuarios([]);
        setUsuariosFiltrados([]);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Filtrar usuarios basado en la búsqueda y el estado
  useEffect(() => {
    let todosLosUsuarios = [...usuariosPendientes, ...usuarios];
    
    let filtrados = todosLosUsuarios.filter(usuario =>
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Aplicar filtro de estado
    if (filtroEstado === 'pendiente') {
      filtrados = usuariosPendientes;
    } else if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(usuario => 
        usuario.estado === filtroEstado && usuario.solicitudAprobada !== false
      );
    }

    setUsuariosFiltrados(filtrados);
  }, [busqueda, filtroEstado, usuarios, usuariosPendientes]);

  const verLogs = (usuario: Usuario) => {
    alert(`Ver logs de ${usuario.nombre}`);
    // Aquí abrir modal o navegar a página de logs
  };

  // Función para aprobar usuario y crear suscripción
  const aprobarUsuario = async (uid: string) => {
    const usuario = usuariosPendientes.find(u => u.uid === uid);
    if (!usuario) return;

    if (!confirm(`¿Aprobar la solicitud de ${usuario.nombre}?\n\nSe enviará un email de bienvenida y se creará su suscripción.`)) {
      return;
    }

    setCargandoAprobacion(true);

    try {
      console.log('✅ Aprobando usuario:', uid);
      
      // 1. Aprobar usuario (esto cambia solicitudAprobada a true y envía email)
      const usuarioAprobado = await approveUser(uid);
      
      if (!usuarioAprobado) {
        alert('❌ Error al aprobar usuario. Intenta nuevamente.');
        return;
      }

      console.log('✅ Usuario aprobado, creando suscripción...');

      // 2. Crear suscripción para el usuario
      const datosSubscripcion: CreateSubscriptionData = {
        userId: uid,
        planId: 'plan_premium', // Puedes cambiar esto según tu lógica
        userEmail: usuario.email,
        userName: usuario.nombre,
        planName: 'Plan Premium',
        precio: 99.99 // Puedes ajustar el precio
      };

      console.log('📦 Datos de suscripción preparados:', datosSubscripcion);

      const nuevaSubscripcion = await createSubscription(datosSubscripcion);

      if (nuevaSubscripcion) {
        console.log('✅ Suscripción creada exitosamente:', nuevaSubscripcion);
      } else {
        console.warn('⚠️ createSubscription devolvió null');
        alert('⚠️ Usuario aprobado pero hubo un error al crear la suscripción.\n\nPor favor, créala manualmente.');
      }

      // 3. Recargar todos los datos
      console.log('🔄 Recargando datos...');
      const [usuariosAPI, suscripcionesAPI, pendientesAPI] = await Promise.all([
        getAllUsers(),
        getAllSubscriptions(),
        getPendingUsers()
      ]);

      // Crear mapa de suscripciones
      const subscripcionesPorUsuario = new Map<string, Subscription>();
      suscripcionesAPI.forEach(sub => {
        if (sub.userId) {
          subscripcionesPorUsuario.set(sub.userId, sub);
        }
      });

      // Actualizar usuarios aprobados
      const usuariosCombinados: Usuario[] = usuariosAPI
        .filter((user: User) => user.solicitudAprobada !== false)
        .map((user: User) => {
          const suscripcion = subscripcionesPorUsuario.get(user.uid);
          
          // Determinar el estado desde la suscripción
          let estadoUsuario: 'activo' | 'suspendido' = 'activo';
          if (suscripcion?.status) {
            estadoUsuario = (suscripcion.status === 'active' || suscripcion.status === 'trialing') 
              ? 'activo' 
              : 'suspendido';
          }
          
          return {
            uid: user.uid,
            nombre: user.name || user.username || user.email.split('@')[0],
            email: user.email,
            username: user.username,
            company: user.company || undefined,
            estado: estadoUsuario,
            solicitudAprobada: user.solicitudAprobada,
            plan: suscripcion?.plan || suscripcion?.description || 'Sin plan',
            subscriptionId: suscripcion?.id,
            subscriptionStatus: suscripcion?.status
          };
        });

      // Actualizar usuarios pendientes
      const usuariosPendientesMapeados: Usuario[] = pendientesAPI.map((user: User) => ({
        uid: user.uid,
        nombre: user.name || user.username || user.email.split('@')[0],
        email: user.email,
        username: user.username,
        company: user.company || undefined,
        estado: user.estado === 'active' ? 'activo' : 'suspendido',
        solicitudAprobada: false,
        plan: 'Pendiente de aprobación'
      }));

      setUsuarios(usuariosCombinados);
      setUsuariosPendientes(usuariosPendientesMapeados);

      setCargandoAprobacion(false);

      const mensaje = nuevaSubscripcion 
        ? `✅ Usuario ${usuario.nombre} aprobado exitosamente!\n\n• Email de bienvenida enviado\n• Suscripción creada`
        : `✅ Usuario ${usuario.nombre} aprobado!\n\n• Email de bienvenida enviado\n⚠️ La suscripción NO se creó, créala manualmente`;
      
      alert(mensaje);
      
    } catch (error) {
      setCargandoAprobacion(false);
      console.error('❌ Error al aprobar usuario:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      alert(`❌ Error al aprobar usuario:\n\n${errorMsg}\n\nVerifica la consola (F12) para más detalles.`);
    }
  };

  // Función para rechazar usuario
  const rechazarUsuario = async (uid: string) => {
    const usuario = usuariosPendientes.find(u => u.uid === uid);
    if (!usuario) return;

    const motivo = prompt(`¿Rechazar la solicitud de ${usuario.nombre}?\n\nEscribe el motivo (opcional):`);
    
    if (motivo === null) return; // Usuario canceló

    try {
      console.log('❌ Rechazando usuario:', uid);
      
      const usuarioRechazado = await rejectUser(uid, motivo || undefined);
      
      if (!usuarioRechazado) {
        alert('❌ Error al rechazar usuario. Intenta nuevamente.');
        return;
      }

      // Recargar usuarios pendientes
      const pendientesAPI = await getPendingUsers();
      const usuariosPendientesMapeados: Usuario[] = pendientesAPI.map((user: User) => ({
        uid: user.uid,
        nombre: user.name || user.username || user.email.split('@')[0],
        email: user.email,
        username: user.username,
        company: user.company || undefined,
        estado: user.estado === 'active' ? 'activo' : 'suspendido',
        solicitudAprobada: false,
        plan: 'Pendiente de aprobación'
      }));

      setUsuariosPendientes(usuariosPendientesMapeados);

      alert(`✅ Solicitud de ${usuario.nombre} rechazada.`);
      
    } catch (error) {
      console.error('❌ Error al rechazar usuario:', error);
      alert('❌ Error al rechazar usuario. Verifica la consola para más detalles.');
    }
  };

  const cambiarEstadoUsuario = async (uid: string) => {
    const usuario = usuarios.find(u => u.uid === uid);
    if (!usuario) return;

    const nuevoEstado: 'activo' | 'suspendido' = usuario.estado === 'activo' ? 'suspendido' : 'activo';
    const accion = nuevoEstado === 'suspendido' ? 'suspender' : 'reactivar';
    
    // Confirmar la acción con el usuario
    if (!confirm(`¿Estás seguro de que deseas ${accion} la cuenta de ${usuario.nombre}?`)) {
      return;
    }

    try {
      console.log(`🔄 ${accion === 'suspender' ? '🔴' : '🟢'} Intentando ${accion} usuario:`, uid);
      
      // Verificar que el usuario tenga una suscripción
      if (!usuario.subscriptionId) {
        alert(`❌ El usuario ${usuario.nombre} no tiene una suscripción asociada.`);
        return;
      }

      let resultado = false;
      let estadoCambioEnAPI = false;

      if (nuevoEstado === 'suspendido') {
        // Suspender = PATCH status -> 'cancelled'
        console.log('🔴 Intentando suspender suscripción (PATCH status=cancelled):', usuario.subscriptionId);
        const updated = await updateSubscription(usuario.subscriptionId, { status: 'cancelled' });

        if (updated) {
          console.log('🔍 Resultado PATCH (suspender):', updated.status);
          estadoCambioEnAPI = (updated.status === 'cancelled' || updated.status === 'canceled');
          resultado = true;
        } else {
          resultado = false;
        }
      } else {
        // Reactivar = PATCH status -> 'active'
        console.log('🟢 Intentando reactivar suscripción (PATCH status=active):', usuario.subscriptionId);
        const updated = await updateSubscription(usuario.subscriptionId, { status: 'active' });

        if (updated) {
          console.log('🔍 Resultado PATCH (reactivar):', updated.status);
          estadoCambioEnAPI = (updated.status === 'active');
          resultado = true;
        } else {
          resultado = false;
        }
      }

      // Recargar todos los datos desde las APIs
      console.log('🔄 Recargando datos desde las APIs...');
      const [usuariosAPI, suscripcionesAPI] = await Promise.all([
        getAllUsers(),
        getAllSubscriptions()
      ]);

      // Crear mapa de suscripciones
      const subscripcionesPorUsuario = new Map<string, Subscription>();
      suscripcionesAPI.forEach(sub => {
        if (sub.userId) {
          subscripcionesPorUsuario.set(sub.userId, sub);
        }
      });

      // Combinar datos
      const usuariosCombinados: Usuario[] = usuariosAPI
        .filter((user: User) => user.solicitudAprobada !== false)
        .map((user: User) => {
          const suscripcion = subscripcionesPorUsuario.get(user.uid);
          
          // Determinar el estado desde la suscripción
          let estadoUsuario: 'activo' | 'suspendido' = 'activo';
          if (suscripcion?.status) {
            estadoUsuario = (suscripcion.status === 'active' || suscripcion.status === 'trialing') 
              ? 'activo' 
              : 'suspendido';
          }
          
          return {
            uid: user.uid,
            nombre: user.name || user.username || user.email.split('@')[0],
            email: user.email,
            username: user.username,
            company: user.company || undefined,
            estado: estadoUsuario,
            solicitudAprobada: user.solicitudAprobada,
            plan: suscripcion?.plan || suscripcion?.description || 'Sin plan',
            subscriptionId: suscripcion?.id,
            subscriptionStatus: suscripcion?.status
          };
        });

      setUsuarios(usuariosCombinados);

      if (resultado && estadoCambioEnAPI) {
        // Todo funcionó correctamente
        const mensajeExito = nuevoEstado === 'suspendido' ? 'suspendida' : 'reactivada';
        alert(`✅ Cuenta ${mensajeExito} exitosamente para ${usuario.nombre}`);
      } else if (resultado && !estadoCambioEnAPI) {
        // La API respondió pero no devolvió la suscripción actualizada
        alert(
          `⚠️ La solicitud fue procesada, pero la API no devolvió la suscripción actualizada.\n\n` +
          `Por favor, verifica el backend para confirmar que el campo "status" se actualizó correctamente.\n` +
          `Si el problema persiste, pide al equipo de API que retorne la suscripción actualizada dentro de "data" en la respuesta PATCH.`
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
            Todos ({usuarios.length + usuariosPendientes.length})
          </button>
          <button
            className={`filter-btn ${filtroEstado === 'pendiente' ? 'active' : ''}`}
            onClick={() => setFiltroEstado('pendiente')}
          >
            Pendientes ({usuariosPendientes.length})
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
              <div key={usuario.uid} className={`user-card ${usuario.solicitudAprobada === false ? 'pending-card' : ''}`}>
                {/* Avatar */}
                <div className={`user-avatar ${usuario.solicitudAprobada === false ? 'pending-avatar' : ''}`}>
                  {getIniciales(usuario.nombre)}
                </div>
                
                {/* Nombre del usuario */}
                <h3 className="user-name">{usuario.nombre}</h3>
                <p className="user-email">{usuario.email}</p>
                {usuario.company && <p className="user-company">🏢 {usuario.company}</p>}
                
                {/* Botones de acción */}
                <div className="user-actions">
                  {usuario.solicitudAprobada === false ? (
                    <>
                      <button 
                        className="btn-approve"
                        onClick={() => aprobarUsuario(usuario.uid)}
                        disabled={cargandoAprobacion}
                      >
                        {cargandoAprobacion ? '⏳ Procesando...' : '✅ Aprobar'}
                      </button>
                      <button 
                        className="btn-reject"
                        onClick={() => rechazarUsuario(usuario.uid)}
                        disabled={cargandoAprobacion}
                      >
                        ❌ Rechazar
                      </button>
                      <button 
                        className="btn-boleta"
                        onClick={() => window.open(`http://172.105.21.15:3000/api/users/${usuario.uid}/comprobante`, '_blank')}
                        disabled={cargandoAprobacion}
                      >
                        🎫 Ver Comprobante
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn-logs"
                        onClick={() => verLogs(usuario)}
                      >
                        📋 Logs
                      </button>
                      <button 
                        className="btn-boleta"
                        onClick={() => window.open(`http://172.105.21.15:3000/api/users/${usuario.uid}/comprobante`, '_blank')}
                        disabled={cargandoAprobacion}
                      >
                        🎫 Ver boleta
                      </button>
                      <button 
                        className={usuario.estado === 'activo' ? 'btn-suspend' : 'btn-reactivate'}
                        onClick={() => cambiarEstadoUsuario(usuario.uid)}
                      >
                        {usuario.estado === 'activo' ? '⛔ Suspender' : '✅ Reactivar'}
                      </button>
                    </>
                  )}
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