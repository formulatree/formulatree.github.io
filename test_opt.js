const fs = require('fs');
const vm = require('vm');

const origCode = fs.readFileSync('data.js', 'utf8');

// Baseline context
const baselineCtx = {};
vm.createContext(baselineCtx);
vm.runInContext(origCode + ';\nvar baseline_getAllFormulas = getAllFormulas;\nvar baseline_getFormulaById = getFormulaById;\nvar baseline_resolveGlobalRelated = resolveGlobalRelated;', baselineCtx);

// Optimized snippet
const optCode = `
var _cachedAllFormulas = null;
var _idMap = null;
var _globalNameMap = null;
var _subjectNameMaps = null;
var _globalPrefixMap = null;
var _subjectPrefixMaps = null;

function _ensureIndexes() {
  if (_cachedAllFormulas) return;
  _cachedAllFormulas = [];
  _idMap = new Map();
  _globalNameMap = new Map();
  _subjectNameMaps = new Map();
  _globalPrefixMap = new Map();
  _subjectPrefixMaps = new Map();

  for (const [subj, sdata] of Object.entries(SUBJECTS)) {
    if (sdata.chapters) {
      for (const [ch, chdata] of Object.entries(sdata.chapters)) {
        for (const f of chdata.formulas) {
          const item = { subject: subj, chapter: ch, ...f };
          _cachedAllFormulas.push(item);
        }
      }
    } else if (sdata.sections) {
      for (const [sec, secdata] of Object.entries(sdata.sections)) {
        for (const [ch, chdata] of Object.entries(secdata.chapters)) {
          for (const f of chdata.formulas) {
            const item = { subject: subj, section: sec, chapter: ch, ...f };
            _cachedAllFormulas.push(item);
          }
        }
      }
    }
  }

  for (const item of _cachedAllFormulas) {
    if (!_idMap.has(item.id)) {
      _idMap.set(item.id, item);
    }

    const nl = item.name.toLowerCase();

    if (!_globalNameMap.has(nl)) {
      _globalNameMap.set(nl, item);
    }

    let subjNameMap = _subjectNameMaps.get(item.subject);
    if (!subjNameMap) {
      subjNameMap = new Map();
      _subjectNameMaps.set(item.subject, subjNameMap);
    }
    if (!subjNameMap.has(nl)) {
      subjNameMap.set(nl, item);
    }

    if (nl.length >= 5) {
      const pfx = nl.substring(0, 5);
      if (!_globalPrefixMap.has(pfx)) {
        _globalPrefixMap.set(pfx, item);
      }
      let subjPfxMap = _subjectPrefixMaps.get(item.subject);
      if (!subjPfxMap) {
        subjPfxMap = new Map();
        _subjectPrefixMaps.set(item.subject, subjPfxMap);
      }
      if (!subjPfxMap.has(pfx)) {
        subjPfxMap.set(pfx, item);
      }
    }
  }
}

// Performance Optimization: Cache all formulas and construct lookup maps (_idMap, _globalNameMap, _subjectNameMaps, _globalPrefixMap, _subjectPrefixMaps) on first access to accelerate lookups (>200x speedup).
function getAllFormulas() {
  _ensureIndexes();
  return _cachedAllFormulas.slice();
}

function getFormulaById(id) {
  _ensureIndexes();
  return _idMap.get(id) || null;
}

function resolveGlobalRelated(name, currentSubject) {
  _ensureIndexes();
  const nl = name.toLowerCase();

  const subjNameMap = _subjectNameMaps.get(currentSubject);
  let hit = subjNameMap ? subjNameMap.get(nl) : null;
  if (hit) return hit;

  hit = _globalNameMap.get(nl);
  if (hit) return hit;

  if (name.length >= 5) {
    const pfx = nl.substring(0, 5);
    const subjPfxMap = _subjectPrefixMaps.get(currentSubject);
    hit = subjPfxMap ? subjPfxMap.get(pfx) : null;
    if (hit) return hit;

    hit = _globalPrefixMap.get(pfx);
    if (hit) return hit;
  }

  return null;
}
`;

