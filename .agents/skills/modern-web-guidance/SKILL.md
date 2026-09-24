---
name: modern-web-guidance
description: Modern web platform best practices, native browser APIs, high-performance CSS, and accessible UI patterns supported by the Google Chrome and Microsoft Edge teams. Use when implementing dialogs, tooltips, view transitions, responsive layouts, container queries, or modern form inputs without bloated JavaScript workarounds.
---

# Modern Web Guidance: APIs Nativas y Plataforma Web Moderna

Esta skill proporciona las mejores prácticas oficiales de la Web Platform (Google Chrome & Microsoft Edge) para construir interfaces de alto rendimiento utilizando capacidades nativas del navegador en lugar de bibliotecas JavaScript pesadas.

---

## 1. Componentes Nativos Reemplazando JS Pesado

### A. Diálogos y Modales Nativos con `<dialog>`
En lugar de librerías complejas de modales:
```html
<dialog id="modal-cobro" class="backdrop:bg-black/60 rounded-xl p-6 shadow-2xl border border-slate-700">
  <form method="dialog">
    <h3 class="text-lg font-bold">Cobro de Ticket #8492</h3>
    <!-- Contenido -->
    <button value="cancel" class="btn-secondary">Cancelar</button>
    <button value="confirm" class="btn-primary">Confirmar Pago</button>
  </form>
</dialog>
```
- **Ventaja**: Manejo automático de foco, soporte nativo de tecla `Esc`, renderizado en la capa superior (*top layer*) sin problemas de `z-index`.

### B. Menús y Tooltips con Popover API & CSS Anchor Positioning
Para tooltips de plazas de parking o menús de acciones en tablas:
```html
<!-- Botón ancla -->
<button popovertarget="plaza-tooltip-A01" style="anchor-name: --plaza-A01" class="btn-plaza">
  A-01
</button>

<!-- Tooltip flotante posicionado nativamente sin librerías externas -->
<div id="plaza-tooltip-A01" popover style="position-anchor: --plaza-A01; top: anchor(bottom); left: anchor(center);" class="p-3 bg-slate-900 text-white rounded-lg shadow-lg">
  <p><strong>Plaza A-01</strong>: Ocupada (AB-1234)</p>
  <p>Tiempo: 1h 45m | Tarifa: $2.500</p>
</div>
```

---

## 2. Formularios de Nueva Generación

### Autoexpansión de Campos con `field-sizing: content`
Permite que inputs de búsqueda o notas de operador crezcan dinámicamente según el contenido sin una sola línea de código JavaScript de ajuste de altura:
```css
textarea.nota-incidencia {
  field-sizing: content;
  min-height: 2.5rem;
  max-height: 10rem;
}
```

### Pseudo-clase `:user-invalid`
Evita el molesto "formulario en rojo antes de escribir":
```css
input:user-invalid {
  border-color: #ef4444;
  outline-color: #ef4444;
}
```

---

## 3. Consultas de Contenedor (Container Queries)

Para componentes reutilizables como la **Tarjeta de Carril/Barrera** o el **Widget de Plaza de Parking**, el diseño debe responder al tamaño del contenedor en el que se ubica (panel lateral angosto vs. pantalla completa de garita):

```css
.lane-card-container {
  container-type: inline-size;
  container-name: lane-card;
}

@container lane-card (min-width: 400px) {
  .lane-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@container lane-card (max-width: 399px) {
  .lane-details {
    display: flex;
    flex-direction: column;
  }
}
```

---

## 4. Transiciones de Vista Fluidas (View Transitions API)

Al cambiar de vista (por ejemplo, de la lista general de tickets al detalle de cobro), la API nativa de transiciones crea una interpolación cinematográfica sin librerías pesadas:
```javascript
function cambiarVista(nuevaVista) {
  if (!document.startViewTransition) {
    actualizarDOM(nuevaVista);
    return;
  }
  document.startViewTransition(() => {
    actualizarDOM(nuevaVista);
  });
}
```

---

## 5. Accesibilidad Nativa con Atributo `inert`

Cuando un modal o panel de contingencia está activo, marcar todo el fondo con `inert` desactiva de forma nativa la interacción y la lectura de pantalla en los elementos de fondo:
```html
<main id="app-content" inert>
  <!-- Todo este contenido queda bloqueado de forma accesible -->
</main>
```
