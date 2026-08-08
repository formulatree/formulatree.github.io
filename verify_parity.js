const fs = require('fs');
const vm = require('vm');

// Read and prepare data.js for vm evaluation
let dataContent = fs.readFileSync('data.js', 'utf8');
// Convert const/let to var to bind to the vm context
dataContent = dataContent.replace(/\bconst SUBJECTS\b/g, 'var SUBJECTS');
dataContent = dataContent.replace(/\bconst SUBJECT_ICONS\b/g, 'var SUBJECT_ICONS');
dataContent = dataContent.replace(/\bconst SUBJECT_PAGES\b/g, 'var SUBJECT_PAGES');

// Also do a simple replace just in case of formatting variations
dataContent = dataContent.replace('const SUBJECTS =', 'var SUBJECTS =');

const context = {
  window: {},
  Map,
  Object,
  Array,
};
vm.createContext(context);
vm.runInContext(dataContent, context);

// Now context has SUBJECTS, getAllFormulas, getFormulaById, resolveGlobalRelated
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

// 1. Verify getAllFormulas parity
console.log('Verifying getAllFormulas()...');
const baselineAll = baseline_getAllFormulas();
const optimizedAll = getAllFormulas();

if (baselineAll.length !== optimizedAll.length) {
  console.error(`Mismatch in flat formulas list length: expected ${baselineAll.length}, got ${optimizedAll.length}`);
  process.exit(1);
}

for (let i = 0; i < baselineAll.length; i++) {
  if (baselineAll[i].id !== optimizedAll[i].id) {
    console.error(`Mismatch in formula ID at index ${i}: expected ${baselineAll[i].id}, got ${optimizedAll[i].id}`);
    process.exit(1);
  }
}
console.log('✓ getAllFormulas parity verified successfully!');

// 2. Verify getFormulaById parity
console.log('Verifying getFormulaById()...');
for (const formula of baselineAll) {
  const baselineResult = baseline_getFormulaById(formula.id);
  const optimizedResult = getFormulaById(formula.id);
  if (!optimizedResult || baselineResult.id !== optimizedResult.id) {
    console.error(`Mismatch for getFormulaById(${formula.id}): expected ${baselineResult ? baselineResult.name : null}, got ${optimizedResult ? optimizedResult.name : null}`);
    process.exit(1);
  }
}
// Test non-existent ID
if (getFormulaById('non-existent') !== null) {
  console.error('getFormulaById("non-existent") did not return null');
  process.exit(1);
}
console.log('✓ getFormulaById parity verified successfully!');

// 3. Verify resolveGlobalRelated parity
console.log('Verifying resolveGlobalRelated()...');
const subjects = Object.keys(SUBJECTS);

// Gather a list of search terms from formula names and related fields
const testTerms = [];
for (const formula of baselineAll) {
  testTerms.push({ name: formula.name, subject: formula.subject });
  if (formula.related) {
    for (const rel of formula.related) {
      testTerms.push({ name: rel, subject: formula.subject });
    }
  }
}

// Include prefixes and empty/edge cases
testTerms.push({ name: 'Lens', subject: 'Physics' });
testTerms.push({ name: 'Coul', subject: 'Physics' });
testTerms.push({ name: 'Coulomb', subject: 'Physics' });
testTerms.push({ name: 'Short', subject: 'Mathematics' });
testTerms.push({ name: '', subject: 'Chemistry' });

for (const { name, subject } of testTerms) {
  for (const currentSubject of subjects) {
    const baselineResult = baseline_resolveGlobalRelated(name, currentSubject);
    const optimizedResult = resolveGlobalRelated(name, currentSubject);

    const baselineId = baselineResult ? baselineResult.id : null;
    const optimizedId = optimizedResult ? optimizedResult.id : null;

    if (baselineId !== optimizedId) {
      console.error(`Mismatch for resolveGlobalRelated("${name}", "${currentSubject}"): expected ${baselineId} (${baselineResult?.name}), got ${optimizedId} (${optimizedResult?.name})`);
      process.exit(1);
    }
  }
}
console.log('✓ resolveGlobalRelated parity verified successfully!');
console.log('All parity checks passed!');
