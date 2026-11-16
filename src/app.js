(function () {
'use strict'
const CEM = (globalThis.CEM = globalThis.CEM || {})
const { BUILDING, MODEL_PARAMS, PEAK_WINDOWS, OUTCOMES, buildingFloors, congestionLevel, estimate, formatClock, peakFactorAt, servesGroup, CONGESTION_TEXT, GROUP_SHORT, PARAM_LABELS, formatDuration, formatNumber, formatRecordTime, formatValue, outcomeCopy, addRecord, clearRecords, groupForFloorNumber, loadRecords, makeObservation, resolveStorage, saveRecords, toCsv, validateObservation } = CEM

const el = (id) => document.getElementById(id)

const els = typeof document === 'undefined' ? {} : {
  clock: el('clock-status'),
  congestion: el('congestion-status'),
  fromFloor: el('from-floor'),
  toFloor: el('to-floor'),
  timeInput: el('time-input'),
  stairsToggle: el('stairs-toggle'),
  resultMeta: el('result-meta'),
  outcomeTitle: el('outcome-title'),
  outcomeSub: el('outcome-sub'),
  elevatorRow: el('elevator-row'),
  elevatorLabel: el('elevator-label'),
  elevatorValue: el('elevator-value'),
  stairsRow: el('stairs-row'),
  stairsValue: el('stairs-value'),
  breakdown: el('breakdown-list'),
  shaft: el('shaft'),
  paramsBody: el('params-body'),
  observationForm: el('observation-form'),
  observationFloor: el('observation-floor'),
  observationWait: el('observation-wait'),
  observationError: el('observation-error'),
  observationBody: el('observation-body'),
  observationTableWrap: el('observation-table-wrap'),
  observationEmpty: el('observation-empty'),
  observationCount: el('observation-count'),
  exportButton: el('export-csv'),
  clearButton: el('clear-observations'),
  railLinks: Array.from(document.querySelectorAll('.rail-link')),
}

let records = []
const storage = resolveStorage()

/* ---------- doldurma ---------- */

function fillFloorSelect(select, defaultFloor) {
  const fragment = document.createDocumentFragment()
  for (const floor of buildingFloors()) {
    const option = document.createElement('option')
    option.value = String(floor)
    option.textContent = `${floor}. kat`
    fragment.append(option)
  }
  select.append(fragment)
  select.value = String(defaultFloor)
}

function defaultTimeValue() {
  const now = new Date()
  const minutes = Math.floor(now.getMinutes() / 5) * 5
  return `${String(now.getHours()).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function renderParams() {
  const fragment = document.createDocumentFragment()
  for (const [key, param] of Object.entries(MODEL_PARAMS)) {
    const row = document.createElement('tr')

    const nameCell = document.createElement('td')
    nameCell.textContent = PARAM_LABELS[key] ?? key

    const valueCell = document.createElement('td')
    const value = document.createElement('span')
    value.className = 'mono'
    value.textContent = formatValue(param)
    valueCell.append(value)

    const sourceCell = document.createElement('td')
    const tag = document.createElement('span')
    tag.className = param.source === 'ölçüm' ? 'source-tag is-measured' : 'source-tag'
    tag.textContent = param.source
    sourceCell.append(tag)

    const noteCell = document.createElement('td')
    noteCell.className = 'cell-note'
    noteCell.textContent = param.note

    row.append(nameCell, valueCell, sourceCell, noteCell)
    fragment.append(row)
  }
  els.paramsBody.replaceChildren(fragment)
}

/* ---------- şaft ---------- */

function renderShaft(result) {
  const fragment = document.createDocumentFragment()
  const from = result.fromFloor
  const to = result.toFloor

  for (const floor of buildingFloors().reverse()) {
    const item = document.createElement('li')
    item.className = 'shaft-row'
    item.dataset.floor = String(floor)
    if (floor === from) item.classList.add('is-board')
    if (floor === to) item.classList.add('is-target')

    const label = document.createElement('span')
    label.className = 'shaft-floor'
    label.textContent = String(floor).padStart(2, '0')

    const oddLane = document.createElement('span')
    oddLane.className = 'lane lane-odd'
    if (servesGroup('odd', floor)) oddLane.classList.add('is-served')

    const evenLane = document.createElement('span')
    evenLane.className = 'lane lane-even'
    if (servesGroup('even', floor)) evenLane.classList.add('is-served')

    item.append(label, oddLane, evenLane)
    fragment.append(item)
  }

  els.shaft.replaceChildren(fragment)
}

/* ---------- sonuç ---------- */

function setRowState(row, { visible, widthPercent, recommended }) {
  row.classList.toggle('is-hidden', !visible)
  row.classList.toggle('is-recommended', Boolean(recommended))
  const bar = row.querySelector('.bar-fill')
  if (bar) bar.style.width = visible ? `${widthPercent}%` : '0%'
}

function renderBreakdown(result) {
  const rows = []
  const push = (label, value) => rows.push([label, value])

  if (result.elevator) {
    const elevator = result.elevator
    if (elevator.kind === 'transfer') {
      for (const leg of elevator.legs) {
        push(
          `${leg.groupLabel} ${leg.fromFloor} → ${leg.toFloor}`,
          `bekle ${formatDuration(leg.waitSeconds)} · seyir ${formatDuration(leg.rideSeconds)}`
        )
      }
      push('Aktarma yürümesi', formatDuration(elevator.transferWalkSeconds))
    } else {
      push('Asansör bekleme', formatDuration(elevator.waitSeconds))
      push('Asansör seyir', formatDuration(elevator.rideSeconds))
    }
    push('Kat içi yürüme', formatDuration(elevator.corridorSeconds))
    push('Asansör toplam', formatDuration(elevator.totalSeconds))
  }
  if (result.stairs) {
    push('Merdiven kat başına', `${formatNumber(result.stairs.perFloorSeconds)} sn`)
    push('Merdiven tırmanış', formatDuration(result.stairs.climbSeconds))
    push('Merdivene yönelme', formatDuration(result.stairs.landingSeconds))
    push('Merdiven toplam', formatDuration(result.stairs.totalSeconds))
  }
  if (rows.length === 0) push('Süre', 'Kat değişikliği yok')

  const fragment = document.createDocumentFragment()
  for (const [label, value] of rows) {
    const wrapper = document.createElement('div')
    const dt = document.createElement('dt')
    dt.textContent = label
    const dd = document.createElement('dd')
    dd.textContent = value
    wrapper.append(dt, dd)
    fragment.append(wrapper)
  }
  els.breakdown.replaceChildren(fragment)
}

function renderResult(result) {
  const copy = outcomeCopy(result)
  els.outcomeTitle.textContent = copy.title
  els.outcomeSub.textContent = copy.sub
  els.resultMeta.textContent = `Saat ${result.clock}`

  const elevator = result.elevator
  const stairs = result.stairs
  const maxSeconds = Math.max(
    elevator ? elevator.totalSeconds : 1,
    stairs ? stairs.totalSeconds : 1,
    1
  )

  if (elevator) {
    els.elevatorLabel.textContent =
      elevator.kind === 'transfer'
        ? `Asansör (${elevator.viaFloor}. katta aktarma)`
        : `Asansör (${GROUP_SHORT[elevator.group].toLowerCase()})`
    els.elevatorValue.textContent = formatDuration(elevator.totalSeconds)
  } else {
    els.elevatorValue.textContent = '—'
  }
  els.stairsValue.textContent = stairs ? formatDuration(stairs.totalSeconds) : '—'

  setRowState(els.elevatorRow, {
    visible: Boolean(elevator),
    widthPercent: elevator ? Math.round((elevator.totalSeconds / maxSeconds) * 100) : 0,
    recommended: result.outcome === OUTCOMES.elevator,
  })
  setRowState(els.stairsRow, {
    visible: Boolean(stairs),
    widthPercent: stairs ? Math.round((stairs.totalSeconds / maxSeconds) * 100) : 0,
    recommended: result.outcome === OUTCOMES.stairs,
  })

  renderBreakdown(result)
}

function readJourney() {
  const fromFloor = Number(els.fromFloor.value)
  const toFloor = Number(els.toFloor.value)
  const match = /^(\d{2}):(\d{2})$/.exec(els.timeInput.value)
  const now = new Date()
  const minutesOfDay = match
    ? Number(match[1]) * 60 + Number(match[2])
    : now.getHours() * 60 + now.getMinutes()

  return {
    fromFloor,
    toFloor,
    minutesOfDay,
    stairsAllowed: !els.stairsToggle.checked,
  }
}

function update() {
  const journey = readJourney()
  let result
  try {
    result = estimate(journey)
  } catch {
    els.outcomeTitle.textContent = 'Kat seçimi geçersiz'
    els.outcomeSub.textContent = 'Kat 1 ile 15 arasında olmalı.'
    return
  }

  renderResult(result)
  renderShaft(result)

  const peak = peakFactorAt(journey.minutesOfDay)
  els.clock.textContent = `Saat ${formatClock(journey.minutesOfDay)} · ${peak.label}`
  els.congestion.textContent = CONGESTION_TEXT[congestionLevel(peak.factor)]
  els.congestion.classList.toggle('is-peak', peak.isPeak)
}

/* ---------- gözlemler ---------- */

function renderObservations() {
  const fragment = document.createDocumentFragment()

  for (const record of records) {
    const row = document.createElement('tr')

    const timeCell = document.createElement('td')
    timeCell.className = 'mono'
    timeCell.textContent = formatRecordTime(record.recordedAt)

    const floorCell = document.createElement('td')
    floorCell.className = 'mono'
    floorCell.textContent = `${record.floor}. kat`

    const groupCell = document.createElement('td')
    groupCell.textContent = GROUP_SHORT[groupForFloorNumber(record.floor)]

    const waitCell = document.createElement('td')
    waitCell.className = 'mono'
    waitCell.textContent = formatDuration(record.waitSeconds)

    const actionCell = document.createElement('td')
    const remove = document.createElement('button')
    remove.type = 'button'
    remove.className = 'icon-button'
    remove.dataset.deleteId = record.id
    remove.setAttribute(
      'aria-label',
      `Kaydı sil: ${formatRecordTime(record.recordedAt)}, ${record.floor}. kat, ${record.waitSeconds} saniye`
    )
    remove.textContent = '×'
    actionCell.append(remove)

    row.append(timeCell, floorCell, groupCell, waitCell, actionCell)
    fragment.append(row)
  }

  els.observationBody.replaceChildren(fragment)
  els.observationTableWrap.hidden = records.length === 0
  els.observationEmpty.hidden = records.length > 0
  els.observationCount.textContent = `Bu tarayıcıda ${records.length} kayıt`
  els.exportButton.disabled = records.length === 0
}

function handleObservationSubmit(event) {
  event.preventDefault()
  const validation = validateObservation({
    floor: els.observationFloor.value,
    waitSeconds: els.observationWait.value,
  })

  els.observationWait.removeAttribute('aria-invalid')
  if (!validation.ok) {
    els.observationError.textContent = validation.error
    els.observationError.hidden = false
    els.observationWait.setAttribute('aria-invalid', 'true')
    els.observationWait.focus()
    return
  }

  els.observationError.hidden = true
  records = addRecord(
    records,
    makeObservation(validation.value, new Date().toISOString())
  )
  saveRecords(storage, records)
  renderObservations()

  els.observationWait.value = ''
  els.observationWait.focus()
}

function handleObservationDelete(event) {
  const button = event.target.closest('[data-delete-id]')
  if (!button) return
  records = records.filter((record) => record.id !== button.dataset.deleteId)
  saveRecords(storage, records)
  renderObservations()
}

function downloadCsv() {
  if (records.length === 0) return
  const blob = new Blob([`\uFEFF${toCsv(records)}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `gozlemler-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const SECTION_IDS = ['karar', 'varsayimlar', 'gozlemler']

function setActiveSection(sectionId) {
  for (const link of els.railLinks) {
    const active = link.dataset.section === sectionId
    link.classList.toggle('is-active', active)
    if (active) link.setAttribute('aria-current', 'true')
    else link.removeAttribute('aria-current')
  }
}

/**
 * Bölüm gezintisi: her tıklama hedef bölüme kaydırır. Aynı bağlantıya ikinci
 * kez basmak da çalışır; adres çubuğundaki hash değişmediği için tarayıcının
 * kendi atlaması yetmiyor. Kaydırma sürerken vurgu tıklanan bölümde kalır.
 */
function initRail() {
  const reduceMotion = () =>
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let lockUntil = 0
  let frame = 0

  const sync = () => {
    frame = 0
    if (Date.now() < lockUntil) return

    const line = window.innerHeight * 0.3
    let current = SECTION_IDS[0]
    for (const id of SECTION_IDS) {
      const section = document.getElementById(id)
      if (section && section.getBoundingClientRect().top <= line) current = id
    }
    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 8
    if (atBottom) current = SECTION_IDS[SECTION_IDS.length - 1]
    setActiveSection(current)
  }

  const schedule = () => {
    if (frame) return
    frame = requestAnimationFrame(sync)
  }

  const goToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (!section) return

    setActiveSection(sectionId)
    lockUntil = Date.now() + 700
    section.scrollIntoView({
      behavior: reduceMotion() ? 'auto' : 'smooth',
      block: 'start',
    })

    try {
      window.history.replaceState(null, '', `#${sectionId}`)
    } catch {
      // file:// üzerinde replaceState kısıtlı olabilir; kaydırma yine çalışır.
    }
    window.setTimeout(schedule, 750)
  }

  for (const link of els.railLinks) {
    link.addEventListener('click', (event) => {
      event.preventDefault()
      goToSection(link.dataset.section)
    })
  }

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  sync()
}

/* ---------- başlat ---------- */

function init() {
  fillFloorSelect(els.fromFloor, 1)
  fillFloorSelect(els.toFloor, 7)
  fillFloorSelect(els.observationFloor, 7)
  els.timeInput.value = defaultTimeValue()

  renderParams()
  records = loadRecords(storage)
  renderObservations()

  els.fromFloor.addEventListener('change', update)
  els.toFloor.addEventListener('change', update)
  els.timeInput.addEventListener('change', update)
  els.timeInput.addEventListener('input', update)
  els.stairsToggle.addEventListener('change', update)

  els.observationForm.addEventListener('submit', handleObservationSubmit)
  els.observationBody.addEventListener('click', handleObservationDelete)
  els.exportButton.addEventListener('click', downloadCsv)
  els.clearButton.addEventListener('click', () => {
    if (!window.confirm('Bu tarayıcıdaki tüm gözlem kayıtları silinsin mi?')) return
    clearRecords(storage)
    records = []
    renderObservations()
  })

  initRail()
  update()
}

if (typeof document !== 'undefined') init()

Object.assign(CEM, { BUILDING, PEAK_WINDOWS })
})();
