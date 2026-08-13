const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

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

console.log('Testing parity...');

// Helper to assert equality
function assertEqual(val1, val2, msg) {
  if (JSON.stringify(val1) !== JSON.stringify(val2)) {
    console.error(`Mismatch in: ${msg}`);
    console.error('Original:', val1);
    console.error('Optimized:', val2);
    process.exit(1);
  }
}

// Check getAllFormulas parity
const origAll = original.getAllFormulas();
const optAll = optimized.getAllFormulas();
assertEqual(origAll, optAll, 'getAllFormulas() output');

console.log('✅ getAllFormulas() parity passed (Length:', origAll.length, ')');

// Check getFormulaById parity for all possible IDs
for (const f of origAll) {
  const origF = original.getFormulaById(f.id);
  const optF = optimized.getFormulaById(f.id);
  assertEqual(origF, optF, `getFormulaById(${f.id})`);
}
// Test missing ID
assertEqual(original.getFormulaById('non-existent'), optimized.getFormulaById('non-existent'), 'getFormulaById(non-existent)');

console.log('✅ getFormulaById() parity passed');

// Check resolveGlobalRelated parity
// We'll test with each formula name, prefixes, mixed case, non-existent names
const subjects = ['Physics', 'Chemistry', 'Mathematics'];
for (const f of origAll) {
  for (const subj of subjects) {
    // 1. Exact name match
    assertEqual(
      original.resolveGlobalRelated(f.name, subj),
      optimized.resolveGlobalRelated(f.name, subj),
      `resolveGlobalRelated(${f.name}, ${subj})`
    );
    // 2. Exact lowercase match
    assertEqual(
      original.resolveGlobalRelated(f.name.toLowerCase(), subj),
      optimized.resolveGlobalRelated(f.name.toLowerCase(), subj),
      `resolveGlobalRelated(${f.name.toLowerCase()}, ${subj})`
    );
    // 3. Exact uppercase match
    assertEqual(
      original.resolveGlobalRelated(f.name.toUpperCase(), subj),
      optimized.resolveGlobalRelated(f.name.toUpperCase(), subj),
      `resolveGlobalRelated(${f.name.toUpperCase()}, ${subj})`
    );
    // 4. Prefix match (if length >= 5)
    if (f.name.length >= 5) {
      const prefix = f.name.substring(0, 5);
      assertEqual(
        original.resolveGlobalRelated(prefix, subj),
        optimized.resolveGlobalRelated(prefix, subj),
        `resolveGlobalRelated(prefix: ${prefix}, ${subj})`
      );
      assertEqual(
        original.resolveGlobalRelated(prefix.toLowerCase(), subj),
        optimized.resolveGlobalRelated(prefix.toLowerCase(), subj),
        `resolveGlobalRelated(prefix: ${prefix.toLowerCase()}, ${subj})`
      );
    }
  }
}

// Test related links in formulas
for (const f of origAll) {
  if (f.related) {
    for (const rel of f.related) {
      assertEqual(
        original.resolveGlobalRelated(rel, f.subject),
        optimized.resolveGlobalRelated(rel, f.subject),
        `resolveGlobalRelated related: ${rel} for subject ${f.subject}`
      );
    }
  }
}

console.log('✅ resolveGlobalRelated() parity passed');
console.log('🎉 ALL PARITY TESTS PASSED!');
