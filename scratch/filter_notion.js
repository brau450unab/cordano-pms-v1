const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/Users/BraulioAM/.gemini/antigravity/brain/45e70a57-d4ab-4eb5-9ed4-eeeeede8cae8/.system_generated/steps/14/output.txt', 'utf8'));
const results = data.results || [];
console.log('Total results:', results.length);
results.forEach(item => {
  let title = '';
  const props = item.properties || {};
  if (props.title && props.title.title && props.title.title[0]) {
    title = props.title.title[0].plain_text;
  } else if (props['RAZÓN SOCIAL'] && props['RAZÓN SOCIAL'].title && props['RAZÓN SOCIAL'].title[0]) {
    title = props['RAZÓN SOCIAL'].title[0].plain_text;
  } else if (item.title && item.title[0]) {
    title = item.title[0].plain_text;
  }
  console.log(`[${item.object}] ${item.id} -> ${title}`);
});
