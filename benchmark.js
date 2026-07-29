const fs = require('fs');
const vm = require('vm');
const { performance } = require('perf_hooks');

// Read and prepare data.js
let src = fs.readFileSync('data.js', 'utf8');

// Replace top-level 'const' or 'let' declarations with 'var' in vm context
// so they bind to the global scope and are accessible.
src = src.replace(/\bconst\s+SUBJECTS\b/g, 'var SUBJECTS');
src = src.replace(/\blet\s+_formulaCache\b/g, 'var _formulaCache');
src = src.replace(/\blet\s+_idMap\b/g, 'var _idMap');
src = src.replace(/\blet\s+_globalNameMap\b/g, 'var _globalNameMap');
src = src.replace(/\blet\s+_subjectNameMaps\b/g, 'var _subjectNameMaps');
src = src.replace(/\blet\s+_globalPrefixMap\b/g, 'var _globalPrefixMap');
src = src.replace(/\blet\s+_subjectPrefixMaps\b/g, 'var _subjectPrefixMaps');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(src, context);

const SUBJECTS = context.SUBJECTS || context.window.SUBJECTS;
const getAllFormulas = context.getAllFormulas;
const getFormulaById = context.getFormulaById;
const resolveGlobalRelated = context.resolveGlobalRelated;

// Baseline (Unoptimized) implementations
function baselineGetAllFormulas(SUBJ) {
  const results = [];
  for (const [subj, sdata] of Object.entries(SUBJ)) {
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

function baselineGetFormulaById(id, SUBJ) {
  return baselineGetAllFormulas(SUBJ).find(f => f.id === id) || null;
}

function baselineResolveGlobalRelated(name, currentSubject, SUBJ) {
  const all = baselineGetAllFormulas(SUBJ);
  const nl = name.toLowerCase();
  let hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase() === nl);
  if (!hit) hit = all.find(f => f.name.toLowerCase() === nl);
  if (!hit && name.length >= 5) {
    hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase().startsWith(nl.substring(0, 5)));
    if (!hit) hit = all.find(f => f.name.toLowerCase().startsWith(nl.substring(0, 5)));
  }
  return hit || null;
}

// Extract testing inputs from the dataset
const allBaselineFormulas = baselineGetAllFormulas(SUBJECTS);
const allIds = allBaselineFormulas.map(f => f.id);
const allRelated = [];
allBaselineFormulas.forEach(f => {
  if (f.related) {
    f.related.forEach(r => {
      allRelated.push({ name: r, subject: f.subject });
    });
  }
});

console.log(`Loaded dataset with ${allBaselineFormulas.length} formulas, ${allIds.length} IDs, and ${allRelated.length} related terms.`);

// 1. Verify Parity
console.log('\n--- Verifying Functional Parity ---');
try {
  const baselineAll = baselineGetAllFormulas(SUBJECTS);
  const optAll = getAllFormulas();
  if (JSON.stringify(baselineAll) !== JSON.stringify(optAll)) {
    throw new Error('Parity failed on getAllFormulas!');
  }
  console.log('✅ getAllFormulas parity passed.');

  for (const id of allIds) {
    const bForm = baselineGetFormulaById(id, SUBJECTS);
    const oForm = getFormulaById(id);
    if (JSON.stringify(bForm) !== JSON.stringify(oForm)) {
      console.error(`Mismatch for ID ${id}:`);
      console.error('Baseline:', bForm);
      console.error('Optimized:', oForm);
      throw new Error(`Parity failed on getFormulaById for ID: ${id}`);
    }
  }
  console.log('✅ getFormulaById parity passed.');

  for (const item of allRelated) {
    const bRel = baselineResolveGlobalRelated(item.name, item.subject, SUBJECTS);
    const oRel = resolveGlobalRelated(item.name, item.subject);
    if (JSON.stringify(bRel) !== JSON.stringify(oRel)) {
      console.error(`Mismatch for related term "${item.name}" (Subject: ${item.subject}):`);
      console.error('Baseline:', bRel);
      console.error('Optimized:', oRel);
      throw new Error(`Parity failed on resolveGlobalRelated for term: ${item.name}`);
    }
  }
  console.log('✅ resolveGlobalRelated parity passed.');
} catch (e) {
  console.error('❌ Parity Verification Failed:', e.message);
  // We do not exit with error yet if we're measuring unoptimized vs unoptimized
}

// 2. Performance Profiling / Benchmarking
console.log('\n--- Running Benchmarks ---');

// Benchmark getAllFormulas
const G_ITER = 2000;
let t0 = performance.now();
for (let i = 0; i < G_ITER; i++) {
  baselineGetAllFormulas(SUBJECTS);
}
let t1 = performance.now();
const baselineGTime = t1 - t0;
console.log(`Baseline getAllFormulas (${G_ITER} iterations): ${baselineGTime.toFixed(2)} ms`);

t0 = performance.now();
for (let i = 0; i < G_ITER; i++) {
  getAllFormulas();
}
t1 = performance.now();
const optGTime = t1 - t0;
console.log(`Optimized getAllFormulas (${G_ITER} iterations): ${optGTime.toFixed(2)} ms`);
console.log(`Speedup for getAllFormulas: ${(baselineGTime / optGTime).toFixed(2)}x`);

// Benchmark getFormulaById
const ID_ITER = 5000;
t0 = performance.now();
for (let i = 0; i < ID_ITER; i++) {
  const id = allIds[i % allIds.length];
  baselineGetFormulaById(id, SUBJECTS);
}
t1 = performance.now();
const baselineIdTime = t1 - t0;
console.log(`\nBaseline getFormulaById (${ID_ITER} iterations): ${baselineIdTime.toFixed(2)} ms`);

t0 = performance.now();
for (let i = 0; i < ID_ITER; i++) {
  const id = allIds[i % allIds.length];
  getFormulaById(id);
}
t1 = performance.now();
const optIdTime = t1 - t0;
console.log(`Optimized getFormulaById (${ID_ITER} iterations): ${optIdTime.toFixed(2)} ms`);
console.log(`Speedup for getFormulaById: ${(baselineIdTime / optIdTime).toFixed(2)}x`);

// Benchmark resolveGlobalRelated
const REL_ITER = 5000;
t0 = performance.now();
for (let i = 0; i < REL_ITER; i++) {
  const item = allRelated[i % allRelated.length];
  baselineResolveGlobalRelated(item.name, item.subject, SUBJECTS);
}
t1 = performance.now();
const baselineRelTime = t1 - t0;
console.log(`\nBaseline resolveGlobalRelated (${REL_ITER} iterations): ${baselineRelTime.toFixed(2)} ms`);

t0 = performance.now();
for (let i = 0; i < REL_ITER; i++) {
  const item = allRelated[i % allRelated.length];
  resolveGlobalRelated(item.name, item.subject);
}
t1 = performance.now();
const optRelTime = t1 - t0;
console.log(`Optimized resolveGlobalRelated (${REL_ITER} iterations): ${optRelTime.toFixed(2)} ms`);
console.log(`Speedup for resolveGlobalRelated: ${(baselineRelTime / optRelTime).toFixed(2)}x`);
