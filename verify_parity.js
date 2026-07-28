// Functional parity verification script
const fs = require('fs');
const vm = require('vm');

// 1. Read original functions
const originalCode = `
const SUBJECTS = ${fs.readFileSync('data.js', 'utf8').match(/const SUBJECTS = (\{[\s\S]*?\n\};)/)[1]}

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

const originalCtx = {};
vm.createContext(originalCtx);
vm.runInContext(originalCode, originalCtx);

// 2. Read optimized data.js
let optimizedCode = fs.readFileSync('data.js', 'utf8');
optimizedCode = optimizedCode.replace('const SUBJECTS =', 'var SUBJECTS =');

const optimizedCtx = {};
vm.createContext(optimizedCtx);
vm.runInContext(optimizedCode, optimizedCtx);

console.log('--- STARTING FUNCTIONAL PARITY VERIFICATION ---');

// Compare getAllFormulas()
const origAll = originalCtx.getAllFormulas();
const optAll = optimizedCtx.getAllFormulas();

if (origAll.length !== optAll.length) {
  console.error(`Mismatch in length of getAllFormulas: Original has ${origAll.length}, Optimized has ${optAll.length}`);
  process.exit(1);
}
console.log(`getAllFormulas length check: PASSED (${origAll.length} items)`);

for (let i = 0; i < origAll.length; i++) {
  const o1 = origAll[i];
  const o2 = optAll[i];

  const s1 = JSON.stringify(o1);
  const s2 = JSON.stringify(o2);

  if (s1 !== s2) {
    console.error(`Mismatch at index ${i}:\nOriginal:  ${s1}\nOptimized: ${s2}`);
    process.exit(1);
  }
}
console.log('getAllFormulas content and JSON property order check: PASSED');

// Compare getFormulaById() for ALL possible IDs, plus some non-existent ones
const allIds = origAll.map(f => f.id);
allIds.push('nonexistent', 'hyd1', 'hyd2', 'bio9');

for (const id of allIds) {
  const r1 = originalCtx.getFormulaById(id);
  const r2 = optimizedCtx.getFormulaById(id);

  if (JSON.stringify(r1) !== JSON.stringify(r2)) {
    console.error(`Mismatch for getFormulaById("${id}"):\nOriginal:  ${JSON.stringify(r1)}\nOptimized: ${JSON.stringify(r2)}`);
    process.exit(1);
  }
}
console.log('getFormulaById check for all possible and edge-case IDs: PASSED');

// Compare resolveGlobalRelated() for many combinations
const namesToTest = [
  // Exact matches
  'Dimensional Formula',
  'Ideal Gas Law',
  'De Morgan\'s Laws',
  'Raoult\'s Law',
  'Natural Rubber and Vulcanization',
  'Drug Classification',
  // Prefix matches (>= 5 chars)
  'Dimension',
  'Ideal',
  'De Mo',
  'Raoul',
  'Natur',
  'Drug ',
  // Short names (< 5 chars) which should NOT prefix match
  'Drug',
  'De M',
  'Idea',
  // Completely mismatched
  'Something completely different',
  'Vitamins and Hormones Classification'
];

const subjectsToTest = ['Physics', 'Mathematics', 'Chemistry', 'Biomolecules'];

let resolveChecks = 0;
for (const name of namesToTest) {
  for (const subject of subjectsToTest) {
    const r1 = originalCtx.resolveGlobalRelated(name, subject);
    const r2 = optimizedCtx.resolveGlobalRelated(name, subject);

    if (JSON.stringify(r1) !== JSON.stringify(r2)) {
      console.error(`Mismatch for resolveGlobalRelated("${name}", "${subject}"):\nOriginal:  ${JSON.stringify(r1)}\nOptimized: ${JSON.stringify(r2)}`);
      process.exit(1);
    }
    resolveChecks++;
  }
}
console.log(`resolveGlobalRelated check for ${resolveChecks} query combinations: PASSED`);

console.log('--- ALL FUNCTIONAL PARITY CHECKS PASSED SUCCESSFULLY ---');
