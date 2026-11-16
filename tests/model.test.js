import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import CEM from './setup.js'

const {
  BUILDING,
  MODEL_PARAMS,
  OUTCOMES,
  PEAK_WINDOWS,
  buildingFloors,
  clamp,
  commonFloors,
  congestionLevel,
  decideOutcome,
  elevatorPlan,
  estimate,
  floorsForGroup,
  formatClock,
  groupsForFloor,
  isCommonFloor,
  parseClock,
  peakFactorAt,
  rideSeconds,
  servesGroup,
  stairsSeconds,
  waitModel,
} = CEM

const OFFPEAK = parseClock('09:30')
const MORNING_PEAK = parseClock('08:50')
const NOON_PEAK = parseClock('12:50')
const TIE = MODEL_PARAMS.tieThresholdSeconds.value

describe('kat ve grup eşlemesi', () => {
  it('binada 15 kat vardır ve 1..15 üretilir', () => {
    const floors = buildingFloors()
    assert.equal(floors.length, BUILDING.floors)
    assert.equal(floors[0], 1)
    assert.equal(floors.at(-1), 15)
  })

  it('1, 2, 3 ve 15 ortak katlardır', () => {
    assert.deepEqual(commonFloors(), [1, 2, 3, 15])
    assert.equal(BUILDING.groundFloor, 1)
    for (const floor of [1, 2, 3, 15]) assert.equal(isCommonFloor(floor), true)
    assert.equal(isCommonFloor(4), false)
    assert.equal(isCommonFloor(14), false)
  })

  it('ortak katlara iki grup da hizmet eder', () => {
    for (const floor of [1, 2, 3, 15]) {
      assert.deepEqual(groupsForFloor(floor), ['odd', 'even'], `${floor}. kat`)
    }
  })

  it('aradaki katlarda tek/çift ayrımı geçerli', () => {
    assert.deepEqual(groupsForFloor(4), ['even'])
    assert.deepEqual(groupsForFloor(5), ['odd'])
    assert.deepEqual(groupsForFloor(14), ['even'])
    assert.deepEqual(groupsForFloor(13), ['odd'])
  })

  it('geçersiz katlara hiçbir grup hizmet etmez', () => {
    for (const floor of [0, 16, 4.5, Number.NaN, 'x']) {
      assert.deepEqual(groupsForFloor(floor), [], String(floor))
      assert.equal(servesGroup('odd', floor), false)
      assert.equal(servesGroup('even', floor), false)
    }
  })

  it('grup kat listeleri ortak katları içerir', () => {
    assert.deepEqual(floorsForGroup('odd'), [1, 2, 3, 5, 7, 9, 11, 13, 15])
    assert.deepEqual(floorsForGroup('even'), [1, 2, 3, 4, 6, 8, 10, 12, 14, 15])
  })
})

describe('saat ve yoğunluk', () => {
  it('saati dakikaya çevirir, geçersiz girişte null döner', () => {
    assert.equal(parseClock('08:45'), 525)
    assert.equal(parseClock('00:00'), 0)
    assert.equal(parseClock('23:59'), 1439)
    assert.equal(parseClock('24:00'), null)
    assert.equal(parseClock('12:60'), null)
    assert.equal(parseClock('abc'), null)
  })

  it('dakikayı yeniden saat formatına yazar', () => {
    assert.equal(formatClock(525), '08:45')
    assert.equal(formatClock(0), '00:00')
    assert.equal(formatClock(-10), '00:00')
    assert.equal(formatClock(2000), '23:59')
  })

  it('ders geçişi pencerelerini uygular, bitiş anı hariçtir', () => {
    assert.equal(peakFactorAt(parseClock('08:50')).factor, 2.0)
    assert.equal(peakFactorAt(parseClock('08:45')).isPeak, true)
    assert.equal(peakFactorAt(parseClock('09:00')).factor, 1)
    assert.equal(peakFactorAt(parseClock('09:00')).isPeak, false)
    assert.equal(peakFactorAt(OFFPEAK).factor, 1)
  })

  it('her pencere başlangıç-bitiş arasında tanımlıdır', () => {
    for (const window of PEAK_WINDOWS) {
      assert.ok(parseClock(window.start) < parseClock(window.end), window.label)
      assert.ok(window.factor > 1, window.label)
    }
  })

  it('yoğunluk seviyesini çarpana göre sınıflar', () => {
    assert.equal(congestionLevel(1), 'low')
    assert.equal(congestionLevel(1.6), 'medium')
    assert.equal(congestionLevel(2.2), 'high')
  })
})

