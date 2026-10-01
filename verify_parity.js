const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

function loadDataInContext(code) {
  const adaptedCode = code.replace(/^const SUBJECTS =/m, 'var SUBJECTS =')
                          .replace(/^let _/gm, 'var _');
  const context = vm.createContext({});
  vm.runInContext(adaptedCode, context);
  return context;
}

const originalCode = execSync('git show HEAD:data.js', { encoding: 'utf8' });
const originalContext = loadDataInContext(originalCode);

const currentCode = fs.readFileSync('data.js', 'utf8');
const currentContext = loadDataInContext(currentCode);

const origAll = originalContext.getAllFormulas();
const currAll = currentContext.getAllFormulas();

// Verify getAllFormulas parity
if (JSON.stringify(origAll) !== JSON.stringify(currAll)) {
  console.error('FAILED: getAllFormulas output mismatch!');
  process.exit(1);
}
console.log('PASS: getAllFormulas 100% parity verified.');

// Verify getFormulaById parity
for (const f of origAll) {
  const origResult = originalContext.getFormulaById(f.id);
  const currResult = currentContext.getFormulaById(f.id);
  if (JSON.stringify(origResult) !== JSON.stringify(currResult)) {
    console.error(`FAILED: getFormulaById mismatch for id ${f.id}`);
    process.exit(1);
  }
}
console.log(`PASS: getFormulaById 100% parity verified across all ${origAll.length} formula IDs.`);

// Verify resolveGlobalRelated parity
const allRelated = [];
for (const f of origAll) {
  if (f.related) {
    for (const r of f.related) {
      allRelated.push({ name: r, subject: f.subject });
    }
  }
}

let tested = 0;
for (const rel of allRelated) {
  const origHit = originalContext.resolveGlobalRelated(rel.name, rel.subject);
  const currHit = currentContext.resolveGlobalRelated(rel.name, rel.subject);
  if (JSON.stringify(origHit) !== JSON.stringify(currHit)) {
    console.error(`FAILED: resolveGlobalRelated mismatch for name "${rel.name}", subject "${rel.subject}"`);
    console.error('Orig:', origHit);
    console.error('Curr:', currHit);
    process.exit(1);
  }
  tested++;
}
console.log(`PASS: resolveGlobalRelated 100% parity verified across all ${tested} related query terms.`);