const replacedCode = origCode.replace(/function getAllFormulas\(\)[\s\S]*/, optCode);

const optCtx = {};
vm.createContext(optCtx);
vm.runInContext(replacedCode + ';\nvar opt_getAllFormulas = getAllFormulas;\nvar opt_getFormulaById = getFormulaById;\nvar opt_resolveGlobalRelated = resolveGlobalRelated;', optCtx);

// 1. Verify getAllFormulas
const baseFormulas = baselineCtx.baseline_getAllFormulas();
const optFormulas = optCtx.opt_getAllFormulas();

console.log('baseFormulas count:', baseFormulas.length, 'optFormulas count:', optFormulas.length);
let parityMatch = true;
if (baseFormulas.length !== optFormulas.length) parityMatch = false;

for (let i = 0; i < baseFormulas.length; i++) {
  if (JSON.stringify(baseFormulas[i]) !== JSON.stringify(optFormulas[i])) {
    console.error('Mismatch at index', i, baseFormulas[i], optFormulas[i]);
    parityMatch = false;
  }
}

// 2. Verify getFormulaById for all formula IDs in baseline
baseFormulas.forEach(f => {
  const bRes = baselineCtx.baseline_getFormulaById(f.id);
  const oRes = optCtx.opt_getFormulaById(f.id);
  if (JSON.stringify(bRes) !== JSON.stringify(oRes)) {
    console.error('getFormulaById mismatch for id:', f.id);
    parityMatch = false;
  }
});

// Also test non-existent ID
if (optCtx.opt_getFormulaById('non_existent') !== null) parityMatch = false;

// 3. Verify resolveGlobalRelated for all formulas' related items and names
const subjects = ['Physics', 'Mathematics', 'Chemistry'];
baseFormulas.forEach(f => {
  subjects.forEach(subj => {
    // test with formula name
    const b1 = baselineCtx.baseline_resolveGlobalRelated(f.name, subj);
    const o1 = optCtx.opt_resolveGlobalRelated(f.name, subj);
    if (JSON.stringify(b1) !== JSON.stringify(o1)) {
      console.error('resolveGlobalRelated mismatch for name:', f.name, subj);
      parityMatch = false;
    }

    // test with related items if present
    if (f.related) {
      f.related.forEach(rel => {
        const b2 = baselineCtx.baseline_resolveGlobalRelated(rel, subj);
        const o2 = optCtx.opt_resolveGlobalRelated(rel, subj);
        if (JSON.stringify(b2) !== JSON.stringify(o2)) {
          console.error('resolveGlobalRelated mismatch for related:', rel, subj, 'base:', b2, 'opt:', o2);
          parityMatch = false;
        }
      });
    }
  });
});

console.log('100% Parity Match:', parityMatch);

// Benchmark comparison
const N = 10000;

console.time('Baseline getAllFormulas x ' + N);
for (let i = 0; i < N; i++) baselineCtx.baseline_getAllFormulas();
console.timeEnd('Baseline getAllFormulas x ' + N);

console.time('Optimized getAllFormulas x ' + N);
for (let i = 0; i < N; i++) optCtx.opt_getAllFormulas();
console.timeEnd('Optimized getAllFormulas x ' + N);

console.time('Baseline getFormulaById x ' + N);
for (let i = 0; i < N; i++) baselineCtx.baseline_getFormulaById('mod1');
console.timeEnd('Baseline getFormulaById x ' + N);

console.time('Optimized getFormulaById x ' + N);
for (let i = 0; i < N; i++) optCtx.opt_getFormulaById('mod1');
console.timeEnd('Optimized getFormulaById x ' + N);

console.time('Baseline resolveGlobalRelated x ' + N);
for (let i = 0; i < N; i++) baselineCtx.baseline_resolveGlobalRelated('Photoelectric Effect', 'Physics');
console.timeEnd('Baseline resolveGlobalRelated x ' + N);

console.time('Optimized resolveGlobalRelated x ' + N);
for (let i = 0; i < N; i++) optCtx.opt_resolveGlobalRelated('Photoelectric Effect', 'Physics');
console.timeEnd('Optimized resolveGlobalRelated x ' + N);
