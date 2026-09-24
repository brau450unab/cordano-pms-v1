# Especificación de Diseño de UI/UX: Flujo Operacional, Menús, Pop-ups y Landing Page
## Proyecto: ParkOps PMS & ERP (Cordano Inversiones Inmobiliarias Ltda.)
**Ubicación**: Serrano 447, Iquique, Chile  
**Documento Generado vía**: Skill `spec-to-design` + Interrogatorio `/grill-me`  
**Fecha**: Septiembre 2026  

---

## 1. Arquitectura de Información y Menú Superior Estilo macOS

Para garantizar que el operador trabaje en monitores 1080p sin scroll vertical ni horizontal, la navegación se ubica exclusivamente en una **Menubar Superior Fija**:

```
+---------------------------------------------------------------------------------------------------------------------------------------+
|  🔴 🟡 🟢  ParkOps Cordano · Serrano 447  |  [ Garita POS ]  [ Matriz Serrano 447 ]  [ Servicios Especiales ]  [ Reportes Admin ]   |
|  -----------------------------------------------------------------------------------------------------------------------------------  |
|  [ Cloud Run: En Línea 🟢 ]  |  CLT 14:15:32  |  Turno: #01 (Carlos Soto)  |  Fondo: $30.000 CLP  |  [ Cerrar Turno ]  [ Salir ]       |
+---------------------------------------------------------------------------------------------------------------------------------------+
```

### Elementos de la Menubar Superior:
1. **Controles de Ventana macOS**: Botones traffic lights (`rojo`, `amarillo`, `verde`) decorativos en la esquina superior izquierda.
2. **Identidad de Marca**: Isotipo y texto minimalista `ParkOps Cordano · Serrano 447, Iquique`.
3. **Pestañas de Navegación Rápida (Tabs)**:
   - **`[ Garita POS ]`**: Cockpit de atención rápida (Check-in, Check-out, vehículos activos).
   - **`[ Matriz Serrano 447 ]`**: Mapa interactivo de las 30 plazas (Sectores A y B) y tablero Kanban de estadía.
   - **`[ Servicios Especiales ]`**: Submódulo en paralelo para vehículos por Noche y Convenios mensuales.
   - **`[ Reportes Admin ]`**: Acceso al panel de auditoría, cierres de caja y configuración (protegido por rol).
4. **Telemetría y Estado de Turno**:
   - Badge con pulso de sincronización: `Cloud Run: En Línea` (verde) o `Modo Offline Local (O)` (ámbar).
   - Reloj oficial en tiempo real de Chile (`CLT HH:mm:ss`).
   - Nombre de operador y atajo para cierre de caja o cambio de turno.

---

## 2. Estructura Espacial del Cockpit de Garita (Bi-Panel Asimétrico)

La pantalla principal de Garita opera en una relación asimétrica **40% / 60%** optimizada para operadores diestros y pantallas táctiles o teclados:

```
+-------------------------------------------------------------+-------------------------------------------------------------------------+
| PANEL IZQUIERDO: CHECK-IN DE ENTRADA (40%)                  | PANEL DERECHO: MONITOREO Y COBRO RÁPIDO (60%)                           |
+-------------------------------------------------------------+-------------------------------------------------------------------------+
| [ PLACA PATENTE GIGANTE: _ _ _ _ - _ _ ]  [Extranjera]       | [ 🔍 Buscar por Patente, QR o Código de Ticket... ]                     |
|                                                             |                                                                         |
| Selector de Tipo de Vehículo:                               | MINI-RESUMEN DE SLOTS: 22 Ocupados | 7 Libres | 1 Reservado (73%)       |
| [ 🚗 Auto ($25/min) ] [ 🛻 Camioneta ] [ 🏍️ Moto ]        | [Ver Mapa Completo ->]                                                  |
|                                                             |                                                                         |
| Datos del Conductor:                                        | LISTA ACTIVA DE VEHÍCULOS ESTACIONADOS:                                 |
| • Nombre Conductor: [ Juan Pérez                      ]     | +---------------------------------------------------------------------+ |
| • Teléfono Móvil:   [ +56 9 8765 4321                 ]     | | ABCD-12 | Auto      | Slot A-03 | 1h 15m | $1.875 CLP | [ Cobrar F2 ] | |
| • Daño Observado:   [ Rayón puerta copiloto           ]     | | KJ-9872 | Camioneta | Slot B-18 | 2h 40m | $4.800 CLP | [ Cobrar F2 ] | |
|                                                             | | FL-4421 | Auto      | Slot A-07 | 0h 42m | $1.050 CLP | [ Cobrar F2 ] | |
| Tarifa Activa: Estándar Minuto (10 min gracia)              | +---------------------------------------------------------------------+ |
|                                                             |                                                                         |
| [ REGISTRAR INGRESO E IMPRIMIR TICKET (Enter) ] (Azul 52px) | Atajos: [F1: Ingreso] [F2: Cobrar] [F3: Slots] [F4: Arqueo]             |
+-------------------------------------------------------------+-------------------------------------------------------------------------+
```

---

## 3. Mecánica y Ergonomía de los Pop-ups (Progressive Disclosure)

