const fs = require('fs');
const vm = require('vm');

// Read and prepare data.js for vm evaluation
let dataContent = fs.readFileSync('data.js', 'utf8');
dataContent = dataContent.replace('const SUBJECTS =', 'var SUBJECTS =');

const context = {
  window: {},
  Map,
  Object,
  Array,
};
vm.createContext(context);
vm.runInContext(dataContent, context);

const SUBJECTS = context.SUBJECTS;
const getAllFormulas = context.getAllFormulas;
const getFormulaById = context.getFormulaById;
const resolveGlobalRelated = context.resolveGlobalRelated;

// Original baseline implementations
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

// Warm up
getAllFormulas();
baseline_getAllFormulas();

const baselineAll = baseline_getAllFormulas();
const formulaIds = baselineAll.map(f => f.id);

console.log('--- STARTING RETRIEVAL BENCHMARKS ---\n');

// 1. Benchmark getAllFormulas
console.log('Benchmarking getAllFormulas()...');
const runsGetAll = 5000;

let start = process.hrtime.bigint();
for (let i = 0; i < runsGetAll; i++) {
  baseline_getAllFormulas();
}
let end = process.hrtime.bigint();
const baselineGetAllTime = Number(end - start) / 1000000; // ms

start = process.hrtime.bigint();
for (let i = 0; i < runsGetAll; i++) {
  getAllFormulas();
}
end = process.hrtime.bigint();
const optimizedGetAllTime = Number(end - start) / 1000000; // ms

console.log(`Baseline (O(N) construction): ${baselineGetAllTime.toFixed(2)} ms`);
console.log(`Optimized (Cached O(1)):      ${optimizedGetAllTime.toFixed(2)} ms`);
console.log(`Speedup:                      ${(baselineGetAllTime / optimizedGetAllTime).toFixed(1)}x\n`);

// 2. Benchmark getFormulaById
console.log('Benchmarking getFormulaById()...');
const runsGetId = 200;

start = process.hrtime.bigint();
for (let r = 0; r < runsGetId; r++) {
  for (const id of formulaIds) {
    baseline_getFormulaById(id);
  }
}
end = process.hrtime.bigint();
const baselineGetIdTime = Number(end - start) / 1000000; // ms

start = process.hrtime.bigint();
for (let r = 0; r < runsGetId; r++) {
  for (const id of formulaIds) {
    getFormulaById(id);
  }
}
end = process.hrtime.bigint();
const optimizedGetIdTime = Number(end - start) / 1000000; // ms

console.log(`Baseline (O(N) linear scans): ${baselineGetIdTime.toFixed(2)} ms`);
console.log(`Optimized (O(1) Map lookups):  ${optimizedGetIdTime.toFixed(2)} ms`);
console.log(`Speedup:                      ${(baselineGetIdTime / optimizedGetIdTime).toFixed(1)}x\n`);

// 3. Benchmark resolveGlobalRelated
console.log('Benchmarking resolveGlobalRelated()...');
const runsResolve = 50;
const subjects = Object.keys(SUBJECTS);

// Take unique names/relations
const searchTerms = [];
for (let i = 0; i < baselineAll.length; i += 7) {
  searchTerms.push(baselineAll[i].name);
  if (baselineAll[i].related && baselineAll[i].related[0]) {
    searchTerms.push(baselineAll[i].related[0]);
  }
}

start = process.hrtime.bigint();
for (let r = 0; r < runsResolve; r++) {
  for (const name of searchTerms) {
    for (const subj of subjects) {
      baseline_resolveGlobalRelated(name, subj);
    }
  }
}
end = process.hrtime.bigint();
const baselineResolveTime = Number(end - start) / 1000000; // ms

start = process.hrtime.bigint();
for (let r = 0; r < runsResolve; r++) {
  for (const name of searchTerms) {
    for (const subj of subjects) {
      resolveGlobalRelated(name, subj);
    }
  }
}
end = process.hrtime.bigint();
const optimizedResolveTime = Number(end - start) / 1000000; // ms

console.log(`Baseline (multiple nested scans): ${baselineResolveTime.toFixed(2)} ms`);
console.log(`Optimized (O(1) Map lookups):     ${optimizedResolveTime.toFixed(2)} ms`);
console.log(`Speedup:                          ${(baselineResolveTime / optimizedResolveTime).toFixed(1)}x\n`);

console.log('--- BENCHMARKS COMPLETED ---');
