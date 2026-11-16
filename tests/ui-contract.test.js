import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const read = (path) =>
  readFileSync(fileURLToPath(new URL(`../${path}`, import.meta.url)), 'utf8')

const html = read('index.html')
const css = read('src/styles.css')
const app = read('src/app.js')

const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/u

describe('HTML sözleşmesi', () => {
  it('dil ve karakter kümesi tanımlı', () => {
    assert.match(html, /<html lang="tr">/)
    assert.match(html, /<meta charset="utf-8"/)
    assert.match(html, /viewport/)
  })

  it('her form alanının etiketi var', () => {
    for (const id of [
      'from-floor',
      'to-floor',
      'time-input',
      'stairs-toggle',
      'observation-floor',
      'observation-wait',
    ]) {
      assert.ok(html.includes(`for="${id}"`), `#${id} etiketsiz`)
      assert.ok(html.includes(`id="${id}"`), `#${id} yok`)
    }
  })

  it('sonuç bölgesi ekran okuyucuya bildirilir', () => {
    assert.match(html, /aria-live="polite"/)
    assert.match(html, /role="status"/)
  })

  it('form hatası canlı bölge ve açıklama ile bağlı', () => {
    assert.match(html, /id="observation-error"[^>]*role="alert"/)
    assert.match(html, /aria-describedby="observation-error form-hint-observation"/)
  })

  it('düğmelerin türü ve erişilebilir adı var', () => {
    assert.match(html, /<button class="button button-primary" type="submit">Kaydet<\/button>/)
    assert.match(html, /CSV indir/)
    assert.match(html, /Kayıtları sil/)
  })

  it('JavaScript kapalıyken bilgi verir', () => {
    assert.match(html, /<noscript>/)
  })
})

describe('metin kuralları', () => {
  it('arayüzde emoji yok', () => {
    assert.doesNotMatch(html, EMOJI)
    assert.doesNotMatch(app, EMOJI)
  })

  it('arayüz metninde ünlem yok', () => {
    const text = html.replace(/<!DOCTYPE[^>]*>/i, '')
    assert.doesNotMatch(text, /!/)
  })

  it('abartılı pazarlama sözcükleri yok', () => {
    const banned = ['mükemmel', 'devrim', 'sihirli', 'süper', 'inanılmaz', 'en iyi deneyim']
    for (const word of banned) {
      assert.ok(!html.toLowerCase().includes(word), word)
    }
  })

  it('sahte kesinlik iddiası yok', () => {
    assert.doesNotMatch(html, /kesinlikle|garanti|%100/)
  })
})

describe('CSS sözleşmesi', () => {
  it('gradyan, glow ve animasyon döngüsü yok', () => {
    assert.doesNotMatch(css, /linear-gradient|radial-gradient/)
    assert.doesNotMatch(css, /drop-shadow/)
    assert.doesNotMatch(css, /animation:/)
    assert.doesNotMatch(css, /transition:\s*all/)
  })

  it('büyük harfe zorlanan etiket yok', () => {
    assert.doesNotMatch(css, /text-transform:\s*uppercase/)
  })

  it('geniş tablolar yatay kaydırılır, kesilmez', () => {
    assert.match(css, /\.table-wrap\s*\{[^}]*overflow-x:\s*auto/)
    const wrappers = html.match(/class="table-wrap"[^>]*/g) ?? []
    assert.ok(wrappers.length >= 2)
    for (const wrapper of wrappers) {
      assert.match(wrapper, /role="region"/, 'tablo bölgesi rolü yok')
      assert.match(wrapper, /tabindex="0"/, 'tablo klavyeyle kaydırılamaz')
      assert.match(wrapper, /aria-label="/, 'tablo bölgesinin adı yok')
    }
  })

  it('açılır liste seçenekleri okunur renkte', () => {
    assert.match(css, /\.field select option\s*\{[^}]*color:/)
    assert.match(css, /color-scheme:\s*dark/)
  })

  it('odak halkası ve azaltılmış hareket desteği var', () => {
    assert.match(css, /:focus-visible/)
    assert.match(css, /prefers-reduced-motion/)
  })

  it('boşluklar 4px ızgarasında veya 2px ara adımda kalır', () => {
    const declarations = Array.from(
      css.matchAll(/(?:padding|gap|margin|min-height|height|width):\s*([^;]+);/g)
    )
    for (const match of declarations) {
      for (const token of match[1].matchAll(/(\d+)px/g)) {
        const value = Number(token[1])
        assert.ok(value === 1 || value % 2 === 0, `ızgara dışı değer: ${value}px`)
      }
    }
  })
})

describe('JavaScript güvenliği', () => {
  it('HTML enjeksiyonu kullanılmaz', () => {
    assert.doesNotMatch(app, /innerHTML/)
    assert.doesNotMatch(app, /insertAdjacentHTML/)
  })

  it('dinamik kod çalıştırılmaz', () => {
    assert.doesNotMatch(app, /\beval\(/)
    assert.doesNotMatch(app, /new Function\(/)
  })
})
