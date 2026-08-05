const fs = require('fs');
const vm = require('vm');
const { execSync } = require('child_process');

function loadInContext(code) {
  let processed = code
    .replace(/const SUBJECTS\s*=/g, 'var SUBJECTS =')
    .replace(/const/g, 'var')
    .replace(/let\s+/g, 'var ');

  const context = { window: {}, console };
  vm.createContext(context);
  vm.runInContext(processed, context);
  return context;
}

console.log("Loading baseline data.js from Git HEAD...");
const baselineCode = execSync("git show HEAD:data.js", { encoding: 'utf8' });

console.log("Loading optimized data.js from filesystem...");
const optimizedCode = fs.readFileSync("data.js", "utf8");

const baselineContext = loadInContext(baselineCode);
const optimizedContext = loadInContext(optimizedCode);

const baselineAll = baselineContext.getAllFormulas();

// Let's gather valid IDs and related names
const ids = baselineAll.map(f => f.id);
const relatedQueries = [];
for (const f of baselineAll) {
  if (f.related) {
    for (const r of f.related) {
      relatedQueries.push({ name: r, subject: f.subject });
    }
  }
}

console.log("\n--- BENCHMARK RESULTS ---\n");

// 1. getAllFormulas Benchmark
const ITERATIONS_ALL = 5000;
console.log(`Running getAllFormulas() benchmark (${ITERATIONS_ALL} iterations)...`);

const t0_base = performance.now();
for (let i = 0; i < ITERATIONS_ALL; i++) {
  baselineContext.getAllFormulas();
}
const t1_base = performance.now();
const time_base_all = t1_base - t0_base;

// Reset cache for optimized (to measure cold + warm or just warm. Let's do pure warm lookups)
optimizedContext._formulaCache = null; // force first run
optimizedContext.getAllFormulas(); // warm up

const t0_opt = performance.now();
for (let i = 0; i < ITERATIONS_ALL; i++) {
  optimizedContext.getAllFormulas();
}
const t1_opt = performance.now();
const time_opt_all = t1_opt - t0_opt;

console.log(`Baseline time:  ${time_base_all.toFixed(2)} ms`);
console.log(`Optimized time: ${time_opt_all.toFixed(2)} ms`);
console.log(`Speedup:        ${(time_base_all / time_opt_all).toFixed(2)}x\n`);


// 2. getFormulaById Benchmark
const ITERATIONS_ID = 20000;
console.log(`Running getFormulaById() benchmark (${ITERATIONS_ID} iterations)...`);

const t2_base = performance.now();
for (let i = 0; i < ITERATIONS_ID; i++) {
  const id = ids[i % ids.length];
  baselineContext.getFormulaById(id);
}
const t3_base = performance.now();
const time_base_id = t3_base - t2_base;

// Warm up optimized lookup
optimizedContext.getFormulaById(ids[0]);

const t2_opt = performance.now();
for (let i = 0; i < ITERATIONS_ID; i++) {
  const id = ids[i % ids.length];
  optimizedContext.getFormulaById(id);
}
const t3_opt = performance.now();
const time_opt_id = t3_opt - t2_opt;

console.log(`Baseline time:  ${time_base_id.toFixed(2)} ms`);
console.log(`Optimized time: ${time_opt_id.toFixed(2)} ms`);
console.log(`Speedup:        ${(time_base_id / time_opt_id).toFixed(2)}x\n`);


// 3. resolveGlobalRelated Benchmark
const ITERATIONS_RELATED = 10000;
console.log(`Running resolveGlobalRelated() benchmark (${ITERATIONS_RELATED} iterations)...`);

const t4_base = performance.now();
for (let i = 0; i < ITERATIONS_RELATED; i++) {
  const query = relatedQueries[i % relatedQueries.length];
  baselineContext.resolveGlobalRelated(query.name, query.subject);
}
const t5_base = performance.now();
const time_base_related = t5_base - t4_base;

// Warm up optimized lookup
optimizedContext.resolveGlobalRelated(relatedQueries[0].name, relatedQueries[0].subject);

const t4_opt = performance.now();
for (let i = 0; i < ITERATIONS_RELATED; i++) {
  const query = relatedQueries[i % relatedQueries.length];
  optimizedContext.resolveGlobalRelated(query.name, query.subject);
}
const t5_opt = performance.now();
const time_opt_related = t5_opt - t4_opt;

console.log(`Baseline time:  ${time_base_related.toFixed(2)} ms`);
console.log(`Optimized time: ${time_opt_related.toFixed(2)} ms`);
console.log(`Speedup:        ${(time_base_related / time_opt_related).toFixed(2)}x\n`);
