const fs = require('fs');
const path = require('path');

const dataJsContent = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');

const context = {};
const vm = require('vm');
vm.createContext(context);
vm.runInContext(dataJsContent, context);

const { SUBJECTS, getAllFormulas, getFormulaById, resolveGlobalRelated } = context;

function benchmark(name, fn, iterations = 10000) {
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = Date.now();
  console.log(`${name}: ${end - start}ms for ${iterations} iterations (${(end - start) / iterations}ms per call)`);
}

console.log('--- Original Implementation ---');
benchmark('getAllFormulas', () => {
  getAllFormulas();
});

const all = getAllFormulas();
const firstId = all[0].id;
const lastId = all[all.length - 1].id;

benchmark('getFormulaById (first)', () => {
  getFormulaById(firstId);
});

benchmark('getFormulaById (last)', () => {
  getFormulaById(lastId);
});

benchmark('resolveGlobalRelated (exact match)', () => {
  resolveGlobalRelated('Dimensional Formula', 'Physics');
});

benchmark('resolveGlobalRelated (prefix match)', () => {
  resolveGlobalRelated('Dimen', 'Physics');
});

// New Implementation
let _allFormulasMemo = null;
let _formulaIdMap = null;
let _formulaNameMap = null;

function getAllFormulasOptimized() {
  if (_allFormulasMemo) return _allFormulasMemo;
  const results = [];
  const subs = context.SUBJECTS;
  for (const subj in subs) {
    const sdata = subs[subj];
    if (sdata.chapters) {
      for (const ch in sdata.chapters) {
        const chdata = sdata.chapters[ch];
        for (const f of chdata.formulas) {
          results.push({ subject: subj, chapter: ch, ...f });
        }
      }
    } else if (sdata.sections) {
      for (const sec in sdata.sections) {
        const secdata = sdata.sections[sec];
        for (const ch in secdata.chapters) {
          const chdata = secdata.chapters[ch];
          for (const f of chdata.formulas) {
            results.push({ subject: subj, section: sec, chapter: ch, ...f });
          }
        }
      }
    }
  }
  _allFormulasMemo = results;
  return results;
}

function ensureMaps() {
  if (_formulaIdMap) return;
  const all = getAllFormulasOptimized();
  _formulaIdMap = new Map();
  _formulaNameMap = new Map();
  for (const f of all) {
    if (!_formulaIdMap.has(f.id)) _formulaIdMap.set(f.id, f);
    const nameKey = `${f.subject}:${f.name.toLowerCase()}`;
    if (!_formulaNameMap.has(nameKey)) _formulaNameMap.set(nameKey, f);
    if (!_formulaNameMap.has(f.name.toLowerCase())) _formulaNameMap.set(f.name.toLowerCase(), f);
  }
}

function getFormulaByIdOptimized(id) {
  ensureMaps();
  return _formulaIdMap.get(id) || null;
}

function resolveGlobalRelatedOptimized(name, currentSubject) {
  ensureMaps();
  const nl = name.toLowerCase();

  // Exact match with current subject
  let hit = _formulaNameMap.get(`${currentSubject}:${nl}`);
  if (hit) return hit;

  // Exact match globally
  hit = _formulaNameMap.get(nl);
  if (hit) return hit;

  if (name.length >= 5) {
    const prefix = nl.substring(0, 5);
    const all = getAllFormulasOptimized();
    hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase().startsWith(prefix));
    if (!hit) hit = all.find(f => f.name.toLowerCase().startsWith(prefix));
  }
  return hit || null;
}

console.log('\n--- Optimized Implementation ---');
benchmark('getAllFormulas (Optimized)', () => {
  getAllFormulasOptimized();
});

benchmark('getFormulaById (first) (Optimized)', () => {
  getFormulaByIdOptimized(firstId);
});

benchmark('getFormulaById (last) (Optimized)', () => {
  getFormulaByIdOptimized(lastId);
});

benchmark('resolveGlobalRelated (exact match) (Optimized)', () => {
  resolveGlobalRelatedOptimized('Dimensional Formula', 'Physics');
});

benchmark('resolveGlobalRelated (prefix match) (Optimized)', () => {
  resolveGlobalRelatedOptimized('Dimen', 'Physics');
});
