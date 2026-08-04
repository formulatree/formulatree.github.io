const vm = require('vm');
const fs = require('fs');
const { execSync } = require('child_process');

console.log("Loading optimized source...");
let optSource = fs.readFileSync('data.js', 'utf8');
optSource = optSource.replace(/\blet\s+/g, 'var ').replace(/\bconst\s+/g, 'var ');

console.log("Loading baseline source from Git HEAD...");
let baselineSource = execSync('git show HEAD:data.js', { encoding: 'utf8' });
baselineSource = baselineSource.replace(/\blet\s+/g, 'var ').replace(/\bconst\s+/g, 'var ');

console.log("Creating VM contexts...");
const optContext = { Map, Object, Array, console };
vm.createContext(optContext);
vm.runInContext(optSource, optContext);

const baselineContext = { Map, Object, Array, console };
vm.createContext(baselineContext);
vm.runInContext(baselineSource, baselineContext);

const baselineAll = baselineContext.getAllFormulas();

// Warm up
optContext.getAllFormulas();
baselineContext.getAllFormulas();

console.log("\n--- BENCHMARK 1: getAllFormulas() ---");
const iters1 = 1000;
let start = Date.now();
for (let i = 0; i < iters1; i++) {
  baselineContext.getAllFormulas();
}
let timeBaseline1 = Date.now() - start;

start = Date.now();
for (let i = 0; i < iters1; i++) {
  optContext.getAllFormulas();
}
let timeOpt1 = Date.now() - start;

console.log(`Baseline (${iters1} runs): ${timeBaseline1}ms`);
console.log(`Optimized (${iters1} runs): ${timeOpt1}ms`);
console.log(`Speedup: ${(timeBaseline1 / Math.max(timeOpt1, 1)).toFixed(2)}x`);


console.log("\n--- BENCHMARK 2: getFormulaById() ---");
const iters2 = 10000;
const idsToTest = baselineAll.map(f => f.id);

start = Date.now();
for (let i = 0; i < iters2; i++) {
  const id = idsToTest[i % idsToTest.length];
  baselineContext.getFormulaById(id);
}
let timeBaseline2 = Date.now() - start;

start = Date.now();
for (let i = 0; i < iters2; i++) {
  const id = idsToTest[i % idsToTest.length];
  optContext.getFormulaById(id);
}
let timeOpt2 = Date.now() - start;

console.log(`Baseline (${iters2} runs): ${timeBaseline2}ms`);
console.log(`Optimized (${iters2} runs): ${timeOpt2}ms`);
console.log(`Speedup: ${(timeBaseline2 / Math.max(timeOpt2, 1)).toFixed(2)}x`);


console.log("\n--- BENCHMARK 3: resolveGlobalRelated() ---");
const iters3 = 10000;
const relatedTestCases = [];
for (const f of baselineAll) {
  if (f.related) {
    for (const r of f.related) {
      relatedTestCases.push({ name: r, subject: f.subject });
    }
  }
}

start = Date.now();
for (let i = 0; i < iters3; i++) {
  const tc = relatedTestCases[i % relatedTestCases.length];
  baselineContext.resolveGlobalRelated(tc.name, tc.subject);
}
let timeBaseline3 = Date.now() - start;

start = Date.now();
for (let i = 0; i < iters3; i++) {
  const tc = relatedTestCases[i % relatedTestCases.length];
  optContext.resolveGlobalRelated(tc.name, tc.subject);
}
let timeOpt3 = Date.now() - start;

console.log(`Baseline (${iters3} runs): ${timeBaseline3}ms`);
console.log(`Optimized (${iters3} runs): ${timeOpt3}ms`);
console.log(`Speedup: ${(timeBaseline3 / Math.max(timeOpt3, 1)).toFixed(2)}x`);
