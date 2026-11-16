(function () {
'use strict'
const CEM = (globalThis.CEM = globalThis.CEM || {})
const { BUILDING, DEFAULTS, MODEL_PARAMS, PEAK_WINDOWS } = CEM

/** @typedef {'odd' | 'even'} GroupName */
/** @typedef {'elevator' | 'stairs' | 'tie' | 'same-floor'} Outcome */

const OUTCOMES = Object.freeze({
  elevator: 'elevator',
  stairs: 'stairs',
  tie: 'tie',
  sameFloor: 'same-floor',
})

const P = (key) => MODEL_PARAMS[key].value

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function buildingFloors() {
  return Array.from({ length: BUILDING.floors }, (_, index) => index + 1)
}

/** Ortak katlar: dört asansörün de uğradığı katlar (zemin dahil). */
function commonFloors() {
  return [...BUILDING.commonFloors]
}

function isCommonFloor(floor) {
  return BUILDING.commonFloors.includes(floor)
}

/**
 * Grup bu kata hizmet ediyor mu?
 * 1–3 ortak katlardır, her iki grup da uğrar. 4 ve üstünde tek/çift ayrımı.
 */
function servesGroup(group, floor) {
  if (!Number.isInteger(floor) || floor < 1 || floor > BUILDING.floors) return false
  if (isCommonFloor(floor)) return true
  return floor % 2 === (group === 'odd' ? 1 : 0)
}

/** Bu kata hizmet eden gruplar; hizmet yoksa boş dizi. */
function groupsForFloor(floor) {
  return ['odd', 'even'].filter((group) => servesGroup(group, floor))
}

/** Grubun uğradığı katlar (ortak katlar dahil). */
function floorsForGroup(group) {
  return buildingFloors().filter((floor) => servesGroup(group, floor))
}

function groupLabel(group) {
  return BUILDING.groups[group]?.label ?? ''
}

/** "08:45" → 525 dakika. Geçersizse null. */
function parseClock(text) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(text).trim())
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (hours > 23 || minutes > 59) return null
  return hours * 60 + minutes
}

function formatClock(minutesOfDay) {
  const safe = clamp(Math.round(minutesOfDay), 0, 1439)
  const hours = String(Math.floor(safe / 60)).padStart(2, '0')
  const minutes = String(safe % 60).padStart(2, '0')
  return `${hours}:${minutes}`
}

/** Verilen dakika bir yoğunluk penceresine düşüyor mu? */
function peakFactorAt(minutesOfDay) {
  const safe = clamp(Number(minutesOfDay) || 0, 0, 1439)
  const window = PEAK_WINDOWS.find((entry) => {
    const start = parseClock(entry.start)
    const end = parseClock(entry.end)
    return safe >= start && safe < end
  })
  return window
    ? { factor: window.factor, label: window.label, isPeak: true }
    : { factor: DEFAULTS.baseFactor, label: 'Ders geçişi dışı', isPeak: false }
}

function congestionLevel(factor) {
  if (factor >= 1.7) return 'high'
  if (factor >= 1.3) return 'medium'
  return 'low'
}

/**
 * Grup için bekleme modeli: tur süresi ve talep birbirine bağlı olduğu için
 * iki adımlı sabit nokta ile çözülür. Deterministik, rastgelelik yok.
 */
function waitModel(group, minutesOfDay) {
  const groupFloors = floorsForGroup(group)
  const topFloor = Math.max(...groupFloors)
  const lifts = BUILDING.groups[group].lifts
  const { factor } = peakFactorAt(minutesOfDay)
  const baseTrip = 2 * (topFloor - 1) * P('secondsPerFloor')

  let roundTripSeconds = baseTrip + 2 * P('doorCycleSeconds')
  let ridersPerRoundTrip = 0
  let stops = 0

  for (let pass = 0; pass < 2; pass += 1) {
    ridersPerRoundTrip = P('baseDemandPerMinute') * factor * (roundTripSeconds / 60)
    stops = clamp(
      Math.ceil(ridersPerRoundTrip * P('stopShare')),
      DEFAULTS.stopFloorMin,
      groupFloors.length,
    )
    roundTripSeconds =
      baseTrip + stops * (P('doorCycleSeconds') + P('boardSecondsPerRider'))
  }

  const headwaySeconds = roundTripSeconds / lifts
  const queueSeconds = (ridersPerRoundTrip * P('boardSecondsPerRider')) / lifts
  const waitSeconds = headwaySeconds / 2 + queueSeconds

  return {
    group,
    factor,
    ridersPerRoundTrip,
    stops,
    roundTripSeconds,
    headwaySeconds,
    waitSeconds,
  }
}

