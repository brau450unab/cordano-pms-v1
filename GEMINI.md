# Directrices del Proyecto: ParkOps PMS & ERP (Cordano Inversiones Inmobiliarias Ltda.)

Este archivo establece las directrices permanentes para el desarrollo del software de gestión de estacionamientos y módulos ERP en este espacio de trabajo.

---

## 1. Entorno de Ejecución e Infraestructura Cloud Run

- **Proyecto GCP**: `gen-lang-client-0862587160` (N° `349577440002`) | Región: `us-west1`
- **Microservicio Cloud Run**: `cordano-pms-v1` en puerto 8080 (URL: `https://cordano-pms-v1-349577440002.us-west1.run.app`)
- **Google Stitch Project**: `projects/12916038623650348087` (*NUEVO PMS CORDANO - ParkOps Iquique*)
- **Instalación Física**: Serrano 447, Iquique, Chile (~700 m², 30 plazas: Sector A 01–15, Sector B 16–30)
- **Persistencia**: Monolito Modular Next.js con soporte Offline-First (IndexedDB local) y sincronización con Cloud Run.

---

## 2. Habilitación de Skills de Diseño y Arquitectura

En este proyecto se encuentran instaladas y activadas las siguientes skills en `.agents/skills/`:
- **`pms-erp-dashboard-design`**: Patrones de dominio para estacionamientos, control de barreras, matriz de plazas en tiempo real, modo garita y conciliación de cajas.
- **`spec-to-design`**: Procedimiento para traducir especificaciones técnicas y documentación de producto a flujos, contratos y arquitectura de UI.
- **`ui-ux-pro-max`**: Inteligencia de diseño con base de datos de estilos, paletas contrastadas, tipografías y componentes de gestión (búsqueda: `node .agents/skills/ui-ux-pro-max/scripts/search.js <termino>`).
- **`frontend-design`**: Principios de composición y eliminación de plantillas genéricas de IA.
- **`web-design-guidelines`**: Auditoría de accesibilidad (WCAG AA), foco visible (`:focus-visible`) y resiliencia en formularios.
- **`modern-web-guidance`**: Uso prioritario de APIs nativas de la plataforma web (`<dialog>`, Popover, Anchor Positioning, View Transitions).
- **`stitch-design-system`**: Integración con `StitchMCP` para generación de pantallas y tokens en `DESIGN.md`.
- **`magnific-ai`**: Alucinación generativa, reiluminación (`Relight`) y super-resolución fotorrealista para renders arquitectónicos de Serrano 447, tótems y señalética.
- **`clarity-upscaler`**: Escalado generativo open-source de alta fidelidad (Tiled MultiDiffusion + ControlNet Tile) para super-resolución 4K/8K de interfaces y mockups UI sin deformar tipografías.
- **`archify`**: Diagramas interactivos y verificables de arquitectura, flujo de datos y base de datos con validación geométrica formal, vistas guiadas y exportación vectorial/HTML.

---

## 3. Reglas Obligatorias de UX/UI para este Proyecto

1. **Ergonomía de Garita (Keyboard-First & Sin Scroll)**:
   - Toda acción operativa crítica (apertura de barrera, búsqueda de patente, selección de cobro, impresión) debe contar con atajos de teclado primarios (`F1` a `F9`, `Enter`, `Esc`).
   - El campo de matrícula/ticket en las vistas de cobro debe tener autofoco inmediato.
   - En pantallas de escritorio de garita (1080p / 4K), el flujo operativo principal debe operar **completamente sin scroll vertical ni horizontal**.

2. **Tipografía Numérica Tabular**:
   - Todo valor monetario en CLP (`$4.500`), contador de tiempo, porcentaje de ocupación o patente debe utilizar `tabular-nums` y tipografía monoespaciada fija (`font-mono`) para evitar saltos visuales durante actualizaciones en tiempo real.

3. **Código Semántico de Colores para Plazas**:
   - **Disponible**: Verde Esmeralda (`#10B981`)
   - **Ocupada**: Gris Pizarra (`#64748B`)
   - **Reservada**: Ámbar (`#F59E0B`)
   - **Abonado / VIP**: Azul (`#3B82F6`)
   - **PMR (Movilidad Reducida)**: Cian (`#06B6D4`)
   - **Punto de Carga EV**: Violeta (`#8B5CF6`)
   - **Sobrestadía / Alerta**: Rojo (`#EF4444`)

4. **Identificación de Tickets y Modo Offline**:
   - Formato estándar de ticket: `TKT-AAAAMMDD-T0X-XXXX`.
   - Si el ticket fue emitido en contingencia offline, añade el sufijo **`O`** (`TKT-AAAAMMDD-T0X-XXXXO`).
   - Identificación dual en ticket térmico (80mm): **Código QR** (para escaneo 2D o móvil) y **Código lineal (Code 128)** con correlativo alfanumérico visible para escaneo láser o digitación manual.
   - Leyenda legal de advertencia obligatoria sobre el recargo por pérdida de ticket.

5. **Auditoría Antifraude y Caja Ciega**:
   - Apertura obligatoria de turno declarando fondo inicial de sencillo para dar vuelto.
   - Descuentos menores exigen **PIN individual del operador** y justificación escrita obligatoria (>10 caracteres).
   - Anulaciones de tickets o cobro por ticket extraviado exigen **PIN de Administrador**.
   - Resaltar en auditoría: **Verde** para descuentos autorizados y **Rojo** para recargos/ticket perdido.
   - En arqueo ciego, desglosar: `Efectivo Sistema` vs `Efectivo Recontado Físico` = `Diferencia / Cuadre`.

6. **Baja Densidad, Divulgación Progresiva y Estética macOS**:
   - Interfaz limpia y desahogada sin tablas saturadas. La información secundaria y operativa detallada se revela mediante **tooltips** o **modales pop-up flotantes centrales** con efecto `backdrop-blur`.
   - Botones grandes (48px–52px) redondeados estilo macOS (`rounded-xl`), micro-relieve y sombras suaves.
   - Tipografía moderna: **Geist** para textos de interfaz y **Geist Mono** (`tabular-nums`) para montos y matrículas.

7. **Segregación de Roles y Servicios Especiales en Paralelo**:
   - **Incompatibilidad de Caja para Administradores**: El rol de Administrador audita y configura, pero **no puede abrir turnos de caja** directamente (debe utilizar perfil de Operador para salvaguardar la trazabilidad de arqueo).
   - **Servicios Paralelos (Noche / Convenios)**: Los vehículos que pernoctan o pertenecen a convenios mensuales se registran en un submódulo paralelo mediante pop-up, bloqueando su plaza en la matriz pero sin ingresar a la lista de transitorios ni alterar la contabilidad rotativa por minuto del día.
