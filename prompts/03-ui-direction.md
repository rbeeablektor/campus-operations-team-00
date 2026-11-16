# P3 — Arayüz yönü promptu (unslop ile)

**Amaç:** Klişe "AI ürünü" görünümünden kaçınan, ürüne özgü bir yön ve denetim listesi almak.
**Üretilen artefakt:** `src/styles.css`, `index.html`, yön kararı.
**Rubrik:** v1 = 6/12 → v2 = 10/12.
**Skill:** `unslop` (CC BY 4.0, Damir Sokolovsky). Kuralı: yön yazılır, onaylanır, sonra düzenlenir.

## v1 (naif)

```
Bir öğrenci uygulaması için modern, temiz bir arayüz tasarla.
Asansör uygulaması, dashboard gibi olsun.
```

**Ürettiği kusurlar**

- "Modern, temiz" hiçbir şey söylemiyor; sonuç her ürüne uyan şablon.
- Mor–mavi gradyan, glow, emoji ikonlar, büyük harfli etiketler.
- Ürünün dünyasından (bina, kat, gösterge) hiçbir iz yok.
- Erişilebilirlik (odak, kontrast, `aria-live`) istemiyor.

## v2 (kısıtlı, unslop yönüyle)

```
Rol: Arayüz tasarımcısı. Kural: önce yön, sonra kod. Yön 5 satır olacak ve
onaylanmadan hiçbir stil yazılmayacak.

Ürün: 15 katlı kampüs binasında öğrenciye hangi asansör grubunun çalıştığını ve
asansör mü merdiven mi daha hızlı olduğunu gösteren karar aracı.
Kullanıcı: ders arasında kat değiştiren öğrenci; ayakta, telefonda, 10 saniyesi var.

İstenen (5 satır):
- Product / Character / World / Moments / Signature.

Kısıtlar:
- Tek parlak öğe: kodla çizilmiş 15 katlı şaft diyagramı. Gerisi sessiz.
- Nötr rampa: grafit. Tek accent: amber (metin kontrastı ≥ 4.5:1).
- Yasak: hue gradyanı, gradient text, glow, renkli gölge, emoji, uppercase tracked
  etiket, `transition-all`, döngüsel animasyon, minik sparkline'lı stat kartı.
- Tipografi: tek aile + mono rakamlar (tabular-nums), ağırlık 400–500, sentence case.
- Izgara: 4px. Panel padding 20–24. Satır yüksekliği tutarlı.
- Erişilebilirlik: görünür `:focus-visible`, `role="status"` + `aria-live`,
  `prefers-reduced-motion`, etiketli alanlar.
- Tek sayfa: Karar, Varsayımlar, Gözlemler bölümleri; çıktı: HTML yapısı + CSS değişkenleri.

Sonunda: (a) 9 geçişin hangi sırayla uygulandığı, (b) yasak listesine karşı öz denetim.
```

## Fark

| Boyut | v1 | v2 | Değişim |
|---|---|---|---|
| Rol/bağlam | 1 | 2 | Kullanıcı bağlamı (ayakta, 10 sn) |
| Çıktı sözleşmesi | 0 | 2 | 5 satır yön + dosya çıktısı |
| Kapsam sınırı | 0 | 1 | Yasak listesi var, "ne yapılacak" listesi kısmi |
| Belirsizlik kuralı | 0 | 1 | "Veri uydurma" dolaylı |
| Doğrulama | 1 | 2 | 9 geçiş + öz denetim |
| Dil/biçim | 1 | 2 | Klişe sıfat yasağı |

**Kabul kanıtı:** `tests/ui-contract.test.js` yasakların hiçbirini bulmuyor (gradyan, glow,
emoji, `transition-all`, uppercase); `docs/test-report.md` §4 görsel doğrulama tablosu
iki genişlikte yerleşimi doğruluyor.

## Uygulanan geçişler

| Geçiş | Yapılan |
|---|---|
| 1 Spacing | 4px ızgara, satır 20px, panel 20–24 |
| 2 Color | grafit rampası + tek amber; semantik renk yok |
| 3 Icons | emoji yok; tek inline SVG marka işareti, 1.5 stroke |
| 4 Copy | somut süre cümleleri, ünlem yok, süslü sıfat yok |
| 5 Type | sistem sans + mono rakamlar, 2 ağırlık, sentence case |
| 6 Layout | rail 248px + akışkan içerik, ilk ekran kompoze |
| 7 Details | iç içe radius, hairline, odak halkası, seçili satır = yüzey adımı |
| 8 Visuals | şaft diyagramı gerçek bina verisinden; dekoratif görsel yok |
| 9 Motion | 140 ms tek easing, yalnız renk/genişlik; reduced-motion desteği |
