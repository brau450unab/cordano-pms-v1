---
name: web-design-guidelines
description: Review and enforce Web Interface Guidelines compliance, accessibility (WCAG AA), focus management, keyboard navigation, and form UX. Use when asked to review UI code, check accessibility, audit design, or ensure production-grade interface quality.
metadata:
  author: vercel
  version: "1.0.0"
---

# Web Interface Guidelines: Checklist de Calidad en Producción

Guía de auditoría y reglas obligatorias para interfaces web profesionales, reactivas y accesibles.

---

## 1. Accesibilidad (WCAG 2.1 AA)

- **Botones con sólo icono**: Deben incluir obligatoriamente `aria-label` o texto oculto con clase `sr-only`.
  ```html
  <!-- Correcto -->
  <button aria-label="Abrir barrera de entrada"><BarrierIcon aria-hidden="true" /></button>
  ```
- **Iconos decorativos**: Deben tener siempre `aria-hidden="true"`.
- **Elementos interactivos**: Usar elementos semánticos reales (`<button>`, `<a>`, `<input>`) en lugar de `<div onClick={...}>`.
- **Actualizaciones asíncronas**: Los mensajes de estado en vivo (lectura LPR de cámara, cambio de sensor en plaza) deben usar `aria-live="polite"` o `aria-live="assertive"`.
- **Jerarquía de encabezados**: Un solo `<h1>` por página o vista principal, seguido de `<h2>`, `<h3>` sin saltarse niveles.

---

## 2. Gestión de Estados de Foco (Focus States)

- **Foco visible siempre**: Nunca usar `outline-none` sin proveer una alternativa visible como `focus-visible:ring-2 focus-visible:ring-primary`.
- **Diferenciar click de teclado**: Usar `:focus-visible` en lugar de `:focus` simple para que el ratón no dibuje bordes molestos pero el tabulador de teclado sí sea claramente visible.
- **Compuestos interactivos**: Usar `:focus-within` en contenedores de búsqueda o inputs compuestos (ej: prefijo de país + número de matrícula).
- **Trampas de foco (Focus Trap)**: Al abrir un modal de cobro o confirmación, el foco de teclado debe quedar atrapado dentro del modal y liberarse con `Esc`.

---

## 3. Formularios y Entradas Rápidas

- **Autocompletado y Tipo de Input**:
  - `inputmode="numeric"` para campos de importe y teclado de PIN/código.
  - `enterkeyhint="done"` o `"search"` para dispositivos táctiles.
  - `autoComplete="off"` en campos de búsqueda de patentes en tiempo real para evitar que el navegador tape la lista desplegable con datos guardados.
- **Validación con `:user-invalid`**: Mostrar errores sólo después de que el usuario haya interactuado con el campo, no de forma prematura al cargar la pantalla.
- **Sincronización de Contraste**: Las etiquetas de campo `<label>` deben estar vinculadas mediante `htmlFor` / `id` para permitir clic y enfoque rápido.

---

## 4. Rendimiento de Renderizado y Layout Shift

- **Dimensiones de Contenedores**: Reservar espacio para las imágenes de las cámaras LPR o gráficos en vivo (`aspect-ratio` o `min-h-[...]`) para evitar saltos de diseño (Cumulative Layout Shift - CLS).
- **Tablas con Ancho Fijo o Automático Predecible**: Especificar anchos relativos o fijos en columnas críticas (`w-24` para patentes, `w-20` para hora, `w-28` para importe) para que la tabla no cambie de ancho a medida que llegan registros.
- **Indicadores de Carga No Bloqueantes**: Usar esqueletos (*Skeleton Loaders*) con la misma geometría de las tarjetas en lugar de spinners flotantes que desajustan la pantalla.
