#!/usr/bin/env node
/**
 * Lê coverage-summary.json (Jest/Vitest) ou lcov.info (Flutter)
 * e imprime métricas com 2 casas. O gate é linhas >= MIN em cada app.
 */
const fs = require('fs');
const path = require('path');

const MIN = 89;
const args = process.argv.slice(2);
const ignoreArg = args.find((arg) => arg.startsWith('--ignore='));
const positional = args.filter((arg) => !arg.startsWith('--'));
const target = positional[0];
const label = positional[1] || 'app';
const ignorePatterns = (ignoreArg ? ignoreArg.slice('--ignore='.length) : '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

if (!target) {
    console.error('Uso: node print-coverage.js <coverage-summary.json|lcov.info> [label]');
    process.exit(2);
}

const resolved = path.resolve(target);
if (!fs.existsSync(resolved)) {
    console.error(`::error::Arquivo de cobertura não encontrado: ${resolved}`);
    process.exit(1);
}

const fmt = (n) => Number(n).toFixed(2);

const printAndGate = (metrics) => {
    const rows = Object.entries(metrics).map(([name, value]) => ({
        name,
        value: Number(value),
        ok: Number(value) + 1e-9 >= MIN,
    }));

    console.log('');
    console.log(`========== Cobertura ${label} ==========`);
    for (const row of rows) {
        const mark = row.ok ? 'OK' : 'BAIXA';
        console.log(`  ${row.name.padEnd(12)} ${fmt(row.value)}%  [${mark}]`);
    }
    console.log(`  mínimo aceito ${fmt(MIN)}%`);
    console.log('========================================');
    console.log('');

    const summary = rows.map((row) => `${row.name}=${fmt(row.value)}%`).join('  ');
    console.log(`COBERTURA ${label}: ${summary}`);

    const lines = rows.find((row) => row.name === 'lines') || rows[0];
    if (!lines.ok) {
        console.error(
            `::error::Cobertura ${label} (linhas) ${fmt(lines.value)}% abaixo de ${fmt(MIN)}%`
        );
        process.exit(1);
    }

    console.log(`Cobertura ${label} aceita: linhas ${fmt(lines.value)}% (>= ${fmt(MIN)}%).`);
};

const pctOf = (metric) => {
    if (metric == null) return 0;
    if (typeof metric.pct === 'number') return metric.pct;
    if (typeof metric.percentage === 'number') return metric.percentage;
    if (typeof metric.total === 'number' && metric.total > 0) {
        return (100 * (metric.covered || 0)) / metric.total;
    }
    return 0;
};

if (resolved.endsWith('.json')) {
    const json = JSON.parse(fs.readFileSync(resolved, 'utf8'));
    const total = json.total || json;
    printAndGate({
        statements: pctOf(total.statements),
        branches: pctOf(total.branches),
        functions: pctOf(total.functions),
        lines: pctOf(total.lines),
    });
    process.exit(0);
}

const lcov = fs.readFileSync(resolved, 'utf8');
const shouldIgnore = (file) =>
    ignorePatterns.some((pattern) => file.replace(/\\/g, '/').includes(pattern));

let found = 0;
let hit = 0;
let skipped = 0;
let currentFile = '';
let skipRecord = false;

for (const line of lcov.split(/\r?\n/)) {
    if (line.startsWith('SF:')) {
        currentFile = line.slice(3);
        skipRecord = shouldIgnore(currentFile);
        if (skipRecord) skipped += 1;
        continue;
    }
    if (skipRecord) continue;
    if (line.startsWith('LF:')) found += Number(line.slice(3)) || 0;
    if (line.startsWith('LH:')) hit += Number(line.slice(3)) || 0;
}

const linesPct = found > 0 ? (100 * hit) / found : 0;
console.log(`  linhas cobertas ${hit}/${found}`);
if (skipped) {
    console.log(`  arquivos ignorados no gate: ${skipped} (${ignorePatterns.join(', ')})`);
}
printAndGate({ lines: linesPct });
