# admin-interface

## 1. Propósito
Interfaz administrativa para la gestión centralizada de datos y estadísticas de noticias, proporcionando herramientas para la administración de usuarios, configuración de procesos de web scraping y sistema de respaldos automatizado.


## 2. Interacción con otros subsistemas
- **user-subscription-manager** : Obtenemos el listado de los usuarios registrados, para poder gestionarlos en el modulo **user-management**
- **news-query-analysis** : Obtenemos las noticias que se recolectaron, junto con sus metadatos y metricas


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
- Módulo de gestión de datos
- Editor de contenido con indicadores
- Sidebars colapsables

### En Desarrollo:
- Gestión completa de usuarios
- Configuración de scraping
- Sistema de notificaciones
- Gestión de respaldos
- Gestión de medios

---

## Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de build y desarrollo
- **CSS3** - Estilos nativos sin frameworks externos

### Arquitectura
- **Component-Based Architecture** - Arquitectura basada en componentes
- **Context API** - Gestión de estado global
- **Feature-Based Structure** - Organización modular por funcionalidades
- **Responsive Design** - Diseño adaptable a dispositivos

---

##  Estructura del Proyecto

```
admin-interface/
├── public/                         # Archivos estáticos
│   ├── LogoSophia1.png             # Logo principal
│   ├── LogoSophia2.png             # Logo alternativo
│   └── vite.svg
├── src/
│   ├── components/                 # Componentes reutilizables
│   │   ├── auth/                   # Componentes de autenticación
│   │   │   ├── LoginForm.tsx
│   │   │   └── LoginForm.css
│   │   └── layout/                 # Componentes de estructura
│   │       ├── Layout.tsx
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── context/                    # Contextos de React
│   │   └── AuthContext.tsx         # Gestión de autenticación
│   ├── features/                   # Módulos de funcionalidades
│   │   ├── data-management/        # Implementado
│   │   ├── user-management/        # En desarrollo
│   │   ├── scraping-config/        # En desarrollo
│   │   ├── media-management/       # En desarrollo
│   │   ├── backup-management/      # En desarrollo
│   │   └── error-notifications/    # En desarrollo
│   ├── types/                      # Definiciones TypeScript
│   │   ├── auth.ts
│   │   └── navigation.ts
│   ├── App.tsx                     # Componente principal
│   ├── App.css                     # Estilos globales
│   └── main.tsx                    # Punto de entrada
├── docs/                           # Documentación del sistema
│   ├── README.md                   # Resumen general del subsistema
│   ├── arquitectura.md             # Descripción de componentes y flujo
│   ├── decisiones.md               # Decisiones técnicas importantes
│   ├── requisitos.md               # Requisitos funcionales y no funcionales
│   └── deploy.md                   # Cómo instalar y ejecutar
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Credenciales de Acceso

### Usuarios de Prueba
| Usuario | Contraseña | Rol   | Descripción        |
|---------|------------|-------|--------------------|
| `admin` | `admin123` | Admin | Usuario de pruebas |
| `test`  | `test`     | Admin | Usuario de pruebas |

---

## Uso del Sistema

### Inicio de Sesión
1. Accede a la aplicación en tu navegador
2. Usa cualquiera de las credenciales de prueba
3. El sistema te redirigirá al dashboard principal

### Gestión de Datos
1. Utiliza los botones de la barra superior para expandir sidebars
2. **Sidebar Derecho**: Visualiza estadísticas y gráficos
3. **Sidebar Izquierdo**: Corrige errores en noticias
   - Selecciona una noticia del dropdown
   - Edita el contenido directamente
   - Guarda los cambios

### Navegación
- Solo un sidebar puede estar expandido a la vez
- El contenido central se oculta cuando un sidebar está activo
- Navegación responsive en dispositivos móviles

---

## Compatibilidad

### Navegadores Soportados
- **Chrome**: 92+
- **Firefox**: 91+
- **Safari**: 14.1+
- **Edge**: 92+

---

## Roadmap de Desarrollo

### Fase 1 - Prototipo Base 
- [x] Sistema de autenticación
- [x] Layout y navegación
- [x] Módulo de gestión de datos
- [x] Editor de contenido

### Fase 2 - Funcionalidades Core 
- [ ] Gestión completa de usuarios
- [ ] Configuración de scraping
- [ ] Sistema de notificaciones
- [ ] Gestión de respaldos

### Fase 3 - Características Avanzadas 
- [ ] Gestión de medios
- [ ] API REST backend
- [ ] Base de datos persistente
- [ ] Autenticación JWT

### Fase 4 - Optimización 
- [ ] Performance optimization
- [ ] Testing automatizado
- [ ] CI/CD pipeline
- [ ] Documentación completa