describe('bekleme modeli', () => {
  it('her zaman pozitif ve sonlu üretir', () => {
    for (const group of ['odd', 'even']) {
      for (const minutes of [OFFPEAK, MORNING_PEAK, NOON_PEAK]) {
        const model = waitModel(group, minutes)
        assert.ok(Number.isFinite(model.waitSeconds), `${group} ${minutes}`)
        assert.ok(model.waitSeconds > 0, `${group} ${minutes}`)
        assert.ok(model.headwaySeconds > 0)
      }
    }
  })

  it('yoğun saatte bekleme azalmaz', () => {
    const calm = waitModel('odd', OFFPEAK).waitSeconds
    const busy = waitModel('odd', NOON_PEAK).waitSeconds
    assert.ok(busy > calm, `yoğun ${busy} > sakin ${calm}`)
  })

  it('aynı girdi aynı çıktıyı verir (deterministik)', () => {
    const first = waitModel('even', NOON_PEAK)
    const second = waitModel('even', NOON_PEAK)
    assert.deepEqual(first, second)
  })

  it('durak sayısı grup kat sayısını aşmaz', () => {
    for (const group of ['odd', 'even']) {
      const model = waitModel(group, NOON_PEAK)
      assert.ok(model.stops >= 2)
      assert.ok(model.stops <= floorsForGroup(group).length)
    }
  })

  it('iki grup da aynı en üst kata çıkar (15) ve aynı tur uzunluğunda başlar', () => {
    assert.equal(Math.max(...floorsForGroup('odd')), 15)
    assert.equal(Math.max(...floorsForGroup('even')), 15)
    assert.equal(
      waitModel('odd', OFFPEAK).roundTripSeconds,
      waitModel('even', OFFPEAK).roundTripSeconds
    )
  })
})

describe('asansör planı', () => {
  it('ortak kattan her yöne doğrudan binilir', () => {
    for (const toFloor of buildingFloors()) {
      const plan = elevatorPlan(1, toFloor, OFFPEAK)
      assert.equal(plan.kind, 'direct', `1 → ${toFloor}`)
      assert.equal(plan.legs.length, 1)
    }
  })

  it('3. kattan 1 ve 2 ye doğrudan gidilir', () => {
    for (const toFloor of [1, 2]) {
      const plan = elevatorPlan(3, toFloor, OFFPEAK)
      assert.equal(plan.kind, 'direct', `3 → ${toFloor}`)
    }
  })

  it('2. kattan 7. kata doğrudan gidilir (tek asansör 2 ye de uğrar)', () => {
    const plan = elevatorPlan(2, 7, OFFPEAK)
    assert.equal(plan.kind, 'direct')
    assert.equal(plan.group, 'odd')
  })

  it('iki katı da servis eden gruplardan en hızlısını seçer', () => {
    const plan = elevatorPlan(2, 3, NOON_PEAK)
    const oddTotal = waitModel('odd', NOON_PEAK).waitSeconds
    const evenTotal = waitModel('even', NOON_PEAK).waitSeconds
    const expected = Math.min(oddTotal, evenTotal) + rideSeconds(2, 3) +
      MODEL_PARAMS.corridorSeconds.value
    assert.ok(Math.abs(plan.totalSeconds - expected) < 1e-9)
  })

  it('farklı gruplarda kalan katlar için ortak katta aktarma üretir', () => {
    for (const [from, to] of [[5, 6], [4, 5], [6, 9], [14, 13]]) {
      const plan = elevatorPlan(from, to, OFFPEAK)
      assert.equal(plan.kind, 'transfer', `${from} → ${to}`)
      assert.equal(plan.legs.length, 2, `${from} → ${to}`)
      assert.ok(commonFloors().includes(plan.viaFloor), `${from} → ${to}`)
    }
  })

  it('15. kata iki gruptan da doğrudan gidilir', () => {
    for (const from of [14, 13, 5, 2]) {
      const plan = elevatorPlan(from, 15, OFFPEAK)
      assert.equal(plan.kind, 'direct', `${from} → 15`)
    }
    assert.equal(elevatorPlan(14, 15, OFFPEAK).group, 'even')
    assert.equal(elevatorPlan(13, 15, OFFPEAK).group, 'odd')
  })

  it('aktarma katı olarak en yakın ortak katı seçer', () => {
    assert.equal(elevatorPlan(5, 6, OFFPEAK).viaFloor, 3)
    assert.equal(elevatorPlan(14, 13, OFFPEAK).viaFloor, 15)
  })

  it('aktarmalı toplam iki bekleme, iki seyir, yürüme ve koridordan oluşur', () => {
    const plan = elevatorPlan(5, 6, NOON_PEAK)
    const sum =
      plan.legs[0].waitSeconds +
      plan.legs[0].rideSeconds +
      plan.transferWalkSeconds +
      plan.legs[1].waitSeconds +
      plan.legs[1].rideSeconds +
      plan.corridorSeconds
    assert.ok(Math.abs(plan.totalSeconds - sum) < 1e-9)
  })

  it('geçersiz katta hata verir', () => {
    assert.throws(() => elevatorPlan(0, 5, OFFPEAK), RangeError)
    assert.throws(() => elevatorPlan(1, 99, OFFPEAK), RangeError)
  })

  it('seyir süresi mesafeyle artar', () => {
    assert.ok(rideSeconds(1, 5) > rideSeconds(1, 3))
    assert.equal(rideSeconds(4, 4), MODEL_PARAMS.doorCycleSeconds.value)
  })
})

