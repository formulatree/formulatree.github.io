const fs = require('fs');
const vm = require('vm');

function loadData() {
  let code = fs.readFileSync('data.js', 'utf-8');
  // Convert block scoped variables to var so they are accessible via Node vm
  code = code.replace(/const SUBJECTS/g, 'var SUBJECTS')
             .replace(/const/g, 'var')
             .replace(/let/g, 'var');
  const context = vm.createContext({});
  vm.runInContext(code, context);
  return context;
}

const context = loadData();
const { getAllFormulas, getFormulaById, resolveGlobalRelated } = context;

console.log('Parity Verification: checking total formula count...');
const formulas = getAllFormulas();
if (formulas.length !== 333) {
  console.error(`FAIL: expected 333 formulas, got ${formulas.length}`);
  process.exit(1);
}

// Perform lookups and verify order and fallback priorities
console.log('Parity Verification: checking object property order for sections...');
const organicEntry = formulas.find(f => f.section !== undefined);
if (organicEntry) {
  const keys = Object.keys(organicEntry);
  const subjectIndex = keys.indexOf('subject');
  const sectionIndex = keys.indexOf('section');
  const chapterIndex = keys.indexOf('chapter');
  if (sectionIndex < 0 || subjectIndex < 0 || chapterIndex < 0 || !(subjectIndex < sectionIndex && sectionIndex < chapterIndex)) {
    console.error('FAIL: property order is incorrect. Expected key order containing ...subject, section, chapter...', keys);
    process.exit(1);
  }
}

console.log('Parity Verification: checking duplicate ids fallback (hyd1)...');
const firstHyd = getFormulaById('hyd1');
if (!firstHyd || firstHyd.chapter !== 'Hydrogen & s-Block') {
  console.error('FAIL: getFormulaById did not resolve first duplicate instance of hyd1', firstHyd);
  process.exit(1);
}

console.log('Parity Verification: checking case insensitivity and priorities in resolveGlobalRelated...');
const search1 = resolveGlobalRelated('First Law', 'Chemistry');
if (!search1 || search1.subject !== 'Chemistry' || search1.chapter !== 'States of Matter & Thermodynamics') {
  console.error('FAIL: resolveGlobalRelated for First Law in Chemistry failed', search1);
  process.exit(1);
}

const search2 = resolveGlobalRelated('kirchhoff\'s law', 'Physics');
if (!search2 || search2.subject !== 'Chemistry' || search2.id !== 'stt7') {
  console.error('FAIL: resolveGlobalRelated for kirchhoff\'s law in Physics failed to fall back to Chemistry', search2);
  process.exit(1);
}

const search3 = resolveGlobalRelated('ohm\'s law & kirchhoff\'s laws', 'Chemistry');
if (!search3 || search3.subject !== 'Physics' || search3.id !== 'em4') {
  console.log('search3:', search3);
  console.error('FAIL: resolveGlobalRelated for ohm\'s law & kirchhoff\'s laws in Chemistry failed to fall back to Physics exact match');
  process.exit(1);
}

console.log('SUCCESS: All parity checks passed!');
