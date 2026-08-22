const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

// Load Git HEAD unoptimized version
const headCode = execSync('git show HEAD:data.js', { encoding: 'utf8' });
const headCodeVar = headCode.replace(/const SUBJECTS =/, 'var SUBJECTS =');
const headCtx = {};
vm.runInNewContext(headCodeVar, headCtx);

// Load current workspace data.js
const currentCode = fs.readFileSync('data.js', 'utf8');
const currentCodeVar = currentCode.replace(/const SUBJECTS =/, 'var SUBJECTS =');
const currentCtx = {};
vm.runInNewContext(currentCodeVar, currentCtx);

let passed = true;

// 1. getAllFormulas
const headAll = headCtx.getAllFormulas();
const currentAll = currentCtx.getAllFormulas();

if (headAll.length !== currentAll.length) {
  console.error(`❌ Length mismatch: HEAD ${headAll.length} vs CURRENT ${currentAll.length}`);
  passed = false;
} else {
  console.log(`✅ getAllFormulas length match (${headAll.length} formulas)`);
}

for (let i = 0; i < headAll.length; i++) {
  if (JSON.stringify(headAll[i]) !== JSON.stringify(currentAll[i])) {
    console.error(`❌ Mismatch at index ${i}:`, headAll[i], currentAll[i]);
    passed = false;
    break;
  }
}
if (passed) console.log('✅ getAllFormulas output exact match');

// 2. getFormulaById
for (const f of headAll) {
  const headRes = headCtx.getFormulaById(f.id);
  const currentRes = currentCtx.getFormulaById(f.id);
  if (JSON.stringify(headRes) !== JSON.stringify(currentRes)) {
    console.error(`❌ getFormulaById mismatch for ID ${f.id}:`, headRes, currentRes);
    passed = false;
    break;
  }
}
if (currentCtx.getFormulaById('non_existent_id') !== null) {
  console.error('❌ getFormulaById failed for non-existent ID');
  passed = false;
} else if (passed) {
  console.log('✅ getFormulaById exact match across all formula IDs');
}

// 3. resolveGlobalRelated
const subjects = ['Physics', 'Mathematics', 'Chemistry'];
for (const f of headAll) {
  for (const subj of subjects) {
    const headRes = headCtx.resolveGlobalRelated(f.name, subj);
    const currentRes = currentCtx.resolveGlobalRelated(f.name, subj);
    if (JSON.stringify(headRes) !== JSON.stringify(currentRes)) {
      console.error(`❌ resolveGlobalRelated mismatch for "${f.name}" (${subj}):`, headRes, currentRes);
      passed = false;
      break;
    }
  }
}
if (passed) console.log('✅ resolveGlobalRelated exact match across all formulas & subjects');

if (!passed) {
  console.error('❌ PARITY VERIFICATION FAILED');
  process.exit(1);
} else {
  console.log('🎉 ALL PARITY TESTS PASSED SUCCESSFULLY!');
}
