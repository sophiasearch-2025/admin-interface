# Despliegue del subsistema admin-interface

## 1. Requisitos

### Software necesario
- **Node.js**: versión 18.0 o superior
- **npm**: versión 8.0 o superior (incluido con Node.js)
- **Git**: para clonar el repositorio
- **Navegador web moderno**: Chrome 92+, Firefox 91+, Safari 14.1+, Edge 92+
- docker-compose
- docker

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

2. asegurarse que existe la red |red_arqui|, sino
docker network create red_arqui

3. ejecutar 
docker-compose up -d --build

4. acceder a ip:3003

## 4. Pruebas y verificación

### Cómo probar que el subsistema funciona correctamente

**Verificaciones básicas**:

1. **Acceso a la aplicación**
   - Abrir navegador en `172.105.21.15:3003`
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


**Logs importantes**:
```bash
# Ver logs de desarrollo
npm run dev

# Verificar build
npm run build 2>&1 | tee build.log

# Analizar bundle
npm run build -- --analyze
```

