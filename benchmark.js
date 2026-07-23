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

console.log('=== BENCHMARK START ===');

console.time('getAllFormulas x10000');
for (let i = 0; i < 10000; i++) {
  getAllFormulas();
}
console.timeEnd('getAllFormulas x10000');

console.time('getFormulaById x10000');
for (let i = 0; i < 10000; i++) {
  getFormulaById('stt4');
}
console.timeEnd('getFormulaById x10000');

console.time('resolveGlobalRelated x10000');
for (let i = 0; i < 10000; i++) {
  resolveGlobalRelated('First Law', 'Chemistry');
}
console.timeEnd('resolveGlobalRelated x10000');

console.log('=== BENCHMARK END ===');
