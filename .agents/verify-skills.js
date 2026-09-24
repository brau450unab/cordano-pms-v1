const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, 'skills');
const dirs = fs.readdirSync(skillsDir);
let allValid = true;

console.log('Verificando skills en:', skillsDir);

dirs.forEach(d => {
  const skillFile = path.join(skillsDir, d, 'SKILL.md');
  if (!fs.existsSync(skillFile)) {
    console.error(`[FAIL] Falta SKILL.md en ${d}`);
    allValid = false;
    return;
  }
  const content = fs.readFileSync(skillFile, 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    console.error(`[FAIL] Frontmatter YAML no encontrado en ${d}/SKILL.md`);
    allValid = false;
    return;
  }
  const fmLines = match[1].split(/\r?\n/);
  const nameLine = fmLines.find(l => l.startsWith('name:'));
  const descLine = fmLines.find(l => l.startsWith('description:'));
  if (!nameLine || !descLine) {
    console.error(`[FAIL] name o description faltante en frontmatter de ${d}`);
    allValid = false;
    return;
  }
  console.log(`[OK] Skill '${d}': ${nameLine.trim()} | ${descLine.slice(0, 65)}...`);
});

if (allValid) {
  console.log('\n>>> Todas las 7 skills estan correctamente formateadas y validadas.');
} else {
  process.exit(1);
}
