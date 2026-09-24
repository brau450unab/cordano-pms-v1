# Documento de Requerimientos de Producto (PRD) — ParkOps
## Sistema Integral de Gestión de Estacionamiento y ERP Operativo
**Empresa**: Cordano Inversiones Inmobiliarias Ltda.  
**Ubicación Física**: Serrano 447, Iquique, Chile (Junto al Consulado Italiano)  
**Capacidad**: ~700 m² | 30 plazas estandarizadas (Sector A 01–15, Sector B 16–30)  
**Versión**: 2.0 (Consolidada tras Interrogatorio de Arquitectura y Operaciones)  

---

## 1. Propósito y Objetivos Estratégicos

El software **ParkOps** es la plataforma central de punto de venta (POS), control de acceso vehicular, administración de espacios y auditoría financiera diseñada a medida para el estacionamiento de Serrano 447 en Iquique.

### Objetivos Clave a Cumplir:
1. **Control de Recaudación y Cero Fugas**: Erradicar el cobro informal y las omisiones de registro mediante la emisión obligatoria de tickets térmicos con código QR y código de barras lineal, combinada con arqueos de caja ciega inmutables.
2. **Operación de Alta Velocidad sin Fricción**: Permitir al operador en garita ejecutar el check-in y check-out en una interfaz de baja densidad, con botones grandes estilo macOS (48px–52px), tipografía tabular y modales emergentes con `backdrop-blur` para verificación instantánea sin scroll.
3. **Segregación Estricta de Servicios**: Separar contable y operativamente las ventas transitorias del día (cobro por minuto con tiempo de gracia) de los servicios especiales en paralelo (vehículos que pernoctan por Noche o empresas bajo Convenio mensual), asegurando que ambos bloqueen plazas en el recinto pero no mezclen sus finanzas ni listas operativas.
4. **Resiliencia Operacional Híbrida**: Capacidad de operar 100% de forma local y offline ante caídas de internet (IndexedDB local), con sincronización transparente hacia Google Cloud Run.
5. **Separación de Responsabilidades por Rol**: El operador se enfoca exclusivamente en la operativa diaria con información restringida (caja ciega); el administrador tiene control gerencial y auditoría total, con la prohibición expresa de abrir turnos de caja en rol administrativo para no vulnerar la trazabilidad.

---

## 2. Flujo Operacional del Día a Día

El ciclo operativo diario se estructura en 5 fases secuenciales:

```mermaid
flowchart TD
    subgraph F0["Fase 0: Apertura de Turno"]
        A0["Inicio de Sesión del Operador"] --> B0["Declaración Obligatoria de Fondo Inicial de Sencillo (ej: $30.000 CLP)"]
        B0 --> C0["Apertura Confirmada: Caja Lista para Operar"]
    end

    subgraph F1["Fase 1: Ingreso de Vehículo (Check-in)"]
        C0 --> A1["Llegada de Vehículo & Solicitud de Patente"]
        A1 --> B1{"¿Tipo de Servicio?"}
        
        B1 -- "Transitorio por Minuto" --> C1["Registro de: Nombre Conductor + Teléfono + Daño Opcional"]
        C1 --> D1["Asignación de Tarifa Diaria (con 10 min de gracia)"]
        D1 --> E1["Pop-up Modal de Verificación Previa"]
        E1 --> F1["Imprimir Ticket Térmico 80mm (QR + Código Lineal + Advertencia Legal)"]
        
        B1 -- "Noche / Convenio" --> G1["Apertura de Pop-up Submódulo Paralelo"]
        G1 --> H1["Registro de Empresa/Noche & Bloqueo de Plaza en Matriz (Sin entrar a transitorios)"]
    end

    subgraph F2["Fase 2: Monitoreo en Tiempo Real"]
        F1 --> A2["Plaza marcada en Matriz 30 Slots (Sector A / B) & Tarjeta en Kanban"]
        H1 --> A2
        A2 --> B2["Tooltips al pasar el cursor (Patente y Tiempo)"]
        A2 --> C2["Clic en Plaza: Pop-up Flotante Central con Ficha Técnica"]
    end

    subgraph F3["Fase 3: Salida y Cobro (Check-out)"]
        A2 --> A3["Búsqueda: Escaneo de QR / Escaneo de Código / Digitación de Patente"]
        A3 --> B3["Pop-up de Cobro: Estadía exacta, Tarifa, Verificación de Daños registrados"]
        B3 --> C3{"¿Excepción o Descuento?"}
        C3 -- "Descuento Menor" --> D3["PIN de Operador + Justificación Escrita Obligatoria"]
        C3 -- "Ticket Perdido / Anulación" --> E3["Autorización Obligatoria con PIN de Administrador"]
        C3 -- "Cobro Regular" --> F3["Selección de Medio de Pago"]
        D3 --> F3
        E3 --> F3
        F3 --> G3["Efectivo (Vuelto Gigante) / Tarjeta POS Externa / Transferencia"]
        G3 --> H3["Emisión de Comprobante Térmico & Liberación Inmediata de Plaza"]
    end

    subgraph F4["Fase 4: Cierre de Turno y Conciliación"]
        H3 --> A4["Operador Solicita Cierre de Turno"]
        A4 --> B4["Arqueo Ciego: Conteo de Billetes ($20k, $10k, $5k, $2k, $1k) y Monedas"]
        B4 --> C4["Sistema descuenta Fondo Inicial de Sencillo"]
        C4 --> D4["Comparativa Automática: Declarado vs. Sistema = Cuadre o Diferencia"]
        D4 --> E4["Impresión de Reporte Z Térmico Duplicado (Operador + Archivo Admin)"]
    end
```

