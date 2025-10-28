# admin-interface

## 📋 Descripción del Proyecto


### 🎯 Objetivos del Sistema
- Gestión centralizada de datos y estadísticas
- Administración de usuarios y roles
- Configuración de procesos de web scraping
- Gestión de archivos multimedia
- Sistema de respaldos automatizado
- Monitoreo y notificaciones de errores

---

## 🚀 Características Principales

### ✨ **Sistema de Autenticación**
- Login seguro con validación de credenciales
- Gestión de sesiones de usuario
- Dropdown de usuario con opciones de logout

### 📊 **Módulo de Gestión de Datos**
- Dashboard de estadísticas con gráficos interactivos
- Editor de contenido para corrección de errores en noticias
- Sistema de revisión y validación de contenido
- Interfaz dual con sidebars colapsables

### 👥 **Gestión de Usuarios** *(En desarrollo)*
- CRUD completo de usuarios
- Asignación de roles y permisos
- Filtros y búsqueda avanzada

### ⚙️ **Configuración de Scraping** *(En desarrollo)*
- Configuración de fuentes de datos
- Programación de tareas automatizadas
- Monitoreo de procesos de extracción

### 📁 **Gestión de Medios** *(En desarrollo)*
- Subida y organización de archivos
- Preview de contenido multimedia
- Sistema de categorización

### 💾 **Gestión de Respaldos** *(En desarrollo)*
- Creación de backups automáticos
- Restauración de datos
- Programación de tareas

### 🚨 **Notificaciones de Errores** *(En desarrollo)*
- Dashboard de errores del sistema
- Alertas automáticas
- Seguimiento de resoluciones

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Herramienta de build y desarrollo
- **CSS3** - Estilos nativos sin frameworks externos

### **Arquitectura**
- **Component-Based Architecture** - Arquitectura basada en componentes
- **Context API** - Gestión de estado global
- **Feature-Based Structure** - Organización modular por funcionalidades
- **Responsive Design** - Diseño adaptable a dispositivos

---

## 📁 Estructura del Proyecto

```
prototipo_interfaz_admin/
├── public/                          # Archivos estáticos
│   ├── LogoSophia1.png             # Logo principal
│   ├── LogoSophia2.png             # Logo alternativo
│   └── vite.svg
├── src/
│   ├── components/                  # Componentes reutilizables
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
│   │   ├── data-management/        # ✅ Implementado
│   │   ├── user-management/        # 🚧 En desarrollo
│   │   ├── scraping-config/        # 🚧 En desarrollo
│   │   ├── media-management/       # 🚧 En desarrollo
│   │   ├── backup-management/      # 🚧 En desarrollo
│   │   └── error-notifications/    # 🚧 En desarrollo
│   ├── types/                      # Definiciones TypeScript
│   │   ├── auth.ts
│   │   └── navigation.ts
│   ├── App.tsx                     # Componente principal
│   ├── App.css                     # Estilos globales
│   └── main.tsx                    # Punto de entrada
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Instalación y Configuración

### **📋 Prerrequisitos**
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git >= 2.30.0

### **⬇️ Instalación**

1. **Clonar el repositorio**
```bash
git clone https://github.com/BenjaUribe/prototipo_interfaz_admin.git
cd prototipo_interfaz_admin
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

---

## 🔐 Credenciales de Acceso

### **Usuarios de Prueba**
| Usuario | Contraseña | Rol | Descripción |
|---------|------------|-----|-------------|
| `admin` | `admin123` | Admin | Usuario de pruebas |
| `test` | `test` | Admin | Usuario de pruebas |


---

## 🎮 Uso del Sistema

### **🔑 Inicio de Sesión**
1. Accede a la aplicación en tu navegador
2. Usa cualquiera de las credenciales de prueba
3. El sistema te redirigirá al dashboard principal

### **📊 Gestión de Datos**
1. Utiliza los botones de la barra superior para expandir sidebars
2. **Sidebar Derecho**: Visualiza estadísticas y gráficos
3. **Sidebar Izquierdo**: Corrige errores en noticias
   - Selecciona una noticia del dropdown
   - Edita el contenido directamente
   - Guarda los cambios

### **🧭 Navegación**
- Solo un sidebar puede estar expandido a la vez
- El contenido central se oculta cuando un sidebar está activo
- Navegación responsive en dispositivos móviles

---

## 🧪 Testing y Validación

### **✅ Funcionalidades Probadas**
- [x] Sistema de autenticación completo
- [x] Navegación y layout responsivo
- [x] Módulo de gestión de datos
- [x] Editor de contenido con indicadores
- [x] Sidebars colapsables
- [x] Dropdown de usuario con logout

---

## 📱 Compatibilidad

### **🌐 Navegadores Soportados**
- **Chrome**: 92+
- **Firefox**: 91+
- **Safari**: 14.1+
- **Edge**: 92+


## 🔮 Roadmap de Desarrollo

### **Fase 1 - Prototipo Base** ✅
- [x] Sistema de autenticación
- [x] Layout y navegación
- [x] Módulo de gestión de datos
- [x] Editor de contenido

### **Fase 2 - Funcionalidades Core** 🚧
- [ ] Gestión completa de usuarios
- [ ] Configuración de scraping
- [ ] Sistema de notificaciones
- [ ] Gestión de respaldos

### **Fase 3 - Características Avanzadas** 📋
- [ ] Gestión de medios
- [ ] API REST backend
- [ ] Base de datos persistente
- [ ] Autenticación JWT

### **Fase 4 - Optimización** 📋
- [ ] Performance optimization
- [ ] Testing automatizado
- [ ] CI/CD pipeline
- [ ] Documentación completa

---

### **📏 Estándares de Código**
- Usar TypeScript estricto
- Seguir convenciones de nomenclatura
- Documentar componentes complejos
- Mantener responsividad en todos los componentes
