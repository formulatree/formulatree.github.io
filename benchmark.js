const fs = require('fs');
const code = fs.readFileSync('./data.js', 'utf8');
eval(code);

console.time('getAllFormulas x 10000');
for (let i = 0; i < 10000; i++) {
  getAllFormulas();
}
console.timeEnd('getAllFormulas x 10000');

console.time('getFormulaById x 10000');
for (let i = 0; i < 10000; i++) {
  getFormulaById('mec1');
}
console.timeEnd('getFormulaById x 10000');

console.time('resolveGlobalRelated x 10000');
for (let i = 0; i < 10000; i++) {
  resolveGlobalRelated('Kinematic Equations', 'Physics');
}
console.timeEnd('resolveGlobalRelated x 10000');
