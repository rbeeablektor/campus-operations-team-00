import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import CEM from './setup.js'

const {
  CSV_HEADER,
  MAX_RECORDS,
  STORAGE_KEY,
  addRecord,
  clearRecords,
  groupForFloorNumber,
  loadRecords,
  makeObservation,
  memoryStorage,
  resolveStorage,
  saveRecords,
  toCsv,
  validateObservation,
} = CEM

function memoryKeys(seed = {}) {
  const store = new Map(Object.entries(seed))
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: (key) => store.delete(key),
    size: () => store.size,
  }
}

describe('gözlem doğrulama', () => {
  it('geçerli kaydı kabul eder', () => {
    const result = validateObservation({ floor: '7', waitSeconds: '95' })
    assert.equal(result.ok, true)
    assert.deepEqual(result.value, { floor: 7, waitSeconds: 95 })
  })

  it('sınır değerleri kabul eder', () => {
    assert.equal(validateObservation({ floor: 1, waitSeconds: 1 }).ok, true)
    assert.equal(validateObservation({ floor: 15, waitSeconds: 900 }).ok, true)
  })

  it('geçersiz katı reddeder', () => {
    for (const floor of [0, 16, 1.5, 'abc', '']) {
      const result = validateObservation({ floor, waitSeconds: 30 })
      assert.equal(result.ok, false, `kat ${floor}`)
      assert.match(result.error, /Kat 1 ile 15/)
    }
  })

  it('boş veya aralık dışı süreyi reddeder', () => {
    assert.equal(validateObservation({ floor: 3, waitSeconds: '' }).ok, false)
    assert.equal(validateObservation({ floor: 3, waitSeconds: 0 }).ok, false)
    assert.equal(validateObservation({ floor: 3, waitSeconds: 901 }).ok, false)
    assert.equal(validateObservation({ floor: 3, waitSeconds: 12.5 }).ok, false)
  })

  it('hatayı insan dilinde açıklar', () => {
    const result = validateObservation({ floor: 3, waitSeconds: 'abc' })
    assert.equal(result.ok, false)
    assert.match(result.error, /tam sayı/)
  })
})

describe('kayıt üretimi', () => {
  it('grubu kata göre atar', () => {
    assert.equal(groupForFloorNumber(7), 'odd')
    assert.equal(groupForFloorNumber(8), 'even')
  })

  it('zaman damgalı ve kimlikli kayıt üretir', () => {
    const iso = '2026-11-15T11:05:00.000Z'
    const record = makeObservation({ floor: 8, waitSeconds: 64 }, iso)
    assert.equal(record.floor, 8)
    assert.equal(record.group, 'even')
    assert.equal(record.waitSeconds, 64)
    assert.equal(record.recordedAt, iso)
    assert.match(record.id, /^2026-11-15/)
    assert.notEqual(record.id, makeObservation({ floor: 8, waitSeconds: 64 }, iso).id)
  })

  it('yeni kaydı başa ekler ve sınırı korur', () => {
    const one = makeObservation({ floor: 2, waitSeconds: 10 }, '2026-11-15T10:00:00.000Z')
    const two = makeObservation({ floor: 3, waitSeconds: 20 }, '2026-11-15T10:05:00.000Z')
    const list = addRecord(addRecord([], one), two)
    assert.equal(list[0].id, two.id)
    assert.equal(list.length, 2)
  })

  it('kayıt sayısını MAX_RECORDS ile sınırlar', () => {
    let list = []
    for (let index = 0; index < MAX_RECORDS + 20; index += 1) {
      list = addRecord(list, makeObservation(
        { floor: 3, waitSeconds: index + 1 },
        new Date(2026, 10, 15, 10, 0, index % 60).toISOString()
      ))
    }
    assert.equal(list.length, MAX_RECORDS)
  })
})

describe('CSV çıktısı', () => {
  it('başlık ve bir satır üretir', () => {
    const record = {
      id: 'a', floor: 7, group: 'odd', waitSeconds: 95,
      recordedAt: '2026-11-15T09:10:00.000Z',
    }
    const csv = toCsv([record])
    const lines = csv.split('\r\n')
    assert.equal(lines.length, 2)
    assert.deepEqual(lines[0], CSV_HEADER.join(','))
    assert.equal(lines[1], '2026-11-15T09:10:00.000Z,7,tek,95')
  })

  it('virgül, tırnak ve satır sonu içeren hücreyi kaçırır', () => {
    const csv = toCsv([{
      id: 'a', floor: 7, group: 'odd', waitSeconds: 95,
      recordedAt: '2026,11 "özel"\n15',
    }])
    assert.match(csv, /"2026,11 ""özel""\n15"/)
  })

  it('boş listede sadece başlık döner', () => {
    assert.equal(toCsv([]), CSV_HEADER.join(','))
  })
})

describe('kalıcılık', () => {
  it('kaydeder ve geri okur', () => {
    const storage = memoryKeys()
    const records = [{
      id: 'x', floor: 5, group: 'odd', waitSeconds: 40,
      recordedAt: '2026-11-15T09:00:00.000Z',
    }]
    saveRecords(storage, records)
    assert.ok(storage.getItem(STORAGE_KEY))
    assert.deepEqual(loadRecords(storage), records)
  })

  it('bozuk ve eksik veride çökmez', () => {
    assert.deepEqual(loadRecords(memoryKeys()), [])
    assert.deepEqual(loadRecords(memoryKeys({ [STORAGE_KEY]: 'bozuk{' })), [])
    assert.deepEqual(loadRecords(memoryKeys({ [STORAGE_KEY]: '{"a":1}' })), [])
    assert.deepEqual(
      loadRecords(memoryKeys({ [STORAGE_KEY]: '[{"floor":2},{"floor":"x"}]' })),
      []
    )
  })

  it('kayıtları siler', () => {
    const storage = memoryKeys()
    saveRecords(storage, [{ id: 'a', floor: 2, group: 'even', waitSeconds: 5, recordedAt: '' }])
    clearRecords(storage)
    assert.equal(storage.getItem(STORAGE_KEY), null)
    assert.deepEqual(loadRecords(storage), [])
  })

  it('depolama hata verse de sessizce devam eder', () => {
    const broken = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceeded')
      },
      removeItem: () => {
        throw new Error('SecurityError')
      },
    }
    assert.doesNotThrow(() => saveRecords(broken, [{ id: 'a' }]))
    assert.doesNotThrow(() => clearRecords(broken))
    assert.deepEqual(loadRecords(broken), [])
  })
})

describe('depolama çözümlemesi', () => {
  it('çalışan depolamayı olduğu gibi döndürür', () => {
    const storage = memoryKeys()
    assert.equal(resolveStorage(storage), storage)
  })

  it('erişim hata verirse bellek içi depolamaya düşer', () => {
    const blocked = {
      getItem: () => null,
      setItem: () => {
        throw new Error('SecurityError')
      },
      removeItem: () => {},
    }
    const fallback = resolveStorage(blocked)
    assert.notEqual(fallback, blocked)
    fallback.setItem('a', '1')
    assert.equal(fallback.getItem('a'), '1')
  })

  it('aday yoksa bellek içi depolama üretir', () => {
    const fallback = resolveStorage(null)
    assert.equal(fallback.getItem(STORAGE_KEY), null)
    fallback.setItem('x', 'y')
    assert.equal(fallback.getItem('x'), 'y')
  })
})

