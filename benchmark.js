const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

console.log('--- Starting Performance Benchmarking ---');

// 1. Load baseline (HEAD) and optimized (local) data.js code
const baselineCode = execSync('git show HEAD:data.js').toString('utf8');
const optimizedCode = fs.readFileSync('data.js', 'utf8');

// 2. Prepare code for VM execution
function prepareCode(code) {
  return code
    .replace(/\bconst SUBJECTS\b/g, 'var SUBJECTS')
    .replace(/\blet _/g, 'var _');
}

const preparedBaseline = prepareCode(baselineCode);
const preparedOptimized = prepareCode(optimizedCode);

const baselineSandbox = {};
vm.createContext(baselineSandbox);
vm.runInContext(preparedBaseline, baselineSandbox);

const optimizedSandbox = {};
vm.createContext(optimizedSandbox);
vm.runInContext(preparedOptimized, optimizedSandbox);

const formulas = baselineSandbox.getAllFormulas();

// Helper to benchmark execution time
function runBenchmark(name, fn, iterations = 1000) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = process.hrtime.bigint();
  const nanoseconds = Number(end - start);
  const milliseconds = nanoseconds / 1_000_000;
  return milliseconds;
}

// Benchmark 1: getAllFormulas()
console.log('\nBenchmark 1: getAllFormulas() [1,000 calls]');
const baseTime1 = runBenchmark('Baseline', () => {
  baselineSandbox.getAllFormulas();
}, 1000);
const optTime1 = runBenchmark('Optimized', () => {
  optimizedSandbox.getAllFormulas();
}, 1000);

console.log(`Baseline  : ${baseTime1.toFixed(3)} ms`);
console.log(`Optimized : ${optTime1.toFixed(3)} ms`);
console.log(`Speedup   : ${(baseTime1 / optTime1).toFixed(1)}x`);

// Benchmark 2: getFormulaById() for all formulas
console.log('\nBenchmark 2: getFormulaById() [all formulas, 100 iterations]');
const baseTime2 = runBenchmark('Baseline', () => {
  for (const f of formulas) {
    baselineSandbox.getFormulaById(f.id);
  }
}, 100);
const optTime2 = runBenchmark('Optimized', () => {
  for (const f of formulas) {
    optimizedSandbox.getFormulaById(f.id);
  }
}, 100);

console.log(`Baseline  : ${baseTime2.toFixed(3)} ms`);
console.log(`Optimized : ${optTime2.toFixed(3)} ms`);
console.log(`Speedup   : ${(baseTime2 / optTime2).toFixed(1)}x`);

// Benchmark 3: resolveGlobalRelated() for all related entries in all formulas
console.log('\nBenchmark 3: resolveGlobalRelated() [all related items, 20 iterations]');
const baseTime3 = runBenchmark('Baseline', () => {
  for (const f of formulas) {
    const currentSubject = f.subject;
    for (const r of (f.related || [])) {
      baselineSandbox.resolveGlobalRelated(r, currentSubject);
    }
  }
}, 20);
const optTime3 = runBenchmark('Optimized', () => {
  for (const f of formulas) {
    const currentSubject = f.subject;
    for (const r of (f.related || [])) {
      optimizedSandbox.resolveGlobalRelated(r, currentSubject);
    }
  }
}, 20);

console.log(`Baseline  : ${baseTime3.toFixed(3)} ms`);
console.log(`Optimized : ${optTime3.toFixed(3)} ms`);
console.log(`Speedup   : ${(baseTime3 / optTime3).toFixed(1)}x`);

// Benchmark 4: Overall Card Rendering Emulation
console.log('\nBenchmark 4: Formula Card Rendering Emulation (resolveGlobalRelated + getFormulaById) [50 iterations]');
const baseTime4 = runBenchmark('Baseline', () => {
  for (const f of formulas) {
    baselineSandbox.getFormulaById(f.id);
    for (const r of (f.related || [])) {
      baselineSandbox.resolveGlobalRelated(r, f.subject);
    }
  }
}, 50);
const optTime4 = runBenchmark('Optimized', () => {
  for (const f of formulas) {
    optimizedSandbox.getFormulaById(f.id);
    for (const r of (f.related || [])) {
      optimizedSandbox.resolveGlobalRelated(r, f.subject);
    }
  }
}, 50);

console.log(`Baseline  : ${baseTime4.toFixed(3)} ms`);
console.log(`Optimized : ${optTime4.toFixed(3)} ms`);
console.log(`Speedup   : ${(baseTime4 / optTime4).toFixed(1)}x`);

console.log('\n----------------------------------------');
console.log('Performance verification complete!');
