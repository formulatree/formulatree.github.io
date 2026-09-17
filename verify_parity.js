const fs = require('fs');
const execSync = require('child_process').execSync;

// Load Git HEAD version (unoptimized baseline)
const gitHeadCode = execSync('git show HEAD:data.js', { encoding: 'utf8' });

// Load current modified version (optimized)
const currentCode = fs.readFileSync('data.js', 'utf8');

// Function to run baseline logic in isolated VM/eval context
function createBaseline() {
  const code = gitHeadCode.replace(/const SUBJECTS =/g, 'var SUBJECTS =');
  const fn = new Function(code + `
    return {
      getAllFormulas: getAllFormulas,
      getFormulaById: getFormulaById,
      resolveGlobalRelated: resolveGlobalRelated
    };
  `);
  return fn();
}

// Function to run optimized logic in isolated VM/eval context
function createOptimized() {
  const code = currentCode.replace(/const SUBJECTS =/g, 'var SUBJECTS =');
  const fn = new Function(code + `
    return {
      getAllFormulas: getAllFormulas,
      getFormulaById: getFormulaById,
      resolveGlobalRelated: resolveGlobalRelated
    };
  `);
  return fn();
}

console.log("=== FormulaTree Parity & Performance Verification ===");

const baseline = createBaseline();
const optimized = createOptimized();

const baseAll = baseline.getAllFormulas();
const optAll = optimized.getAllFormulas();

console.log(`Checking getAllFormulas length: Baseline=${baseAll.length}, Optimized=${optAll.length}`);
if (baseAll.length !== optAll.length) {
  console.error("❌ Length mismatch!");
  process.exit(1);
}

let mismatches = 0;
let totalChecks = 0;

for (const f of baseAll) {
  // Check getFormulaById parity
  totalChecks++;
  const baseById = baseline.getFormulaById(f.id);
  const optById = optimized.getFormulaById(f.id);
  if (baseById?.id !== optById?.id || baseById?.name !== optById?.name || baseById?.chapter !== optById?.chapter) {
    console.error(`❌ getFormulaById mismatch for ID ${f.id}`);
    mismatches++;
  }

  // Check resolveGlobalRelated parity
  for (const r of (f.related || [])) {
    totalChecks++;
    const baseRel = baseline.resolveGlobalRelated(r, f.subject);
    const optRel = optimized.resolveGlobalRelated(r, f.subject);
    if (baseRel?.id !== optRel?.id || baseRel?.name !== optRel?.name || baseRel?.chapter !== optRel?.chapter) {
      console.error(`❌ resolveGlobalRelated mismatch for query "${r}" in ${f.subject}`);
      mismatches++;
    }
  }
}

if (mismatches === 0) {
  console.log(`✅ Functional parity verified 100%! All ${totalChecks} lookup checks passed perfectly.\n`);
} else {
  console.error(`❌ Found ${mismatches} mismatches out of ${totalChecks} checks.`);
  process.exit(1);
}

// Benchmark
console.log("=== Performance Benchmark ===");

const ITERATIONS = 1000;

console.time("Baseline 1,000x getAllFormulas");
for (let i = 0; i < ITERATIONS; i++) baseline.getAllFormulas();
console.timeEnd("Baseline 1,000x getAllFormulas");

console.time("Optimized 1,000x getAllFormulas");
for (let i = 0; i < ITERATIONS; i++) optimized.getAllFormulas();
console.timeEnd("Optimized 1,000x getAllFormulas");

console.time("Baseline 10,000x getFormulaById");
for (let i = 0; i < 10000; i++) baseline.getFormulaById(baseAll[i % baseAll.length].id);
console.timeEnd("Baseline 10,000x getFormulaById");

console.time("Optimized 10,000x getFormulaById");
for (let i = 0; i < 10000; i++) optimized.getFormulaById(baseAll[i % baseAll.length].id);
console.timeEnd("Optimized 10,000x getFormulaById");

console.time("Baseline 100x full related resolution pass");
for (let i = 0; i < 100; i++) {
  for (const f of baseAll) {
    for (const r of (f.related || [])) {
      baseline.resolveGlobalRelated(r, f.subject);
    }
  }
}
console.timeEnd("Baseline 100x full related resolution pass");

console.time("Optimized 100x full related resolution pass");
for (let i = 0; i < 100; i++) {
  for (const f of baseAll) {
    for (const r of (f.related || [])) {
      optimized.resolveGlobalRelated(r, f.subject);
    }
  }
}
console.timeEnd("Optimized 100x full related resolution pass");
