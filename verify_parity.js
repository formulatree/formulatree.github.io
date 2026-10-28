const fs = require('fs');
const vm = require('vm');

// Read current data.js
const code = fs.readFileSync('data.js', 'utf8');

// Context for baseline (original implementation)
const baselineCode = code + `
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
`;

// Helper to convert const/let in global context for VM exposure if needed
const preparedCode = code.replace(/^const /gm, 'var ').replace(/^let /gm, 'var ');

const context = { console };
vm.createContext(context);
vm.runInContext(preparedCode, context);

// Also run baseline
const baselineContext = { console };
vm.createContext(baselineContext);
vm.runInContext(baselineCode.replace(/^const /gm, 'var ').replace(/^let /gm, 'var '), baselineContext);

console.log('Testing getAllFormulas()...');
const optAll = context.getAllFormulas();
const baseAll = baselineContext.baseline_getAllFormulas();

if (JSON.stringify(optAll) !== JSON.stringify(baseAll)) {
  console.error('Mismatch in getAllFormulas()!');
  process.exit(1);
} else {
  console.log(`getAllFormulas() matches perfectly (${optAll.length} items).`);
}

console.log('Testing getFormulaById()...');
let idMismatches = 0;
for (const f of baseAll) {
  const optRes = context.getFormulaById(f.id);
  const baseRes = baselineContext.baseline_getFormulaById(f.id);
  if (JSON.stringify(optRes) !== JSON.stringify(baseRes)) {
    console.error(`Mismatch for getFormulaById(${f.id})`);
    idMismatches++;
  }
}
if (idMismatches === 0) {
  console.log('getFormulaById() matches perfectly across all IDs.');
} else {
  console.error(`Total id mismatches: ${idMismatches}`);
  process.exit(1);
}

console.log('Testing resolveGlobalRelated()...');
let relatedMismatches = 0;
const subjects = ['Physics', 'Mathematics', 'Chemistry'];

// Test all related string items in all formulas
for (const f of baseAll) {
  if (f.related) {
    for (const rel of f.related) {
      for (const subj of subjects) {
        const optRes = context.resolveGlobalRelated(rel, subj);
        const baseRes = baselineContext.baseline_resolveGlobalRelated(rel, subj);
        if (JSON.stringify(optRes) !== JSON.stringify(baseRes)) {
          console.error(`Mismatch for resolveGlobalRelated("${rel}", "${subj}")`);
          console.error('Opt:', optRes);
          console.error('Base:', baseRes);
          relatedMismatches++;
        }
      }
    }
  }
}

if (relatedMismatches === 0) {
  console.log('resolveGlobalRelated() matches perfectly across all query combinations.');
} else {
  console.error(`Total related mismatches: ${relatedMismatches}`);
  process.exit(1);
}
