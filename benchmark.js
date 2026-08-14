const fs = require('fs');

let code = fs.readFileSync('data.js', 'utf8');
const evalCode = code.replace('const SUBJECTS =', 'var SUBJECTS =');

eval(evalCode);

function origGetAll() {
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

function origGetById(id) {
  return origGetAll().find(f => f.id === id) || null;
}

function origResolve(name, currentSubject) {
  const all = origGetAll();
  const nl = name.toLowerCase();
  let hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase() === nl);
  if (!hit) hit = all.find(f => f.name.toLowerCase() === nl);
  if (!hit && name.length >= 5) {
    hit = all.find(f => f.subject === currentSubject && f.name.toLowerCase().startsWith(nl.substring(0, 5)));
    if (!hit) hit = all.find(f => f.name.toLowerCase().startsWith(nl.substring(0, 5)));
  }
  return hit || null;
}

const N = 1000;

console.log(`Running benchmark over ${N} iterations...`);

console.time('Baseline getAllFormulas');
for (let i = 0; i < N; i++) origGetAll();
console.timeEnd('Baseline getAllFormulas');

console.time('Optimized getAllFormulas');
for (let i = 0; i < N; i++) getAllFormulas();
console.timeEnd('Optimized getAllFormulas');

console.time('Baseline getFormulaById');
for (let i = 0; i < N; i++) origGetById('thm1');
console.timeEnd('Baseline getFormulaById');

console.time('Optimized getFormulaById');
for (let i = 0; i < N; i++) getFormulaById('thm1');
console.timeEnd('Optimized getFormulaById');

console.time('Baseline resolveGlobalRelated');
for (let i = 0; i < N; i++) origResolve('Ideal Gas Law', 'Thermal Physics');
console.timeEnd('Baseline resolveGlobalRelated');

console.time('Optimized resolveGlobalRelated');
for (let i = 0; i < N; i++) resolveGlobalRelated('Ideal Gas Law', 'Thermal Physics');
console.timeEnd('Optimized resolveGlobalRelated');
