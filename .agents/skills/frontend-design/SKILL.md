---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with intentional typography, thoughtful layout, and high-signal UX. Use when designing, building, or styling web pages, components, dashboards, or applications to avoid generic AI-generated styles and achieve tailored, ergonomic visual design.
---

# Frontend Design: Principios de Excelencia Visual y Composición

Esta skill asegura que las interfaces construidas posean una identidad visual única, una jerarquía estética sólida y una estructura intencional, evitando los clichés comunes del código generado por IA.

---

## 1. Eliminar los Patrones Genéricos de IA ("AI Slop")

Muchos modelos de IA tienden a generar siempre los mismos recursos predeterminados:
- Fondos crema suave (#F4F1EA) o negro azulado genérico (#0B0B0B).
- Tarjetas idénticas con esquinas excesivamente redondeadas (`rounded-3xl`) y sombras flotantes suaves sin propósito funcional.
- Etiquetas en mayúsculas espaciadas innecesarias arriba de cada título (`TRACKED-OUT ALL CAPS`).
- Acentos de color degradados puramente decorativos sin significado semántico.

### Cómo evitarlo:
1. **La Forma Sigue a la Función**: En un sistema de parking o ERP, una tarjeta debe tener bordes definidos, contraste claro y densidad apropiada para mostrar datos, no espacio en blanco desperdiciado.
2. **Tipografía con Personalidad**: Usar escalas tipográficas proporcionales. No acentuar palabras individuales con negrita/cursiva dentro de un encabezado a menos que sea un dato dinámico.
3. **Estructura Visual con Significado**: Los divisores, bordes y etiquetas deben codificar información real (por ejemplo, separar zonas de parking o tramos horarios), nunca ser adornos vacíos.

---

## 2. Proceso de Trabajo: Planificar, Contrastar, Construir, Criticar

Antes de escribir código de maquetación:

1. **Definir el Sistema de Tokens Compacto**:
   - Paleta base: 4 a 6 valores hexadecimales con rol semántico explícito.
   - Tipografía: Fuente de interfaz y fuente monoespaciada para datos numéricos/patentes.
   - Alineación: Guiarse por cuadrícula estricta (12 columnas o CSS Grid flexible).
2. **Revisar contra el Caso de Uso Real**:
   - ¿Este botón es lo suficientemente grande para tocarlo rápidamente en una pantalla táctil?
   - ¿El contraste entre el fondo de la plaza y el texto de la patente permite leerlo sin esfuerzo?
3. **Gasto de Audacia en un Solo Punto Focal**:
   - En una pantalla de garita, el punto focal es el **estado del carril y la matrícula OCR**. Todo lo demás (menús secundarios, configuraciones) debe mantenerse en un segundo plano visual discreto y ordenado.

---

## 3. Redacción de Textos y Microcopy en el Diseño

- **Perspectiva del Usuario Operativo**:
  - Nombrar las acciones por lo que hacen: `"Abrir Barrera"`, `"Cobrar y Abrir"`, `"Imprimir Comprobante"` (en lugar de etiquetas ambiguas como `"Aceptar"` o `"Enviar"`).
- **Consistencia de Términos**:
  - Si un botón se llama `"Cerrar Turno"`, el modal de confirmación debe decir `"Confirmar Cierre de Turno"` y la notificación resultante `"Turno Cerrado Correctamente"`.
- **Manejo de Estados Vacíos y Errores**:
  - Los errores nunca deben ser vagos. `"No se detectó vehículo en el bucle magnético del carril 2"` es 10 veces más útil que `"Error de lectura"`.
  - Un estado vacío debe incluir la acción a tomar: `"No hay tickets pendientes de cobro en esta caja. [Buscar Matrícula Manual]"`.
