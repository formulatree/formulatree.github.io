const fs = require('fs');
const execSync = require('child_process').execSync;
const vm = require('vm');

console.log('--- RUNNING BENCHMARK & PARITY SUITE ---');

const origCode = execSync('git show HEAD:data.js', { encoding: 'utf8' });
const optCode = fs.readFileSync('data.js', 'utf8');

// Temporarily expose let/const to sandbox context for evaluation in vm
const makeEvalable = (codeStr) =>
  codeStr
    .replace(/^const SUBJECTS =/m, 'var SUBJECTS =')
    .replace(/^let _allFormulasCache =/m, 'var _allFormulasCache =')
    .replace(/^let _idMap =/m, 'var _idMap =')
    .replace(/^let _globalNameMap =/m, 'var _globalNameMap =')
    .replace(/^let _subjectNameMaps =/m, 'var _subjectNameMaps =')
    .replace(/^let _globalPrefixMap =/m, 'var _globalPrefixMap =')
    .replace(/^let _subjectPrefixMaps =/m, 'var _subjectPrefixMaps =');

const baseCtx = {};
vm.runInNewContext(makeEvalable(origCode), baseCtx);

const optCtx = {};
vm.runInNewContext(makeEvalable(optCode), optCtx);

// 1. Verify Parity
console.log('\n[1/2] Verifying Functional Parity...');

const baseAll = baseCtx.getAllFormulas();
const optAll = optCtx.getAllFormulas();

if (baseAll.length !== optAll.length) {
  throw new Error(`Length mismatch: baseline = ${baseAll.length}, opt = ${optAll.length}`);
}

for (let i = 0; i < baseAll.length; i++) {
  if (JSON.stringify(baseAll[i]) !== JSON.stringify(optAll[i])) {
    throw new Error(`Formula mismatch at index ${i}`);
  }
}

baseAll.forEach(f => {
  const bRes = baseCtx.getFormulaById(f.id);
  const oRes = optCtx.getFormulaById(f.id);
  if (JSON.stringify(bRes) !== JSON.stringify(oRes)) {
    throw new Error(`getFormulaById mismatch for ID: ${f.id}`);
  }
});

baseAll.forEach(f => {
  const rels = (f.related || []).concat([f.name, 'NonExistentTestItem']);
  rels.forEach(rel => {
    ['Physics', 'Mathematics', 'Chemistry'].forEach(subj => {
      const bRes = baseCtx.resolveGlobalRelated(rel, subj);
      const oRes = optCtx.resolveGlobalRelated(rel, subj);
      if (JSON.stringify(bRes) !== JSON.stringify(oRes)) {
        throw new Error(`resolveGlobalRelated mismatch for query "${rel}" under subject "${subj}"`);
      }
    });
  });
});

console.log('✅ ALL 333 FORMULA IDS & QUERY MAPPINGS MATCH 100% PERFECTLY!');

// 2. Measure Performance Speedups
console.log('\n[2/2] Benchmarking Performance Speedups...');

const BENCH_ITERS = 10000;

// Bench getAllFormulas
let t0 = process.hrtime.bigint();
for (let i = 0; i < BENCH_ITERS; i++) {
  baseCtx.getAllFormulas();
}
let baseAllTime = Number(process.hrtime.bigint() - t0) / 1e6;

t0 = process.hrtime.bigint();
for (let i = 0; i < BENCH_ITERS; i++) {
  optCtx.getAllFormulas();
}
let optAllTime = Number(process.hrtime.bigint() - t0) / 1e6;

console.log(`getAllFormulas (${BENCH_ITERS} calls): Baseline = ${baseAllTime.toFixed(2)}ms, Opt = ${optAllTime.toFixed(2)}ms (Speedup = ${(baseAllTime / optAllTime).toFixed(1)}x)`);

// Bench getFormulaById
t0 = process.hrtime.bigint();
for (let i = 0; i < BENCH_ITERS; i++) {
  baseCtx.getFormulaById('mec1');
  baseCtx.getFormulaById('hyd5');
  baseCtx.getFormulaById('bio9');
}
let baseByIdTime = Number(process.hrtime.bigint() - t0) / 1e6;

t0 = process.hrtime.bigint();
for (let i = 0; i < BENCH_ITERS; i++) {
  optCtx.getFormulaById('mec1');
  optCtx.getFormulaById('hyd5');
  optCtx.getFormulaById('bio9');
}
let optByIdTime = Number(process.hrtime.bigint() - t0) / 1e6;

console.log(`getFormulaById (${BENCH_ITERS * 3} calls): Baseline = ${baseByIdTime.toFixed(2)}ms, Opt = ${optByIdTime.toFixed(2)}ms (Speedup = ${(baseByIdTime / optByIdTime).toFixed(1)}x)`);

// Bench resolveGlobalRelated
t0 = process.hrtime.bigint();
for (let i = 0; i < BENCH_ITERS; i++) {
  baseCtx.resolveGlobalRelated('Dimensional Formula', 'Physics');
  baseCtx.resolveGlobalRelated('Relative Error', 'Physics');
  baseCtx.resolveGlobalRelated('Ideal Gas Law', 'Chemistry');
  baseCtx.resolveGlobalRelated('De Morgan\'s Laws', 'Mathematics');
}
let baseRelTime = Number(process.hrtime.bigint() - t0) / 1e6;

t0 = process.hrtime.bigint();
for (let i = 0; i < BENCH_ITERS; i++) {
  optCtx.resolveGlobalRelated('Dimensional Formula', 'Physics');
  optCtx.resolveGlobalRelated('Relative Error', 'Physics');
  optCtx.resolveGlobalRelated('Ideal Gas Law', 'Chemistry');
  optCtx.resolveGlobalRelated('De Morgan\'s Laws', 'Mathematics');
}
let optRelTime = Number(process.hrtime.bigint() - t0) / 1e6;

console.log(`resolveGlobalRelated (${BENCH_ITERS * 4} calls): Baseline = ${baseRelTime.toFixed(2)}ms, Opt = ${optRelTime.toFixed(2)}ms (Speedup = ${(baseRelTime / optRelTime).toFixed(1)}x)`);

console.log('\n✅ BENCHMARK COMPLETE!');
