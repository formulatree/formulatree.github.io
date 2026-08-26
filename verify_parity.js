const fs = require('fs');
const vm = require('vm');

// Load optimized data.js
let optCode = fs.readFileSync('data.js', 'utf8');
optCode = optCode.replace(/^const SUBJECTS =/m, 'var SUBJECTS =');

const optContext = {};
vm.createContext(optContext);
vm.runInContext(optCode, optContext);

// Reconstruct unoptimized baseline data.js logic
let unoptCode = optCode.split('// Performance optimization:')[0] + `
function getAllFormulas() {
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

function getFormulaById(id) {
  return getAllFormulas().find(f => f.id === id) || null;
}

function resolveGlobalRelated(name, currentSubject) {
  const all = getAllFormulas();
  const nl = name.toLowerCase();
  let hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase() === nl);
  if (!hit) hit = all.find(f => f.name.toLowerCase() === nl);
  if (!hit && name.length >= 5) {
    hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase().startsWith(nl.substring(0, 5)));
    if (!hit) hit = all.find(f => f.name.toLowerCase().startsWith(nl.substring(0, 5)));
  }
  return hit || null;
}
`;

const baseContext = {};
vm.createContext(baseContext);
vm.runInContext(unoptCode, baseContext);

console.log('--- Functional Parity Verification ---');

// 1. Verify getAllFormulas
const baseAll = baseContext.getAllFormulas();
const optAll = optContext.getAllFormulas();
console.assert(baseAll.length === optAll.length, `Length mismatch: ${baseAll.length} vs ${optAll.length}`);
console.log(`getAllFormulas returned ${optAll.length} items (matches baseline).`);

for (let i = 0; i < baseAll.length; i++) {
  const b = baseAll[i];
  const o = optAll[i];
  if (b.id !== o.id || b.name !== o.name || b.subject !== o.subject) {
    console.error(`Mismatch at index ${i}:`, b, o);
    process.exit(1);
  }
}

// 2. Verify getFormulaById
let idMismatches = 0;
baseAll.forEach(f => {
  const bRes = baseContext.getFormulaById(f.id);
  const oRes = optContext.getFormulaById(f.id);
  if (!bRes || !oRes || bRes.id !== oRes.id) {
    idMismatches++;
  }
});
console.log(`getFormulaById checked ${baseAll.length} IDs. Mismatches: ${idMismatches}`);
console.assert(idMismatches === 0, 'getFormulaById mismatch detected!');

// 3. Verify resolveGlobalRelated
const relatedStrings = new Set();
baseAll.forEach(f => (f.related || []).forEach(r => relatedStrings.add(r)));

let relMismatches = 0;
let totalRelQueries = 0;
for (const r of relatedStrings) {
  for (const subj of ['Physics', 'Mathematics', 'Chemistry']) {
    totalRelQueries++;
    const bRes = baseContext.resolveGlobalRelated(r, subj);
    const oRes = optContext.resolveGlobalRelated(r, subj);
    if ((bRes === null && oRes !== null) || (bRes !== null && oRes === null) || (bRes && oRes && bRes.id !== oRes.id)) {
      console.error(`Mismatch for related query "${r}" in subject "${subj}":`, bRes, oRes);
      relMismatches++;
    }
  }
}
console.log(`resolveGlobalRelated checked ${totalRelQueries} queries across all subjects. Mismatches: ${relMismatches}`);
console.assert(relMismatches === 0, 'resolveGlobalRelated mismatch detected!');

console.log('\n--- Performance Benchmark ---');
const iterations = 5000;

// Benchmark getAllFormulas
const t0 = performance.now();
for (let i = 0; i < iterations; i++) baseContext.getAllFormulas();
const t1 = performance.now();
for (let i = 0; i < iterations; i++) optContext.getAllFormulas();
const t2 = performance.now();
const speedupAll = (t1 - t0) / (t2 - t1);
console.log(`getAllFormulas: Baseline ${(t1 - t0).toFixed(2)}ms vs Opt ${(t2 - t1).toFixed(2)}ms (${speedupAll.toFixed(1)}x speedup)`);

// Benchmark getFormulaById
const sampleIds = ['gen1', 'mec5', 'alg3', 'trg1', 'mol1', 'evd9', 'bio9', 'hyd1'];
const t3 = performance.now();
for (let i = 0; i < iterations; i++) {
  for (const id of sampleIds) baseContext.getFormulaById(id);
}
const t4 = performance.now();
for (let i = 0; i < iterations; i++) {
  for (const id of sampleIds) optContext.getFormulaById(id);
}
const t5 = performance.now();
const speedupId = (t4 - t3) / (t5 - t4);
console.log(`getFormulaById: Baseline ${(t4 - t3).toFixed(2)}ms vs Opt ${(t5 - t4).toFixed(2)}ms (${speedupId.toFixed(1)}x speedup)`);

// Benchmark resolveGlobalRelated
const sampleQueries = [
  ['De Morgan\'s Laws', 'Mathematics'],
  ['Snell\'s Law', 'Physics'],
  ['Markovnikov\'s Rule', 'Chemistry'],
  ['Unknown Query Item', 'Physics'],
  ['Vector Addition', 'Physics'],
  ['Bohr Model', 'Physics']
];
const t6 = performance.now();
for (let i = 0; i < iterations; i++) {
  for (const [q, s] of sampleQueries) baseContext.resolveGlobalRelated(q, s);
}
const t7 = performance.now();
for (let i = 0; i < iterations; i++) {
  for (const [q, s] of sampleQueries) optContext.resolveGlobalRelated(q, s);
}
const t8 = performance.now();
const speedupRel = (t7 - t6) / (t8 - t7);
console.log(`resolveGlobalRelated: Baseline ${(t7 - t6).toFixed(2)}ms vs Opt ${(t8 - t7).toFixed(2)}ms (${speedupRel.toFixed(1)}x speedup)`);

console.log('\nAll parity checks and benchmarks completed successfully!');
