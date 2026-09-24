---
name: ui-ux-pro-max
description: UI/UX design intelligence for web, mobile, and enterprise management applications. Use when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layout, typography, color, charts, and stack-specific UI implementation. Searchable local database covers 79 styles, 192 product palettes, 74 font pairings, 119 UX guidelines, charts, and stacks.
---

# UI/UX Pro Max: Inteligencia de Diseño Integral

Sistema experto de diseño para interfaces web de alto impacto, enfocado en aplicaciones complejas B2B, dashboards y sistemas de gestión empresarial (ERP / PMS).

---

## 1. Utilidad de Búsqueda Local (CLI)

Puedes consultar la base de datos local en cualquier momento ejecutando:

```bash
node .agents/skills/ui-ux-pro-max/scripts/search.js <término>
```

### Ejemplos de Búsqueda
- `node .agents/skills/ui-ux-pro-max/scripts/search.js dashboard` -> Encuentra estilos, paletas y fuentes para paneles de control.
- `node .agents/skills/ui-ux-pro-max/scripts/search.js "financial dashboard"` -> Paletas y contrastes para módulos contables y cajas.
- `node .agents/skills/ui-ux-pro-max/scripts/search.js "real-time"` -> Pautas para streaming de datos en vivo (sensores de parking).
- `node .agents/skills/ui-ux-pro-max/scripts/search.js "table"` -> Directrices para tablas densas y paginación.

---

## 2. Paletas Semánticas Recomendadas para ERP / PMS

### Paleta A: Modo Día Profesional (Industrial Slate & Emerald)
- **Superficie Principal (`background`)**: `#F8FAFC` (Slate 50)
- **Superficie de Tarjetas (`card`)**: `#FFFFFF`
- **Bordes y Divisores (`border`)**: `#E2E8F0` (Slate 200)
- **Texto Principal (`foreground`)**: `#0F172A` (Slate 900)
- **Texto Secundario (`muted`)**: `#64748B` (Slate 500)
- **Acento Primario (`primary`)**: `#0284C7` (Sky 600) o `#1E40AF` (Blue 800)
- **Éxito / Disponible (`success`)**: `#10B981` (Emerald 500)
- **Advertencia / Ocupado (`warning`)**: `#F59E0B` (Amber 500)
- **Peligro / Alerta (`destructive`)**: `#EF4444` (Red 500)

### Paleta B: Modo Noche Garita / Control Room (Deep Charcoal & OLED)
- **Superficie Principal (`background`)**: `#090D16` / `#0B0F19`
- **Superficie de Tarjetas (`card`)**: `#111827` (Gray 900) con borde `#1F2937`
- **Bordes y Divisores (`border`)**: `#1F2937` (Gray 800)
- **Texto Principal (`foreground`)**: `#F3F4F6` (Gray 100)
- **Texto Secundario (`muted`)**: `#9CA3AF` (Gray 400)
- **Acentos Activos**: Indicadores con brillo controlado (`ring-1 ring-emerald-500/50`) para evitar deslumbramiento.

---

## 3. Tipografía y Jerarquía Numérica

En sistemas ERP y de cobro vehicular, **los números son tan importantes como las palabras**:

1. **Fuente de Interfaz**: `Inter`, `Geist`, o `Plus Jakarta Sans`.
   - Limpia, altamente legible en pantallas de baja resolución (tótem de garita).
2. **Números Tabulares (`tabular-nums`)**:
   - Para importes monetarios, contadores de plazas libres, patentes y cronómetros de tiempo estacionado, **usar siempre `font-mono tabular-nums`**.
   - Esto evita que los números "bailen" horizontalmente cuando el cronómetro o la recaudación se actualizan en tiempo real.
3. **Escala Modular**:
   - `text-xs` (11-12px): Etiquetas secundarias, horas de entrada, estado de sensor.
   - `text-sm` (13-14px): Celdas de tablas, botones estándar, campos de formulario.
   - `text-base` (15-16px): Títulos de tarjetas, campos numéricos principales.
   - `text-2xl` / `text-3xl`: Métricas KPI de ocupación (`85%`, `$1.450.000`).

---

## 4. Patrones de Componentes de Alto Rendimiento

### Formularios de Entrada Rápida
- **Autofocus Inteligente**: Al abrir un modal de cobro o escaneo, el cursor debe posicionarse automáticamente en el campo de matrícula/ticket.
- **Validación Instantánea sin Pérdida de Enfoque**: Mensajes de error en línea sin mover el cursor fuera del input.
- **Teclas de Confirmación**: `Enter` valida y ejecuta el cobro primario; `Esc` cancela.

### Tablas Densas con Acciones Rápidas
- **Paginación vs. Virtual Scroll**: Para listas de más de 500 tickets del día, implementar virtualización (`@tanstack/react-virtual` o scroll con carga por bloques).
- **Acciones en la Fila (Row Actions)**: Botón de acceso rápido a imprimir duplicado, ver foto LPR o anular sin abrir una página nueva.

### Modales y Drawers
- Utilizar elementos semánticos modernos (`<dialog>` con `showModal()`) o componentes basados en Radix UI (`Sheet` / `Dialog`) con `aria-modal="true"`.
- Los paneles laterales (*Drawers*) son superiores a los modales para auditoría: permiten al operador leer los datos de la fila de la tabla mientras revisa el detalle en el lateral derecho.
