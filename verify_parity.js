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

// Check if SUBJECTS is present
if (!optContext.SUBJECTS || !baselineContext.SUBJECTS) {
  console.error("Error: SUBJECTS not loaded in contexts!");
  process.exit(1);
}

console.log("--- 1. Testing getAllFormulas() Parity ---");
const optAll = optContext.getAllFormulas();
const baselineAll = baselineContext.getAllFormulas();

if (optAll.length !== baselineAll.length) {
  console.error(`FAIL: length mismatch. Optimized: ${optAll.length}, Baseline: ${baselineAll.length}`);
  process.exit(1);
}

if (JSON.stringify(optAll) !== JSON.stringify(baselineAll)) {
  console.error("FAIL: getAllFormulas() does not have functional parity (property order or values differ)!");
  // Find where they differ
  for (let i = 0; i < optAll.length; i++) {
    const oStr = JSON.stringify(optAll[i]);
    const bStr = JSON.stringify(baselineAll[i]);
    if (oStr !== bStr) {
      console.error(`Difference at index ${i}:`);
      console.error(`Optimized: ${oStr}`);
      console.error(`Baseline: ${bStr}`);
      break;
    }
  }
  process.exit(1);
}
console.log("PASS: getAllFormulas() matches baseline perfectly!");

console.log("--- 2. Testing getFormulaById() Parity ---");
for (const f of baselineAll) {
  const optFormula = optContext.getFormulaById(f.id);
  const baselineFormula = baselineContext.getFormulaById(f.id);
  if (JSON.stringify(optFormula) !== JSON.stringify(baselineFormula)) {
    console.error(`FAIL: getFormulaById('${f.id}') does not have parity!`);
    console.error(`Optimized: ${JSON.stringify(optFormula)}`);
    console.error(`Baseline: ${JSON.stringify(baselineFormula)}`);
    process.exit(1);
  }
}
console.log("PASS: getFormulaById() matches baseline perfectly for all formula IDs!");

console.log("--- 3. Testing resolveGlobalRelated() Parity ---");
const relatedTestCases = [];
for (const f of baselineAll) {
  if (f.related) {
    for (const r of f.related) {
      relatedTestCases.push({ name: r, subject: f.subject });
    }
  }
}

let relatedPass = true;
for (const testCase of relatedTestCases) {
  const optRes = optContext.resolveGlobalRelated(testCase.name, testCase.subject);
  const baselineRes = baselineContext.resolveGlobalRelated(testCase.name, testCase.subject);
  if (JSON.stringify(optRes) !== JSON.stringify(baselineRes)) {
    console.error(`FAIL: resolveGlobalRelated('${testCase.name}', '${testCase.subject}') does not have parity!`);
    console.error("Optimized:", JSON.stringify(optRes));
    console.error("Baseline:", JSON.stringify(baselineRes));
    relatedPass = false;
    process.exit(1);
  }
}
if (relatedPass) {
  console.log("PASS: resolveGlobalRelated() matches baseline perfectly for all related terms!");
}

console.log("\nALL FUNCTIONAL PARITY TESTS PASSED SUCCESSFULLY! 🎉");
