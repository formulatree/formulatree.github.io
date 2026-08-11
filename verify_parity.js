const fs = require('fs');
const dataCode = fs.readFileSync('data.js', 'utf8');
const vm = require('vm');

const context = { window: {}, document: { addEventListener: () => {} } };
vm.createContext(context);
vm.runInContext(dataCode, context);

const all = context.getAllFormulas();

function resolveGlobalRelatedOrig(name, currentSubject) {
  const nl = name.toLowerCase();
  let hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase() === nl);
  if (!hit) hit = all.find(f => f.name.toLowerCase() === nl);
  if (!hit && name.length >= 5) {
    hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase().startsWith(nl.substring(0, 5)));
    if (!hit) hit = all.find(f => f.name.toLowerCase().startsWith(nl.substring(0, 5)));
  }
  return hit || null;
}

// Optimized implementation
let _allFormulasCached = null;
let _idMap = null;
let _globalNameMap = null;
let _subjectNameMaps = null;
let _globalPrefixMap = null;
let _subjectPrefixMaps = null;

function ensureIndexes() {
  if (_allFormulasCached) return;
  _allFormulasCached = all; // Use the cached formulas list
  _idMap = new Map();
  _globalNameMap = new Map();
  _subjectNameMaps = new Map();
  _globalPrefixMap = new Map();
  _subjectPrefixMaps = new Map();

  for (const f of _allFormulasCached) {
    if (!_idMap.has(f.id)) {
      _idMap.set(f.id, f);
    }

    const nl = f.name.toLowerCase();

    if (!_globalNameMap.has(nl)) {
      _globalNameMap.set(nl, f);
    }

    if (!_subjectNameMaps.has(f.subject)) {
      _subjectNameMaps.set(f.subject, new Map());
    }
    const subjNameMap = _subjectNameMaps.get(f.subject);
    if (!subjNameMap.has(nl)) {
      subjNameMap.set(nl, f);
    }

    if (f.name.length >= 5) {
      const pref = nl.substring(0, 5);

      if (!_globalPrefixMap.has(pref)) {
        _globalPrefixMap.set(pref, f);
      }

      if (!_subjectPrefixMaps.has(f.subject)) {
        _subjectPrefixMaps.set(f.subject, new Map());
      }
      const subjPrefMap = _subjectPrefixMaps.get(f.subject);
      if (!subjPrefMap.has(pref)) {
        subjPrefMap.set(pref, f);
      }
    }
  }
}

function resolveGlobalRelatedOptimized(name, currentSubject) {
  ensureIndexes();
  const nl = name.toLowerCase();

  // 1. Subject exact match
  const subjNameMap = _subjectNameMaps.get(currentSubject);
  if (subjNameMap) {
    const hit = subjNameMap.get(nl);
    if (hit) return hit;
  }

  // 2. Global exact match
  const hitExact = _globalNameMap.get(nl);
  if (hitExact) return hitExact;

  if (name.length >= 5) {
    const pref = nl.substring(0, 5);

    // 3. Subject prefix match
    const subjPrefMap = _subjectPrefixMaps.get(currentSubject);
    if (subjPrefMap) {
      const hitPref = subjPrefMap.get(pref);
      if (hitPref) return hitPref;
    }

    // 4. Global prefix match
    const hitGlobalPref = _globalPrefixMap.get(pref);
    if (hitGlobalPref) return hitGlobalPref;
  }

  return null;
}

// Parity check across all possible names & prefixes
let errors = 0;
all.forEach(f => {
  if (f.related) {
    f.related.forEach(rel => {
      const orig = resolveGlobalRelatedOrig(rel, f.subject);
      const opt = resolveGlobalRelatedOptimized(rel, f.subject);
      if (orig !== opt) {
        console.error('Mismatch for related:', rel, 'subject:', f.subject, 'orig:', orig ? orig.id : null, 'opt:', opt ? opt.id : null);
        errors++;
      }
    });
  }
});

// Also test every single name
all.forEach(f => {
  const name = f.name;
  ['Physics', 'Chemistry', 'Mathematics'].forEach(subj => {
    const orig = resolveGlobalRelatedOrig(name, subj);
    const opt = resolveGlobalRelatedOptimized(name, subj);
    if (orig !== opt) {
      console.error('Mismatch for name:', name, 'subject:', subj, 'orig:', orig ? orig.id : null, 'opt:', opt ? opt.id : null);
      errors++;
    }
  });
});

console.log('Total mismatch errors:', errors);
