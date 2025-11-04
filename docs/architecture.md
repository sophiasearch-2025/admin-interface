# Arquitectura del subsistema admin-interface

Interfaz administrativa para la gestión centralizada de datos y estadísticas de noticias, proporcionando herramientas para la administración de usuarios, configuración de procesos de web scraping, gestión de archivos multimedia y sistema de respaldos automatizado.

- **Versión actual**: v0.1 (Prototipo funcional)
- **Versión de diseño**: v1.0 (Funcionalidades completas planificadas)

---

## 1. Arquitectura actual

### Diagrama 1: Estructura de Componentes
Organización modular de componentes React y flujo de datos.

```
App.tsx
├── AuthContext (Estado global)
├── LoginForm (Autenticación)
└── Layout (Dashboard)
    ├── Header
    ├── Sidebar
    └── Features
        ├── DataManagement 
        ├── UserManagement 
        ├── ScrapingConfig 
        ├── MediaManagement 
        ├── BackupManagement 
        └── ErrorNotifications 
```

### Diagrama 2: Gestión de Estado
Flujo de información entre componentes.

```
AuthContext (Global)
├── user: User | null
├── isAuthenticated: boolean
└── login/logout functions

Features (Local State)
├── DataManagement
│   ├── newsData: NewsItem[]
│   └── editMode: boolean
└── Navigation
    └── sidebarExpanded: string
```

---

## 2. Arquitectura final esperada

### Diagrama 1: Sistema Completo
Diseño planificado con todas las funcionalidades.

```
Frontend (React + TypeScript)
├── Authentication (JWT + Roles)
├── UI Components (Layout + Features)
├── State Management (Context API)
└── API Client (REST)
```

### Diagrama 2: Integración Backend
Conexión con servicios externos.

```
Admin Interface
├── API Gateway
│   ├── Auth Service
│   ├── User Service
│   └── Content Service
├── Databases
│   ├── Users (PostgreSQL)
│   └── Content (MongoDB)
└── External Services
    ├── Elasticsearch
    └── Scraping Service
```

---

## 3. Componentes Principales

### Autenticación 
- `AuthContext.tsx`: Estado global de usuario
- `LoginForm.tsx`: Formulario de login
- **Estado**: Completado (credenciales hardcodeadas)

### Layout 
- `Layout.tsx`: Contenedor principal
- `Header.tsx`: Barra de navegación
- `Sidebar.tsx`: Panel lateral colapsable
- **Estado**: Completado (responsive, sidebars funcionales)

### Features
- **DataManagement** : Editor de noticias funcionando
- **UserManagement** : CRUD de usuarios (planificado)
- **ScrapingConfig** : Configuración de scraping (planificado)
- **MediaManagement** : Gestión de archivos (planificado)
- **BackupManagement** : Sistema de respaldos (planificado)
- **ErrorNotifications** : Sistema de alertas (planificado)

---

## 4. Stack Técnico

### Frontend
- **React 18**: UI library
- **TypeScript**: Tipado estático
- **Vite**: Build tool
- **CSS3**: Estilos nativos

### Patrones
- **Component Composition**: Componentes reutilizables
- **Context API**: Estado global sin Redux
- **Feature-Based**: Organización modular por funcionalidad

### Futuras Integraciones
- **JWT Authentication**: Tokens seguros
- **API REST**: Comunicación backend
- **Testing**: Jest + React Testing Library