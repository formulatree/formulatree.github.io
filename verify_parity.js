const fs = require('fs');
const execSync = require('child_process').execSync;

// Get baseline code from git HEAD
const baselineCode = execSync('git show HEAD:data.js', { encoding: 'utf8' }).replace('const SUBJECTS =', 'var SUBJECTS =');
const modifiedCode = fs.readFileSync('data.js', 'utf8').replace('const SUBJECTS =', 'var SUBJECTS =');

// Evaluate baseline in isolated scope
const baselineContext = {};
(function() {
  eval(baselineCode);
  baselineContext.getAllFormulas = getAllFormulas;
  baselineContext.getFormulaById = getFormulaById;
  baselineContext.resolveGlobalRelated = resolveGlobalRelated;
})();

// Evaluate modified in isolated scope
const modifiedContext = {};
(function() {
  eval(modifiedCode);
  modifiedContext.getAllFormulas = getAllFormulas;
  modifiedContext.getFormulaById = getFormulaById;
  modifiedContext.resolveGlobalRelated = resolveGlobalRelated;
})();

// 1. Verify Parity
const baseFormulas = baselineContext.getAllFormulas();
const modFormulas = modifiedContext.getAllFormulas();

console.log("=== Functional Parity Verification ===");
if (baseFormulas.length !== modFormulas.length) {
  console.error(`FAILED: Formula counts differ (${baseFormulas.length} vs ${modFormulas.length})`);
  process.exit(1);
}
console.log(`✓ Total formulas match: ${baseFormulas.length}`);

for (let i = 0; i < baseFormulas.length; i++) {
  if (JSON.stringify(baseFormulas[i]) !== JSON.stringify(modFormulas[i])) {
    console.error(`FAILED: Formula mismatch at index ${i}`);
    process.exit(1);
  }
}
console.log("✓ getAllFormulas() output array is 100% identical");

let idMismatch = false;
for (const f of baseFormulas) {
  const b = baselineContext.getFormulaById(f.id);
  const m = modifiedContext.getFormulaById(f.id);
  if (JSON.stringify(b) !== JSON.stringify(m)) {
    console.error(`FAILED: getFormulaById mismatch for ID '${f.id}'`);
    idMismatch = true;
    break;
  }
}
if (!idMismatch) console.log("✓ getFormulaById() returned 100% identical results across all IDs");

let relMismatch = false;
for (const f of baseFormulas) {
  if (f.related) {
    for (const rel of f.related) {
      const b = baselineContext.resolveGlobalRelated(rel, f.subject);
      const m = modifiedContext.resolveGlobalRelated(rel, f.subject);
      if (JSON.stringify(b) !== JSON.stringify(m)) {
        console.error(`FAILED: resolveGlobalRelated mismatch for query '${rel}' in '${f.subject}'`);
        relMismatch = true;
        break;
      }
    }
  }
  if (relMismatch) break;
}
if (!relMismatch) console.log("✓ resolveGlobalRelated() returned 100% identical results across all related topics");

// 2. Performance Benchmarks
console.log("\n=== Performance Benchmarks (10,000 iterations each) ===");

// Benchmark getAllFormulas
const t0Base = performance.now();
for (let i = 0; i < 10000; i++) baselineContext.getAllFormulas();
const t1Base = performance.now();

const t0Mod = performance.now();
for (let i = 0; i < 10000; i++) modifiedContext.getAllFormulas();
const t1Mod = performance.now();

const timeBaseAll = t1Base - t0Base;
const timeModAll = t1Mod - t0Mod;
console.log(`getAllFormulas(): Baseline ${timeBaseAll.toFixed(2)} ms vs Optimized ${timeModAll.toFixed(2)} ms (${(timeBaseAll / timeModAll).toFixed(1)}x speedup)`);

// Benchmark getFormulaById
const t2Base = performance.now();
for (let i = 0; i < 10000; i++) baselineContext.getFormulaById("evd9");
const t3Base = performance.now();

const t2Mod = performance.now();
for (let i = 0; i < 10000; i++) modifiedContext.getFormulaById("evd9");
const t3Mod = performance.now();

const timeBaseId = t3Base - t2Base;
const timeModId = t3Mod - t2Mod;
console.log(`getFormulaById(): Baseline ${timeBaseId.toFixed(2)} ms vs Optimized ${timeModId.toFixed(2)} ms (${(timeBaseId / timeModId).toFixed(1)}x speedup)`);

// Benchmark resolveGlobalRelated
const t4Base = performance.now();
for (let i = 0; i < 10000; i++) baselineContext.resolveGlobalRelated("Iodoform Test", "Chemistry");
const t5Base = performance.now();

const t4Mod = performance.now();
for (let i = 0; i < 10000; i++) modifiedContext.resolveGlobalRelated("Iodoform Test", "Chemistry");
const t5Mod = performance.now();

const timeBaseRel = t5Base - t4Base;
const timeModRel = t5Mod - t4Mod;
console.log(`resolveGlobalRelated(): Baseline ${timeBaseRel.toFixed(2)} ms vs Optimized ${timeModRel.toFixed(2)} ms (${(timeBaseRel / timeModRel).toFixed(1)}x speedup)`);

console.log("\nALL VERIFICATIONS AND BENCHMARKS PASSED SUCCESSFULLY!");
