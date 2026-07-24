const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

// 1. Get original (baseline) data.js from Git
const originalCode = execSync('git show HEAD:data.js', { encoding: 'utf8' });

// 2. Get current (optimized) data.js
const optimizedCode = fs.readFileSync('data.js', 'utf8');

// 3. Helper to create a sandbox context with standard browser/window globals
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

// 4. Evaluate both codes in separate contexts
// We convert 'let ' and 'const ' to 'var ' so they bind to the global sandbox object
function prepareCode(code) {
  // Replace 'let ' with 'var ' and 'const ' with 'var ' for top-level declarations
  // to make sure they bind to the sandbox context.
  return code
    .replace(/\bconst\s+/g, 'var ')
    .replace(/\blet\s+/g, 'var ');
}

const ctxOriginal = createSandbox();
const ctxOptimized = createSandbox();

vm.runInContext(prepareCode(originalCode), ctxOriginal);
vm.runInContext(prepareCode(optimizedCode), ctxOptimized);

const originalAll = ctxOriginal.getAllFormulas();
const optimizedAll = ctxOptimized.getAllFormulas();

console.log(`Original formulas count: ${originalAll.length}`);
console.log(`Optimized formulas count: ${optimizedAll.length}`);

if (originalAll.length !== optimizedAll.length) {
  console.error('Error: Formula count mismatch!');
  process.exit(1);
}

let mismatchCount = 0;

// Verify getFormulaById parity
originalAll.forEach(f => {
  const id = f.id;
  const originalResult = ctxOriginal.getFormulaById(id);
  const optimizedResult = ctxOptimized.getFormulaById(id);

  const origStr = JSON.stringify(originalResult);
  const optStr = JSON.stringify(optimizedResult);

  if (origStr !== optStr) {
    console.error(`Mismatch for getFormulaById(${id}):`);
    console.error(`Original:  ${origStr}`);
    console.error(`Optimized: ${optStr}`);
    mismatchCount++;
  }
});

// Verify resolveGlobalRelated parity
const testNames = [
  'First Law',
  "Saytzeff's Rule",
  "Markovnikov's Rule",
  'Hydrogen',
  'Water as Universal Solvent',
  'Hofmann Rule',
  'PCl₅ dissociation problems',
  'P-H Bonds',
  'Non-existent'
];
const subjects = ['Physics', 'Chemistry', 'Mathematics'];

testNames.forEach(name => {
  subjects.forEach(subj => {
    const originalResult = ctxOriginal.resolveGlobalRelated(name, subj);
    const optimizedResult = ctxOptimized.resolveGlobalRelated(name, subj);

    const origStr = JSON.stringify(originalResult);
    const optStr = JSON.stringify(optimizedResult);

    if (origStr !== optStr) {
      console.error(`Mismatch for resolveGlobalRelated("${name}", "${subj}"):`);
      console.error(`Original:  ${origStr}`);
      console.error(`Optimized: ${optStr}`);
      mismatchCount++;
    }
  });
});

if (mismatchCount === 0) {
  console.log('✅ ALL PARITY TESTS PASSED SUCCESSFULLY!');
} else {
  console.error(`❌ FAILED: ${mismatchCount} mismatch(es) detected.`);
  process.exit(1);
}
