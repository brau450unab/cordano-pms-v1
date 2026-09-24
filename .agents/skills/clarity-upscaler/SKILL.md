---
name: clarity-upscaler
description: Open-source high-resolution AI creative upscaler and enhancer by philz1337x based on Tiled MultiDiffusion, ControlNet, and SD checkpoints. Free Magnific AI alternative for super-resolution, UI sharpening, architectural detail synthesis, and low-res asset restoration via Replicate API or local ComfyUI.
---

# Clarity Upscaler: Escalado Generativo Open-Source (Alternativa a Magnific AI)

Esta skill documenta e implementa el uso de **Clarity Upscaler** (creado por **philz1337x**), una alternativa libre y de código abierto a Magnific AI diseñada para síntesis creativa de detalles, superresolución de interfaces, renders arquitectónicos y optimización visual sin costo por suscripción privativa.

- **Repositorio Oficial**: [github.com/philz1337x/clarity-upscaler](https://github.com/philz1337x/clarity-upscaler)
- **API en Replicate**: [replicate.com/philz1337x/clarity-upscaler](https://replicate.com/philz1337x/clarity-upscaler)
- **Plataforma Web**: [clarityai.co](https://clarityai.co)

---

## 1. Arquitectura Técnica de Clarity

A diferencia de los reescaladores tradicionales bicúbicos o ESRGAN clásicos (que solo interpolan o suavizan bordes), Clarity opera mediante un **pipeline de difusión generativa guiada por mosaicos**:

```
+-----------------------------------------------------------------------------------------------+
|                               PIPELINE CLARITY UPSCALER                                       |
+-----------------------------------------------------------------------------------------------+
| 1. Imagen Base (UI / Plano / Render)                                                          |
|      ↓                                                                                        |
| 2. Pre-escalado & Segmentación en Mosaicos (Tiled MultiDiffusion / Tile Overlap)             |
|      ↓                                                                                        |
| 3. Inyección de ControlNet (Tile / LineArt) para fijar estructura y no deformar texto/iconos   |
|      ↓                                                                                        |
| 4. Denoising Generativo condicionado por Prompt (Creativity, Dynamic, Fractality)              |
|      ↓                                                                                        |
| 5. Reensamblado Seamless y Corrección de Color / Resemblance                                   |
+-----------------------------------------------------------------------------------------------+
```

---

## 2. Parámetros de Control y Calibración

| Parámetro | Rango | Efecto en Interfaces de Software (UI) | Efecto en Renders y Planos (PMS) |
| :--- | :--- | :--- | :--- |
| **`scale_factor`** | `2x`, `4x` | Aumenta el canvas de 1080p a 4K o 8K nativo. | Convierte planos esquemáticos en renders de alta resolución. |
| **`creativity`** | `0.0` – `1.0` | **Mantener bajo (`0.1` a `0.25`)** para que no invente botones falsos ni altere cifras. | **`0.35` a `0.6`** para sintetizar texturas de asfalto, marcas viales y sombras. |
| **`resemblance`** | `0.0` – `3.0` | **Alto (`1.2` a `2.0`)** para asegurar que el diseño de Stitch/shadcn se mantenga idéntico. | **`0.8` a `1.3`** para respetar la distribución de los 30 slots sin perder realismo. |
| **`dynamic`** | `1` – `50` | **`3` a `8`** para evitar halos y mantener bordes tipográficos limpios. | **`12` a `25`** para realzar iluminación desértica de Iquique y contrastes. |
| **`fractality`** | `0.0` – `2.0` | **`0.0` a `0.1`** (cero ruido en fondos planos `bg-slate-950`). | **`0.4` a `0.9`** para grano sutil de materiales industriales y pavimentos. |

---

## 3. Presets Recomendados para ParkOps

### Preset 1: UI Crisp Precision (Mockups de Garita & ERP)
- `scale_factor`: `2`
- `creativity`: `0.15`
- `resemblance`: `1.8`
- `dynamic`: `5`
- `fractality`: `0.0`
- `prompt`: `"Ultra clean UI interface, crisp vector icons, razor-sharp monospace typography, flat design, perfectly aligned data table, zero noise, high contrast 4k"`
- `negative_prompt`: `"blurry, noisy, distorted text, warped lines, photorealistic face, organic mess"`

### Preset 2: Parking Layout & 3D Facility (Serrano 447)
- `scale_factor`: `4`
- `creativity`: `0.45`
- `resemblance`: `1.0`
- `dynamic`: `18`
- `fractality`: `0.6`
- `prompt`: `"Aerial photography of a 30-slot outdoor parking facility in Iquique Chile, clean asphalt pavement, clear emerald green lines, security barrier arm, bright daytime sunlight, 8k architectural detail"`
- `negative_prompt`: `"deformed, bad perspective, blurry, low resolution, messy cars, cartoon"`

---

## 4. Métodos de Ejecución

### Opción A: API Cloud vía Replicate (Recomendada para CI/CD y automatización)
```javascript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const output = await replicate.run(
  "philz1337x/clarity-upscaler:df798544c0177fc24316715f2aa34f590fc3646549a1d48c8b671a5c68adbe05",
  {
    input: {
      image: "https://.../cockpit_screen.png",
      scale_factor: 2,
      creativity: 0.2,
      resemblance: 1.5,
      dynamic: 6,
      prompt: "Crisp enterprise UI, sharp tabular numbers",
      negative_prompt: "blurry, artifacts"
    }
  }
);
console.log("Imagen escalada:", output);
```

### Opción B: Ejecución Local en ComfyUI
Para entornos con GPU NVIDIA (RTX 3060/4060 o superior con ≥8GB VRAM):
1. Instalar el nodo custom `ComfyUI-TiledDiffusion` y `ComfyUI_ControlNet_Tile`.
2. Cargar el checkpoint de SD 1.5 o SDXL.
3. Importar el flujo `clarity_workflow.json` con los valores de mosaico (Tile Width: 1024, Tile Height: 1024, Overlap: 96).

---

## 5. Tabla Comparativa: Magnific AI vs. Clarity Upscaler

| Característica | Magnific AI (Freepik) | Clarity Upscaler (philz1337x) |
| :--- | :--- | :--- |
| **Licencia / Costo** | Comercial / Créditos de pago | Open-Source / Gratuito (o costo marginal de GPU en Replicate) |
| **Especialidad Principal** | Fotorrealismo extremo y reiluminación (`Relight`) | Super-resolución controlada y preservación estructural con ControlNet |
| **Control en UI** | Requiere calibrar slider de creatividad en mínimos | Excelente fidelidad con `resemblance >= 1.5` |
| **Privacidad** | Procesa en servidores de Freepik / Magnific | Ejecutable localmente (100% offline y privado) |
| **Uso en ParkOps** | Renders de presentación comercial y marketing para socios | Automatización de activos de interfaz y generación de vistas 4K |
