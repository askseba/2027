#!/usr/bin/env node
/**
 * make-ui-snapshot.mjs
 * Reads docs/UI-Scope-For-Other-Models.md, extracts file paths (src/, public/, tailwind.config.ts),
 * copies each existing file to docs/ui-snapshot/<same-path>, reports missing.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const scopePath = path.join(rootDir, 'docs', 'UI-Scope-For-Other-Models.md');
const outDir = path.join(rootDir, 'docs', 'ui-snapshot');

function extractPathsFromMarkdown(content) {
  const paths = new Set();
  const lines = content.split(/\r?\n/);

  for (const line of lines) {
    if (!line.startsWith('|') || line.startsWith('|---')) continue;
    const cells = line.split('|').map((c) => c.trim());
    if (cells.length < 2) continue;
    const filePath = cells[1];
    if (!filePath) continue;
    if (
      filePath.startsWith('src/') ||
      filePath.startsWith('public/') ||
      filePath === 'tailwind.config.ts'
    ) {
      paths.add(filePath);
    }
  }

  return [...paths];
}

function main() {
  const content = fs.readFileSync(scopePath, 'utf8');
  const paths = extractPathsFromMarkdown(content);

  const copied = [];
  const missing = [];

  for (const filePath of paths) {
    const src = path.join(rootDir, filePath);
    const dest = path.join(outDir, filePath);

    if (!fs.existsSync(src)) {
      missing.push(filePath);
      continue;
    }

    const destDir = path.dirname(dest);
    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(src, dest);
    copied.push(filePath);
  }

  console.log('Copied:', copied.length);
  copied.forEach((p) => console.log('  ', p));
  console.log('');
  console.log('Missing:', missing.length);
  missing.forEach((p) => console.log('  ', p));
  console.log('');
  console.log('Output folder:', path.relative(rootDir, outDir) || outDir);
}

main();
