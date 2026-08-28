const fs = require('fs');
const execSync = require('child_process').execSync;
const vm = require('vm');

// Get unoptimized data.js from Git HEAD
let baseCode = execSync('git show HEAD:data.js', { encoding: 'utf8' }).replace('const SUBJECTS =', 'var SUBJECTS =');
let modCode = fs.readFileSync('data.js', 'utf8').replace('const SUBJECTS =', 'var SUBJECTS =');

const baseCtx = { Map, Object, Array, console };
vm.createContext(baseCtx);
vm.runInContext(baseCode, baseCtx);

const modCtx = { Map, Object, Array, console };
vm.createContext(modCtx);
vm.runInContext(modCode, modCtx);

// 1. Compare getAllFormulas()
const baseAll = baseCtx.getAllFormulas();
const modAll = modCtx.getAllFormulas();

if (baseAll.length !== modAll.length) {
  console.error(`Length mismatch: base ${baseAll.length} vs mod ${modAll.length}`);
  process.exit(1);
}

for (let i = 0; i < baseAll.length; i++) {
  if (baseAll[i].id !== modAll[i].id || baseAll[i].name !== modAll[i].name) {
    console.error(`Mismatch at index ${i}:`, baseAll[i], modAll[i]);
    process.exit(1);
  }
}

// 2. Compare getFormulaById() across all IDs
for (const f of baseAll) {
  const baseRes = baseCtx.getFormulaById(f.id);
  const modRes = modCtx.getFormulaById(f.id);
  if (!baseRes || !modRes || baseRes.id !== modRes.id || baseRes.name !== modRes.name) {
    console.error(`getFormulaById mismatch for ${f.id}:`, baseRes, modRes);
    process.exit(1);
  }
}

// 3. Compare resolveGlobalRelated() across all formulas and related terms
let totalRelated = 0;
for (const f of baseAll) {
  for (const r of (f.related || [])) {
    totalRelated++;
    const baseRes = baseCtx.resolveGlobalRelated(r, f.subject);
    const modRes = modCtx.resolveGlobalRelated(r, f.subject);
    if ((baseRes === null) !== (modRes === null)) {
      console.error(`resolveGlobalRelated nullness mismatch for '${r}' in subject '${f.subject}'`);
      process.exit(1);
    }
    if (baseRes && modRes && baseRes.id !== modRes.id) {
      console.error(`resolveGlobalRelated ID mismatch for '${r}' in subject '${f.subject}': ${baseRes.id} vs ${modRes.id}`);
      process.exit(1);
    }
  }
}

console.log(`✅ Parity Verification Passed! All ${baseAll.length} formula IDs and ${totalRelated} related query lookups match perfectly.`);
