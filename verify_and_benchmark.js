const fs = require('fs');
const dataJs = fs.readFileSync('data.js', 'utf8');

function runTests() {
  const context = {};
  eval(dataJs);

  const all = getAllFormulas();
  console.log(`Total formulas: ${all.length}`);

  // Parity checks
  const testId = 'mod9';
  const fById = getFormulaById(testId);
  if (!fById || fById.id !== testId) throw new Error('getFormulaById failed');

  const testName = 'Photoelectric Effect';
  const fByName = resolveGlobalRelated(testName, 'Physics');
  if (!fByName || fByName.name !== testName) throw new Error('resolveGlobalRelated failed');

  // Performance benchmarks
  const ITERATIONS = 1000;

  let start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) getAllFormulas();
  let end = performance.now();
  const t1 = end - start;
  console.log(`getAllFormulas x ${ITERATIONS}: ${t1.toFixed(2)}ms`);

  start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) getFormulaById('mod9');
  end = performance.now();
  const t2 = end - start;
  console.log(`getFormulaById x ${ITERATIONS}: ${t2.toFixed(2)}ms`);

  start = performance.now();
  for (let i = 0; i < ITERATIONS; i++) resolveGlobalRelated('Photoelectric Effect', 'Physics');
  end = performance.now();
  const t3 = end - start;
  console.log(`resolveGlobalRelated x ${ITERATIONS}: ${t3.toFixed(2)}ms`);

  return { t1, t2, t3, count: all.length };
}

try {
  const results = runTests();
  fs.writeFileSync('benchmark_results.json', JSON.stringify(results));
} catch (e) {
  console.error(e);
  process.exit(1);
}
