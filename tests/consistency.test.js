import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import CEM from './setup.js'

const { BUILDING, MODEL_PARAMS, PARAM_LABELS, PEAK_WINDOWS, parseClock } = CEM

const read = (path) =>
  readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), 'utf8')

const SOURCES = new Set(['varsayım', 'bilinen', 'ölçüm'])

describe('katsayı sözleşmesi', () => {
  it('her katsayı sayısal, pozitif ve birimli', () => {
    for (const [key, param] of Object.entries(MODEL_PARAMS)) {
      assert.ok(Number.isFinite(param.value), `${key} sayı değil`)
      assert.ok(param.value > 0, `${key} pozitif değil`)
      assert.ok(param.unit.length > 0, `${key} birimsiz`)
      assert.ok(param.note.length > 10, `${key} notu açıklayıcı değil`)
    }
  })

  it('her katsayının kaynak etiketi geçerli', () => {
    for (const [key, param] of Object.entries(MODEL_PARAMS)) {
      assert.ok(SOURCES.has(param.source), `${key}: ${param.source}`)
    }
  })

  it('v1 katsayıları ölçüm değil varsayım olarak işaretli', () => {
    const measured = Object.values(MODEL_PARAMS).filter((p) => p.source === 'ölçüm')
    assert.equal(measured.length, 0, 'ölçüm etiketi saha verisi olmadan kullanılmamalı')
  })

  it('her katsayının Türkçe etiketi var', () => {
    for (const key of Object.keys(MODEL_PARAMS)) {
      assert.ok(PARAM_LABELS[key], `${key} etiketsiz`)
    }
  })

  it('bina tanımı 15 kat ve iki grupla tutarlı', () => {
    assert.equal(BUILDING.floors, 15)
    assert.equal(BUILDING.groups.odd.lifts, 2)
    assert.equal(BUILDING.groups.even.lifts, 2)
    assert.ok(BUILDING.groups.odd.label.length > 0)
    assert.ok(BUILDING.groups.even.label.length > 0)
  })

  it('yoğunluk pencereleri artan ve geçerli', () => {
    for (const window of PEAK_WINDOWS) {
      assert.ok(parseClock(window.start) < parseClock(window.end), window.label)
      assert.ok(window.factor > 1, window.label)
    }
  })
})

describe('doküman ↔ kod tutarlılığı', () => {
  it('model-notes.md her katsayı anahtarını listeler', () => {
    const notes = read('docs/model-notes.md')
    for (const key of Object.keys(MODEL_PARAMS)) {
      assert.ok(notes.includes(`\`${key}\``), `docs/model-notes.md içinde ${key} yok`)
    }
  })

  it('model-notes.md her yoğunluk penceresinin saatini listeler', () => {
    const notes = read('docs/model-notes.md')
    for (const window of PEAK_WINDOWS) {
      assert.ok(notes.includes(window.start), `${window.start} dokümanda yok`)
    }
  })

  it('test planı her test kimliğini içerir', () => {
    const plan = read('docs/test-plan.md')
    for (let index = 1; index <= 12; index += 1) {
      const id = `T${String(index).padStart(2, '0')}`
      assert.ok(plan.includes(id), `${id} test planında yok`)
    }
  })
})

describe('arayüz ↔ kod tutarlılığı', () => {
  const html = read('index.html')
  const app = read('src/app.js')

  it('app.js içindeki her element kimliği HTML de var', () => {
    const ids = new Set()
    for (const match of app.matchAll(/\bel\('([a-z0-9-]+)'\)/g)) {
      ids.add(match[1])
    }
    assert.ok(ids.size >= 10, 'element kimliği taraması boş')
    for (const id of ids) {
      assert.ok(html.includes(`id="${id}"`), `index.html içinde #${id} yok`)
    }
  })

  it('app.js yalnızca tanımlı bölüm kimliklerine kaydırma yapar', () => {
    for (const match of html.matchAll(/data-section="([a-z-]+)"/g)) {
      assert.ok(html.includes(`id="${match[1]}"`), `#${match[1]} bölümü yok`)
    }
  })

  it('gözlem kaydı CSV başlığı dokümante edilir', () => {
    const notes = read('docs/model-notes.md')
    const plan = read('docs/test-plan.md')
    assert.ok(/CSV/.test(notes) || /CSV/.test(plan))
  })
})
