(function () {
'use strict'
const CEM = (globalThis.CEM = globalThis.CEM || {})

/**
 * Tek doğruluk kaynağı: modelin tüm katsayıları burada.
 * Her parametre `source` etiketiyle taşınır:
 *   'varsayım' → sahada ölçülmedi, tahmindir
 *   'bilinen'  → bina/sistem tarafından bilinen bir olgu
 *   'ölçüm'    → gerçek gözlemle kalibre edildi (v1'de boş)
 *
 * UI'daki hiçbir sayı bu dosyanın dışından gelmez; tutarlılık testi
 * (tests/consistency.test.js) bunu doğrular.
 */

const BUILDING = {
  floors: 15,
  groundFloor: 1,
  /**
   * Ortak katlar: dört asansör de bu katlara uğrar.
   * 1 = zemin kat. 15. kata hem tek hem çift asansör çıkabilir.
   * Aradaki katlarda tek/çift ayrımı geçerli.
   */
  commonFloors: [1, 2, 3, 15],
  groups: {
    odd: { label: 'Tek kat asansörleri', lifts: 2 },
    even: { label: 'Çift kat asansörleri', lifts: 2 },
  },
}

const MODEL_PARAMS = {
  secondsPerFloor: {
    value: 2.4,
    unit: 's/kat',
    source: 'varsayım',
    note: 'Kabin seyri, kapı beklemesi hariç. Saha ölçümü ile kalibre edilecek.',
  },
  doorCycleSeconds: {
    value: 7,
    unit: 's',
    source: 'varsayım',
    note: 'Durak başına kapı açma + kapatma döngüsü.',
  },
  boardSecondsPerRider: {
    value: 1.2,
    unit: 's/yolcu',
    source: 'varsayım',
    note: 'Yolcu başına binme süresi.',
  },
  baseDemandPerMinute: {
    value: 3.0,
    unit: 'kişi/dk',
    source: 'varsayım',
    note: 'Grup başına sakin saat talebi. Saha sayımı ile kalibre edilecek.',
  },
  stopShare: {
    value: 0.6,
    unit: 'oran',
    source: 'varsayım',
    note: 'Tur içindeki isteklerin en fazla bu kadarı yeni durak açar.',
  },
  stairsSecondsPerFloorUp: {
    value: 13,
    unit: 's/kat',
    source: 'varsayım',
    note: 'Merdivenle çıkış. Kişiye göre değişir; ölçüm bekliyor.',
  },
  stairsSecondsPerFloorDown: {
    value: 11,
    unit: 's/kat',
    source: 'varsayım',
    note: 'Merdivenle iniş.',
  },
  landingSeconds: {
    value: 6,
    unit: 's',
    source: 'varsayım',
    note: 'Kat holünde merdivene yönelme.',
  },
  transferWalkSeconds: {
    value: 25,
    unit: 's',
    source: 'varsayım',
    note: 'Aktarmalı yolculukta iki asansör grubu arasında holde yürüme.',
  },
  corridorSeconds: {
    value: 20,
    unit: 's',
    source: 'varsayım',
    note: 'Kat içi yürüme; iki seçenekte de ortak.',
  },
  tieThresholdSeconds: {
    value: 12,
    unit: 's',
    source: 'varsayım',
    note: 'Bu farkın altında iki seçenek "aynı" kabul edilir; kişisel hız farkı ±10 sn mertebesinde.',
  },
}

/**
 * Ders değişimi pencereleri. Çarpan, taban talebi bu aralıkta çarpar.
 * Aralık dışında 1.0 uygulanır.
 */
const PEAK_WINDOWS = [
  { start: '08:45', end: '09:00', factor: 2.0, label: 'Sabah ders başlangıcı' },
  { start: '10:45', end: '11:00', factor: 1.6, label: 'İkinci ders geçişi' },
  { start: '12:45', end: '13:00', factor: 2.2, label: 'Öğle ders geçişi' },
  { start: '14:45', end: '15:00', factor: 1.6, label: 'Öğleden sonra geçişi' },
  { start: '16:45', end: '17:00', factor: 1.8, label: 'Gün sonu geçişi' },
]

const DEFAULTS = {
  baseFactor: 1,
  stopFloorMin: 2,
  /** Kısıt yoksa null; transfer gerekiyorsa en yakın ortak kat bilgisi. */
  transferFloor: 1,
}

Object.assign(CEM, { BUILDING, MODEL_PARAMS, PEAK_WINDOWS, DEFAULTS })
})();
