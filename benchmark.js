const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

// 1. Get original (baseline) data.js from Git
const originalCode = execSync('git show HEAD:data.js', { encoding: 'utf8' });

// 2. Get current (optimized) data.js
const optimizedCode = fs.readFileSync('data.js', 'utf8');

// 3. Helper to create a sandbox context
function createSandbox() {
  const sandbox = {
    window: {},
    document: {
      addEventListener: () => {},
      getElementById: () => ({
        addEventListener: () => {}
      })
    }
  };
  sandbox.window.POPUP_DEFS = {};
  return vm.createContext(sandbox);
}

function prepareCode(code) {
  return code
    .replace(/\bconst\s+/g, 'var ')
    .replace(/\blet\s+/g, 'var ');
}

const ctxOriginal = createSandbox();
const ctxOptimized = createSandbox();

vm.runInContext(prepareCode(originalCode), ctxOriginal);
vm.runInContext(prepareCode(optimizedCode), ctxOptimized);

const originalAll = ctxOriginal.getAllFormulas();

// Warm up
for (let i = 0; i < 1000; i++) {
  ctxOriginal.getFormulaById('stt4');
  ctxOptimized.getFormulaById('stt4');
  ctxOriginal.resolveGlobalRelated('First Law', 'Chemistry');
  ctxOptimized.resolveGlobalRelated('First Law', 'Chemistry');
}

const ITERATIONS = 50000;

console.log(`Running ${ITERATIONS} iterations for benchmarking...\n`);

// Benchmark getFormulaById (baseline)
const startOrigId = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  ctxOriginal.getFormulaById('stt4');
}
const endOrigId = Date.now();
const timeOrigId = endOrigId - startOrigId;

// Benchmark getFormulaById (optimized)
const startOptId = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  ctxOptimized.getFormulaById('stt4');
}
const endOptId = Date.now();
const timeOptId = endOptId - startOptId;

console.log(`--- getFormulaById (${ITERATIONS} runs) ---`);
console.log(`Original:  ${timeOrigId} ms`);
console.log(`Optimized: ${timeOptId} ms`);
console.log(`Speedup:   ${(timeOrigId / timeOptId).toFixed(2)}x\n`);

// Benchmark resolveGlobalRelated (baseline)
const startOrigRel = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  ctxOriginal.resolveGlobalRelated('First Law', 'Chemistry');
}
const endOrigRel = Date.now();
const timeOrigRel = endOrigRel - startOrigRel;

// Benchmark resolveGlobalRelated (optimized)
const startOptRel = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  ctxOptimized.resolveGlobalRelated('First Law', 'Chemistry');
}
const endOptRel = Date.now();
const timeOptRel = endOptRel - startOptRel;

console.log(`--- resolveGlobalRelated (${ITERATIONS} runs) ---`);
console.log(`Original:  ${timeOrigRel} ms`);
console.log(`Optimized: ${timeOptRel} ms`);
console.log(`Speedup:   ${(timeOrigRel / timeOptRel).toFixed(2)}x\n`);
