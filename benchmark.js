const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

function prepareCode(code) {
  return code
    .replace(/\bconst SUBJECTS\b/, 'var SUBJECTS')
    .replace(/\bconst _formulaCache\b/g, 'var _formulaCache')
    .replace(/\blet _formulaCache\b/g, 'var _formulaCache')
    .replace(/\bconst _idMap\b/g, 'var _idMap')
    .replace(/\blet _idMap\b/g, 'var _idMap')
    .replace(/\bconst _globalNameMap\b/g, 'var _globalNameMap')
    .replace(/\blet _globalNameMap\b/g, 'var _globalNameMap')
    .replace(/\bconst _subjectNameMaps\b/g, 'var _subjectNameMaps')
    .replace(/\blet _subjectNameMaps\b/g, 'var _subjectNameMaps')
    .replace(/\bconst _globalPrefixMap\b/g, 'var _globalPrefixMap')
    .replace(/\blet _globalPrefixMap\b/g, 'var _globalPrefixMap')
    .replace(/\bconst _subjectPrefixMaps\b/g, 'var _subjectPrefixMaps')
    .replace(/\blet _subjectPrefixMaps\b/g, 'var _subjectPrefixMaps');
}

function runInContext(code) {
  const sandbox = {
    console: console
  };
  const context = vm.createContext(sandbox);
  vm.runInContext(prepareCode(code), context);
  return sandbox;
}

