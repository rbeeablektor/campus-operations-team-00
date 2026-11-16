import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

import CEM from './setup.js'

const read = (path) =>
  readFile(path.startsWith('http') ? path : fileURLToPath(new URL(`../${path}`, import.meta.url)), 'utf8')

const SCRIPTS = [
  'src/model-params.js',
  'src/model.js',
  'src/present.js',
  'src/evidence.js',
  'src/app.js',
]

describe('tek dosya açılış (file://) sözleşmesi', () => {
  it('index.html modül kullanmaz, klasik script yükler', async () => {
    const html = await read('index.html')
    assert.doesNotMatch(html, /type="module"/)
    const positions = SCRIPTS.map((file) => html.indexOf(`<script src="./${file}"></script>`))
    for (const [index, position] of positions.entries()) {
      assert.ok(position > -1, `${SCRIPTS[index]} index.html içinde yok`)
    }
    const sorted = [...positions].sort((a, b) => a - b)
    assert.deepEqual(positions, sorted, 'script sırası bağımlılık sırasına uymuyor')
  })

  it('hiçbir kaynak dosyası import/export içermez', async () => {
    for (const file of SCRIPTS) {
      const source = await read(file)
      assert.doesNotMatch(source, /^\s*import\s/m, `${file} import içeriyor`)
      assert.doesNotMatch(source, /^\s*export\s/m, `${file} export içeriyor`)
      assert.match(source, /globalThis\.CEM/, `${file} CEM ad alanına yazmıyor`)
    }
  })

  it('ad alanı tüm modüllerin genel API yüzeyini taşır', () => {
    const expected = [
      'BUILDING',
      'MODEL_PARAMS',
      'PEAK_WINDOWS',
      'estimate',
      'formatDuration',
      'outcomeCopy',
      'toCsv',
      'validateObservation',
      'resolveStorage',
    ]
    for (const key of expected) {
      assert.ok(key in CEM, `CEM.${key} yok`)
    }
  })

  it('app.js tarayıcı olmadan yüklenebilir (Node güvenli)', async () => {
    const source = await read('src/app.js')
    assert.match(source, /typeof document === 'undefined'/)
    assert.match(source, /if \(typeof document !== 'undefined'\) init\(\)/)
  })

  it('bölüm bağlantıları her tıklamada hedefe kaydırır', async () => {
    const source = await read('src/app.js')
    assert.match(source, /event\.preventDefault\(\)/, 'varsayılan atlama engellenmiyor')
    assert.match(source, /scrollIntoView\(/, 'açık kaydırma yok')
    assert.match(source, /lockUntil/, 'kaydırma sırasında vurgu kilitlenmiyor')
    assert.match(source, /replaceState\(/, 'adres çubuğu güncellenmiyor')
  })

  it('index.html gömülü kod içermez, kaynağı ayrı dosyalardan alır', async () => {
    const html = await read('index.html')
    assert.doesNotMatch(html, /<script>\s*\(function/)
    assert.match(html, /<link rel="stylesheet" href="\.\/src\/styles\.css" \/>/)
  })
})
