const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

console.log('--- Starting Functional Parity Verification ---');

// 1. Load baseline (HEAD) and optimized (local) data.js code
let baselineCode;
try {
  baselineCode = execSync('git show HEAD:data.js').toString('utf8');
} catch (e) {
  console.error('Failed to load baseline code from git HEAD:', e.message);
  process.exit(1);
}

const optimizedCode = fs.readFileSync('data.js', 'utf8');

// 2. Prepare code for VM execution by converting const/let to var for global visibility
function prepareCode(code) {
  return code
    .replace(/\bconst SUBJECTS\b/g, 'var SUBJECTS')
    .replace(/\blet _/g, 'var _');
}

const preparedBaseline = prepareCode(baselineCode);
const preparedOptimized = prepareCode(optimizedCode);

// 3. Create isolated contexts
const baselineSandbox = {};
vm.createContext(baselineSandbox);
vm.runInContext(preparedBaseline, baselineSandbox);

const optimizedSandbox = {};
vm.createContext(optimizedSandbox);
vm.runInContext(preparedOptimized, optimizedSandbox);

// Helper to deep compare two objects
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }
  return true;
}

// 4. Run Parity Tests
let failures = 0;

// Test getAllFormulas()
console.log('Running test: getAllFormulas()...');
const baseAll = baselineSandbox.getAllFormulas();
const optAll = optimizedSandbox.getAllFormulas();

if (baseAll.length !== optAll.length) {
  console.error(`FAIL: getAllFormulas() length mismatch. Baseline: ${baseAll.length}, Optimized: ${optAll.length}`);
  failures++;
} else {
  let listMatch = true;
  for (let i = 0; i < baseAll.length; i++) {
    if (!deepEqual(baseAll[i], optAll[i])) {
      console.error(`FAIL: getAllFormulas() mismatch at index ${i}`);
      console.error('Baseline:', baseAll[i]);
      console.error('Optimized:', optAll[i]);
      listMatch = false;
      failures++;
      break;
    }
  }
  if (listMatch) {
    console.log(`SUCCESS: getAllFormulas() matches perfectly for all ${baseAll.length} formulas.`);
  }
}

// Test getFormulaById(id)
console.log('Running test: getFormulaById(id) for all formulas and edge cases...');
let idMatch = true;
for (const f of baseAll) {
  const baseResult = baselineSandbox.getFormulaById(f.id);
  const optResult = optimizedSandbox.getFormulaById(f.id);
  if (!deepEqual(baseResult, optResult)) {
    console.error(`FAIL: getFormulaById("${f.id}") mismatch.`);
    console.error('Baseline:', baseResult);
    console.error('Optimized:', optResult);
    idMatch = false;
    failures++;
  }
}

// Check with non-existent ID
const baseNone = baselineSandbox.getFormulaById('non_existent_id');
const optNone = optimizedSandbox.getFormulaById('non_existent_id');
if (baseNone !== optNone) {
  console.error(`FAIL: getFormulaById("non_existent_id") mismatch. Baseline: ${baseNone}, Optimized: ${optNone}`);
  failures++;
  idMatch = false;
}

if (idMatch) {
  console.log('SUCCESS: getFormulaById(id) matches perfectly.');
}

// Test resolveGlobalRelated(name, currentSubject)
console.log('Running test: resolveGlobalRelated(name, currentSubject)...');
let relatedMatch = true;

// Test resolving for every related field in every formula in baseline
for (const f of baseAll) {
  const currentSubject = f.subject;
  const relatedList = f.related || [];
  for (const r of relatedList) {
    const baseRes = baselineSandbox.resolveGlobalRelated(r, currentSubject);
    const optRes = optimizedSandbox.resolveGlobalRelated(r, currentSubject);
    if (!deepEqual(baseRes, optRes)) {
      console.error(`FAIL: resolveGlobalRelated("${r}", "${currentSubject}") mismatch.`);
      console.error('Baseline:', baseRes);
      console.error('Optimized:', optRes);
      relatedMatch = false;
      failures++;
    }

    // Also test different case combinations
    const lowerName = r.toLowerCase();
    const baseResLower = baselineSandbox.resolveGlobalRelated(lowerName, currentSubject);
    const optResLower = optimizedSandbox.resolveGlobalRelated(lowerName, currentSubject);
    if (!deepEqual(baseResLower, optResLower)) {
      console.error(`FAIL: resolveGlobalRelated("${lowerName}", "${currentSubject}") lower-case mismatch.`);
      relatedMatch = false;
      failures++;
    }

    const upperName = r.toUpperCase();
    const baseResUpper = baselineSandbox.resolveGlobalRelated(upperName, currentSubject);
    const optResUpper = optimizedSandbox.resolveGlobalRelated(upperName, currentSubject);
    if (!deepEqual(baseResUpper, optResUpper)) {
      console.error(`FAIL: resolveGlobalRelated("${upperName}", "${currentSubject}") upper-case mismatch.`);
      relatedMatch = false;
      failures++;
    }
  }
}

// Additional edge cases for resolveGlobalRelated
const extraCases = [
  { name: 'Lens', subject: 'Physics' },
  { name: 'Lens', subject: 'Chemistry' },
  { name: 'Hydrogen', subject: 'Chemistry' },
  { name: 'Hydrogen', subject: 'Physics' },
  { name: 'Short', subject: 'Physics' }, // length < 5
  { name: 'ExactMatchesAreCool', subject: 'Mathematics' },
  { name: 'NonexistentFormula', subject: 'Chemistry' },
  { name: 'Photo', subject: 'Physics' }, // length 5, startsWith match
  { name: 'Photoe', subject: 'Physics' }, // length 6, startsWith match
];

for (const tc of extraCases) {
  const baseRes = baselineSandbox.resolveGlobalRelated(tc.name, tc.subject);
  const optRes = optimizedSandbox.resolveGlobalRelated(tc.name, tc.subject);
  if (!deepEqual(baseRes, optRes)) {
    console.error(`FAIL: resolveGlobalRelated("${tc.name}", "${tc.subject}") extra case mismatch.`);
    console.error('Baseline:', baseRes);
    console.error('Optimized:', optRes);
    relatedMatch = false;
    failures++;
  }
}

if (relatedMatch) {
  console.log('SUCCESS: resolveGlobalRelated(name, currentSubject) matches perfectly.');
}

console.log('------------------------------------------------');
if (failures === 0) {
  console.log('🎉 ALL PARITY TESTS PASSED! 100% FUNCTIONAL PARITY CONFIRMED!');
} else {
  console.error(`❌ PARITY TEST FAILED with ${failures} failure(s).`);
  process.exit(1);
}
