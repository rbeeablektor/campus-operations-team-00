# Prompt logu

Her satır bir prompt sürümünün ürettiği artefaktı ve insan kararını kaydeder.
Puanlar `docs/prompt-rubric.md` rubriğine göre verilmiştir (0–12).

| # | Prompt | Sürüm | Üretilen artefakt | Puan | Karar | Düzeltilen kusur | İnceleyen |
|---|---|---|---|---|---|---|---|
| 1 | P1 problem çerçeveleme | v1 | `docs/mvp-scope.md` taslağı | 6 | Reject | Gerçek zamanlı asansör verisi varmış gibi yazdı; kapsam sınırsız | Takım |
| 2 | P1 problem çerçeveleme | v2 | `docs/mvp-scope.md`, `docs/model-notes.md` §5 | 11 | Accept | Varsayım etiketleri, non-goals, erişilebilirlik maddesi | Takım |
| 3 | P2 model spesifikasyonu | v1 | `src/model.js` (ilk deneme) | 5 | Reject | Katsayılar gömülü, testsiz, `NaN` durumları yok | Takım |
| 4 | P2 model spesifikasyonu | v2 | `src/model-params.js`, `src/model.js` | 12 | Accept | Parametre sözleşmesi + invariant listesi | Takım |
| 5 | P3 arayüz yönü | v1 | stil taslağı | 6 | Reject | "Modern/temiz" klişesi; emoji, gradyan, uppercase etiket | Takım |
| 6 | P3 arayüz yönü | v2 | `src/styles.css`, `index.html` | 10 | Modify → Accept | Grafit + amber yön, 9 geçiş, a11y kısıtları | Takım |
| 7 | P4 test üretimi | v1 | `tests/model.test.js` (ilk 8 test) | 7 | Reject | Yalnız mutlu yol; erişilebilirlik ve sınır yok | Takım |
| 8 | P4 test üretimi | v2 | 5 test dosyası, 90 test | 11 | Accept | Tam tarama, sınır değerleri, CSV kaçırma, HTML sözleşmesi | Takım |
| 9 | P5 rapor | v1 | rapor taslağı | 6 | Reject | "Tüm testler geçti" iddiası, test adı ve ortam yok | Takım |
| 10 | P5 rapor | v2 | `docs/test-report.md` | 10 | Accept | Künye, katman tablosu, T01–T12 eşlemesi, boşluklar | Takım |

## Karar dağılımı

| Karar | Adet | Anlamı |
|---|---|---|
| Reject | 5 | v1 çıktıları kullanılmadı, ders: şemasız prompt |
| Modify | 1 | P3 v2: yön onaylandı, geçişler sırayla uygulandı |
| Accept | 4 | v2 çıktıları doğrudan artefakta dönüştü |

## Notlar

- İnceleyen sütunu takım onayıyla doldurulur; AI kendi çıktısını onaylamış sayılmaz.
- "Accept" kararı, çıktının **testlerle** doğrulandığı anlamına gelir; üretim doğruluğu
  (gerçek bekleme süresi) hâlâ ölçülmemiştir. Bu ayrım `docs/test-report.md` §6'da açık.
- v1 çıktıları silinmedi: `prompts/` dosyalarında karşılaştırma için duruyor, çünkü
  "prompt iyileştirme" iddiasının kanıtı farkın kendisidir.

## Dosya eşlemesi

| Prompt | Dosya | Çıktı |
|---|---|---|
| P1 | `prompts/01-problem-frame.md` | `docs/mvp-scope.md` |
| P2 | `prompts/02-model-spec.md` | `src/model*.js`, `tests/model.test.js` |
| P3 | `prompts/03-ui-direction.md` | `index.html`, `src/styles.css` |
| P4 | `prompts/04-test-gen.md` | `tests/*.test.js` |
| P5 | `prompts/05-report.md` | `docs/test-report.md` |
