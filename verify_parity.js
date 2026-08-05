const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

function loadInContext(code) {
  // Convert 'const SUBJECTS' and block-scoped variables to 'var'
  // so they bind to the vm global context
  let processed = code
    .replace(/const SUBJECTS\s*=/g, 'var SUBJECTS =')
    .replace(/const/g, 'var')
    .replace(/let\s+/g, 'var ');

  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(processed, context);
  return context;
}

console.log("Loading baseline data.js from Git HEAD...");
let baselineCode;
try {
  baselineCode = execSync("git show HEAD:data.js", { encoding: 'utf8' });
} catch (e) {
  console.error("Failed to read from Git, falling back to original code pattern (manual extraction if needed)...");
  // If git fails, we can't do exact baseline comparison. But we can still test the current one.
  process.exit(1);
}

console.log("Loading optimized data.js from filesystem...");
const optimizedCode = fs.readFileSync("data.js", "utf8");

const baselineContext = loadInContext(baselineCode);
const optimizedContext = loadInContext(optimizedCode);

console.log("Verifying 100% functional parity between baseline and optimized implementations...");

// 1. Verify getAllFormulas()
const baselineAll = baselineContext.getAllFormulas();
const optimizedAll = optimizedContext.getAllFormulas();

const baselineAllJSON = JSON.stringify(baselineAll);
const optimizedAllJSON = JSON.stringify(optimizedAll);

if (baselineAllJSON !== optimizedAllJSON) {
  console.error("Mismatch in getAllFormulas() results!");
  console.error("Baseline length:", baselineAll.length);
  console.error("Optimized length:", optimizedAll.length);
  process.exit(1);
}
console.log(`✅ getAllFormulas() parity OK. Checked ${baselineAll.length} formulas.`);

// 2. Verify getFormulaById() for every ID in baseline
let idCount = 0;
for (const f of baselineAll) {
  const bFormula = baselineContext.getFormulaById(f.id);
  const oFormula = optimizedContext.getFormulaById(f.id);
  if (JSON.stringify(bFormula) !== JSON.stringify(oFormula)) {
    console.error(`Mismatch for ID: ${f.id}`);
    process.exit(1);
  }
  idCount++;
}
// Check invalid ID
if (baselineContext.getFormulaById("invalid_id") !== optimizedContext.getFormulaById("invalid_id")) {
  console.error("Mismatch for invalid ID lookup!");
  process.exit(1);
}
console.log(`✅ getFormulaById() parity OK. Checked ${idCount} valid IDs and 1 invalid ID.`);

// 3. Verify resolveGlobalRelated() for various combinations
let relatedChecked = 0;
for (const f of baselineAll) {
  if (f.related) {
    for (const r of f.related) {
      const bRes = baselineContext.resolveGlobalRelated(r, f.subject);
      const oRes = optimizedContext.resolveGlobalRelated(r, f.subject);
      if (JSON.stringify(bRes) !== JSON.stringify(oRes)) {
        console.error(`Mismatch in resolveGlobalRelated for name: "${r}" under subject: "${f.subject}"`);
        console.error("Baseline:", JSON.stringify(bRes));
        console.error("Optimized:", JSON.stringify(oRes));
        process.exit(1);
      }
      relatedChecked++;
    }
  }
}
// Edge case checks
const edgeCases = [
  { name: "NonExistentFormula", subj: "Physics" },
  { name: "Kinetic", subj: "Chemistry" }, // Prefix match
  { name: "First Law", subj: "Chemistry" },
  { name: "Entropy and Second Law", subj: "Mathematics" },
];
for (const ec of edgeCases) {
  const bRes = baselineContext.resolveGlobalRelated(ec.name, ec.subj);
  const oRes = optimizedContext.resolveGlobalRelated(ec.name, ec.subj);
  if (JSON.stringify(bRes) !== JSON.stringify(oRes)) {
    console.error(`Mismatch in resolveGlobalRelated edge case: "${ec.name}" under subject: "${ec.subj}"`);
    process.exit(1);
  }
}
console.log(`✅ resolveGlobalRelated() parity OK. Checked ${relatedChecked} relations and edge cases.`);

console.log("\n🎉 ALL TESTS PASSED! 100% Functional Parity Verified!");
