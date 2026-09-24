#!/usr/bin/env node
/**
 * Generador de Prompts y Configuración para Magnific AI
 * Uso: node .agents/skills/magnific-ai/scripts/generate-prompt.js <ui|architectural|cctv|signage>
 */

const PRESETS = {
  ui: {
    name: "Dashboard & UI Mockup (Sin Alucinación Deformante)",
    engine: "Faithful / Graphic",
    creativity: 0,
    resemblance: 95,
    hdr: 10,
    fractality: 0,
    scale: 2,
    prompt: "Ultra-sharp enterprise dark mode UI dashboard, crisp vector icons, perfectly legible monospace numbers, flat clean surfaces, slate blue and emerald accents, 8k resolution, zero compression artifacts, pixel-perfect alignment.",
    negative_prompt: "blurry, low contrast, distorted text, mutated icons, noisy textures, chromatic aberration"
  },
  architectural: {
    name: "Plano Arquitectónico y Recinto Serrano 447",
    engine: "Hard Surface / Architecture",
    creativity: 3,
    resemblance: 75,
    hdr: 45,
    fractality: 35,
    scale: 4,
    prompt: "Architectural aerial 3D render of an outdoor commercial parking lot in Iquique Chile, clean asphalt with clearly marked emerald green and slate stalls 01 to 30, automatic barrier arms, modern aluminum security booth, bright desert coastal daylight, photorealistic 8k.",
    negative_prompt: "cartoon, oversaturated, deformed buildings, cluttered, unrealistic scale"
  },
  cctv: {
    name: "Simulación de Cámara de Seguridad / Garita",
    engine: "Photographic",
    creativity: 2,
    resemblance: 80,
    hdr: 30,
    fractality: 20,
    scale: 2,
    prompt: "Real surveillance CCTV camera angle of a modern parking entry booth, vehicle approaching automatic barrier, crisp Chilean license plate format, security LED spotlight illumination, realistic high-definition security footage.",
    negative_prompt: "blurry, illegible plate, cinematic fantasy, heavy film grain"
  },
  signage: {
    name: "Señalética y Tótems Tarifarios Físicos",
    engine: "Hard Surface",
    creativity: 1,
    resemblance: 90,
    hdr: 25,
    fractality: 15,
    scale: 4,
    prompt: "High-contrast parking entrance LED totem and tariff sign, clean typography in Chilean Pesos CLP, ParkOps Cordano branding, metallic brushed finish, highly legible text, 8k product render.",
    negative_prompt: "spelling errors, illegible text, warped edges"
  }
};

const type = process.argv[2] || "ui";
const preset = PRESETS[type.toLowerCase()];

if (!preset) {
  console.log(`\n❌ Tipo '${type}' no encontrado.`);
  console.log(`Tipos disponibles: ${Object.keys(PRESETS).join(", ")}\n`);
  process.exit(1);
}

console.log("\n=======================================================");
console.log(`🎯 MAGNIFIC AI CONFIGURACIÓN - ${preset.name.toUpperCase()}`);
console.log("=======================================================");
console.log(`• Motor Recomendado: ${preset.engine}`);
console.log(`• Factor de Escala:  ${preset.scale}x`);
console.log(`• Creativity:        ${preset.creativity}`);
console.log(`• Resemblance:       ${preset.resemblance}`);
console.log(`• HDR:               ${preset.hdr}`);
console.log(`• Fractality:        ${preset.fractality}`);
console.log("\n📝 PROMPT SUGERIDO:");
console.log(`   "${preset.prompt}"`);
console.log("\n🚫 NEGATIVE PROMPT:");
console.log(`   "${preset.negative_prompt}"`);
console.log("=======================================================\n");
