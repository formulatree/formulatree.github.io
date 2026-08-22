const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

const headCode = execSync('git show HEAD:data.js', { encoding: 'utf8' }).replace(/const SUBJECTS =/, 'var SUBJECTS =');
const currentCode = fs.readFileSync('data.js', 'utf8').replace(/const SUBJECTS =/, 'var SUBJECTS =');

const headCtx = {};
vm.runInNewContext(headCode, headCtx);

const currentCtx = {};
vm.runInNewContext(currentCode, currentCtx);

const ITERATIONS = 10000;

console.log(`Running benchmarks (${ITERATIONS} iterations)...`);

// Benchmark getAllFormulas
const t1Start = performance.now();
for (let i = 0; i < ITERATIONS; i++) headCtx.getAllFormulas();
const t1End = performance.now();
const baselineGetAll = t1End - t1Start;

const t2Start = performance.now();
for (let i = 0; i < ITERATIONS; i++) currentCtx.getAllFormulas();
const t2End = performance.now();
const optGetAll = t2End - t2Start;

console.log(`getAllFormulas x ${ITERATIONS}:`);
console.log(`  Baseline:  ${baselineGetAll.toFixed(2)} ms`);
console.log(`  Optimized: ${optGetAll.toFixed(2)} ms`);
console.log(`  Speedup:   ${(baselineGetAll / optGetAll).toFixed(1)}x faster`);

// Benchmark getFormulaById
const ids = ['thm1', 'mod1', 'set1', 'int1', 'stt1', 'goc1'];
const t3Start = performance.now();
for (let i = 0; i < ITERATIONS; i++) headCtx.getFormulaById(ids[i % ids.length]);
const t3End = performance.now();
const baselineGetId = t3Start ? t3End - t3Start : 0;

const t4Start = performance.now();
for (let i = 0; i < ITERATIONS; i++) currentCtx.getFormulaById(ids[i % ids.length]);
const t4End = performance.now();
const optGetId = t4End - t4Start;

console.log(`\ngetFormulaById x ${ITERATIONS}:`);
console.log(`  Baseline:  ${baselineGetId.toFixed(2)} ms`);
console.log(`  Optimized: ${optGetId.toFixed(2)} ms`);
console.log(`  Speedup:   ${(baselineGetId / optGetId).toFixed(1)}x faster`);

// Benchmark resolveGlobalRelated
const queries = [
  { name: 'Ideal Gas Law', subj: 'Physics' },
  { name: "De Morgan's Laws", subj: 'Mathematics' },
  { name: 'Ellingham Diagram', subj: 'Chemistry' }
];

const t5Start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  const q = queries[i % queries.length];
  headCtx.resolveGlobalRelated(q.name, q.subj);
}
const t5End = performance.now();
const baselineRel = t5End - t5Start;

const t6Start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  const q = queries[i % queries.length];
  currentCtx.resolveGlobalRelated(q.name, q.subj);
}
const t6End = performance.now();
const optRel = t6End - t6Start;

console.log(`\nresolveGlobalRelated x ${ITERATIONS}:`);
console.log(`  Baseline:  ${baselineRel.toFixed(2)} ms`);
console.log(`  Optimized: ${optRel.toFixed(2)} ms`);
console.log(`  Speedup:   ${(baselineRel / optRel).toFixed(1)}x faster`);
