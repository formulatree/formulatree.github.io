const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

function loadDataInContext(code) {
  const adaptedCode = code.replace(/^const SUBJECTS =/m, 'var SUBJECTS =')
                          .replace(/^let _/gm, 'var _');
  const context = vm.createContext({});
  vm.runInContext(adaptedCode, context);
  return context;
}

const originalCode = execSync('git show HEAD:data.js', { encoding: 'utf8' });
const originalContext = loadDataInContext(originalCode);

const originalAll = originalContext.getAllFormulas();

const allRelated = [];
for (const f of originalAll) {
  if (f.related) {
    for (const r of f.related) {
      allRelated.push({ name: r, subject: f.subject });
    }
  }
}

// Measure Baseline
const b0_t0 = performance.now();
for (let i = 0; i < 1000; i++) {
  originalContext.getAllFormulas();
}
const b0_t1 = performance.now();
const time_getAll_orig = b0_t1 - b0_t0;

const b1_t0 = performance.now();
for (const f of originalAll) {
  originalContext.getFormulaById(f.id);
}
const b1_t1 = performance.now();
const time_getById_orig = b1_t1 - b1_t0;

const b2_t0 = performance.now();
for (let i = 0; i < 10; i++) {
  for (const rel of allRelated) {
    originalContext.resolveGlobalRelated(rel.name, rel.subject);
  }
}
const b2_t1 = performance.now();
const time_resolve_orig = b2_t1 - b2_t0;

console.log('=== BASELINE PERFORMANCE (Git HEAD) ===');
console.log(`getAllFormulas() x 1000: ${time_getAll_orig.toFixed(3)} ms`);
console.log(`getFormulaById() x ${originalAll.length}: ${time_getById_orig.toFixed(3)} ms`);
console.log(`resolveGlobalRelated() x ${allRelated.length * 10}: ${time_resolve_orig.toFixed(3)} ms`);

// Test Current data.js
const currentCode = fs.readFileSync('data.js', 'utf8');
const currentContext = loadDataInContext(currentCode);

const c0_t0 = performance.now();
for (let i = 0; i < 1000; i++) {
  currentContext.getAllFormulas();
}
const c0_t1 = performance.now();
const time_getAll_curr = c0_t1 - c0_t0;

const c1_t0 = performance.now();
for (const f of originalAll) {
  currentContext.getFormulaById(f.id);
}
const c1_t1 = performance.now();
const time_getById_curr = c1_t1 - c1_t0;

const c2_t0 = performance.now();
for (let i = 0; i < 10; i++) {
  for (const rel of allRelated) {
    currentContext.resolveGlobalRelated(rel.name, rel.subject);
  }
}
const c2_t1 = performance.now();
const time_resolve_curr = c2_t1 - c2_t0;

console.log('\n=== OPTIMIZED PERFORMANCE (Current data.js) ===');
console.log(`getAllFormulas() x 1000: ${time_getAll_curr.toFixed(3)} ms (${(time_getAll_orig / time_getAll_curr).toFixed(1)}x speedup)`);
console.log(`getFormulaById() x ${originalAll.length}: ${time_getById_curr.toFixed(3)} ms (${(time_getById_orig / time_getById_curr).toFixed(1)}x speedup)`);
console.log(`resolveGlobalRelated() x ${allRelated.length * 10}: ${time_resolve_curr.toFixed(3)} ms (${(time_resolve_orig / time_resolve_curr).toFixed(1)}x speedup)`);
