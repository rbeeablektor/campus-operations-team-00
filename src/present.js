(function () {
'use strict'
const CEM = (globalThis.CEM = globalThis.CEM || {})
const { MODEL_PARAMS, OUTCOMES } = CEM

/**
 * Sunum katmanı: saf, DOM'suz yardımcılar.
 * Arayüz bunları kullanır, testler doğrudan çağırır.
 */



const GROUP_SHORT = { odd: 'Tek kat', even: 'Çift kat' }

const CONGESTION_TEXT = {
  low: 'Yoğunluk düşük',
  medium: 'Yoğunluk orta',
  high: 'Yoğunluk yüksek',
}

const PARAM_LABELS = {
  secondsPerFloor: 'Kat başına kabin seyri',
  doorCycleSeconds: 'Kapı döngüsü (durak başına)',
  boardSecondsPerRider: 'Yolcu binme süresi',
  baseDemandPerMinute: 'Taban talep (grup başına)',
  stopShare: 'Yeni durak açma oranı',
  stairsSecondsPerFloorUp: 'Merdiven çıkış (kat başına)',
  stairsSecondsPerFloorDown: 'Merdiven iniş (kat başına)',
  landingSeconds: 'Merdivene yönelme',
  transferWalkSeconds: 'Aktarma yürümesi',
  corridorSeconds: 'Kat içi yürüme',
  tieThresholdSeconds: 'Başabaş eşiği',
}

const numberFormat = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 })

function formatNumber(value) {
  return numberFormat.format(value)
}

function formatValue(param) {
  return `${numberFormat.format(param.value)}\u00A0${param.unit}`
}

function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(Number(totalSeconds) || 0))
  if (seconds < 60) return `${seconds} sn`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  if (rest === 0) return `${minutes} dk`
  return `${minutes} dk ${String(rest).padStart(2, '0')} sn`
}

function formatRecordTime(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}.${month} ${hours}:${minutes}`
}

/** Sonuç nesnesini başlık + tek cümle gerekçeye çevirir. */
function outcomeCopy(result) {
  const tie = MODEL_PARAMS.tieThresholdSeconds.value
  const elevator = result.elevator

  const elevatorReason = elevator
    ? elevator.kind === 'transfer'
      ? `Aktarma ${elevator.viaFloor}. katta · toplam bekleme ${formatDuration(elevator.waitSeconds)}`
      : `${elevator.groupLabel} · bekleme tahmini ${formatDuration(elevator.waitSeconds)}`
    : ''

  switch (result.outcome) {
    case OUTCOMES.stairs:
      return {
        title: `Merdiven ${formatDuration(result.deltaSeconds)} daha hızlı`,
        sub: elevatorReason,
      }
    case OUTCOMES.elevator: {
      if (!result.stairsAllowed) {
        return {
          title: elevator && elevator.kind === 'transfer' ? 'Aktarmalı asansör' : 'Asansör öneriliyor',
          sub: `${elevatorReason} · erişilebilirlik modu açık`,
        }
      }
      return {
        title:
          elevator && elevator.kind === 'transfer'
            ? `Aktarmalı asansör ${formatDuration(result.deltaSeconds)} daha hızlı`
            : `Asansör ${formatDuration(result.deltaSeconds)} daha hızlı`,
        sub: elevatorReason,
      }
    }
    case OUTCOMES.tie:
      return {
        title: 'İki seçenek başabaş',
        sub: `Fark ${formatDuration(result.deltaSeconds)}; ${tie} saniyenin altındaki fark yönlendirme için anlamlı sayılmaz.`,
      }
    case OUTCOMES.sameFloor:
      return {
        title: 'Aynı kattasınız',
        sub: 'Kat değişikliği yok, hesaplanacak süre yok.',
      }
    default:
      return { title: 'Hesaplanıyor', sub: '' }
  }
}

Object.assign(CEM, { GROUP_SHORT, CONGESTION_TEXT, PARAM_LABELS, formatNumber, formatValue, formatDuration, formatRecordTime, outcomeCopy })
})();
