const fs = require('fs');

const raw = fs.readFileSync('C:\\Users\\BraulioAM\\.gemini\\antigravity\\brain\\5669c12e-7772-45a0-aed1-ab4bbaf71e1b\\.system_generated\\steps\\132\\output.txt', 'utf8');
const data = JSON.parse(raw);

const screens = data.screens || [];
console.log(`Total screens found: ${screens.length}`);

screens.forEach((s, idx) => {
  console.log(`\n--- Screen #${idx + 1} ---`);
  console.log(`Name: ${s.name}`);
  console.log(`Title: ${s.title || '(no title)'}`);
  console.log(`Description: ${s.description || '(no description)'}`);
  if (s.prompt) console.log(`Prompt: ${s.prompt}`);
  if (s.userPrompt) console.log(`UserPrompt: ${s.userPrompt}`);
  if (s.deviceType) console.log(`DeviceType: ${s.deviceType}`);
  if (s.fileEntries) {
    console.log(`File entries: ${Object.keys(s.fileEntries).join(', ')}`);
  }
});
