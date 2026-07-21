const fs = require('fs');
const vm = require('vm');

// Original implementations embedded for comparison
function getAllFormulasOriginal(SUBJECTS) {
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

function getFormulaByIdOriginal(SUBJECTS, id) {
  return getAllFormulasOriginal(SUBJECTS).find(f => f.id === id) || null;
}

function resolveGlobalRelatedOriginal(SUBJECTS, name, currentSubject) {
  const all = getAllFormulasOriginal(SUBJECTS);
  const nl = name.toLowerCase();
  let hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase() === nl);
  if (!hit) hit = all.find(f => f.name.toLowerCase() === nl);
  if (!hit && name.length >= 5) {
    hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase().startsWith(nl.substring(0, 5)));
    if (!hit) hit = all.find(f => f.name.toLowerCase().startsWith(nl.substring(0, 5)));
  }
  return hit || null;
}

function runBenchmark() {
  console.log('Loading data.js...');
  const dataJsContent = fs.readFileSync('data.js', 'utf8') +
    '\n;globalThis.SUBJECTS = SUBJECTS; globalThis.getAllFormulas = getAllFormulas; globalThis.getFormulaById = getFormulaById; globalThis.resolveGlobalRelated = resolveGlobalRelated;';

  const context = { console };
  vm.createContext(context);
  vm.runInNewContext(dataJsContent, context);

  const SUBJECTS = context.SUBJECTS;
  const getAllFormulas = context.getAllFormulas;
  const getFormulaById = context.getFormulaById;
  const resolveGlobalRelated = context.resolveGlobalRelated;

  console.log('Checking Functional Parity...');

  // 1. getAllFormulas Parity
  const allOrig = getAllFormulasOriginal(SUBJECTS);
  const allOpt = getAllFormulas();

  if (JSON.stringify(allOrig) !== JSON.stringify(allOpt)) {
    console.error('FAIL: getAllFormulas output mismatch!');
    console.log('Original length:', allOrig.length, 'Optimized length:', allOpt.length);
    process.exit(1);
  } else {
    console.log('PASS: getAllFormulas matches perfectly.');
  }

  // 2. getFormulaById Parity (test all IDs including duplicate ones to verify first occurrence semantics)
  const uniqueIds = Array.from(new Set(allOrig.map(f => f.id)));
  let parityIdFail = false;
  for (const id of uniqueIds) {
    const origResult = getFormulaByIdOriginal(SUBJECTS, id);
    const optResult = getFormulaById(id);
    if (JSON.stringify(origResult) !== JSON.stringify(optResult)) {
      console.error(`FAIL: getFormulaById mismatch for ID: ${id}`);
      console.log('Original:', origResult);
      console.log('Optimized:', optResult);
      parityIdFail = true;
      break;
    }
  }
  if (!parityIdFail) {
    console.log('PASS: getFormulaById matches perfectly for all IDs.');
  }

  // 3. resolveGlobalRelated Parity (test exact matches and prefixes)
  const testNames = [
    { name: 'Dimensional Formula', sub: 'Physics' },
    { name: 'Natural Rubber and Vulcanization', sub: 'Chemistry' },
    { name: 'Nylon', sub: 'Chemistry' }, // prefix match for "Nylon and Polyester Synthesis"
    { name: 'lens', sub: 'Physics' },
    { name: 'DoesNotExist', sub: 'Physics' },
  ];
  let parityRelatedFail = false;
  for (const test of testNames) {
    const origResult = resolveGlobalRelatedOriginal(SUBJECTS, test.name, test.sub);
    const optResult = resolveGlobalRelated(test.name, test.sub);
    if (JSON.stringify(origResult) !== JSON.stringify(optResult)) {
      console.error(`FAIL: resolveGlobalRelated mismatch for name: "${test.name}", sub: "${test.sub}"`);
      console.log('Original:', origResult);
      console.log('Optimized:', optResult);
      parityRelatedFail = true;
      break;
    }
  }
  if (!parityRelatedFail) {
    console.log('PASS: resolveGlobalRelated matches perfectly for test suite.');
  }

  console.log('\nStarting Performance Profiling...\n');

  // Benchmark getAllFormulas
  const count = 1000;
  console.log(`Running getAllFormulas() ${count} times...`);
  const t0_orig = performance.now();
  for (let i = 0; i < count; i++) {
    getAllFormulasOriginal(SUBJECTS);
  }
  const t1_orig = performance.now();
  const orig_duration = t1_orig - t0_orig;
  console.log(`Original getAllFormulas: ${orig_duration.toFixed(2)} ms`);

  const t0_opt = performance.now();
  for (let i = 0; i < count; i++) {
    getAllFormulas();
  }
  const t1_opt = performance.now();
  const opt_duration = t1_opt - t0_opt;
  console.log(`Optimized getAllFormulas: ${opt_duration.toFixed(2)} ms`);
  console.log(`getAllFormulas Speedup: ${(orig_duration / opt_duration).toFixed(1)}x`);

  // Benchmark getFormulaById
  const lookupCount = 5000;
  console.log(`\nRunning getFormulaById() ${lookupCount} times...`);
  const t2_orig = performance.now();
  for (let i = 0; i < lookupCount; i++) {
    getFormulaByIdOriginal(SUBJECTS, 'bio9');
  }
  const t3_orig = performance.now();
  const orig_id_duration = t3_orig - t2_orig;
  console.log(`Original getFormulaById: ${orig_id_duration.toFixed(2)} ms`);

  const t2_opt = performance.now();
  for (let i = 0; i < lookupCount; i++) {
    getFormulaById('bio9');
  }
  const t3_opt = performance.now();
  const opt_id_duration = t3_opt - t2_opt;
  console.log(`Optimized getFormulaById: ${opt_id_duration.toFixed(2)} ms`);
  console.log(`getFormulaById Speedup: ${(orig_id_duration / opt_id_duration).toFixed(1)}x`);

  // Benchmark resolveGlobalRelated
  const relatedCount = 5000;
  console.log(`\nRunning resolveGlobalRelated() ${relatedCount} times...`);
  const t4_orig = performance.now();
  for (let i = 0; i < relatedCount; i++) {
    resolveGlobalRelatedOriginal(SUBJECTS, 'Nylon', 'Chemistry');
  }
  const t5_orig = performance.now();
  const orig_related_duration = t5_orig - t4_orig;
  console.log(`Original resolveGlobalRelated: ${orig_related_duration.toFixed(2)} ms`);

  const t4_opt = performance.now();
  for (let i = 0; i < relatedCount; i++) {
    resolveGlobalRelated('Nylon', 'Chemistry');
  }
  const t5_opt = performance.now();
  const opt_related_duration = t5_opt - t4_opt;
  console.log(`Optimized resolveGlobalRelated: ${opt_related_duration.toFixed(2)} ms`);
  console.log(`resolveGlobalRelated Speedup: ${(orig_related_duration / opt_related_duration).toFixed(1)}x`);
}

runBenchmark();