describe('merdiven', () => {
  it('iniş çıkıştan hızlıdır, mesafeyle artar', () => {
    assert.ok(stairsSeconds(8, 2).totalSeconds < stairsSeconds(2, 8).totalSeconds)
    assert.ok(stairsSeconds(1, 5).totalSeconds > stairsSeconds(1, 3).totalSeconds)
    assert.equal(stairsSeconds(1, 4).perFloorSeconds,
      MODEL_PARAMS.stairsSecondsPerFloorUp.value)
  })

  it('kat içi yürüme iki seçenekte de aynıdır', () => {
    assert.equal(stairsSeconds(1, 6).corridorSeconds,
      elevatorPlan(1, 6, OFFPEAK).corridorSeconds)
  })
})

describe('karar kuralı', () => {
  it('açık ara merdiveni seçer', () => {
    assert.equal(decideOutcome({
      elevatorTotalSeconds: 180, stairsTotalSeconds: 60, stairsAllowed: true,
    }), OUTCOMES.stairs)
  })

  it('açık ara asansörü seçer', () => {
    assert.equal(decideOutcome({
      elevatorTotalSeconds: 90, stairsTotalSeconds: 210, stairsAllowed: true,
    }), OUTCOMES.elevator)
  })

  it('eşik içindeki farkı "fark yok" sayar', () => {
    assert.equal(decideOutcome({
      elevatorTotalSeconds: 100, stairsTotalSeconds: 100 + TIE - 1, stairsAllowed: true,
    }), OUTCOMES.tie)
  })

  it('eşiği aşan farkı karara çevirir', () => {
    assert.equal(decideOutcome({
      elevatorTotalSeconds: 100, stairsTotalSeconds: 100 + TIE + 1, stairsAllowed: true,
    }), OUTCOMES.elevator)
  })

  it('erişilebilirlik modunda merdiveni hiç seçmez', () => {
    assert.equal(decideOutcome({
      elevatorTotalSeconds: 400, stairsTotalSeconds: 10, stairsAllowed: false,
    }), OUTCOMES.elevator)
  })

  it('aynı kat için aynı-kat sonucunu verir', () => {
    assert.equal(decideOutcome({
      elevatorTotalSeconds: 0, stairsTotalSeconds: 0, stairsAllowed: true, sameFloor: true,
    }), OUTCOMES.sameFloor)
  })
})

