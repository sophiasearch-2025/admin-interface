# admin-interface

## 1. Propósito
Interfaz administrativa para la gestión centralizada de datos y estadísticas de noticias, proporcionando herramientas para la administración de usuarios y suscripciones, monitoreo de métricas de scraping, verificación de boletas de pago, configuración de procesos de web scraping y sistema de respaldos automatizado.


## 2. Interacción con otros subsistemas
- **user-subscription-manager** (Puerto 3000): 
  - Gestión completa de suscripciones de usuarios
  - Aceptación y rechazo de solicitudes de suscripción entrantes
  - Cambio de estados de suscripciones (activa, pausada, cancelada)
  - Verificación de boletas de pago
  - Renovación de suscripciones
  
- **media-data-collector** (Puerto 3010):
  - Métricas en tiempo real del crawler y scraper de noticias
  - Estadísticas de procesamiento por sitio web
  - Progreso de categorías y URLs encontradas
  - Tasas de éxito y velocidad de scraping


## 3. Documentación interna
Enlace a los documentos principales del subsistema:

- [Arquitectura](./architecture.md)
- [Decisiones tecnicas](./decisions.md)
- [Requisitos](./requirements.md)
- [Despliegue](./deploy.md)

## 4. Estado del subsistema
**En desarrollo** - Prototipo funcional con características principales implementadas y módulos core en desarrollo.

### Funcionalidades Completadas:
- Sistema de autenticación completo
- Layout y navegación responsiva
- Módulo de gestión de datos con visualización de métricas de scraping
- Visualización de métricas en tiempo real (crawler y scraper)
- Estadísticas por sitio web y resumen general
- Editor de contenido con indicadores
- Sidebars colapsables
- Gestión de usuarios y suscripciones:
  - Visualización de suscripciones activas
  - Aceptar/rechazar solicitudes de suscripción entrantes
  - Cambiar estado de suscripciones (activar, cancelar)
  - Verificar y validar boletas de pago
  - Renovar suscripciones próximas a vencer
- Sistema de respaldos con funcionalidad de importación/exportación
- Configuración de APIs y servicios
- Sistema de timeouts configurables
- Integración con APIs backend (user-management y media-data-collector)

### En Desarrollo:
- Configuración avanzada de scraping (control de inicio/parada de procesos)
- Sistema completo de notificaciones push
- Gestión avanzada de medios de prensa

---

## Tecnologías Utilizadas

### Frontend
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de build y desarrollo optimizada
- **CSS3** - Estilos nativos sin frameworks externos
- **Fetch API** - Cliente HTTP nativo con timeouts configurables

### Backend Integration
- **REST APIs** - Integración con servicios externos
- **User Management API (Puerto 3000)** - Gestión completa de suscripciones
- **Media Data Collector API (Puerto 3010)** - Métricas de scraping en tiempo real
- **Timeout Management** - Sistema de timeouts configurables (30s por defecto)
- **Error Handling** - Manejo robusto de errores de red
- **CORS Configuration** - Configuración de proxy para desarrollo

### Arquitectura
- **Component-Based Architecture** - Arquitectura basada en componentes
- **Context API** - Gestión de estado global
- **Feature-Based Structure** - Organización modular por funcionalidades
- **Responsive Design** - Diseño adaptable a dispositivos
- **Modal System** - Sistema de ventanas modales para feedback

### DevOps & Deployment
- **Docker** - Containerización de la aplicación
- **Nginx** - Servidor web con configuración personalizada
- **Multi-stage Build** - Optimización de imagen Docker
- **Static Assets** - Organización optimizada de recursos estáticos

---

##  Estructura del Proyecto

```
admin-interface/
├── public/                         # Archivos estáticos
│   └── images/                     # Imágenes organizadas
│       ├── logos/                  # Logos de la aplicación
│       │   ├── LogoSophia.svg
│       │   ├── LogoSophia1.png
│       │   ├── LogoSophia1.svg
│       │   └── LogoSophia2.png
│       └── charts/                 # Gráficos y estadísticas
│           ├── grafico1.svg
│           ├── grafico2.svg
│           ├── grafico3.svg
│           └── grafico4.svg
├── src/
│   ├── components/                 # Componentes reutilizables
│   │   ├── auth/                   # Componentes de autenticación
│   │   │   ├── LoginForm.tsx       # ✅ Implementado
│   │   │   └── LoginForm.css
│   │   └── layout/                 # Componentes de estructura
│   │       ├── Layout.tsx          # ✅ Implementado
│   │       ├── Layout.css
│   │       ├── Header.tsx          # ✅ Implementado
│   │       ├── Header.css
│   │       ├── Sidebar.tsx         # ✅ Implementado
│   │       └── Sidebar.css
│   ├── config/                     # Configuraciones
│   │   └── api.ts                  # ✅ Configuración de APIs y timeouts
│   ├── context/                    # Contextos de React
│   │   └── AuthContext.tsx         # ✅ Gestión de autenticación
│   ├── features/                   # Módulos de funcionalidades
│   │   ├── data-management/        # ✅ Implementado completo
│   │   │   ├── DataManagement.tsx  # Visualización de métricas de scraping
│   │   │   └── DataManagement.css
│   │   ├── user-management/        # ✅ Implementado completo
│   │   │   ├── UserManagement.tsx  # Gestión de suscripciones y boletas
│   │   │   └── UserManagement.css
│   │   ├── scraping-config/        # 🚧 En desarrollo
│   │   │   ├── ScrapingConfig.tsx
│   │   │   └── ScrapingConfig.css
│   │   ├── media-management/       # 🚧 En desarrollo
│   │   │   ├── MediaManagement.tsx
│   │   │   └── MediaManegment.css
│   │   └── backup-management/      # ✅ Implementado con modales
│   │       ├── BackupManagement.tsx
│   │       └── BackupManagement.css
│   ├── services/                   # Servicios y APIs
│   │   ├── api.ts                  # ✅ API base con timeouts
│   │   ├── subscriptions.ts        # ✅ Gestión de suscripciones
│   │   ├── users.ts                # ✅ Gestión de usuarios
│   │   └── metrics.ts              # ✅ Servicio de métricas de scraping
│   ├── types/                      # Definiciones TypeScript
│   │   ├── auth.ts                 # ✅ Tipos de autenticación
│   │   └── navigation.ts           # ✅ Tipos de navegación
│   ├── App.tsx                     # ✅ Componente principal
│   ├── App.css                     # ✅ Estilos globales
│   ├── index.css                   # ✅ Estilos base
│   └── main.tsx                    # ✅ Punto de entrada
├── docs/                           # Documentación del sistema
│   ├── README.md                   # Resumen general del subsistema
│   ├── architecture.md             # Descripción de componentes y flujo
│   ├── decisions.md                # Decisiones técnicas importantes
│   ├── requirements.md             # Requisitos funcionales y no funcionales
│   └── deploy.md                   # Cómo instalar y ejecutar
├── docker-compose.yml              # ✅ Configuración Docker Compose
├── Dockerfile                      # ✅ Configuración Docker
├── nginx.conf                      # ✅ Configuración Nginx personalizada
├── package.json                    # ✅ Dependencias y scripts
├── tsconfig.json                   # ✅ Configuración TypeScript
├── tsconfig.app.json               # ✅ Config TS para aplicación
├── tsconfig.node.json              # ✅ Config TS para Node
├── vite.config.ts                  # ✅ Configuración Vite optimizada
└── eslint.config.js                # ✅ Configuración ESLint
```

