const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');
const { performance } = require('perf_hooks');

// 1. Get original code (from git HEAD) and optimized code (from disk)
const originalRaw = execSync('git show HEAD:data.js').toString('utf8');
const optimizedRaw = fs.readFileSync('data.js', 'utf8');

// 2. Helper to replace 'const SUBJECTS' with 'var SUBJECTS' and load in a sandbox
function loadSandbox(rawCode) {
  const code = rawCode.replace(/\bconst\s+SUBJECTS\b/, 'var SUBJECTS');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox;
}

const original = loadSandbox(originalRaw);
const optimized = loadSandbox(optimizedRaw);

console.log('Running benchmarks...');

const origAll = original.getAllFormulas();

// Benchmark getAllFormulas()
function runGetAllFormulasBenchmark(lib, iterations = 2000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    lib.getAllFormulas();
  }
  return performance.now() - start;
}

// Benchmark getFormulaById()
function runGetFormulaByIdBenchmark(lib, iterations = 20) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    for (const f of origAll) {
      lib.getFormulaById(f.id);
    }
  }
  return performance.now() - start;
}

// Benchmark resolveGlobalRelated()
function runResolveGlobalRelatedBenchmark(lib, iterations = 20) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    for (const f of origAll) {
      if (f.related) {
        for (const rel of f.related) {
          lib.resolveGlobalRelated(rel, f.subject);
        }
      }
    }
  }
  return performance.now() - start;
}

// Run them and compare
console.log('\n--- getAllFormulas() ---');
const origTime1 = runGetAllFormulasBenchmark(original);
const optTime1 = runGetAllFormulasBenchmark(optimized);
console.log(`Original: ${origTime1.toFixed(2)} ms`);
console.log(`Optimized: ${optTime1.toFixed(2)} ms`);
console.log(`Speedup: ${(origTime1 / optTime1).toFixed(2)}x`);

console.log('\n--- getFormulaById() ---');
const origTime2 = runGetFormulaByIdBenchmark(original);
const optTime2 = runGetFormulaByIdBenchmark(optimized);
console.log(`Original: ${origTime2.toFixed(2)} ms`);
console.log(`Optimized: ${optTime2.toFixed(2)} ms`);
console.log(`Speedup: ${(origTime2 / optTime2).toFixed(2)}x`);

console.log('\n--- resolveGlobalRelated() ---');
const origTime3 = runResolveGlobalRelatedBenchmark(original);
const optTime3 = runResolveGlobalRelatedBenchmark(optimized);
console.log(`Original: ${origTime3.toFixed(2)} ms`);
console.log(`Optimized: ${optTime3.toFixed(2)} ms`);
console.log(`Speedup: ${(origTime3 / optTime3).toFixed(2)}x`);
