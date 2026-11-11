#!/usr/bin/env node
/** Fail if prisma seed sources contain U+FFFD (mojibake leftovers). */
const fs = require('fs');
const path = require('path');

const files = ['seed.js', 'seedExtras.js'].map((f) => path.join(__dirname, f));
let bad = 0;
for (const file of files) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, 'utf8');
  const count = (text.match(/\uFFFD/g) || []).length;
  if (count > 0) {
    console.error(`${path.basename(file)}: ${count} U+FFFD replacement char(s)`);
    bad += 1;
  }
}
if (bad > 0) {
  console.error('Fix UTF-8 in seed files before committing.');
  process.exit(1);
}
console.log('seed UTF-8 OK');
