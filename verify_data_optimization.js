const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('data.js', 'utf8');

// Function to construct baseline unoptimized functions
function buildBaseline(rawCode) {
  let mod = rawCode.replace('const SUBJECTS =', 'var SUBJECTS =');
  mod += `
  function getAllFormulasBaseline() {
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

  function getFormulaByIdBaseline(id) {
    return getAllFormulasBaseline().find(f => f.id === id) || null;
  }

  function resolveGlobalRelatedBaseline(name, currentSubject) {
    const all = getAllFormulasBaseline();
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

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(mod, sandbox);
  return sandbox;
}

const sandbox = buildBaseline(code);

console.log('Testing data.js functions in isolated environment...');

// Verify baseline works
const baselineAll = sandbox.getAllFormulasBaseline();
console.log(`Baseline formula count: ${baselineAll.length}`);

// Test parity with actual functions exported in data.js
let hasActualFunctions = typeof sandbox.getAllFormulas === 'function';
if (hasActualFunctions) {
  const actualAll = sandbox.getAllFormulas();
  console.log(`Actual formula count: ${actualAll.length}`);
  console.log(`getAllFormulas deep parity: ${JSON.stringify(baselineAll) === JSON.stringify(actualAll)}`);

  let idParity = true;
  let relParity = true;

  for (const f of baselineAll) {
    const baseIdHit = sandbox.getFormulaByIdBaseline(f.id);
    const actIdHit = sandbox.getFormulaById(f.id);
    if (JSON.stringify(baseIdHit) !== JSON.stringify(actIdHit)) {
      console.error(`ID mismatch for ${f.id}`);
      idParity = false;
    }

    const baseRelHit = sandbox.resolveGlobalRelatedBaseline(f.name, f.subject);
    const actRelHit = sandbox.resolveGlobalRelated(f.name, f.subject);
    if (JSON.stringify(baseRelHit) !== JSON.stringify(actRelHit)) {
      console.error(`Related mismatch for ${f.name} in ${f.subject}`);
      relParity = false;
    }
  }

  console.log(`getFormulaById parity: ${idParity}`);
  console.log(`resolveGlobalRelated parity: ${relParity}`);

  // Benchmark comparisons
  console.log('\n--- Benchmarks ---');

  const N_ID = 50000;
  const t0 = performance.now();
  for (let i = 0; i < N_ID; i++) sandbox.getFormulaByIdBaseline('thm1');
  const t1 = performance.now();
  for (let i = 0; i < N_ID; i++) sandbox.getFormulaById('thm1');
  const t2 = performance.now();
  console.log(`getFormulaById Baseline (${N_ID} ops): ${(t1 - t0).toFixed(2)}ms`);
  console.log(`getFormulaById Optimized (${N_ID} ops): ${(t2 - t1).toFixed(2)}ms`);
  console.log(`getFormulaById Speedup: ${((t1 - t0) / Math.max(0.001, t2 - t1)).toFixed(1)}x`);

  const N_REL = 50000;
  const t3 = performance.now();
  for (let i = 0; i < N_REL; i++) sandbox.resolveGlobalRelatedBaseline('Photoelectric Effect', 'Physics');
  const t4 = performance.now();
  for (let i = 0; i < N_REL; i++) sandbox.resolveGlobalRelated('Photoelectric Effect', 'Physics');
  const t5 = performance.now();
  console.log(`resolveGlobalRelated Baseline (${N_REL} ops): ${(t4 - t3).toFixed(2)}ms`);
  console.log(`resolveGlobalRelated Optimized (${N_REL} ops): ${(t5 - t4).toFixed(2)}ms`);
  console.log(`resolveGlobalRelated Speedup: ${((t4 - t3) / Math.max(0.001, t5 - t4)).toFixed(1)}x`);

  const N_ALL = 1000;
  const t6 = performance.now();
  for (let i = 0; i < N_ALL; i++) sandbox.getAllFormulasBaseline();
  const t7 = performance.now();
  for (let i = 0; i < N_ALL; i++) sandbox.getAllFormulas();
  const t8 = performance.now();
  console.log(`getAllFormulas Baseline (${N_ALL} ops): ${(t7 - t6).toFixed(2)}ms`);
  console.log(`getAllFormulas Optimized (${N_ALL} ops): ${(t8 - t7).toFixed(2)}ms`);
  console.log(`getAllFormulas Speedup: ${((t7 - t6) / Math.max(0.001, t8 - t7)).toFixed(1)}x`);
} else {
  console.log('data.js currently contains unoptimized functions.');
}
