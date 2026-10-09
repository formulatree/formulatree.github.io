const fs = require('fs');

let code = fs.readFileSync('data.js', 'utf8');
code = code.replace(/const SUBJECTS =/g, 'var SUBJECTS =');

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

function baselineGetFormulaById(SUBJECTS, id) {
  return baselineGetAllFormulas(SUBJECTS).find(f => f.id === id) || null;
}

function baselineResolveGlobalRelated(SUBJECTS, name, currentSubject) {
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

eval(code);

console.log('--- BENCHMARK RESULTS ---');
const N = 50000;
const all = getAllFormulas();

// Warmup
for (let i = 0; i < 100; i++) {
  baselineGetAllFormulas(SUBJECTS);
  getAllFormulas();
  baselineGetFormulaById(SUBJECTS, 'gen1');
  getFormulaById('gen1');
  baselineResolveGlobalRelated(SUBJECTS, 'Absolute Error', 'Physics');
  resolveGlobalRelated('Absolute Error', 'Physics');
}

// 1. getAllFormulas
let t0 = performance.now();
for (let i = 0; i < N; i++) {
  baselineGetAllFormulas(SUBJECTS);
}
let t1 = performance.now();
const baseGetAllTime = t1 - t0;

t0 = performance.now();
for (let i = 0; i < N; i++) {
  getAllFormulas();
}
t1 = performance.now();
const optGetAllTime = t1 - t0;

console.log(`getAllFormulas x ${N}:`);
console.log(`  Baseline:  ${baseGetAllTime.toFixed(2)} ms`);
console.log(`  Optimized: ${optGetAllTime.toFixed(2)} ms`);
console.log(`  Speedup:   ${(baseGetAllTime / optGetAllTime).toFixed(1)}x faster\n`);

// 2. getFormulaById
t0 = performance.now();
for (let i = 0; i < N; i++) {
  const target = all[i % all.length];
  baselineGetFormulaById(SUBJECTS, target.id);
}
t1 = performance.now();
const baseGetByIdTime = t1 - t0;

t0 = performance.now();
for (let i = 0; i < N; i++) {
  const target = all[i % all.length];
  getFormulaById(target.id);
}
t1 = performance.now();
const optGetByIdTime = t1 - t0;

console.log(`getFormulaById x ${N}:`);
console.log(`  Baseline:  ${baseGetByIdTime.toFixed(2)} ms`);
console.log(`  Optimized: ${optGetByIdTime.toFixed(2)} ms`);
console.log(`  Speedup:   ${(baseGetByIdTime / optGetByIdTime).toFixed(1)}x faster\n`);

// 3. resolveGlobalRelated
t0 = performance.now();
for (let i = 0; i < N; i++) {
  const target = all[i % all.length];
  if (target.related && target.related.length) {
    baselineResolveGlobalRelated(SUBJECTS, target.related[0], target.subject);
  }
}
t1 = performance.now();
const baseResolveTime = t1 - t0;

t0 = performance.now();
for (let i = 0; i < N; i++) {
  const target = all[i % all.length];
  if (target.related && target.related.length) {
    resolveGlobalRelated(target.related[0], target.subject);
  }
}
t1 = performance.now();
const optResolveTime = t1 - t0;

console.log(`resolveGlobalRelated x ${N}:`);
console.log(`  Baseline:  ${baseResolveTime.toFixed(2)} ms`);
console.log(`  Optimized: ${optResolveTime.toFixed(2)} ms`);
console.log(`  Speedup:   ${(baseResolveTime / optResolveTime).toFixed(1)}x faster\n`);
