#!/usr/bin/env node
/**
 * Clarity Upscaler CLI & Preset Formatter
 * Uso: node .agents/skills/clarity-upscaler/scripts/clarity-cli.js <ui|layout|cctv|ticket>
 */

const PRESETS = {
  ui: {
    target: "Mockups de Software / Pantallas Stitch ParkOps",
    scale_factor: 2,
    creativity: 0.15,
    resemblance: 1.8,
    dynamic: 5,
    fractality: 0.0,
    prompt: "Ultra clean enterprise dark mode UI, crisp monospace tabular numbers, sharp SVG icons, zero distortion, flat modern design, high resolution 4k",
    negative_prompt: "blurry, low quality, warped letters, messy symbols, photo noise, organic textures"
  },
  layout: {
    target: "Plano 2D / 3D Recinto Serrano 447 (30 Plazas)",
    scale_factor: 4,
    creativity: 0.45,
    resemblance: 1.1,
    dynamic: 18,
    fractality: 0.5,
    prompt: "Aerial architectural photograph of a commercial parking facility in Iquique Chile, sharp pavement lines in emerald green and slate, barrier arm, clear slot markings 01 to 30, sunny coastal daylight, 8k",
    negative_prompt: "deformed perspective, cartoon, lowres, noisy, warped lines"
  },
  cctv: {
    target: "Simulación de Cámara de Seguridad (Entrada Garita)",
    scale_factor: 2,
    creativity: 0.3,
    resemblance: 1.4,
    dynamic: 12,
    fractality: 0.3,
    prompt: "High-definition security surveillance camera view of parking entrance, license plate clearly visible, asphalt road, barrier arm, industrial lighting",
    negative_prompt: "blurry plate, cinematic bokeh, distorted numbers, compression artifacts"
  },
  ticket: {
    target: "Previsualización de Ticket Térmico y Código de Barras Code 128",
    scale_factor: 2,
    creativity: 0.05,
    resemblance: 2.2,
    dynamic: 4,
    fractality: 0.0,
    prompt: "High resolution scan of a 80mm thermal receipt ticket, crisp linear barcode Code 128, sharp typography, high contrast black on white paper, no blur",
    negative_prompt: "fuzzy barcode lines, distorted text, paper crumple, noise"
  }
};

const arg = process.argv[2] || "ui";
const config = PRESETS[arg.toLowerCase()];

if (!config) {
  console.log(`\n❌ Tipo '${arg}' no soportado.`);
  console.log(`Opciones disponibles: ${Object.keys(PRESETS).join(", ")}\n`);
  process.exit(1);
}

console.log("\n=======================================================");
console.log(`⚡ CLARITY UPSCALER - CONFIGURACIÓN: ${config.target.toUpperCase()}`);
console.log("=======================================================");
console.log(`• Factor de Escala:  ${config.scale_factor}x`);
console.log(`• Creativity:        ${config.creativity} (Denoise)`);
console.log(`• Resemblance:       ${config.resemblance} (ControlNet Tile Weight)`);
console.log(`• Dynamic:           ${config.dynamic} (Contrast/Sharpness)`);
console.log(`• Fractality:        ${config.fractality} (Texture Hallucination)`);
console.log("\n📝 PROMPT CONDICIONANTE:");
console.log(`   "${config.prompt}"`);
console.log("\n🚫 NEGATIVE PROMPT:");
console.log(`   "${config.negative_prompt}"`);
console.log("\n💡 Invocación en Replicate API:");
console.log(`   replicate.run("philz1337x/clarity-upscaler:...", { input: { scale_factor: ${config.scale_factor}, creativity: ${config.creativity}, resemblance: ${config.resemblance}, dynamic: ${config.dynamic} } })`);
console.log("=======================================================\n");