function rideSeconds(fromFloor, toFloor) {
  return Math.abs(toFloor - fromFloor) * P('secondsPerFloor') + P('doorCycleSeconds')
}

/**
 * Tek binişlik asansör seçenekleri: iki katı da servis eden grup(lar).
 * Ortak katlar (1–3) sayesinde bu katlardan her yöne doğrudan binilebilir.
 */
function directOptions(fromFloor, toFloor, minutesOfDay) {
  const toGroups = groupsForFloor(toFloor)
  return groupsForFloor(fromFloor)
    .filter((group) => toGroups.includes(group))
    .map((group) => {
      const waitSeconds = waitModel(group, minutesOfDay).waitSeconds
      const ride = rideSeconds(fromFloor, toFloor)
      return {
        kind: 'direct',
        group,
        groupLabel: groupLabel(group),
        viaFloor: null,
        waitSeconds,
        rideSeconds: ride,
        transferWalkSeconds: 0,
        corridorSeconds: P('corridorSeconds'),
        totalSeconds: waitSeconds + ride + P('corridorSeconds'),
        legs: [
          {
            group,
            groupLabel: groupLabel(group),
            fromFloor,
            toFloor,
            waitSeconds,
            rideSeconds: ride,
          },
        ],
      }
    })
}

/**
 * İki kat farklı gruplarda ve ikisi de ortak kat değilse (ör. 5 → 6):
 * ortak bir katta (1, 2 veya 3) aktarma gerekir. İki bekleme + iki seyahat.
 */
function transferOptions(fromFloor, toFloor, minutesOfDay) {
  const [fromGroup] = groupsForFloor(fromFloor)
  const [toGroup] = groupsForFloor(toFloor)
  if (!fromGroup || !toGroup) return []

  const options = []
  for (const viaFloor of BUILDING.commonFloors) {
    if (viaFloor === fromFloor || viaFloor === toFloor) continue

    const firstWait = waitModel(fromGroup, minutesOfDay).waitSeconds
    const secondWait = waitModel(toGroup, minutesOfDay).waitSeconds
    const firstRide = rideSeconds(fromFloor, viaFloor)
    const secondRide = rideSeconds(viaFloor, toFloor)

    options.push({
      kind: 'transfer',
      group: null,
      groupLabel: `${groupLabel(fromGroup)} + ${groupLabel(toGroup)}`,
      viaFloor,
      waitSeconds: firstWait + secondWait,
      rideSeconds: firstRide + secondRide,
      transferWalkSeconds: P('transferWalkSeconds'),
      corridorSeconds: P('corridorSeconds'),
      totalSeconds:
        firstWait +
        firstRide +
        P('transferWalkSeconds') +
        secondWait +
        secondRide +
        P('corridorSeconds'),
      legs: [
        {
          group: fromGroup,
          groupLabel: groupLabel(fromGroup),
          fromFloor,
          toFloor: viaFloor,
          waitSeconds: firstWait,
          rideSeconds: firstRide,
        },
        {
          group: toGroup,
          groupLabel: groupLabel(toGroup),
          fromFloor: viaFloor,
          toFloor,
          waitSeconds: secondWait,
          rideSeconds: secondRide,
        },
      ],
    })
  }
  return options
}

/** İki kat arasındaki en hızlı asansör planı (doğrudan veya aktarmalı). */
function elevatorPlan(fromFloor, toFloor, minutesOfDay) {
  const fromGroups = groupsForFloor(fromFloor)
  const toGroups = groupsForFloor(toFloor)
  if (fromGroups.length === 0 || toGroups.length === 0) {
    throw new RangeError('Kat 1 ile 15 arasında bir tam sayı olmalı.')
  }

  const options = directOptions(fromFloor, toFloor, minutesOfDay)
  if (options.length === 0) options.push(...transferOptions(fromFloor, toFloor, minutesOfDay))
  return options.sort((a, b) => a.totalSeconds - b.totalSeconds)[0]
}

