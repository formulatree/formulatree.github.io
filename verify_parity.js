const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

function loadContext(codeString) {
  // Replace let and const with var to bind variables to the vm context
  // specifically for SUBJECTS, and any cache/helper variables.
  const modifiedCode = codeString
    .replace(/\bconst SUBJECTS\b/g, 'var SUBJECTS')
    .replace(/\blet _/g, 'var _')
    .replace(/\bconst _/g, 'var _');

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(modifiedCode, sandbox);
  return sandbox;
}

function runVerificationAndBenchmark() {
  console.log('--- Loading Baseline Unoptimized data.js from Git HEAD ---');
  let baselineCode;
  try {
    baselineCode = execSync('git show HEAD:data.js', { encoding: 'utf8' });
  } catch (err) {
    console.error('Failed to read baseline data.js from git history:', err.message);
    // Fallback to local data.js file if git show fails
    baselineCode = fs.readFileSync('data.js', 'utf8');
  }

  const baselineSandbox = loadContext(baselineCode);

  console.log('--- Loading Current (Possibly Optimized) data.js from Disk ---');
  const currentCode = fs.readFileSync('data.js', 'utf8');
  const currentSandbox = loadContext(currentCode);

  // 1. Functional Parity Tests
  console.log('\n--- Running Functional Parity Checks ---');

  const baseAllFormulas = baselineSandbox.getAllFormulas();
  const currAllFormulas = currentSandbox.getAllFormulas();

  // Check 1.1: getAllFormulas matches perfectly in structure and order (including section ordering)
  const baseAllJson = JSON.stringify(baseAllFormulas);
  const currAllJson = JSON.stringify(currAllFormulas);

  if (baseAllJson !== currAllJson) {
    console.error('❌ FAIL: getAllFormulas() does not match baseline!');
    console.log(`Baseline count: ${baseAllFormulas.length}, Current count: ${currAllFormulas.length}`);
    // Find first mismatch
    for (let i = 0; i < Math.max(baseAllFormulas.length, currAllFormulas.length); i++) {
      const b = JSON.stringify(baseAllFormulas[i]);
      const c = JSON.stringify(currAllFormulas[i]);
      if (b !== c) {
        console.log(`First mismatch at index ${i}:`);
        console.log('Baseline:', b);
        console.log('Current :', c);
        break;
      }
    }
    process.exit(1);
  } else {
    console.log('✅ PASS: getAllFormulas() matches baseline perfectly (length, property order, and items).');
  }

  // Check 1.2: getFormulaById matches for all IDs in the dataset plus some edge cases
  let idParityPassed = true;
  const allIds = baseAllFormulas.map(f => f.id);
  // Add some nonexistent and edge case IDs
  const testIds = [...allIds, 'nonexistent', 'hyd1', 'opt4', '', null, undefined];

  for (const id of testIds) {
    const baseResult = baselineSandbox.getFormulaById(id);
    const currResult = currentSandbox.getFormulaById(id);
    if (JSON.stringify(baseResult) !== JSON.stringify(currResult)) {
      console.error(`❌ FAIL: getFormulaById("${id}") mismatch!`);
      console.log('Baseline:', JSON.stringify(baseResult));
      console.log('Current :', JSON.stringify(currResult));
      idParityPassed = false;
      break;
    }
  }
  if (idParityPassed) {
    console.log(`✅ PASS: getFormulaById() matches baseline for all ${testIds.length} tested IDs.`);
  } else {
    process.exit(1);
  }

  // Check 1.3: resolveGlobalRelated matches for all related items, exact matches, prefixes, and priorities
  let relatedParityPassed = true;
  const subjects = ['Physics', 'Mathematics', 'Chemistry'];

  // Collect all related strings and formula names to test
  const testNames = new Set();
  baseAllFormulas.forEach(f => {
    testNames.add(f.name);
    testNames.add(f.name.toLowerCase());
    testNames.add(f.name.toUpperCase());
    if (f.related) {
      f.related.forEach(r => {
        testNames.add(r);
        testNames.add(r.toLowerCase());
        testNames.add(r.substring(0, 5));
        testNames.add(r.substring(0, 5).toLowerCase());
      });
    }
  });
  // Edge cases
  testNames.add('');
  testNames.add('Short');
  testNames.add('Non-existent Formula name');
  testNames.add('Enthalpy'); // check case sensitivity and global priority
  testNames.add('Lens'); // 7 results in search, let's see resolveGlobalRelated

  console.log(`Testing resolveGlobalRelated with ${testNames.size} strings across ${subjects.length} subjects...`);

  let checkedCount = 0;
  for (const name of testNames) {
    if (name === undefined || name === null) continue;
    for (const subj of subjects) {
      const baseResult = baselineSandbox.resolveGlobalRelated(name, subj);
      const currResult = currentSandbox.resolveGlobalRelated(name, subj);
      if (JSON.stringify(baseResult) !== JSON.stringify(currResult)) {
        console.error(`❌ FAIL: resolveGlobalRelated("${name}", "${subj}") mismatch!`);
        console.log('Baseline:', JSON.stringify(baseResult));
        console.log('Current :', JSON.stringify(currResult));
        relatedParityPassed = false;
        break;
      }
      checkedCount++;
    }
    if (!relatedParityPassed) break;
  }

  if (relatedParityPassed) {
    console.log(`✅ PASS: resolveGlobalRelated() matches baseline for all ${checkedCount} query-subject combinations.`);
  } else {
    process.exit(1);
  }

  // 2. Performance Benchmarking
  console.log('\n--- Running Performance Benchmarks ---');

  // Benchmark 2.1: getFormulaById performance over 20,000 lookups
  console.log('Benchmarking getFormulaById (20,000 iterations)...');
  const iterCount = 20000;

  const t0_base_id = performance.now();
  for (let i = 0; i < iterCount; i++) {
    const id = allIds[i % allIds.length];
    baselineSandbox.getFormulaById(id);
  }
  const t1_base_id = performance.now();
  const time_base_id = t1_base_id - t0_base_id;

  const t0_curr_id = performance.now();
  for (let i = 0; i < iterCount; i++) {
    const id = allIds[i % allIds.length];
    currentSandbox.getFormulaById(id);
  }
  const t1_curr_id = performance.now();
  const time_curr_id = t1_curr_id - t0_curr_id;

  const speedup_id = time_base_id / time_curr_id;
  console.log(`  Baseline Time: ${time_base_id.toFixed(2)} ms`);
  console.log(`  Optimized Time: ${time_curr_id.toFixed(2)} ms`);
  console.log(`  Speedup for getFormulaById: ${speedup_id.toFixed(1)}x`);

  // Benchmark 2.2: resolveGlobalRelated performance over 20,000 lookups
  console.log('Benchmarking resolveGlobalRelated (20,000 iterations)...');
  const testNamesArr = Array.from(testNames);

  const t0_base_rel = performance.now();
  for (let i = 0; i < iterCount; i++) {
    const name = testNamesArr[i % testNamesArr.length];
    const subj = subjects[i % subjects.length];
    baselineSandbox.resolveGlobalRelated(name, subj);
  }
  const t1_base_rel = performance.now();
  const time_base_rel = t1_base_rel - t0_base_rel;

  const t0_curr_rel = performance.now();
  for (let i = 0; i < iterCount; i++) {
    const name = testNamesArr[i % testNamesArr.length];
    const subj = subjects[i % subjects.length];
    currentSandbox.resolveGlobalRelated(name, subj);
  }
  const t1_curr_rel = performance.now();
  const time_curr_rel = t1_curr_rel - t0_curr_rel;

  const speedup_rel = time_base_rel / time_curr_rel;
  console.log(`  Baseline Time: ${time_base_rel.toFixed(2)} ms`);
  console.log(`  Optimized Time: ${time_curr_rel.toFixed(2)} ms`);
  console.log(`  Speedup for resolveGlobalRelated: ${speedup_rel.toFixed(1)}x`);

  console.log('\n======================================');
  if (speedup_id > 1.5 && speedup_rel > 1.5) {
    console.log('⚡ Benchmark Result: HUGE SUCCESS!');
    console.log(`getFormulaById speedup: ${speedup_id.toFixed(1)}x`);
    console.log(`resolveGlobalRelated speedup: ${speedup_rel.toFixed(1)}x`);
  } else {
    console.log('⚠️ Benchmark Result: No significant speedup detected. Check optimization.');
  }
  console.log('======================================\n');
}

runVerificationAndBenchmark();
