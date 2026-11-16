(function () {
'use strict'
const CEM = (globalThis.CEM = globalThis.CEM || {})

/**
 * Gözlem kaydı: modelin kalibrasyonu için ham kanıt.
 * Saf fonksiyonlar burada; localStorage erişimi enjekte edilebilir
 * (test edilebilirlik için).
 */

const STORAGE_KEY = 'cem.observations.v1'
const MAX_RECORDS = 500
const MIN_WAIT_SECONDS = 1
const MAX_WAIT_SECONDS = 900

const CSV_HEADER = ['recordedAt', 'floor', 'group', 'waitSeconds']

/**
 * @returns {{ok: true, value: {floor: number, waitSeconds: number}}
 *          | {ok: false, error: string}}
 */
function validateObservation({ floor, waitSeconds }) {
  const parsedFloor = Number(floor)
  if (!Number.isInteger(parsedFloor) || parsedFloor < 1 || parsedFloor > 15) {
    return { ok: false, error: 'Kat 1 ile 15 arasında bir tam sayı olmalı.' }
  }
  if (waitSeconds === '' || waitSeconds === null || waitSeconds === undefined) {
    return { ok: false, error: 'Ölçülen bekleme süresi boş olamaz.' }
  }
  const parsedWait = Number(waitSeconds)
  if (!Number.isFinite(parsedWait) || !Number.isInteger(parsedWait)) {
    return { ok: false, error: 'Bekleme süresi saniye cinsinden tam sayı olmalı.' }
  }
  if (parsedWait < MIN_WAIT_SECONDS || parsedWait > MAX_WAIT_SECONDS) {
    return {
      ok: false,
      error: `Bekleme süresi ${MIN_WAIT_SECONDS}–${MAX_WAIT_SECONDS} saniye arasında olmalı.`,
    }
  }
  return { ok: true, value: { floor: parsedFloor, waitSeconds: parsedWait } }
}

function groupForFloorNumber(floor) {
  return floor % 2 === 1 ? 'odd' : 'even'
}

function makeObservation({ floor, waitSeconds }, nowIso) {
  return {
    id: `${nowIso}-${Math.random().toString(36).slice(2, 8)}`,
    floor,
    group: groupForFloorNumber(floor),
    waitSeconds,
    recordedAt: nowIso,
  }
}

function addRecord(records, record) {
  return [record, ...records].slice(0, MAX_RECORDS)
}

function escapeCell(value) {
  const text = String(value ?? '')
  if (/[",\r\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

function toCsv(records) {
  const lines = [CSV_HEADER.join(',')]
  for (const record of records) {
    lines.push(
      [
        escapeCell(record.recordedAt),
        escapeCell(record.floor),
        escapeCell(record.group === 'odd' ? 'tek' : 'cift'),
        escapeCell(record.waitSeconds),
      ].join(',')
    )
  }
  return lines.join('\r\n')
}

function loadRecords(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (record) =>
        record &&
        Number.isInteger(record.floor) &&
        Number.isInteger(record.waitSeconds)
    )
  } catch {
    return []
  }
}

function saveRecords(storage, records) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)))
  } catch {
    // Kota dolu veya depolama kapalı: kayıt bellekte kalır, akış bozulmaz.
  }
}

function clearRecords(storage) {
  try {
    storage.removeItem(STORAGE_KEY)
  } catch {
    // Depolama kapalıysa sessizce geç.
  }
}

/** Depolama yoksa (gizli sekme, file:// kısıtı) bellek içi yedek. */
function memoryStorage(seed = {}) {
  const store = new Map(Object.entries(seed))
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => {
      store.set(key, String(value))
    },
    removeItem: (key) => {
      store.delete(key)
    },
  }
}

/**
 * Tarayıcıda localStorage'a erişilemiyorsa (SecurityError) bellek içi
 * depolamaya düşer; uygulama yine çalışır, yalnız kayıtlar kalıcı olmaz.
 */
function resolveStorage(candidate) {
  const store = candidate ?? (typeof localStorage === 'undefined' ? undefined : localStorage)
  if (!store) return memoryStorage()
  try {
    const probe = '__cem_probe__'
    store.setItem(probe, '1')
    store.removeItem(probe)
    return store
  } catch {
    return memoryStorage()
  }
}

Object.assign(CEM, { STORAGE_KEY, MAX_RECORDS, MIN_WAIT_SECONDS, MAX_WAIT_SECONDS, CSV_HEADER, validateObservation, groupForFloorNumber, makeObservation, addRecord, toCsv, loadRecords, saveRecords, clearRecords, memoryStorage, resolveStorage })
})();
