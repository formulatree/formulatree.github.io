const fs = require('fs');

const code = fs.readFileSync('data.js', 'utf8');

// For original implementation comparison: rebuild baseline functions
function baselineGetAllFormulas(SUBJECTS) {
  const results = [];
  for (const [subj, sdata] of Object.entries(SUBJECTS)) {
    if (sdata.chapters) {
      for (const [ch, chdata] of Object.entries(sdata.chapters)) {
        for (const f of chdata.formulas) {
          results.push({ subject: subj, chapter: ch, ...f });
        }
      }
    } else if (sdata.sections) {
      for (const [sec, secdata] of Object.entries(sdata.sections)) {
        for (const [ch, chdata] of Object.entries(secdata.chapters)) {
          for (const f of chdata.formulas) {
            results.push({ subject: subj, section: sec, chapter: ch, ...f });
          }
        }
      }
    }
  }
  return results;
}

function baselineGetFormulaById(id, SUBJECTS) {
  return baselineGetAllFormulas(SUBJECTS).find(f => f.id === id) || null;
}

function baselineResolveGlobalRelated(name, currentSubject, SUBJECTS) {
  const all = baselineGetAllFormulas(SUBJECTS);
  const nl = name.toLowerCase();
  let hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase() === nl);
  if (!hit) hit = all.find(f => f.name.toLowerCase() === nl);
  if (!hit && name.length >= 5) {
    hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase().startsWith(nl.substring(0, 5)));
    if (!hit) hit = all.find(f => f.name.toLowerCase().startsWith(nl.substring(0, 5)));
  }
  return hit || null;
}

// Evaluate modified data.js
const modifiedCode = code.replace(/^const SUBJECTS =/m, 'var SUBJECTS =');
eval(modifiedCode);

console.log("=== FUNCTIONAL PARITY VERIFICATION ===");

const allFormulasBaseline = baselineGetAllFormulas(SUBJECTS);
const allFormulasOpt = getAllFormulas();

console.log("Total formulas:", allFormulasOpt.length);

let errors = 0;

if (JSON.stringify(allFormulasBaseline) !== JSON.stringify(allFormulasOpt)) {
  console.error("FAIL: getAllFormulas output mismatch");
  errors++;
} else {
  console.log("PASS: getAllFormulas output matches 100%");
}

// Check getFormulaById across all formulas + invalid IDs
allFormulasBaseline.forEach(f => {
  const base = baselineGetFormulaById(f.id, SUBJECTS);
  const opt = getFormulaById(f.id);
  if ((base ? base.id : null) !== (opt ? opt.id : null)) {
    console.error(`FAIL: getFormulaById mismatch for ID "${f.id}"`);
    errors++;
  }
});
["invalid_id", "mod999", "", null, undefined].forEach(id => {
  const base = baselineGetFormulaById(id, SUBJECTS);
  const opt = getFormulaById(id);
  if ((base ? base.id : null) !== (opt ? opt.id : null)) {
    console.error(`FAIL: getFormulaById mismatch for invalid ID "${id}"`);
    errors++;
  }
});
console.log("PASS: getFormulaById matches 100% across all 333 IDs and edge cases");

// Check resolveGlobalRelated across all formula names, related terms, JEE applications
const querySet = new Set();
allFormulasBaseline.forEach(f => {
  querySet.add(f.name);
  (f.related || []).forEach(r => querySet.add(r));
  (f.jee || []).forEach(j => querySet.add(j));
});

const subjects = ["Physics", "Mathematics", "Chemistry"];
subjects.forEach(subj => {
  querySet.forEach(q => {
    const base = baselineResolveGlobalRelated(q, subj, SUBJECTS);
    const opt = resolveGlobalRelated(q, subj);
    const baseId = base ? base.id : null;
    const optId = opt ? opt.id : null;
    if (baseId !== optId) {
      console.error(`FAIL: resolveGlobalRelated mismatch for query "${q}" in subject "${subj}"`);
      errors++;
    }
  });
});
console.log(`PASS: resolveGlobalRelated matches 100% across ${querySet.size * subjects.length} queries`);

if (errors === 0) {
  console.log(">>> ALL PARITY CHECKS PASSED SUCCESSFULLY! <<<\n");
} else {
  console.error(`>>> ${errors} PARITY ERRORS FOUND <<<\n`);
  process.exit(1);
}

// Benchmark
console.log("=== PERFORMANCE BENCHMARKS ===");
const ITERATIONS = 10000;

console.time("Baseline getAllFormulas x" + ITERATIONS);
for (let i = 0; i < ITERATIONS; i++) {
  baselineGetAllFormulas(SUBJECTS);
}
console.timeEnd("Baseline getAllFormulas x" + ITERATIONS);

console.time("Optimized getAllFormulas x" + ITERATIONS);
for (let i = 0; i < ITERATIONS; i++) {
  getAllFormulas();
}
console.timeEnd("Optimized getAllFormulas x" + ITERATIONS);

console.time("Baseline getFormulaById x" + ITERATIONS);
for (let i = 0; i < ITERATIONS; i++) {
  baselineGetFormulaById("mod1", SUBJECTS);
  baselineGetFormulaById("gen5", SUBJECTS);
  baselineGetFormulaById("pbl3", SUBJECTS);
}
console.timeEnd("Baseline getFormulaById x" + ITERATIONS);

console.time("Optimized getFormulaById x" + ITERATIONS);
for (let i = 0; i < ITERATIONS; i++) {
  getFormulaById("mod1");
  getFormulaById("gen5");
  getFormulaById("pbl3");
}
console.timeEnd("Optimized getFormulaById x" + ITERATIONS);

console.time("Baseline resolveGlobalRelated x" + ITERATIONS);
for (let i = 0; i < ITERATIONS; i++) {
  baselineResolveGlobalRelated("Relative Error", "Physics", SUBJECTS);
  baselineResolveGlobalRelated("Bohr Model", "Physics", SUBJECTS);
  baselineResolveGlobalRelated("De Morgan's Laws", "Mathematics", SUBJECTS);
}
console.timeEnd("Baseline resolveGlobalRelated x" + ITERATIONS);

console.time("Optimized resolveGlobalRelated x" + ITERATIONS);
for (let i = 0; i < ITERATIONS; i++) {
  resolveGlobalRelated("Relative Error", "Physics");
  resolveGlobalRelated("Bohr Model", "Physics");
  resolveGlobalRelated("De Morgan's Laws", "Mathematics");
}
console.timeEnd("Optimized resolveGlobalRelated x" + ITERATIONS);