---

## Credenciales de Acceso

### Usuarios de Prueba
| Usuario | Contraseña | Rol   | Descripción        |
|---------|------------|-------|--------------------|
| `Sophia` | `Sophia2025` | Admin | Usuario principal |
| `test`  | `test`     | Admin | Usuario de pruebas |

---

## Uso del Sistema

### Inicio de Sesión
1. Accede a la aplicación en tu navegador
2. Usa cualquiera de las credenciales de prueba
3. El sistema te redirigirá al dashboard principal

### Gestión de Datos y Métricas
1. Utiliza los botones de la barra superior para expandir sidebars
2. **Sidebar Derecho - Métricas**: Visualiza métricas del scraper en tiempo real
   - Estadísticas de crawler (URLs encontradas, categorías)
   - Estadísticas de scraper (noticias procesadas, tasa de éxito)
   - Progreso actual por sitio web
   - Resumen general del sistema
   - Actualización automática cada 30 segundos
3. **Sidebar Izquierdo - Correcciones**: Edita noticias con errores
   - Selecciona una noticia del dropdown
   - Edita el contenido directamente
   - Guarda los cambios

### Gestión de Usuarios y Suscripciones
1. **Visualizar Suscripciones**: Lista completa de usuarios con sus estados
2. **Aceptar/Rechazar Solicitudes**: 
   - Revisa solicitudes pendientes de suscripción
   - Valida la boleta de pago adjunta
   - Acepta o rechaza la solicitud con un clic
3. **Cambiar Estado de Suscripción**:
   - Activar suscripciones pausadas
   - Pausar suscripciones temporalmente
   - Cancelar suscripciones
4. **Verificar Boletas de Pago**:
   - Visualiza la imagen de la boleta
   - Confirma los datos de pago
   - Valida información del usuario
5. **Renovar Suscripciones**:
   - Identifica suscripciones próximas a vencer
   - Renueva por un periodo adicional

### Navegación
- Solo un sidebar puede estar expandido a la vez
- El contenido central se oculta cuando un sidebar está activo
- Navegación responsive en dispositivos móviles
- Indicadores visuales de estado (activo, pausado, cancelado)

---

## Compatibilidad

### Navegadores Soportados
- **Chrome**: 92+
- **Firefox**: 91+
- **Safari**: 14.1+
- **Edge**: 92+

---

## Roadmap de Desarrollo

### Fase 1 - Prototipo Base ✅ COMPLETADA
- [x] Sistema de autenticación
- [x] Layout y navegación responsiva
- [x] Módulo de gestión de datos
- [x] Editor de contenido con sidebars

### Fase 2 - Funcionalidades Core ✅ COMPLETADA
- [x] Gestión completa de usuarios y suscripciones
- [x] Aceptar/rechazar solicitudes de suscripción
- [x] Cambiar estados de suscripciones (activar, pausar, cancelar)
- [x] Verificación de boletas de pago
- [x] Renovación de suscripciones
- [x] Sistema de respaldos con modales
- [x] Configuración de APIs y servicios
- [x] Sistema de timeouts configurables
- [x] Organización de assets (imágenes)
- [x] Visualización de métricas de scraping en tiempo real
- [x] Estadísticas de crawler y scraper por sitio

### Fase 3 - Características Avanzadas 🚧 EN PROGRESO
- [x] Configuración Docker y Nginx
- [x] Integración con APIs externas (user-management y media-data-collector)
- [ ] Control de inicio/parada de procesos de scraping
- [ ] Configuración avanzada de scraping (intervalos, categorías)
- [ ] Gestión completa de medios de prensa
- [ ] Sistema completo de notificaciones push
- [ ] Historial de cambios de estado de suscripciones

### Fase 4 - Optimización 📋 PENDIENTE
- [ ] Performance optimization
- [ ] Testing automatizado
- [ ] CI/CD pipeline
- [ ] Monitoreo y logs
- [ ] Documentación técnica completa