---

## 3. Especificaciones Detalladas por Módulo

### Módulo 1: Garita / Punto de Venta Diario (POS)
- **Apertura de Turno**:
  - Exige ingresar el monto de efectivo base para dar vuelto (`initialCashFloat`, ej: `$30.000 CLP`).
  - No permite registrar vehículos hasta haber declarado el fondo inicial.
- **Check-in Transitorio**:
  - **Patente**: Formato chileno (`ABCD-12` o `AB-1234`) con botón de patente extranjera.
  - **Nombre del Conductor**: Texto obligatorio para atención personalizada.
  - **Teléfono Móvil**: Número de contacto (predeterminado `+569`) para soporte o ticket digital.
  - **Observación de Daños Preexistentes (Opcional)**: Campo de texto para registrar abolladuras, rayones o roturas visibles al ingresar (ej: *"Abolladura tapabarro izquierdo"*), protegiendo legalmente al estacionamiento.
  - **Tarifa**: Aplica por defecto la tarifa activa del día/horario por minuto, permitiendo al operador cambiar a tarifa de Camioneta o Moto.
  - **Pop-up de Verificación**: Ventana emergente con `backdrop-blur` que muestra el resumen antes de imprimir para evitar tickets emitidos por error.
- **Check-out y Cobro**:
  - Triple método de búsqueda rápida:
    1. Escaneo del **Código QR** con lector 2D o cámara.
    2. Escaneo del **Código lineal** (Code 128) con pistola láser USB estándar.
    3. Digitación manual de la **Patente**.
  - Pop-up de cobro que desglosa: hora de ingreso, hora de salida, minutos totales, minutos de gracia descontados, tarifa aplicada y monto final redondeado en CLP.
  - Muestra las observaciones de daño registradas al ingresar para validar que el auto se retire en el mismo estado.
  - **Calculadora de Vuelto Gigante**: Muestra con cuánto dinero paga el cliente (ej: `$10.000`) y despliega en verde esmeralda Apple: **`VUELTO: $ 5.500 CLP`**.
  - Medios de pago: `Efectivo`, `Tarjeta POS Externa` (se cobra en el terminal físico Transbank/Getnet y se marca el botón en pantalla) y `Transferencia`.

### Módulo 2: Submódulo de Servicios Especiales en Paralelo (Noche y Convenios)
- **Propósito**: Mantener un orden estricto evitando mezclar las ventas rotativas por minuto con contratos mensuales o estadías nocturnas.
- **Detección**: Al ingresar una patente registrada en convenio o seleccionar la opción "Servicio Noche", se abre un pop-up modal que depende de este submódulo paralelo.
- **Efecto en la Matriz**: Bloquea el slot seleccionado (Sector A o B) marcándolo con color semántico (Azul para Convenio / Púrpura para Noche), pero **NO suma el vehículo a la lista de vehículos transitorios del POS diario**.
- **Contabilidad Segregada**: La recaudación de estos servicios se reporta en una partida independiente en el cierre de caja, sin distorsionar el promedio de minutos ni la recaudación rotativa.

### Módulo 3: Matriz de Plazas y Monitoreo en Vivo (Serrano 447)
- **Capacidad Física**: 30 plazas estandarizadas divididas en:
  - **Sector A**: 15 plazas (Slots 01 al 15).
  - **Sector B**: 15 plazas (Slots 16 al 30).
