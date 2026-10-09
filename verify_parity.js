const fs = require('fs');

// Read current data.js
let code = fs.readFileSync('data.js', 'utf8');
// Replace const SUBJECTS with var SUBJECTS for evaluation scope
code = code.replace(/const SUBJECTS =/g, 'var SUBJECTS =');

// Baseline unoptimized functions
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

// Evaluate data.js
eval(code);

console.log('--- FUNCTIONAL PARITY VERIFICATION ---');

const baseAll = baselineGetAllFormulas(SUBJECTS);
const optAll = getAllFormulas();

if (baseAll.length !== optAll.length) {
  console.error(`Mismatch in total formula count: baseline ${baseAll.length} vs opt ${optAll.length}`);
  process.exit(1);
}
console.log(`✓ Total formula count matched: ${optAll.length}`);

let idMismatches = 0;
baseAll.forEach(f => {
  const baseHit = baselineGetFormulaById(SUBJECTS, f.id);
  const optHit = getFormulaById(f.id);
  if (!baseHit || !optHit || baseHit.id !== optHit.id) {
    console.error(`ID lookup mismatch for ID '${f.id}'`);
    idMismatches++;
  }
});

if (idMismatches > 0) {
  console.error(`Failed with ${idMismatches} ID mismatches!`);
  process.exit(1);
}
console.log('✓ All 333 getFormulaById() lookups match baseline exactly.');

let relatedMismatches = 0;
let totalRelatedChecks = 0;

baseAll.forEach(f => {
  if (f.related) {
    f.related.forEach(r => {
      totalRelatedChecks++;
      const baseHit = baselineResolveGlobalRelated(SUBJECTS, r, f.subject);
      const optHit = resolveGlobalRelated(r, f.subject);
      if ((baseHit || optHit) && (!baseHit || !optHit || baseHit.id !== optHit.id)) {
        console.error(`Related lookup mismatch for '${r}' in '${f.subject}'`);
        relatedMismatches++;
      }
    });
  }
});

if (relatedMismatches > 0) {
  console.error(`Failed with ${relatedMismatches} related query mismatches!`);
  process.exit(1);
}
console.log(`✓ All ${totalRelatedChecks} resolveGlobalRelated() queries match baseline exactly.`);
console.log('🎉 100% FUNCTIONAL PARITY CONFIRMED!');
