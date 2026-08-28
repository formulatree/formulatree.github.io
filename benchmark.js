const fs = require('fs');
const execSync = require('child_process').execSync;
const vm = require('vm');

let baseCode = execSync('git show HEAD:data.js', { encoding: 'utf8' }).replace('const SUBJECTS =', 'var SUBJECTS =');
let modCode = fs.readFileSync('data.js', 'utf8').replace('const SUBJECTS =', 'var SUBJECTS =');

const baseCtx = { Map, Object, Array, console, performance };
vm.createContext(baseCtx);
vm.runInContext(baseCode, baseCtx);

const modCtx = { Map, Object, Array, console, performance };
vm.createContext(modCtx);
vm.runInContext(modCode, modCtx);

const N = 5000;
const all = baseCtx.getAllFormulas();

// Benchmark getAllFormulas
let t0 = performance.now();
for (let i = 0; i < N; i++) baseCtx.getAllFormulas();
let t1 = performance.now();
const timeGetAllBase = t1 - t0;

t0 = performance.now();
for (let i = 0; i < N; i++) modCtx.getAllFormulas();
t1 = performance.now();
const timeGetAllMod = t1 - t0;

// Benchmark getFormulaById
t0 = performance.now();
for (let i = 0; i < 1000; i++) {
  for (const f of all) baseCtx.getFormulaById(f.id);
}
t1 = performance.now();
const timeGetByIdBase = t1 - t0;

t0 = performance.now();
for (let i = 0; i < 1000; i++) {
  for (const f of all) modCtx.getFormulaById(f.id);
}
t1 = performance.now();
const timeGetByIdMod = t1 - t0;

// Benchmark resolveGlobalRelated
t0 = performance.now();
for (let i = 0; i < 20; i++) {
  for (const f of all) {
    for (const r of (f.related || [])) baseCtx.resolveGlobalRelated(r, f.subject);
  }
}
t1 = performance.now();
const timeResolveBase = t1 - t0;

t0 = performance.now();
for (let i = 0; i < 20; i++) {
  for (const f of all) {
    for (const r of (f.related || [])) modCtx.resolveGlobalRelated(r, f.subject);
  }
}
t1 = performance.now();
const timeResolveMod = t1 - t0;

console.log('⚡ Benchmark Results ⚡');
console.log(`getAllFormulas():       Baseline = ${timeGetAllBase.toFixed(2)}ms, Optimized = ${timeGetAllMod.toFixed(2)}ms, Speedup = ${(timeGetAllBase / timeGetAllMod).toFixed(1)}x`);
console.log(`getFormulaById():       Baseline = ${timeGetByIdBase.toFixed(2)}ms, Optimized = ${timeGetByIdMod.toFixed(2)}ms, Speedup = ${(timeGetByIdBase / timeGetByIdMod).toFixed(1)}x`);
console.log(`resolveGlobalRelated(): Baseline = ${timeResolveBase.toFixed(2)}ms, Optimized = ${timeResolveMod.toFixed(2)}ms, Speedup = ${(timeResolveBase / timeResolveMod).toFixed(1)}x`);
