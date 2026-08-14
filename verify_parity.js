const fs = require('fs');

let code = fs.readFileSync('data.js', 'utf8');

// For node evaluation, convert const SUBJECTS to var SUBJECTS so it binds to global scope
const evalCode = code.replace('const SUBJECTS =', 'var SUBJECTS =');

eval(evalCode);

function origGetAll() {
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

function origGetById(id) {
  return origGetAll().find(f => f.id === id) || null;
}

function origResolve(name, currentSubject) {
  const all = origGetAll();
  const nl = name.toLowerCase();
  let hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase() === nl);
  if (!hit) hit = all.find(f => f.name.toLowerCase() === nl);
  if (!hit && name.length >= 5) {
    hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase().startsWith(nl.substring(0, 5)));
    if (!hit) hit = all.find(f => f.name.toLowerCase().startsWith(nl.substring(0, 5)));
  }
  return hit || null;
}

console.log('Testing optimized implementations against original baseline...');

// 1. Verify getAllFormulas returns all 333 formulas
const all = getAllFormulas();
console.log(`getAllFormulas count: ${all.length} (expected 333)`);
if (all.length !== 333) {
  console.error('ERROR: Expected 333 formulas');
  process.exit(1);
}

// 2. Verify getFormulaById compared to original baseline
let idFailures = 0;
for (const f of all) {
  const orig = origGetById(f.id);
  const opt = getFormulaById(f.id);
  if (JSON.stringify(orig) !== JSON.stringify(opt)) {
    console.error(`ERROR: getFormulaById mismatch for ID ${f.id}`);
    idFailures++;
  }
}

if (idFailures === 0) {
  console.log('✅ getFormulaById passed with 100% parity against baseline');
} else {
  process.exit(1);
}

// 3. Verify resolveGlobalRelated compared to original baseline
let resolveFailures = 0;
for (const f of all) {
  const origHit = origResolve(f.name, f.subject);
  const optHit = resolveGlobalRelated(f.name, f.subject);
  if (JSON.stringify(origHit) !== JSON.stringify(optHit)) {
    console.error(`ERROR: resolveGlobalRelated mismatch for ${f.name} in ${f.subject}`);
    resolveFailures++;
  }

  if (f.related && f.related.length) {
    for (const rel of f.related) {
      const origRelHit = origResolve(rel, f.subject);
      const optRelHit = resolveGlobalRelated(rel, f.subject);
      if (JSON.stringify(origRelHit) !== JSON.stringify(optRelHit)) {
        console.error(`ERROR: resolveGlobalRelated mismatch for related term '${rel}' in subject ${f.subject}`);
        resolveFailures++;
      }
    }
  }
}

if (resolveFailures === 0) {
  console.log('✅ resolveGlobalRelated passed with 100% parity against baseline');
} else {
  process.exit(1);
}

console.log('100% Functional Parity Verified across all 333 formulas and related queries!');