- **Estética Minimalista estilo macOS**:
  - Tarjetas redondeadas (`rounded-2xl`) con bordes translúcidos de 1px.
  - Selector superior segmentado: `Sector A (01-15)`, `Sector B (16-30)` o `Ambos Sectores (30 Slots)`.
  - Códigos de color semánticos de alta visibilidad:
    - **Disponible**: Verde Esmeralda (`#30D158`)
    - **Ocupada**: Gris Pizarra (`#64748B`)
    - **Reservada**: Naranja (`#FF9F0A`)
    - **Abonado / Convenio**: Azul (`#0A84FF`)
    - **PMR (Movilidad Reducida)**: Cian (`#64D2FF`)
    - **Sobrestadía (>2h / Alerta)**: Rojo pulsante (`#FF453A`)
- **Divulgación Progresiva**:
  - **Tooltips flotantes**: Al posar el cursor, revela de inmediato `Patente: FL-4421 · 1h 12m`.
  - **Modal Pop-up Flotante Central**: Al hacer clic en cualquier plaza ocupada, despliega la ficha completa del vehículo (patente, conductor, tiempo, monto acumulado, observación de daño) con botones grandes de acción rápida: *Cobrar y Salida*, *Reubicar Plaza* y *Cerrar [Esc]*.
- **Tablero Kanban de Permanencia**:
  - Agrupación automática de vehículos activos en 4 columnas: `< 1h`, `1 – 2h`, `2 – 4h`, y `> 4h (Sobrestadía)`.

### Módulo 4: Auditoría y Seguridad Antifraude (*Audit Trail*)
- **Descuentos Menores**: El operador puede aplicar descuentos con su propio **PIN individual de Operador**, siendo obligatorio ingresar la justificación por escrito (ej: *"Convenio verbal autorizado por gerencia"*).
- **Acciones Críticas con PIN de Administrador**:
  - Anulación de tickets emitidos o cobrados.
  - Cobro o liberación de vehículo por **Ticket Perdido**.
  - Reaperturas de caja o modificaciones de fondo.
- **Log Inmutable de Auditoría**: Cada evento sensible registra timestamp exacto, usuario responsable, monto ajustado, justificación y estación de trabajo. Resaltado visual: **Verde** para descuentos autorizados y **Rojo** para pérdidas/fugas.

### Módulo 5: Configuración de Tarifas y Servicios (Solo Administrador)
- Configuración de valor por minuto base según tipo de vehículo:
  - Auto: `$ 25 CLP / min`
  - Camioneta / SUV: `$ 30 CLP / min`
  - Moto: `$ 15 CLP / min`
- Definición de tiempo de gracia inicial (ej: `10 minutos` sin cobro si el cliente sale antes).
- Valor de recargo por Ticket Extraviado (ej: `$ 10.000 CLP`).
- Tarifas fijas para servicios especiales: Tarifa Plana Noche (20:00 a 08:00 hrs) y planes mensuales de convenio.

### Módulo 6: Suite de Reportes y Analítica
- **Portal del Operador (Visión Estrictamente Operativa)**:
  - Solo tiene acceso a su turno activo, punto de ventas, matriz de plazas, lista de clientes y vehículos activos.
  - **Reporte Z Térmico (80mm)**: Al cerrar turno tras el arqueo ciego, el sistema imprime el reporte en duplicado (copia cajero y copia admin) detallando: fecha/hora, número de turno, cajero, fondo inicial, total recaudado en efectivo, total vouchers POS tarjeta, total transferencias, y cuadre/diferencia final.
- **Portal del Administrador (Suite Gerencial Completa)**:
  - **Reporte Diario Consolidado**: Resumen acumulado de todos los turnos del día con desglose por medio de pago.
  - **Reporte Histórico Mensual / Rango de Fechas**: Exportable a **Excel (XLSX/CSV)** y **PDF** con métricas de facturación bruta, neta e impuestos.
  - **Reporte de Ocupación y Horas Punta**: Gráficos de afluencia por hora del día y día de la semana para optimizar turnos de personal.
  - **Reporte de Auditoría de Discrepancias**: Historial de sobrantes/faltantes por cajero y detalle de todos los descuentos aplicados con sus justificaciones.

---

## 4. Matriz de Roles y Separación de Responsabilidades

