const fs = require('fs');

// Read data.js and prepare isolated context evaluation
const rawDataCode = fs.readFileSync('data.js', 'utf8');
const dataCodeVar = rawDataCode.replace('const SUBJECTS', 'var SUBJECTS');

// Evaluate baseline & optimized logic
eval(dataCodeVar);

console.log('--- RUNNING FUNCTIONAL PARITY VERIFICATION ---');

const allFormulas = getAllFormulas();
console.log(`Total formulas retrieved: ${allFormulas.length}`);

// Verify total count matches expected 333 formulas
if (allFormulas.length !== 333) {
  console.error(`FAIL: Expected 333 formulas, got ${allFormulas.length}`);
  process.exit(1);
}

// Verify getFormulaById returns exact object returned by Array.prototype.find on allFormulas
let idFailures = 0;
for (const item of allFormulas) {
  const expected = allFormulas.find(f => f.id === item.id);
  const found = getFormulaById(item.id);
  if (found !== expected) {
    console.error(`FAIL: ID lookup mismatch for ${item.id}`);
    idFailures++;
  }
}

// Verify duplicate ID handling (hyd1 should resolve to first occurrence in Hydrogen & s-Block)
const hyd1 = getFormulaById('hyd1');
if (!hyd1 || hyd1.chapter !== 'Hydrogen & s-Block') {
  console.error(`FAIL: Expected hyd1 chapter to be 'Hydrogen & s-Block', got '${hyd1?.chapter}'`);
  idFailures++;
}

// Verify resolveGlobalRelated functionality
let resolveFailures = 0;
const sampleQueries = ['Kirchhoff\'s Law', 'Coulomb\'s Law', 'Ideal Gas Law', 'Raoult\'s Law', 'Markovnikov\'s Rule'];
for (const query of sampleQueries) {
  const res = resolveGlobalRelated(query, 'Physics');
  if (!res) {
    console.error(`FAIL: resolveGlobalRelated returned null for '${query}'`);
    resolveFailures++;
  }
}

if (idFailures === 0 && resolveFailures === 0) {
  console.log('✅ ALL PARITY CHECKS PASSED SUCCESSFULLY!');
} else {
  console.error(`❌ PARITY CHECKS FAILED: ${idFailures} ID failures, ${resolveFailures} resolve failures.`);
  process.exit(1);
}

console.log('\n--- RUNNING BENCHMARKS ---');
const N = 5000;
const startAll = process.hrtime.bigint();
for (let i = 0; i < N; i++) {
  getAllFormulas();
}
const endAll = process.hrtime.bigint();
const durationAllMs = Number(endAll - startAll) / 1e6;
console.log(`getAllFormulas x ${N}: ${durationAllMs.toFixed(3)} ms (${(durationAllMs / N).toFixed(5)} ms/op)`);

const M = 20000;
const startId = process.hrtime.bigint();
for (let i = 0; i < M; i++) {
  getFormulaById('evd9');
  getFormulaById('phy1');
  getFormulaById('math50');
}
const endId = process.hrtime.bigint();
const durationIdMs = Number(endId - startId) / 1e6;
console.log(`getFormulaById x ${M * 3}: ${durationIdMs.toFixed(3)} ms (${(durationIdMs / (M * 3)).toFixed(5)} ms/op)`);
