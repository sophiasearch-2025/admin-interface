# Despliegue del subsistema admin-interface

## 1. Requisitos

### Software necesario
- **Node.js**: versión 18.0 o superior
- **npm**: versión 8.0 o superior (incluido con Node.js)
- **Git**: para clonar el repositorio
- **Navegador web moderno**: Chrome 92+, Firefox 91+, Safari 14.1+, Edge 92+

### Verificar instalaciones
```bash
node --version    # Debe mostrar v18.0+
npm --version     # Debe mostrar v8.0+
git --version     # Cualquier versión reciente
```

## 2. Instalación y configuración

### Pasos para instalar dependencias y configurar el entorno

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/sophiasearch-2025/admin-interface.git
   cd admin-interface
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Verificar la instalación**
   ```bash
   npm list --depth=0
   ```

### Comandos opcionales o instrucciones de entorno virtual

**Configuración de desarrollo**:
```bash
# Limpiar cache de npm (si hay problemas)
npm cache clean --force

# Instalar dependencias desde cero
rm -rf node_modules package-lock.json
npm install

```

## 3. Despliegue / ejecución

### Comandos para desplegar

**Desarrollo local**:
```bash
# Iniciar servidor de desarrollo
npm run dev

# El servidor estará disponible en:
# http://localhost:5173
```

**Build para producción**:
```bash
# Generar build optimizado
npm run build

# Previsualizar build de producción
npm run preview
```

## 4. Pruebas y verificación

### Cómo probar que el subsistema funciona correctamente

**Verificaciones básicas**:

1. **Acceso a la aplicación**
   - Abrir navegador en `http://localhost:5173`
   - Verificar que carga la pantalla de login

2. **Prueba de autenticación**
   ```
   Usuario: admin
   Contraseña: admin123
   
   O alternativamente:
   Usuario: test
   Contraseña: test
   ```

3. **Verificar navegación**
   - Login exitoso debe redirigir al dashboard
   - Verificar que el header y sidebar son visibles
   - Probar expansión/colapso de sidebars

4. **Probar funcionalidades**
   - **DataManagement**: Verificar sidebar derecho (estadísticas)
   - **Editor de noticias**: Verificar sidebar izquierdo (corrección)
   - **Navegación responsive**: Cambiar tamaño de ventana

### Resultado esperado

**Estado de funcionalidades**:
- **Autenticación**: Login/logout funcionando
- **Layout responsivo**: Header y sidebars adaptativos
- **DataManagement**: Editor de noticias operativo
- **Navegación**: Sidebars colapsables funcionando
- **Otros módulos**: UserManagement, ScrapingConfig, etc. (en desarrollo)

**Indicadores de éxito**:
- Página carga en menos de 3 segundos
- Login exitoso con credenciales válidas
- Sidebars se expanden/colapsan correctamente
- Solo un sidebar expandido a la vez
- Navegación fluida sin errores en consola
- Responsive design funciona en móviles

**Troubleshooting común**:

| Problema | Solución |
|----------|----------|
| Puerto 5173 ocupado | Usar `npm run dev -- --port 3000` |
| Errores de TypeScript | Verificar `npm run type-check` |
| Styles no cargan | Limpiar cache del navegador |
| Build falla | Verificar `npm run build` para errores |

**Logs importantes**:
```bash
# Ver logs de desarrollo
npm run dev

# Verificar build
npm run build 2>&1 | tee build.log

# Analizar bundle
npm run build -- --analyze
```

**Métricas esperadas**:
- **Bundle size**: < 500KB
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lighthouse Score**: > 90/100

---