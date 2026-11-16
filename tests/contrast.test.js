import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Kontrast, WCAG 2.1 AA eşiğine göre ölçülür (gövde metni 4.5:1).
 * Renkler `src/styles.css` değişkenlerinden okunur; elle bakılmaz.
 */
const css = readFileSync(
  fileURLToPath(new URL('../src/styles.css', import.meta.url)),
  'utf8'
)

const vars = {}
for (const match of css.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})/g)) {
  vars[match[1]] = match[2]
}

const toRgb = (hex) => {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? [...clean].map((c) => c + c).join('') : clean
  return [0, 2, 4].map((index) => parseInt(full.slice(index, index + 2), 16) / 255)
}

const linear = (channel) =>
  channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4

const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map(linear)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(foreground, background) {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a)
  return (light + 0.05) / (dark + 0.05)
}

const TEXT_PAIRS = [
  ['text', 'bg'],
  ['text', 'surface'],
  ['text', 'surface-2'],
  ['text', 'surface-3'],
  ['text-2', 'bg'],
  ['text-2', 'surface'],
  ['text-2', 'surface-2'],
  ['text-3', 'bg'],
  ['text-3', 'surface'],
  ['text-3', 'surface-2'],
  ['text-3', 'surface-3'],
  ['accent', 'surface'],
  ['accent', 'bg'],
  ['accent-ink', 'accent'],
]

describe('kontrast (WCAG AA)', () => {
  it('renk değişkenleri tanımlı', () => {
    for (const name of ['bg', 'surface', 'surface-2', 'surface-3', 'text', 'text-2', 'text-3', 'accent']) {
      assert.match(vars[name] ?? '', /^#[0-9a-fA-F]{6}$/, `--${name} eksik`)
    }
  })

  it('her metin/zemin çifti 4.5:1 eşiğini geçer', () => {
    for (const [fg, bg] of TEXT_PAIRS) {
      const ratio = contrastRatio(vars[fg], vars[bg])
      assert.ok(
        ratio >= 4.5,
        `${fg} / ${bg} = ${ratio.toFixed(2)} (< 4.5)`
      )
    }
  })

  it('birincil düğme metni accent üzerinde okunur', () => {
    assert.ok(contrastRatio(vars['accent-ink'], vars['accent']) >= 4.5)
  })

  it('form hata rengi zeminde okunur', () => {
    assert.ok(contrastRatio('#e09482', vars['surface-2']) >= 4.5)
  })
})
