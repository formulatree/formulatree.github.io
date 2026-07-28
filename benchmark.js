// Baseline benchmark script
const fs = require('fs');
const vm = require('vm');

// Read data.js and load it into a VM context
let code = fs.readFileSync('data.js', 'utf8');
code = code.replace('const SUBJECTS =', 'var SUBJECTS =');

const context = {};
vm.createContext(context);
vm.runInContext(code, context);

const { getAllFormulas, getFormulaById, resolveGlobalRelated } = context;

console.log('--- BASELINE BENCHMARK ---');

// Warm up
const all = getAllFormulas();
console.log(`Loaded ${all.length} formulas.`);

// Benchmark getAllFormulas
console.time('getAllFormulas (10,000 runs)');
for (let i = 0; i < 10000; i++) {
  getAllFormulas();
}
console.timeEnd('getAllFormulas (10,000 runs)');

// Benchmark getFormulaById
console.time('getFormulaById (10,000 runs)');
for (let i = 0; i < 10000; i++) {
  getFormulaById('bio9');
}
console.timeEnd('getFormulaById (10,000 runs)');

// Benchmark resolveGlobalRelated
console.time('resolveGlobalRelated (10,000 runs)');
for (let i = 0; i < 10000; i++) {
  resolveGlobalRelated('Vitamins and Hormones Classification', 'Chemistry');
}
console.timeEnd('resolveGlobalRelated (10,000 runs)');
