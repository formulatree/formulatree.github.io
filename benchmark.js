const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('data.js', 'utf8');

const baselineCode = code + `
function baseline_getAllFormulas() {
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

function baseline_getFormulaById(id) {
  return baseline_getAllFormulas().find(f => f.id === id) || null;
}

function baseline_resolveGlobalRelated(name, currentSubject) {
  const all = baseline_getAllFormulas();
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

const preparedCode = code.replace(/^const /gm, 'var ').replace(/^let /gm, 'var ');

const optContext = { console };
vm.createContext(optContext);
vm.runInContext(preparedCode, optContext);

const baseContext = { console };
vm.createContext(baseContext);
vm.runInContext(baselineCode.replace(/^const /gm, 'var ').replace(/^let /gm, 'var '), baseContext);

const iterations = 1000;

console.log(`--- BENCHMARK RESULTS (${iterations} iterations) ---`);

// 1. getAllFormulas Benchmark
let start = performance.now();
for (let i = 0; i < iterations; i++) {
  baseContext.baseline_getAllFormulas();
}
const baseGetAllTime = performance.now() - start;

start = performance.now();
for (let i = 0; i < iterations; i++) {
  optContext.getAllFormulas();
}
const optGetAllTime = performance.now() - start;

console.log(`getAllFormulas():`);
console.log(`  Baseline: ${baseGetAllTime.toFixed(2)} ms`);
console.log(`  Current code:  ${optGetAllTime.toFixed(2)} ms`);

// 2. getFormulaById Benchmark
const all = optContext.getAllFormulas();
const sampleIds = all.map(f => f.id);

start = performance.now();
for (let i = 0; i < iterations; i++) {
  for (const id of sampleIds) {
    baseContext.baseline_getFormulaById(id);
  }
}
const baseGetByIdTime = performance.now() - start;

start = performance.now();
for (let i = 0; i < iterations; i++) {
  for (const id of sampleIds) {
    optContext.getFormulaById(id);
  }
}
const optGetByIdTime = performance.now() - start;

console.log(`getFormulaById() [${sampleIds.length} IDs per iteration]:`);
console.log(`  Baseline: ${baseGetByIdTime.toFixed(2)} ms`);
console.log(`  Current code:  ${optGetByIdTime.toFixed(2)} ms`);

// 3. resolveGlobalRelated Benchmark
const sampleRelated = [];
for (const f of all) {
  if (f.related) sampleRelated.push(...f.related);
}

start = performance.now();
for (let i = 0; i < 50; i++) {
  for (const rel of sampleRelated) {
    baseContext.baseline_resolveGlobalRelated(rel, 'Physics');
  }
}
const baseResolveTime = performance.now() - start;

start = performance.now();
for (let i = 0; i < 50; i++) {
  for (const rel of sampleRelated) {
    optContext.resolveGlobalRelated(rel, 'Physics');
  }
}
const optResolveTime = performance.now() - start;

console.log(`resolveGlobalRelated() [${sampleRelated.length} related queries per iteration]:`);
console.log(`  Baseline: ${baseResolveTime.toFixed(2)} ms`);
console.log(`  Current code:  ${optResolveTime.toFixed(2)} ms`);