describe('estimate: uçtan uca', () => {
  it('aynı katta süre üretmez', () => {
    const result = estimate({ fromFloor: 5, toFloor: 5, minutesOfDay: OFFPEAK })
    assert.equal(result.outcome, OUTCOMES.sameFloor)
    assert.equal(result.elevator, null)
    assert.equal(result.stairs, null)
  })

  it('uzun mesafede asansörü önerir', () => {
    const result = estimate({ fromFloor: 1, toFloor: 15, minutesOfDay: OFFPEAK })
    assert.equal(result.outcome, OUTCOMES.elevator)
    assert.ok(result.elevator.totalSeconds < result.stairs.totalSeconds)
  })

  it('erişilebilirlik modunda merdiven verisi üretmez', () => {
    const result = estimate({
      fromFloor: 2, toFloor: 4, minutesOfDay: NOON_PEAK, stairsAllowed: false,
    })
    assert.equal(result.outcome, OUTCOMES.elevator)
    assert.equal(result.stairs, null)
    assert.doesNotMatch(JSON.stringify(result), /merdiven/i)
  })

  it('ortak kat sayesinde 2 → 7 aktarma istemez', () => {
    const result = estimate({ fromFloor: 2, toFloor: 7, minutesOfDay: NOON_PEAK })
    assert.equal(result.transferRequired, false)
    assert.equal(result.elevator.kind, 'direct')
    assert.equal(result.elevator.group, 'odd')
  })

  it('5 → 6 gibi farklı gruplarda aktarma gerekir ve merdiven öne geçer', () => {
    const result = estimate({ fromFloor: 5, toFloor: 6, minutesOfDay: NOON_PEAK })
    assert.equal(result.transferRequired, true)
    assert.equal(result.elevator.kind, 'transfer')
    assert.equal(result.elevator.viaFloor, 3)
    assert.equal(result.outcome, OUTCOMES.stairs)
    assert.ok(result.stairs.totalSeconds < result.elevator.totalSeconds)
  })

  it('aktarmalı yol erişilebilirlik modunda tek seçenek olur', () => {
    const result = estimate({
      fromFloor: 5, toFloor: 6, minutesOfDay: NOON_PEAK, stairsAllowed: false,
    })
    assert.equal(result.outcome, OUTCOMES.elevator)
    assert.equal(result.elevator.kind, 'transfer')
    assert.equal(result.stairs, null)
  })

  it('yoğun saatteki bekleme sakinden büyüktür', () => {
    const calm = estimate({ fromFloor: 1, toFloor: 15, minutesOfDay: OFFPEAK })
    const busy = estimate({ fromFloor: 1, toFloor: 15, minutesOfDay: NOON_PEAK })
    assert.ok(busy.elevator.waitSeconds > calm.elevator.waitSeconds)
    assert.ok(busy.factor > calm.factor)
  })

  it('kısa mesafede yoğun saatte merdivene yönlendirir', () => {
    const result = estimate({ fromFloor: 1, toFloor: 3, minutesOfDay: NOON_PEAK })
    assert.equal(result.outcome, OUTCOMES.stairs)
    assert.ok(result.stairs.totalSeconds < result.elevator.totalSeconds)
    assert.ok(result.deltaSeconds > TIE)
  })

  it('15x15 kat ve 3 zaman diliminde her hücre geçerli sonuç verir', () => {
    const times = [OFFPEAK, MORNING_PEAK, NOON_PEAK]
    const allowed = new Set(Object.values(OUTCOMES))
    for (const minutesOfDay of times) {
      for (const fromFloor of buildingFloors()) {
        for (const toFloor of buildingFloors()) {
          const result = estimate({ fromFloor, toFloor, minutesOfDay })
          assert.ok(allowed.has(result.outcome), `${fromFloor}->${toFloor}`)
          assert.ok(Number.isFinite(result.deltaSeconds))
          assert.ok(!Number.isNaN(result.deltaSeconds))
          if (fromFloor !== toFloor) {
            assert.ok(result.elevator, `${fromFloor}->${toFloor} asansör planı yok`)
            assert.ok(result.elevator.totalSeconds > 0)
          }
        }
      }
    }
  })

  it('erişilebilirlik modunda hiçbir kat çiftinde merdiven önerilmez', () => {
    for (const fromFloor of buildingFloors()) {
      for (const toFloor of buildingFloors()) {
        const result = estimate({
          fromFloor, toFloor, minutesOfDay: NOON_PEAK, stairsAllowed: false,
        })
        assert.ok(
          [OUTCOMES.elevator, OUTCOMES.sameFloor].includes(result.outcome),
          `${fromFloor}->${toFloor}`
        )
        assert.equal(result.stairs, null)
      }
    }
  })

  it('aynı girdi aynı sonucu üretir (deterministik)', () => {
    const input = { fromFloor: 2, toFloor: 14, minutesOfDay: NOON_PEAK }
    assert.deepEqual(estimate(input), estimate(input))
  })

  it('clamp yardımcı fonksiyonu sınırları korur', () => {
    assert.equal(clamp(5, 0, 10), 5)
    assert.equal(clamp(-5, 0, 10), 0)
    assert.equal(clamp(50, 0, 10), 10)
  })
})