Todos los pop-ups comparten la misma base de interacción ergonómica acordada:
- **Efecto de Fondo**: Capa de desenfoque `backdrop-blur-md` (`rgba(0, 0, 0, 0.65)`).
- **Control por Teclado**:
  - Foco inmediato en el botón o campo principal.
  - `[Enter]`: Confirma la acción primaria.
  - `[Esc]` o clic en el fondo difuminado: Cierra la ventana instantáneamente sin alterar datos.
- **Micro-interacción**: Entrada con escala suave (`scale-95` a `scale-100`, duración 150ms).

### Catálogo Canónico de Pop-ups:

#### Pop-up 1: Verificación de Check-in
- **Disparador**: Al pulsar *Registrar Ingreso* o presionar `[Enter]`.
- **Contenido**: Muestra en tarjeta estilo tarjeta de embarque: Patente, Nombre, Teléfono, Daño observado (o *"Sin daños registrados"*), tarifa aplicada y plaza asignada.
- **Acción**: Botón grande verde/azul: *Confirmar e Imprimir Ticket Térmico 80mm [Enter]*.

#### Pop-up 2: Cobro y Salida (Check-out)
- **Disparador**: Escaneo de QR, lectura de código lineal Code 128 o clic en *Cobrar*.
- **Contenido**:
  - Hora entrada, hora salida, minutos totales, minutos de gracia descontados.
  - Total a pagar en fuente gigante mono: **`$ 4.500 CLP`**.
  - Revisión de daños registrados al ingreso.
  - Botones de selección de pago: `[Efectivo F1]`, `[Tarjeta POS F2]`, `[Transferencia F3]`.
  - Calculadora de vuelto gigante: ingresa monto entregado (ej: `$10.000`) y muestra en verde brillante: **`VUELTO: $ 5.500 CLP`**.
  - Botón de Descuento Menor (pide PIN Operador + justificación) y Ticket Perdido (pide PIN Administrador).

#### Pop-up 3: Submódulo de Servicios Especiales (Noche y Convenios)
- **Disparador**: Detección de patente en convenio o selección manual en el menú superior.
- **Contenido**:
  - Asignación de empresa / cliente corporativo.
  - Tarifa plana acordada o servicio Noche (ej: `$ 15.000 CLP`).
  - Selección de plaza física a bloquear (Sector A o B).
  - Bloquea el slot en la matriz pero **no lo agrega a la cola de vehículos rotativos del POS**.

#### Pop-up 4: Cierre de Turno y Arqueo Ciego
- **Disparador**: Clic en *Cerrar Turno*.
- **Contenido**:
  - Cuadrícula táctil para contar billetes ($20.000, $10.000, $5.000, $2.000, $1.000) y monedas.
  - Botón de 52px: *Declarar Efectivo y Cuadrar*.
  - Revelación comparativa: Declarado vs Sistema = Diferencia (`Cuadre Perfecto = $0 CLP`).
  - Botón para imprimir Reporte Z térmico duplicado (80mm).

---

## 4. Diseño y Estructura de la Landing Page

La **Landing Page** de ParkOps es un portal de presentación moderno, limpio y con baja densidad, diseñado para:
1. Proporcionar un **acceso directo y seguro** para los operadores y administradores de Serrano 447 (redirección limpia a `/login`).
2. Servir como **vitrina comercial y tecnológica** para Cordano Inversiones Inmobiliarias Ltda., permitiendo ofrecer el software a otros estacionamientos de Iquique y la región.

### Estructura de Secciones de la Landing Page:

```
+----------------------------------------------------------------------------------------------------+
| HEADER: Logo ParkOps Cordano  |  Tarifas  |  Recinto Serrano 447  |  FAQ  |  [ Iniciar Sesión -> ] |
+----------------------------------------------------------------------------------------------------+
| HERO BANNER:                                                                                       |
| "Tecnología de Vanguardia para la Gestión de Estacionamientos en Iquique"                          |
| Subtítulo: Control en tiempo real, tickets térmicos con código QR dual y arqueo de caja ciega.     |
| [ Acceso Garita / POS ]  [ Conocer Recinto Serrano 447 ]                                          |
+----------------------------------------------------------------------------------------------------+
| BENEFICIOS OPERACIONALES (Bento Cards Minimalistas):                                               |
| [ Check-in en <15s ]   [ Matriz 30 Slots en Vivo ]   [ Caja Ciega Cero Fugas ]   [ Modo Offline ]  |
+----------------------------------------------------------------------------------------------------+
| GALERÍA DEL RECINTO SERRANO 447:                                                                   |
| Visuales fotorrealistas del acceso, garita de seguridad, barreras automáticas y plazas demarcadas |
+----------------------------------------------------------------------------------------------------+
| PREGUNTAS FRECUENTES (FAQ):                                                                        |
| • ¿Cómo funciona el tiempo de gracia inicial?                                                      |
| • ¿Qué medios de pago se aceptan en garita?                                                        |
| • ¿Cómo solicitar un convenio mensual para empresas o flotas?                                      |
+----------------------------------------------------------------------------------------------------+
| ACCESO A DOCUMENTACIÓN Y TUTORIALES (Bloque protegido):                                            |
| "Manual de Operación de Garita y Guías de Auditoría" -> [ Ingresar para Ver Tutoriales ]           |
+----------------------------------------------------------------------------------------------------+
| FOOTER: Cordano Inversiones Inmobiliarias Ltda. | Serrano 447, Iquique | Cloud Run Microservice    |
+----------------------------------------------------------------------------------------------------+
```
