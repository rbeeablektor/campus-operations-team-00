import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import CEM from './setup.js'

const {
  CONGESTION_TEXT,
  GROUP_SHORT,
  MODEL_PARAMS,
  PARAM_LABELS,
  estimate,
  formatDuration,
  formatRecordTime,
  formatValue,
  outcomeCopy,
  parseClock,
} = CEM

const NOON = parseClock('12:50')
const CALM = parseClock('09:30')
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u

describe('süre biçimlendirme', () => {
  it('dakika ve saniyeyi Türkçe yazar', () => {
    assert.equal(formatDuration(0), '0 sn')
    assert.equal(formatDuration(21), '21 sn')
    assert.equal(formatDuration(59), '59 sn')
    assert.equal(formatDuration(60), '1 dk')
    assert.equal(formatDuration(72), '1 dk 12 sn')
    assert.equal(formatDuration(125), '2 dk 05 sn')
  })

  it('geçersiz ve negatif değerleri bozmaz', () => {
    assert.equal(formatDuration(-5), '0 sn')
    assert.equal(formatDuration(Number.NaN), '0 sn')
    assert.equal(formatDuration('42'), '42 sn')
  })

  it('kayıt zamanını gün.ay saat olarak yazar', () => {
    const iso = new Date(2026, 10, 15, 14, 5).toISOString()
    assert.equal(formatRecordTime(iso), '15.11 14:05')
    assert.equal(formatRecordTime('bozuk'), '—')
  })

  it('katsayıyı birimiyle yazar, ondalık virgüllü', () => {
    assert.equal(formatValue({ value: 2.4, unit: 's/kat' }), '2,4\u00A0s/kat')
    assert.equal(formatValue({ value: 15, unit: 'kat' }), '15\u00A0kat')
  })
})

describe('sonuç metni', () => {
  const cases = [
    { label: 'merdiven', input: { fromFloor: 1, toFloor: 3, minutesOfDay: NOON } },
    { label: 'asansör', input: { fromFloor: 1, toFloor: 15, minutesOfDay: CALM } },
    { label: 'başabaş', input: { fromFloor: 2, toFloor: 6, minutesOfDay: NOON } },
    { label: 'aynı kat', input: { fromFloor: 4, toFloor: 4, minutesOfDay: NOON } },
    { label: 'ortak kat', input: { fromFloor: 2, toFloor: 7, minutesOfDay: NOON } },
    { label: 'aktarma', input: { fromFloor: 5, toFloor: 6, minutesOfDay: NOON } },
    {
      label: 'erişilebilir aktarma',
      input: { fromFloor: 5, toFloor: 6, minutesOfDay: NOON, stairsAllowed: false },
    },
  ]

  it('her sonuç için başlık ve gerekçe üretir', () => {
    for (const testCase of cases) {
      const copy = outcomeCopy(estimate(testCase.input))
      assert.ok(copy.title.length > 0, testCase.label)
      assert.ok(copy.sub.length > 0, `${testCase.label} gerekçesi boş`)
    }
  })

  it('başlıklarda ünlem, emoji ve nokta yok', () => {
    for (const testCase of cases) {
      const { title } = outcomeCopy(estimate(testCase.input))
      assert.doesNotMatch(title, /!/, testCase.label)
      assert.doesNotMatch(title, EMOJI, testCase.label)
      assert.ok(!title.endsWith('.'), testCase.label)
    }
  })

  it('merdiven sonucu fark süresini başlıkta taşır', () => {
    const result = estimate({ fromFloor: 1, toFloor: 3, minutesOfDay: NOON })
    const copy = outcomeCopy(result)
    assert.match(copy.title, /^Merdiven /)
    assert.match(copy.title, /daha hızlı$/)
    assert.match(copy.sub, /asansörleri/)
  })

  it('erişilebilirlik modunda merdiven geçmez', () => {
    const result = estimate({
      fromFloor: 2, toFloor: 4, minutesOfDay: NOON, stairsAllowed: false,
    })
    const copy = outcomeCopy(result)
    assert.doesNotMatch(`${copy.title} ${copy.sub}`, /merdiven/i)
  })

  it('aktarma gerektiren sonuç aktarma katını söyler', () => {
    const copy = outcomeCopy(estimate({ fromFloor: 5, toFloor: 6, minutesOfDay: NOON }))
    assert.match(copy.sub, /Aktarma 3\. katta/)
  })

  it('erişilebilir aktarma sonucu tek seçeneği açıklar', () => {
    const copy = outcomeCopy(estimate({
      fromFloor: 5, toFloor: 6, minutesOfDay: NOON, stairsAllowed: false,
    }))
    assert.match(copy.title, /Aktarmalı asansör/)
    assert.match(copy.sub, /erişilebilirlik modu açık/)
  })

  it('ortak kat yolculuğu aktarma diye anlatılmaz', () => {
    const copy = outcomeCopy(estimate({ fromFloor: 2, toFloor: 7, minutesOfDay: NOON }))
    assert.doesNotMatch(`${copy.title} ${copy.sub}`, /Aktarma/)
  })
})

describe('sabit sözlükler', () => {
  it('her katsayının Türkçe etiketi var', () => {
    for (const key of Object.keys(MODEL_PARAMS)) {
      assert.ok(PARAM_LABELS[key], `${key} etiketi eksik`)
      assert.ok(PARAM_LABELS[key].length > 3)
    }
  })

  it('grup ve yoğunluk sözlükleri tamdır', () => {
    assert.deepEqual(Object.keys(GROUP_SHORT).sort(), ['even', 'odd'])
    assert.deepEqual(Object.keys(CONGESTION_TEXT).sort(), ['high', 'low', 'medium'])
  })
})
