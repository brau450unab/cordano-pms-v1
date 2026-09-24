#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const query = process.argv.slice(2).join(' ').toLowerCase().trim();

if (!query) {
  console.log('Uso: node search.js <término de búsqueda>');
  console.log('Ejemplo: node search.js dashboard');
  console.log('         node search.js fintech');
  console.log('         node search.js "color dark"');
  process.exit(0);
}

function searchCSV(filename, name) {
  const filePath = path.join(dataDir, filename);
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/).filter(Boolean);
  const header = lines[0];
  const results = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(query)) {
      results.push(lines[i]);
    }
  }
  return { name, header, results };
}

console.log(`\n=== Resultados para: "${query}" ===\n`);

const datasets = [
  { file: 'styles.csv', name: 'Estilos de UI' },
  { file: 'colors.csv', name: 'Paletas de Color' },
  { file: 'typography.csv', name: 'Tipografías & Maridajes' },
  { file: 'ux-guidelines.csv', name: 'Directrices UX & Accesibilidad' },
  { file: 'charts.csv', name: 'Gráficos & Visualizaciones' },
  { file: 'products.csv', name: 'Perfiles de Producto & Dominio' }
];

let totalMatches = 0;

datasets.forEach(ds => {
  const res = searchCSV(ds.file, ds.name);
  if (res.results.length > 0) {
    console.log(`--- ${res.name} (${res.results.length} coincidencias) ---`);
    res.results.slice(0, 5).forEach((line, idx) => {
      console.log(`  [${idx + 1}] ${line.length > 140 ? line.slice(0, 137) + '...' : line}`);
    });
    if (res.results.length > 5) {
      console.log(`  ... y ${res.results.length - 5} más.`);
    }
    console.log('');
    totalMatches += res.results.length;
  }
});

if (totalMatches === 0) {
  console.log('No se encontraron coincidencias exactas. Prueba con términos como: dashboard, table, dark, card, b2b, form, button');
}
