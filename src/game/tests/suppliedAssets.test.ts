import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { ASSETS } from '../../constants/assets';
import { caseRegistry } from '../cases';

test('every shipped image and case illustration has reviewed supplied-source provenance', () => {
  const records = JSON.parse(readFileSync('docs/supplied-runtime-assets.json', 'utf8')) as { file: string; sha256: string; source: string; sourceSha256: string; provider: string }[];
  const manifest = new Map(records.map(record => [record.file, record]));
  const sourceHashes = new Map<string, string>();
  const digest = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
  for (const entry of readdirSync('public', { recursive: true, withFileTypes: true })) {
    if (!entry.isFile() || !/\.(webp|png|jpe?g|svg|ico)$/i.test(entry.name)) continue;
    const absolute = resolve(entry.parentPath, entry.name);
    const file = '/' + absolute.slice(resolve('public').length + 1).replace(/\\/g, '/');
    const record = manifest.get(file);
    assert(record, `Unreviewed image in public bundle: ${file}`);
    assert.equal(digest(absolute), record.sha256, `Runtime art changed: ${file}`);
    assert(['medical-illustration', 'user-supplied-branding'].includes(record.provider));
    assert(record.source.startsWith('art/medical-illustration/raw/') || record.source === 'art/branding/cardiosim-icon.webp');
    if (!sourceHashes.has(record.source)) sourceHashes.set(record.source, digest(record.source));
    assert.equal(sourceHashes.get(record.source), record.sourceSha256, `Source changed: ${record.source}`);
  }
  const check = (value: unknown): void => {
    if (typeof value === 'string' && value.startsWith('/assets/')) assert(manifest.has(value), `Unreviewed runtime reference: ${value}`);
    else if (value && typeof value === 'object') Object.values(value).forEach(check);
  };
  check(ASSETS);
  caseRegistry.forEach(config => { check(config.assets); check(config.tools); });
  assert(caseRegistry.every(config => config.assets.patientSupport), 'Both cases must use the supplied registered patient layers');
});
