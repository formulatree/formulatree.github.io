/**
 * benchmark.js - Verification & Performance Benchmarking Tool
 * Compares unoptimized baseline from git with the optimized implementation in data.js.
 * Evaluates both in isolated Node.js VM contexts.
 */

const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

function runInContext(code) {
  // Convert 'let ' or 'const ' variables to 'var ' to expose them to VM sandbox/global namespace if needed,
  // but since we already used 'var' in the optimized code and the original code has 'const SUBJECTS' and
  // 'function getAllFormulas', let's replace block-scoped declarations inside the global scope of the file.
  let processed = code;
  processed = processed.replace(/^const SUBJECTS/m, 'var SUBJECTS');
  processed = processed.replace(/^let /gm, 'var ');
  processed = processed.replace(/^const /gm, 'var ');

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(processed, sandbox);
  return sandbox;
}

console.log('----------------------------------------------------');
console.log('⚡ Bolt: Loading Baseline and Optimized Implementations...');
console.log('----------------------------------------------------');

// Load original baseline code from git
let baselineCode;
try {
  baselineCode = execSync('git show HEAD:data.js').toString('utf8');
} catch (e) {
  console.error('Error fetching baseline from git. Make sure changes are not committed yet.');
  process.exit(1);
}

// Load current optimized code from disk
const optimizedCode = fs.readFileSync('data.js', 'utf8');

const baselineSandbox = runInContext(baselineCode);
const optimizedSandbox = runInContext(optimizedCode);

console.log('✅ Loaded baseline and optimized codebases successfully.');

console.log('\n----------------------------------------------------');
console.log('🔍 Running Functional Parity Tests...');
console.log('----------------------------------------------------');

let errors = 0;

function assertEqual(actual, expected, message) {
  const aStr = JSON.stringify(actual);
  const eStr = JSON.stringify(expected);
  if (aStr !== eStr) {
    console.error(`❌ FAIL: ${message}`);
    console.error(`   Expected: ${eStr}`);
    console.error(`   Actual:   ${aStr}`);
    errors++;
  } else {
    // console.log(`  Pass: ${message}`);
  }
}

// 1. Verify getAllFormulas() length and structural identity
const baselineAll = baselineSandbox.getAllFormulas();
const optimizedAll = optimizedSandbox.getAllFormulas();

assertEqual(optimizedAll.length, baselineAll.length, `getAllFormulas() length matches (${baselineAll.length})`);

// Verify exact structural and property order parity of every formula
for (let i = 0; i < baselineAll.length; i++) {
  assertEqual(
    optimizedAll[i],
    baselineAll[i],
    `Formula at index ${i} matches perfectly (ID: ${baselineAll[i].id})`
  );
}

// 2. Verify getFormulaById() for every ID
const allIds = baselineAll.map(f => f.id);
allIds.push('non_existent_id');

for (const id of allIds) {
  const expected = baselineSandbox.getFormulaById(id);
  const actual = optimizedSandbox.getFormulaById(id);
  assertEqual(actual, expected, `getFormulaById('${id}')`);
}

// 3. Verify resolveGlobalRelated() fallback and matching priority
const testCases = [
  { name: 'Lens', subject: 'Physics' },
  { name: 'Lens', subject: 'Chemistry' },
  { name: 'Ideal Gas Law', subject: 'Physics' },
  { name: 'Ideal Gas Law', subject: 'Chemistry' },
  { name: 'Thermochemistry: Hess\'s Law', subject: 'Chemistry' },
  { name: 'Thermochemistry: Hess\'s Law', subject: 'Physics' },
  { name: 'Nylon and Polyester Synthesis', subject: 'Chemistry' },
  { name: 'Nylon', subject: 'Chemistry' }, // prefix match (< 5 chars won't prefix match, but >= 5 will)
  { name: 'Nylons', subject: 'Chemistry' },
  { name: 'Coulomb\'s Law', subject: 'Physics' },
  { name: 'Coulomb\'s Law', subject: 'Mathematics' },
  { name: 'invalid_formula_name', subject: 'Physics' }
];

for (const tc of testCases) {
  const expected = baselineSandbox.resolveGlobalRelated(tc.name, tc.subject);
  const actual = optimizedSandbox.resolveGlobalRelated(tc.name, tc.subject);
  assertEqual(actual, expected, `resolveGlobalRelated('${tc.name}', '${tc.subject}')`);
}

if (errors === 0) {
  console.log('🎉 ALL FUNCTIONAL PARITY TESTS PASSED!');
  console.log('   Parity verification confirms 100% exact functional match and property ordering.');
} else {
  console.error(`❌ Parity verification failed with ${errors} errors.`);
  process.exit(1);
}

console.log('\n----------------------------------------------------');
console.log('⏱ Running Performance Benchmarks (10,000 runs)...');
console.log('----------------------------------------------------');

const RUNS = 10000;

// Benchmark getAllFormulas()
console.log(`\nTesting getAllFormulas() [${RUNS} iterations]:`);
const t0_base = Date.now();
for (let i = 0; i < RUNS; i++) {
  baselineSandbox.getAllFormulas();
}
const t0_base_end = Date.now();
const dur_base_all = t0_base_end - t0_base;
console.log(`- Baseline:  ${dur_base_all}ms`);

const t0_opt = Date.now();
for (let i = 0; i < RUNS; i++) {
  optimizedSandbox.getAllFormulas();
}
const t0_opt_end = Date.now();
const dur_opt_all = t0_opt_end - t0_opt;
console.log(`- Optimized: ${dur_opt_all}ms`);
console.log(`⚡ Speedup:  ${(dur_base_all / (dur_opt_all || 1)).toFixed(1)}x faster`);

// Benchmark resolveGlobalRelated()
console.log(`\nTesting resolveGlobalRelated() [${RUNS} iterations]:`);
const t1_base = Date.now();
for (let i = 0; i < RUNS; i++) {
  for (const tc of testCases) {
    baselineSandbox.resolveGlobalRelated(tc.name, tc.subject);
  }
}
const t1_base_end = Date.now();
const dur_base_related = t1_base_end - t1_base;
console.log(`- Baseline:  ${dur_base_related}ms`);

const t1_opt = Date.now();
for (let i = 0; i < RUNS; i++) {
  for (const tc of testCases) {
    optimizedSandbox.resolveGlobalRelated(tc.name, tc.subject);
  }
}
const t1_opt_end = Date.now();
const dur_opt_related = t1_opt_end - t1_opt;
console.log(`- Optimized: ${dur_opt_related}ms`);
console.log(`⚡ Speedup:  ${(dur_base_related / (dur_opt_related || 1)).toFixed(1)}x faster`);

console.log('\n----------------------------------------------------');
console.log('📈 Benchmark Summary:');
console.log(`- getAllFormulas speedup: ${(dur_base_all / (dur_opt_all || 1)).toFixed(1)}x`);
console.log(`- resolveGlobalRelated speedup: ${(dur_base_related / (dur_opt_related || 1)).toFixed(1)}x`);
console.log('----------------------------------------------------');
