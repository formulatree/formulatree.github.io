const fs = require('fs');
const dataJs = fs.readFileSync('data.js', 'utf8');

// Mock browser globals if needed
eval(dataJs);

const start = performance.now();
for (let i = 0; i < 1000; i++) {
  getAllFormulas();
}
const end = performance.now();
console.log(`getAllFormulas x 1000: ${(end - start).toFixed(2)}ms`);

const start2 = performance.now();
for (let i = 0; i < 1000; i++) {
  getFormulaById('mod9');
}
const end2 = performance.now();
console.log(`getFormulaById x 1000: ${(end2 - start2).toFixed(2)}ms`);

const start3 = performance.now();
for (let i = 0; i < 1000; i++) {
  resolveGlobalRelated('Photoelectric Effect', 'Physics');
}
const end3 = performance.now();
console.log(`resolveGlobalRelated x 1000: ${(end3 - start3).toFixed(2)}ms`);
