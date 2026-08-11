const fs = require('fs');
const vm = require('vm');

function loadDataJS() {
  const dataCode = fs.readFileSync('data.js', 'utf8');
  const context = { window: {}, document: { addEventListener: () => {} } };
  vm.createContext(context);
  vm.runInContext(dataCode, context);
  return context;
}

function runBenchmark() {
  const context = loadDataJS();
  const all = context.getAllFormulas();

  console.log('--- RUNNING RETRIEVAL BENCHMARKS ---');
  console.log(`Total formulas to query: ${all.length}`);

  // 1. getAllFormulas Benchmark
  const itersGetAll = 1000;
  const startGetAll = parseFloat(process.hrtime.bigint().toString()) / 1e6;
  for (let i = 0; i < itersGetAll; i++) {
    context.getAllFormulas();
  }
  const endGetAll = parseFloat(process.hrtime.bigint().toString()) / 1e6;
  const elapsedGetAll = endGetAll - startGetAll;
  console.log(`getAllFormulas x ${itersGetAll}: ${elapsedGetAll.toFixed(2)} ms (${(elapsedGetAll / itersGetAll).toFixed(4)} ms/op)`);

  // 2. getFormulaById Benchmark
  const itersGetId = 10000;
  const ids = all.map(f => f.id);
  const startGetId = parseFloat(process.hrtime.bigint().toString()) / 1e6;
  for (let i = 0; i < itersGetId; i++) {
    const id = ids[i % ids.length];
    context.getFormulaById(id);
  }
  const endGetId = parseFloat(process.hrtime.bigint().toString()) / 1e6;
  const elapsedGetId = endGetId - startGetId;
  console.log(`getFormulaById x ${itersGetId}: ${elapsedGetId.toFixed(2)} ms (${(elapsedGetId / itersGetId).toFixed(4)} ms/op)`);

  // 3. resolveGlobalRelated Benchmark
  const itersResolve = 5000;
  const relatedNames = [];
  all.forEach(f => {
    if (f.related) {
      f.related.forEach(r => relatedNames.push({ name: r, subj: f.subject }));
    }
  });
  const startResolve = parseFloat(process.hrtime.bigint().toString()) / 1e6;
  for (let i = 0; i < itersResolve; i++) {
    const item = relatedNames[i % relatedNames.length];
    context.resolveGlobalRelated(item.name, item.subj);
  }
  const endResolve = parseFloat(process.hrtime.bigint().toString()) / 1e6;
  const elapsedResolve = endResolve - startResolve;
  console.log(`resolveGlobalRelated x ${itersResolve}: ${elapsedResolve.toFixed(2)} ms (${(elapsedResolve / itersResolve).toFixed(4)} ms/op)`);

  return {
    getAllMs: elapsedGetAll,
    getIdMs: elapsedGetId,
    resolveMs: elapsedResolve
  };
}

if (require.main === module) {
  runBenchmark();
}

module.exports = { runBenchmark };
