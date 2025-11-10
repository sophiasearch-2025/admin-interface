# Decisiones de Arquitectura y Diseño

## Registro de Decisiones

Este documento registra las decisiones de arquitectura y diseño importantes tomadas durante el desarrollo del subsistema admin-interface. Cada decisión incluye el contexto, la decisión tomada y las consecuencias.

---

## Decisión #001: Consolidación del Módulo de Notificaciones

### Contexto

El sistema originalmente contaba con dos módulos separados:
- **Configurar Scraping**: Gestión de configuraciones y ejecución de procesos de scraping
- **Notificación de errores**: Sistema independiente para alertas y notificaciones

Esta separación generaba:
- Duplicación de funcionalidad relacionada con el monitoreo de scraping
- Navegación fragmentada para tareas relacionadas
- Complejidad adicional en el mantenimiento de dos módulos separados

### Decisión

**Se elimina el módulo "Notificación de errores" y se integra al módulo "Configurar Scraping".**

El módulo consolidado se renombra a **"Gestión de Scraping"** y agrupa toda la funcionalidad relacionada:
- Configuración de procesos de scraping
- Monitoreo y ejecución
- Notificaciones y alertas de errores
- Logs y resultados

### Consecuencias

**Positivas**:
- Mayor cohesión funcional: todas las operaciones de scraping en un solo lugar
- Mejor experiencia de usuario: flujo de trabajo unificado
- Reducción de código duplicado y mantenimiento simplificado
- Navegación más intuitiva y directa

**Negativas**:
- El módulo se vuelve más complejo y requiere mejor organización interna
- Necesidad de refactorizar rutas y componentes existentes



## Decisión #002: Priorización de Configuración en Gestión de Scraping

### Contexto

El módulo "Gestión de Scraping" contiene múltiples funcionalidades:
- Configuración de procesos
- Monitoreo en tiempo real
- Historial de ejecuciones
- Notificaciones de errores

Era necesario definir qué funcionalidad debe ser la más accesible y visible para los usuarios.

### Decisión

**Se prioriza la configuración como función principal del módulo "Gestión de Scraping".**

Implementación:
1. **La configuración aparece como primera opción** en el menú de opciones del módulo
2. **La vista de configuración se muestra por defecto** al abrir el módulo
3. **El modo de scraping predeterminado es "Manual"** en nuevas configuraciones

### Consecuencias

**Positivas**:
- Flujo de trabajo más natural: configurar → ejecutar → monitorear
- Usuarios nuevos encuentran inmediatamente la función principal
- Configuración manual como default reduce errores de ejecuciones automáticas no deseadas
- Alineación con el patrón de uso más común (configurar antes de ejecutar)

**Negativas**:
- Usuarios que necesiten monitoreo frecuente tendrán un paso adicional
- Requiere documentación clara sobre cómo acceder a otras funciones


