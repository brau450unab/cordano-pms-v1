---
name: magnific-ai
description: AI-driven generative image upscaling, detail hallucination, relighting, and visual enhancement powered by Magnific AI / Freepik. Use for upscaling UI mockups, 3D architectural facility renders, signage, vehicle visualizations, and high-DPI export for presentations.
---

# Magnific AI: Generative Upscaling, Relighting & Visual Enhancement

Esta skill proporciona patrones, parámetros de control y flujos de trabajo para aplicar **Magnific AI** (y su suite en Freepik AI) en la optimización estética, visual y de alta resolución de la interfaz de **ParkOps (PMS & ERP)** y los activos gráficos del recinto Serrano 447 (Iquique).

---

## 1. Capacidades Centrales de Magnific AI

Magnific AI es reconocido por su capacidad de **alucinación generativa controlada** (*Generative Hallucination*): en lugar de limitarse a interpolar o suavizar píxeles, sintetiza nuevos micro-detalles hiperrealistas y coherentes según el prompt y los parámetros de ponderación.

### Módulos Principales:
1. **Generative Upscaler (Original & 2.0)**:
   - Escalado 2x, 4x, 8x y 16x con síntesis de texturas (asfalto, metales, paneles LCD, tipografías vectoriales nítidas).
2. **Relight**:
   - Reiluminación direccional de escenas completas con mapas de luz 3D o prompts de texto (e.g. garita a mediodía soleado en Iquique vs. iluminación nocturna LED).
3. **Structure (Compose from Sketch)**:
   - Generación de escenas fotorrealistas a partir de planos 2D o esquemas de layout respetando los bordes y la perspectiva exacta.
4. **Style Transfer**:
   - Transferencia de estilo visual entre referencias manteniendo la estructura física del recinto o los componentes UI.
5. **Mystic**:
   - Generador fotorrealista texto-a-imagen para crear maquetas de vehículos, cámaras CCTV y entornos urbanos.

---

## 2. Parámetros Críticos de Control

Al aplicar Magnific a maquetas de UI o representaciones de estacionamiento, se deben calibrar cuidadosamente los 4 controles principales:

| Parámetro | Rango Típico | Comportamiento en UI / Dashboards | Comportamiento en Vistas Arquitectónicas |
| :--- | :--- | :--- | :--- |
| **`Creativity`** (Alucinación) | -10 a +10 (o 0 a 100) | **Bajo (-3 a 0)**: Evita deformar números monetarios, patentes o iconos. | **Medio/Alto (+2 a +5)**: Añade texturas realistas a pintura de piso, gravilla y postes. |
| **`HDR`** (Micro-contraste) | 0 a 100 | **Bajo (5 a 15)**: Mantiene colores planos limpios de shadcn/Tailwind. | **Alto (40 a 70)**: Realza luces LED, sombras de barreras y brillos de carrocería. |
| **`Resemblance`** (Fidelidad) | 0 a 100 | **Muy Alto (85 a 95)**: Preserva la fidelidad de botones, tablas y tarjetas. | **Medio (65 a 80)**: Permite que el motor enriquezca el entorno sin distorsionar el plano. |
| **`Fractality`** (Densidad textura) | 0 a 100 | **Mínimo (0 a 10)**: Previene ruido granulado en fondos oscuros (`#0F172A`). | **Medio (30 a 50)**: Simula grano de asfalto, desgaste de pintura y reflejos. |

---

## 3. Presets Recomendados para ParkOps

### Preset A: UI Screenshots & Dashboard Screens (Cockpit Garita / POS)
- **Objetivo**: Convertir capturas de Google Stitch o exportaciones a resolución 4K/8K ultra nítidas para presentaciones y manuales.
- **Engine**: *Faithful* / *Graphic / Design*
- **Creativity**: `0` o `-1`
- **Resemblance**: `95`
- **HDR**: `10`
- **Fractality**: `0`
- **Prompt Guía**:
  ```text
  Ultra-sharp enterprise dark mode UI dashboard, crisp vector icons, perfectly legible monospace numbers, flat clean surfaces, 8k resolution, zero compression artifacts, pixel-perfect alignment.
  ```

### Preset B: Vistas 3D Arquitectónicas del Recinto (Serrano 447)
- **Objetivo**: Renderizar el plano de las 30 plazas con aspecto de estacionamiento real en Iquique (Sector A y B).
- **Engine**: *Hard Surface / Architecture*
- **Creativity**: `+3`
- **Resemblance**: `75`
- **HDR**: `45`
- **Fractality**: `35`
- **Prompt Guía**:
  ```text
  Architectural aerial view of an outdoor parking lot in Iquique Chile, clean asphalt with emerald green and slate painted parking stalls marked 01 to 30, automatic barrier arms, modern aluminum security booth, sunny coastal daylight, hyperrealistic 8k render.
  ```

### Preset C: Simulación de Cámaras de Seguridad CCTV
- **Objetivo**: Mockups de video feed de garita para validación visual de ingreso de patentes.
- **Engine**: *Photographic*
- **Creativity**: `+2`
- **Resemblance**: `80`
- **HDR**: `30`
- **Prompt Guía**:
  ```text
  Security CCTV camera angle of a car entering a parking booth, crisp Chilean license plate visible, industrial security gate, realistic lens distortion, timestamp overlay.
  ```

---

## 4. Integración Técnica (API y Scripting)

Magnific opera a través de su plataforma web y mediante la **Freepik AI Suite API** (`api.freepik.com`):

### Endpoint de Upscaler en Freepik API:
```http
POST https://api.freepik.com/v1/ai/image-upscaler
Headers:
  x-freepik-api-key: <TU_API_KEY>
  Content-Type: application/json

Body:
{
  "image": { "url": "https://..." },
  "scale": 2,
  "engine": "magnific-precision",
  "creativity": 15,
  "resemblance": 85,
  "prompt": "Ultra sharp UI presentation"
}
```

Script de utilidad local incluido en:
- `node .agents/skills/magnific-ai/scripts/generate-prompt.js <tipo_vista>`
