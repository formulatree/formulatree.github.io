const fs = require('fs');
const code = fs.readFileSync('data.js', 'utf8');
eval(code);

console.log('Benchmarking getAllFormulas...');
let start = performance.now();
for (let i = 0; i < 1000; i++) {
  getAllFormulas();
}
let end = performance.now();
console.log(`getAllFormulas 1000 calls: ${(end - start).toFixed(2)}ms`);

const all = getAllFormulas();
const sampleId = all[all.length - 1].id;
const sampleName = all[all.length - 1].name;

console.log('Benchmarking getFormulaById...');
start = performance.now();
for (let i = 0; i < 1000; i++) {
  getFormulaById(sampleId);
}
end = performance.now();
console.log(`getFormulaById 1000 calls: ${(end - start).toFixed(2)}ms`);

console.log('Benchmarking resolveGlobalRelated...');
start = performance.now();
for (let i = 0; i < 1000; i++) {
  resolveGlobalRelated(sampleName, 'Physics');
}
end = performance.now();
console.log(`resolveGlobalRelated 1000 calls: ${(end - start).toFixed(2)}ms`);
