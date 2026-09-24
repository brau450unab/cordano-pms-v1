---
name: pms-erp-dashboard-design
description: Design intelligence, information architecture, and UI/UX patterns specialized for Parking Management Systems (PMS) and Enterprise Resource Planning (ERP) applications. Use when designing, building, reviewing, or refactoring parking dashboards, gate control booths, spot occupancy matrices, tariff engines, cashier shifts, vehicle search, or enterprise data grids.
---

# PMS & ERP Management System Design Skill — ParkOps Cordano

Especialización de diseño y experiencia de usuario (UX/UI) de alta densidad y rendimiento para el sistema de control de estacionamientos **ParkOps (Cordano Inversiones Inmobiliarias Ltda., Serrano 447, Iquique, Chile)**, desplegado en **Google Cloud Run** y sincronizado con **Google Stitch** (`projects/12916038623650348087`).

---

## 1. Contexto de Infraestructura y Despliegue

- **GCP Project**: `gen-lang-client-0862587160` (ID: `349577440002`) | Región: `us-west1`
- **Servicio Cloud Run**: `cordano-pms-v1` en puerto 8080 (`https://cordano-pms-v1-349577440002.us-west1.run.app`)
- **Google Stitch Project**: `projects/12916038623650348087` (*NUEVO PMS CORDANO - ParkOps Iquique*)
- **Endpoints de Dominio**:
  - `/api/checkin`: Registro de ingreso, anti-passback y emisión de ticket canónico.
  - `/api/checkout`: Búsqueda por patente/código de barras, cálculo por minuto y cobro.
  - `/api/slots`: Matriz de 30 plazas (Sector A: 01–15, Sector B: 16–30).
  - `/api/shifts`: Apertura y cierre de caja ciego.
  - `/api/audit`: Bitácora inmutable con verificación obligatoria de PIN.
  - `/api/cloudrun`: Panel de diagnóstico de estado en GCP.

---

## 2. Principios de Diseño para Operaciones Críticas

1. **Latencia Cero en Percepción**: Las acciones en garita y control de barrera deben proporcionar retroalimentación visual en menos de 100 ms.
2. **Keyboard-First & Sin Scroll**: Toda acción operativa frecuente debe poder ejecutarse mediante botones táctiles o atajos de teclado (`F1` a `F9`). En escritorio de garita, la pantalla principal no debe requerir scroll.
3. **Semántica Cromática Inequívoca**:
   - **Disponible**: Verde Esmeralda (`#10B981`)
   - **Ocupada**: Gris Pizarra (`#64748B`)
   - **Reservada**: Ámbar (`#F59E0B`)
   - **Abonado / VIP**: Azul (`#3B82F6`)
   - **PMR**: Cian (`#06B6D4`)
   - **Sobrestadía / Alerta**: Rojo (`#EF4444`)
4. **Resiliencia ante Fallos (Modo Offline PWA)**: El operador debe poder operar con almacenamiento local (`IndexedDB`) ante caídas de internet. Los tickets emitidos offline añaden el sufijo **`O`** (`TKT-20260923-T01-0015O`).
5. **Cierre de Caja Ciego (*Blind Checkout*)**: El cajero declara el efectivo físico contado antes de conocer la cifra esperada por el sistema.

---

## 3. Arquitectura de Pantalla: Cockpit de Garita / Control de Accesos

```
+--------------------------------------------------------------------------------------------------+
| CABECERA: [ParkOps - Serrano 447] [Capacidad: 26/30 (86%)] [Cloud Run: us-west1 ONLINE] [22:15]   |
+--------------------------------------------------------------------+-----------------------------+
| INGRESO RÁPIDO & CONTROL DE CARRIL                                 | COBRO RÁPIDO & TICKET (F5)  |
| +-------------------------------+  +-----------------------------+ | +-------------------------+ |
| | Patente: [ ABCD-12        ]   |  | Carril: [VERDE - ACTIVO]    | | | Patente / Código Barra: | |
| | [Auto] [Camioneta] [Moto]     |  | Barrera: [CERRADA]          | | | [ TKT-20260923-T01-0012] | |
| | Teléfono: [+569 - 84920192]   |  | Acciones:                   | | +-------------------------+ |
| | [Rechaza Datos] [Extranjera]  |  | [F1: Abrir] [F2: Bloquear]  | | | Entrada: 19:42 (2h 33m) | |
| | [Emitir Ticket e Imprimir]    |  |                             | | | Tarifa: General Rotativo| |
| +-------------------------------+  +-----------------------------+ | | Descuento: 0 min        | |
|                                                                    | | TOTAL: $ 3.825 CLP      | |
| MATRIZ DE 30 PLAZAS / KANBAN DE ESTADÍA                            | | Paga con: [ $ 10.000  ] | |
| [SECTOR A: 01-L] [02-O] [03-O] [04-L] [05-PMR] [06-O] ... [15-L]  | | VUELTO: $ 6.175 CLP     | |
| [SECTOR B: 16-O] [17-L] [18-O] [19-R] [20-O  ] [21-L] ... [30-O]  | | [Efectivo] [Tarjeta POS]| |
| Leyenda: [Verde: Libre] [Gris: Ocupado] [Ámbar: Reservado]         | | [Cobro Parcial con PIN] | |
| Kanban: [<1h: 12] [1-2h: 8] [2-4h: 4] [>4h (Alerta): 2]            | +-------------------------+ |
+--------------------------------------------------------------------+-----------------------------+
| PIE: [F1: Abrir Barrera] [F3: Buscar Patente] [F4: Ticket Perdido] [F9: Cierre Ciego de Turno]   |
+--------------------------------------------------------------------------------------------------+
```

---

## 4. Auditoría y Cierre de Turno

- **Arqueo Ciego**: Desglose por denominación de billetes y comprobantes POS.
- **Comparativa Automática**:
  - `Efectivo Sistema`: `$145.000`
  - `Efectivo Declarado`: `$145.000`
  - `Diferencia`: `$0 (Cuadre Exacto)`
- **Incidencias en Auditoría**:
  - **Verde**: Descuentos autorizados con PIN.
  - **Rojo**: Cobro de multa por ticket perdido ($10.000) o salidas no autorizadas.
  - **Azul**: Tickets pagados normalmente.