function stairsSeconds(fromFloor, toFloor) {
  const distance = Math.abs(toFloor - fromFloor)
  const perFloor =
    toFloor > fromFloor ? P('stairsSecondsPerFloorUp') : P('stairsSecondsPerFloorDown')
  const climbSeconds = distance * perFloor
  return {
    climbSeconds,
    landingSeconds: P('landingSeconds'),
    corridorSeconds: P('corridorSeconds'),
    perFloorSeconds: perFloor,
    totalSeconds: climbSeconds + P('landingSeconds') + P('corridorSeconds'),
  }
}

/**
 * Karar kuralı. Saf fonksiyon: süreler hazır verilir, böylece sınır
 * durumları doğrudan test edilebilir.
 */
function decideOutcome({
  elevatorTotalSeconds,
  stairsTotalSeconds,
  stairsAllowed,
  sameFloor = false,
}) {
  if (sameFloor) return OUTCOMES.sameFloor
  if (!stairsAllowed) return OUTCOMES.elevator

  const difference = Math.abs(elevatorTotalSeconds - stairsTotalSeconds)
  if (difference <= P('tieThresholdSeconds')) return OUTCOMES.tie
  return stairsTotalSeconds < elevatorTotalSeconds
    ? OUTCOMES.stairs
    : OUTCOMES.elevator
}

/**
 * Tek giriş noktası.
 * @param {{fromFloor:number,toFloor:number,minutesOfDay:number,stairsAllowed?:boolean}} input
 */
function estimate({
  fromFloor,
  toFloor,
  minutesOfDay,
  stairsAllowed = true,
}) {
  const sameFloor = fromFloor === toFloor
  const plan = sameFloor ? null : elevatorPlan(fromFloor, toFloor, minutesOfDay)
  const stairs = sameFloor ? null : stairsSeconds(fromFloor, toFloor)
  const transferRequired = plan ? plan.kind === 'transfer' : false

  const outcome = decideOutcome({
    elevatorTotalSeconds: plan ? plan.totalSeconds : 0,
    stairsTotalSeconds: stairs ? stairs.totalSeconds : 0,
    stairsAllowed,
    sameFloor,
  })

  const peak = peakFactorAt(minutesOfDay)
  const deltaSeconds =
    plan && stairs ? Math.abs(plan.totalSeconds - stairs.totalSeconds) : 0

  return {
    fromFloor,
    toFloor,
    minutesOfDay,
    clock: formatClock(minutesOfDay),
    stairsAllowed,
    transferRequired,
    outcome,
    deltaSeconds,
    congestion: congestionLevel(peak.factor),
    peakLabel: peak.label,
    isPeak: peak.isPeak,
    factor: peak.factor,
    // Erişilebilirlik: merdiven kapalıysa sonuç nesnesinde hiç görünmez.
    elevator: plan
      ? {
          kind: plan.kind,
          group: plan.group,
          groupLabel: plan.groupLabel,
          viaFloor: plan.viaFloor,
          waitSeconds: plan.waitSeconds,
          rideSeconds: plan.rideSeconds,
          transferWalkSeconds: plan.transferWalkSeconds,
          corridorSeconds: plan.corridorSeconds,
          totalSeconds: plan.totalSeconds,
          legs: plan.legs,
        }
      : null,
    stairs: stairsAllowed && stairs
      ? {
          perFloorSeconds: stairs.perFloorSeconds,
          climbSeconds: stairs.climbSeconds,
          landingSeconds: stairs.landingSeconds,
          corridorSeconds: stairs.corridorSeconds,
          totalSeconds: stairs.totalSeconds,
        }
      : null,
  }
}

Object.assign(CEM, {
  OUTCOMES,
  clamp,
  buildingFloors,
  commonFloors,
  isCommonFloor,
  servesGroup,
  groupsForFloor,
  floorsForGroup,
  groupLabel,
  parseClock,
  formatClock,
  peakFactorAt,
  congestionLevel,
  waitModel,
  rideSeconds,
  elevatorPlan,
  stairsSeconds,
  decideOutcome,
  estimate,
})
})();