```
+----------------------------------------------------------------------------------------------------+
|                                    MATRIZ DE ROLES Y PRIVILEGIOS                                   |
+------------------------------------+----------------------------------+----------------------------+
| CAPACIDAD / ACCIÓN                 | OPERADOR / CAJERO DE GARITA      | ADMINISTRADOR / DUEÑO      |
+------------------------------------+----------------------------------+----------------------------+
| Inicio de Turno con Fondo Inicial  | ✅ SÍ (Obligatorio en cada turno)| ❌ NO (Regla de integridad)|
| Registro de Check-in Transitorio   | ✅ SÍ (Con pop-up de verificación| ❌ NO                      |
| Check-out y Cobro de Salida        | ✅ SÍ (Efectivo/Tarjeta/Transf.)  | ❌ NO                      |
| Aplicación de Descuento Menor      | ✅ SÍ (Con PIN propio + motivo)   | ✅ SÍ (Con PIN Admin)      |
| Anulación de Ticket o Pérdida      | ❌ NO (Exige PIN Administrador)  | ✅ SÍ                      |
| Ingreso de Noche / Convenio        | ✅ SÍ (Vía pop-up paralelo)       | ✅ SÍ                      |
| Visualización de Matriz y Kanban   | ✅ SÍ (Operativo en vivo)         | ✅ SÍ (Supervisión remota) |
| Visualización de Total Recaudado   | ❌ NO (Blindado para caja ciega)  | ✅ SÍ (En vivo)            |
| Cierre de Turno y Arqueo Ciego     | ✅ SÍ (Su propio turno)           | ❌ NO                      |
| Impresión de Reporte Z de Turno    | ✅ SÍ (Su propia copia)           | ✅ SÍ                      |
| Acceso a Reportes Históricos P&L   | ❌ NO                             | ✅ SÍ (Excel / PDF)        |
| Configuración de Tarifas y Precios | ❌ NO                             | ✅ SÍ                      |
| Creación de Operadores y PINs      | ❌ NO                             | ✅ SÍ                      |
+------------------------------------+----------------------------------+----------------------------+
```

> [!IMPORTANT]
> **Regla de Integridad de Caja**: Los usuarios con rol de Administrador no pueden abrir turnos de caja ni cobrar tickets directamente bajo su sesión administrativa. Si un administrador debe atender la garita, el sistema exige que inicie sesión con su usuario de Operador para garantizar un arqueo ciego limpio y auditable.

---

## 5. Especificaciones del Ticket Térmico Físico (80mm)

El ticket emitido al ingresar debe contener:
1. **Encabezado**:
   - Razón Social: *Cordano Inversiones Inmobiliarias Ltda.*
   - Nombre Comercial: *ParkOps — Estacionamiento Serrano 447, Iquique*
   - Contacto / Teléfono de Garita
2. **Cuerpo del Vehículo**:
   - Patente destacada en fuente gigante: **`ABCD-12`**
   - Conductor: *Juan Pérez*
   - Teléfono: *+56 9 8765 4321*
   - Fecha y Hora de Entrada: *24/09/2026 - 14:15:32 hrs*
   - Tarifa Aplicada: *$25 CLP / min (10 min de gracia)*
   - Daño Observado (si existe): *"Rayón puerta derecha"*
3. **Identificación Dual**:
   - **Código QR**: Impreso en alta definición en la parte inferior para lectura rápida mediante cámara o escáner 2D.
   - **Código Lineal (Code 128)**: Barra lineal estándar con correlativo alfanumérico legible a simple vista (`TKT-20260924-T01-0042`).
4. **Leyenda Legal y Advertencia Obligatoria**:
   - *"IMPORTANTE: No pierda este ticket. Es el único comprobante válido para retirar su vehículo. El extravío tiene un recargo de $10.000 CLP previa acreditación de dominio del móvil."*

---

## 6. Requerimientos No Funcionales y Contingencias

- **Tiempo de Respuesta Operativa**: Check-in completado en `< 15 segundos`; Check-out y cálculo de vuelto en `< 10 segundos`.
- **Diseño sin Scroll**: Las pantallas operativas de garita operan al 100% en viewport 1080p sin barras de desplazamiento vertical ni horizontal.
- **Tipografía**: Textos en **Geist** y números monetarios/patentes en **Geist Mono** (`tabular-nums`) para evitar oscilaciones visuales.
- **Contingencia Offline**:
  - En caso de pérdida de conexión con Cloud Run, el sistema conmuta automáticamente a almacenamiento local (IndexedDB).
  - Los tickets emitidos en modo contingencia añaden el sufijo **`O`** (`TKT-20260924-T01-0042O`).
  - Al restablecerse el enlace, la cola de sincronización sube los datos a Cloud Run sin colisiones.
- **Auditoría de Descuadre de Caja**:
  - Cuadre perfecto: `Diferencia = $0 CLP`.
  - Tolerancia de auditoría: Discrepancias superiores a `$1.000 CLP` generan una alerta automática en el panel del Administrador.