// 1. Load baseline (from Git HEAD)
let baselineCode;
try {
  baselineCode = execSync('git show HEAD:data.js', { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
} catch (e) {
  console.log('Falling back to reading data.js as baseline because git show failed');
  baselineCode = fs.readFileSync('data.js', 'utf-8');
}

// 2. Load modified code
const modifiedCode = fs.readFileSync('data.js', 'utf-8');

console.log('Loading baseline and modified contexts...');
const baselineCtx = runInContext(baselineCode);
const modifiedCtx = runInContext(modifiedCode);

// Assert functions exist
const functions = ['getAllFormulas', 'getFormulaById', 'resolveGlobalRelated'];
for (const fn of functions) {
  if (typeof baselineCtx[fn] !== 'function') throw new Error(`Baseline is missing function: ${fn}`);
  if (typeof modifiedCtx[fn] !== 'function') throw new Error(`Modified is missing function: ${fn}`);
}

console.log('Functions verified. Verifying data parity...');

// Check getAllFormulas
const baselineAll = baselineCtx.getAllFormulas();
const modifiedAll = modifiedCtx.getAllFormulas();

if (baselineAll.length !== modifiedAll.length) {
  throw new Error(`Length mismatch for getAllFormulas: baseline=${baselineAll.length}, modified=${modifiedAll.length}`);
}

for (let i = 0; i < baselineAll.length; i++) {
  const b = baselineAll[i];
  const m = modifiedAll[i];
  if (JSON.stringify(b) !== JSON.stringify(m)) {
    throw new Error(`Mismatch at index ${i} in getAllFormulas:\nBaseline: ${JSON.stringify(b)}\nModified: ${JSON.stringify(m)}`);
  }
}
console.log('✅ getAllFormulas matches perfectly!');

// Check getFormulaById
console.log('Verifying getFormulaById for all formula IDs...');
for (const f of baselineAll) {
  const bFormula = baselineCtx.getFormulaById(f.id);
  const mFormula = modifiedCtx.getFormulaById(f.id);
  if (JSON.stringify(bFormula) !== JSON.stringify(mFormula)) {
    throw new Error(`Mismatch for getFormulaById with ID ${f.id}`);
  }
}
// Also verify non-existent ID
if (baselineCtx.getFormulaById('non-existent') !== null || modifiedCtx.getFormulaById('non-existent') !== null) {
  throw new Error('Mismatch for non-existent formula ID in getFormulaById');
}
console.log('✅ getFormulaById matches perfectly!');

// Check resolveGlobalRelated
console.log('Verifying resolveGlobalRelated for all formula names, related terms, and subjects...');
const subjects = ['Physics', 'Mathematics', 'Chemistry'];

// Collect names, related elements and variations
const testCases = [];
for (const f of baselineAll) {
  testCases.push({ name: f.name, subject: f.subject });
  testCases.push({ name: f.name.toLowerCase(), subject: f.subject });
  testCases.push({ name: f.name.toUpperCase(), subject: f.subject });
  if (f.name.length >= 6) {
    testCases.push({ name: f.name.substring(0, 5), subject: f.subject });
    testCases.push({ name: f.name.substring(0, 5).toLowerCase(), subject: f.subject });
  }
  if (f.related) {
    for (const rel of f.related) {
      testCases.push({ name: rel, subject: f.subject });
      testCases.push({ name: rel.toLowerCase(), subject: f.subject });
      if (rel.length >= 6) {
        testCases.push({ name: rel.substring(0, 5), subject: f.subject });
      }
    }
  }
}

// Add some random/edge cases
testCases.push({ name: 'Lens', subject: 'Physics' });
testCases.push({ name: 'Lens', subject: 'Chemistry' });
testCases.push({ name: 'quantum', subject: 'Physics' });
testCases.push({ name: 'quantum', subject: 'Mathematics' });
testCases.push({ name: 'Organic', subject: 'Chemistry' });
testCases.push({ name: 'non-existent-name', subject: 'Physics' });
testCases.push({ name: 'abc', subject: 'Mathematics' }); // length < 5 prefix test

let mismatchCount = 0;
for (const tc of testCases) {
  const bRes = baselineCtx.resolveGlobalRelated(tc.name, tc.subject);
  const mRes = modifiedCtx.resolveGlobalRelated(tc.name, tc.subject);
  if (JSON.stringify(bRes) !== JSON.stringify(mRes)) {
    console.error(`Mismatch for resolveGlobalRelated("${tc.name}", "${tc.subject}"):`);
    console.error(`  Baseline: ${JSON.stringify(bRes)}`);
    console.error(`  Modified: ${JSON.stringify(mRes)}`);
    mismatchCount++;
    if (mismatchCount > 5) break;
  }
}

if (mismatchCount > 0) {
  throw new Error(`resolveGlobalRelated has ${mismatchCount} mismatches!`);
}
console.log('✅ resolveGlobalRelated matches perfectly!');

console.log('\n--- Benchmarking Performance ---');

// Warm up
for (let i = 0; i < 1000; i++) {
  baselineCtx.getFormulaById(baselineAll[i % baselineAll.length].id);
  modifiedCtx.getFormulaById(baselineAll[i % baselineAll.length].id);
}

// Benchmark getFormulaById
const ITERATIONS = 20000;

console.log(`Running getFormulaById benchmark (${ITERATIONS} iterations)...`);
const startB_id = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  baselineCtx.getFormulaById(baselineAll[i % baselineAll.length].id);
}
const endB_id = Date.now();
const timeB_id = endB_id - startB_id;

const startM_id = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  modifiedCtx.getFormulaById(baselineAll[i % baselineAll.length].id);
}
const endM_id = Date.now();
const timeM_id = endM_id - startM_id;

console.log(`Baseline getFormulaById: ${timeB_id}ms`);
console.log(`Modified getFormulaById: ${timeM_id}ms`);
console.log(`Speedup for getFormulaById: ${(timeB_id / Math.max(timeM_id, 1)).toFixed(2)}x`);

// Benchmark resolveGlobalRelated
console.log(`Running resolveGlobalRelated benchmark (${ITERATIONS} iterations)...`);
const startB_rel = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  const tc = testCases[i % testCases.length];
  baselineCtx.resolveGlobalRelated(tc.name, tc.subject);
}
const endB_rel = Date.now();
const timeB_rel = endB_rel - startB_rel;

const startM_rel = Date.now();
for (let i = 0; i < ITERATIONS; i++) {
  const tc = testCases[i % testCases.length];
  modifiedCtx.resolveGlobalRelated(tc.name, tc.subject);
}
const endM_rel = Date.now();
const timeM_rel = endM_rel - startM_rel;

console.log(`Baseline resolveGlobalRelated: ${timeB_rel}ms`);
console.log(`Modified resolveGlobalRelated: ${timeM_rel}ms`);
console.log(`Speedup for resolveGlobalRelated: ${(timeB_rel / Math.max(timeM_rel, 1)).toFixed(2)}x`);

console.log('\nAll tests and benchmarks completed successfully!');
