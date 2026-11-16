# Campus Elevator Mobility — MVP Planı (v0.1)

- **Takım:** Campus Operations — Team 00 (Ege KURNAZ, Emre YILMAZ, Fatih ELAGÖZ, Eyüp Efe COŞKUN)
- **Haftanın görevi (hoca):** "promptlarımızı en iyi hale getirmek ve MVP üretmek. Sonrasında mutlaka TEST işlemlerini gerçekleştirelim."
- **Bu belgenin amacı:** Kod yazmadan önce kapsamı, modeli, prompt sürecini, test stratejisini ve sprint dağılımını netleştirmek; onaydan sonra sırayla uygulamak.
- **Çalışma klasörü:** `C:\1OdevModevBirseyler\campus-elevator-mobility` (ana repo `campus-operations-team-00` **değiştirilmez**; çıktılar buradan ekiple PR ile taşınır)
- **Tarih:** 15 Kasım 2026

---

## 0. Neden bu plan böyle kurgulandı (geri bildirimlere cevap)

| Hoca geri bildirimi | Plandaki karşılığı |
|---|---|
| w01: "YerimVar vaka analizi, kendi projenizin kanıtı değildir" | MVP'deki her sayı **varsayım / ölçüm** etiketiyle ayrı gösterilir; model parametreleri tek dosyada toplanır ve raporlanır |
| w01: "Üç özelliği aynı anda geliştirmeyin, küçük doğrulanabilir bir başlangıç çözümü" | MVP **tek bir kullanıcı kararına** indirgenir: "hangi kat, hangi asansör grubu, hangisi daha hızlı" |
| w01: "Erişilebilirlik göz ardı edilmemeli" | "Merdiven kullanamıyorum" modu: merdiven hiç önerilmez; bu davranış **test edilir** |
| w01: "AI önerisi kabul edilmiş olması, uygulanabilir olduğunun kanıtı değildir" | Gerçek asansör verisi yok varsayımıyla çalışan model + "kanıt eksik" paneli + ölçüm toplama aracı |
| w04: "Scrum-inspired demek daha doğru; rol ve sorumluluk belirleyin" | Görevler sahipli (aşağıda), süreç adı "Scrum-inspired" olarak düzeltilir |
| w04: "İlk sprint somut, doğrulanabilir çıktı üretmeli" | Sprint çıktıları çalışan site + yeşil test çıktısı + prompt log olarak tanımlı |
| w04: "Asansör verisi alınamazsa alternatif senaryo?" | MVP zaten veri yok varsayımıyla çalışır; veri gelirse parametreler kalibre edilir (v1.1) |

---

## 1. Kapsam

### 1.1 MVP'nin çözdüğü tek problem

> Öğrenci, binada bulunduğu kattan gitmek istediği kata çıkarken **hangi asansör grubunun (tek/çift) ona hizmet verdiğini** ve **o anda asansörle mi merdivenle mi daha hızlı gideceğini** bilemiyor.

MVP bu tek kararı verir. Ölçülebilir başarı: kullanıcı 10 saniyede "bekle / yürü" kararını gerekçesiyle görebilir.

### 1.2 Kapsam içi (v1)

1. **Karar ekranı:** biniş katı (1–15), hedef kat, saat (otomatik + manuel), "merdiven kullanamıyorum" anahtarı.
2. **Sonuç:** hizmet veren asansör grubu, tahmini bekleme, toplam asansör süresi, merdiven süresi, öneri + tek cümle gerekçe, yoğunluk etiketi (sakin/orta/yüksek).
3. **Varsayım paneli:** kullanılan her parametre, değeri ve `varsayım` / `ölçüm` etiketi; "bu bir tahmindir" notu.
4. **Gözlem kaydı (kanıt üretimi):** gerçek bekleme süresini saniye ile kaydetme, liste, CSV dışa aktarma (tarayıcıda localStorage). Bu, dönem sonu kalibrasyonunun ham verisidir.
5. **Kalibrasyon (v1.1, opsiyonel):** CSV birikirse ölçüm/ortalama oranı model parametresine yansır.

### 1.3 Kapsam dışı (bilinçli)

- Gerçek zamanlı asansör konum/çağrı verisi (erişim doğrulanmadı).
- Kullanıcı hesabı, sunucu, veritabanı, bildirim.
- İç mekân harita/rota çizimi, kapasite simülasyonu, tahmin için makine öğrenmesi.
- Tek/çift grup yük dengesizliğinin canlı gösterimi (veri gerektirir → v2).

### 1.4 Kabul kriterleri (MVP "bitti" tanımı)

- [ ] `node tools/serve.mjs` ile site açılıyor; konsolda hata yok.
- [ ] 15×15 kat çiftinde ve 3 zaman diliminde sonuç üretiliyor, `NaN`/`undefined` yok.
- [ ] Erişilebilirlik modunda merdiven **hiçbir yerde** önerilmiyor.
- [ ] Tüm birim testleri yeşil (`node --test`), çıktı `docs/test-report.md`'ye yapıştırılmış.
- [ ] Her görünen sayı varsayım panelinde bir satıra bağlı (tutarlılık testi).
- [ ] Prompt paketi v1→v2 farkı ve gerekçesi `prompts/CHANGELOG.md`'de.
- [ ] `evidence/prompt-log.md`: her prompt için Accept/Modify/Reject kararı.
- [ ] 5 öğrenci ile UAT yapıldı, sonuç raporlandı.
- [ ] Erişilebilirlik kontrol listesi (klavye, kontrast, odak, aria-live) işaretli.

---

## 2. Ürün akışı ve model

### 2.1 Tek ekran akışı

```
[biniş katı] → [hedef kat] → [saat] → [merdiven kullanabiliyor muyum?]
        ↓
  grup tespiti (tek/çift)  →  bekleme tahmini  →  toplam süreler
        ↓
  öneri: "Asansör" | "Merdiven" | "Fark yok"  + gerekçe cümlesi
        ↓
  (ikincil) "Gözlem kaydet" → localStorage → CSV
```

### 2.2 Bina varsayımları

- 15 kat. **1 = zemin kat.** Asansörler: **O1, O2 tek kat asansörleri**, **E1, E2 çift kat asansörleri**.
- **Ortak katlar 1, 2, 3 ve 15:** dört asansör de bu katlara uğrar; 15. kata hem tek hem
  çift asansör çıkabilir, bu katlardan her asansöre binilir.
- Aradaki katlarda tek katlar tek asansörlere (5,7,…,13), çift katlar çift asansörlere (4,6,…,14).
- **Aktarma** yalnızca iki kat da 4–14 arasında ve farklı grupta olduğunda gerekir (ör. 5 → 6);
  ortak bir katta (1, 2, 3 veya 15) geçiş yapılır, iki bekleme + hol yürümesi hesaplanır.

### 2.3 Model (deterministik, tek dosyada parametre)

Tüm katsayılar `src/model-params.js` içinde, her biri `source: 'varsayım' | 'ölçüm'` etiketli.

| Parametre | v1 değeri | Etiket |
|---|---|---|
| Kat başına kabin seyri | 2.4 s | varsayım |
| Kapı aç/kapa (durak başına) | 7 s | varsayım |
| Yolcu başına binme | 1.2 s | varsayım |
| Grup başına taban talep | 1.8 kişi/dk | varsayım |
| Grup başına asansör sayısı | 2 | bilinen |
| Merdiven: çıkış / iniş | 13 s / 11 s (kat başına) | varsayım |
| Kat içi yürüme (ortak) | 20 s | varsayım |
| Yoğunluk çarpanları | 08:45–09:00 → 1.9; 10:45–11:00 → 1.5; 12:45–13:00 → 1.9; 14:45–15:00 → 1.5; 16:45–17:00 → 1.7; diğer → 1.0 | varsayım |

Hesaplama (iki adım sabit nokta, tarayıcıda da testte de aynı):

```
factor      = peakFactor(saat)
demand      = baseDemand × factor                     // kişi/dk
riders      ≈ demand × roundTrip / 60                 // turda taşınan
stops       = clamp(ceil(riders × 0.6), 2, groupFloors)
roundTrip   = 2 × (sonKat(grup) − 1) × cabinSec + stops × doorSec + riders × boardSec
headway     = roundTrip / liftsPerGroup
waitSec     = headway / 2 + riders × boardSec
elevatorTotal = waitSec + |from − to| × cabinSec + corridorSec
stairsTotal   = |from − to| × stairsSec(yön) + landingSec + corridorSec
```

Karar kuralı:

1. Erişilebilirlik açıksa → **Asansör** (merdiven hiç hesaplanmaz/gösterilmez).
2. `stairsTotal + 45 ≤ elevatorTotal` → **Merdiven**.
3. `|elevatorTotal − stairsTotal| < 45` → **Fark yok** (kullanıcıya iki süre de gösterilir).
4. Aksi halde → **Asansör**.

> 45 saniyelik eşik ve tüm katsayılar **varsayımdır**; `docs/model-notes.md`'de gerekçesi ve "hangi ölçümle kalibre edileceği" yazılır. Rapor/UI dilinde "ölçüldü" denmez, "tahmin" denir.

### 2.4 Test edilebilirlik için invariantlar

- `waitSec > 0` ve sonlu; `elevatorTotal ≥ travelSec`.
- Yoğunluk çarpanı artınca `waitSec` azalmaz (monotonluk).
- Erişilebilirlik modunda çıktıda `stairsTotal` **yok**.
- Kat mesafesi artınca `stairsTotal` artar.
- Aynı girdi → aynı çıktı (deterministik, rastgelelik yok).

---

## 3. Prompt mühendisliği planı (haftanın ana görevi)

Amaç "daha iyi prompt" iddiasını **ölçülebilir** kılmak. Her prompt v1 (naif) → v2 (kısıtlı) olarak yazılır; iki sürümün ürettiği çıktı aynı rubrikle puanlanır.

### 3.1 Rubrik (0–2 × 6 boyut = 12 puan, hedef ≥ 10 ve hiçbir boyutta 0 yok)

| Boyut | 0 | 2 |
|---|---|---|
| Rol ve bağlam | rol yok | rol + hedef kullanıcı + bina bağlamı |
| Çıktı sözleşmesi | serbest metin | şema/alan listesi verilmiş |
| Kapsam sınırı | sınır yok | açık "yapma" listesi (non-goals) |
| Belirsizlik kuralı | uydurur | "veri yoksa varsayım etiketiyle yaz" |
| Doğrulama isteği | test yok | kabul kriteri + test maddesi ister |
| Dil ve biçim | süslü/abartılı | sade, emoji yok, Türkçe terim tutarlı |

### 3.2 Prompt seti (5 dosya, her biri sürümlü)

| ID | Prompt | Çıktı | Test/kanıt |
|---|---|---|---|
| P1 | Problem çerçeveleme | problem, kullanıcı, varsayım, kanıt ihtiyacı, non-goals | `prompts/01-problem-frame.md` |
| P2 | Model spesifikasyonu | formül + parametre tablosu + invariant listesi | `prompts/02-model-spec.md` → `src/model.js` |
| P3 | UI yönü + redline | 5 satır yön + denetim listesi (unslop) | `prompts/03-ui-direction.md` |
| P4 | Test üretimi | sınır/erişilebilirlik/eşik senaryoları | `prompts/04-test-gen.md` → `tests/` |
| P5 | Rapor ve izlenebilirlik | gereksinim→test matrisi | `prompts/05-report.md` → `docs/test-report.md` |

### 3.3 Prompt log (kanıt)

`evidence/prompt-log.md` her satırı: prompt ID / sürüm / üretilen artefakt / rubrik puanı (v1 vs v2) / insan kararı (Accept–Modify–Reject) / düzeltilen kusur.

Örnek kusur kaydı: *P1 v1 "asansör verisi varsa gerçek zamanlı göster" dedi → veri erişimi doğrulanmadığı için Modify; v2'de "veri yoksa varsayım etiketi + parametre dosyası" kuralı eklendi.*

### 3.4 Prompt → kod → test bağı

P2'nin "invariant" listesi doğrudan testlere dönüşür; böylece prompt kalitesi test sonucuyla ölçülür (retorik değil, kanıt).

---

## 4. UI: unslop yönü ve 9 geçiş

unslop skill'i ("Global skill yerine kur" → `~/.agents/skills/unslop`) UI için kullanılır. Skill'in kuralı: **önce yön yazılır, onay alınır, sonra düzenleme yapılır.**

### 4.1 Önerilen yön (onay bekliyor)

- **Product.** 15 katlı kampüs binasında öğrenciye hangi asansör grubunun çalıştığını ve o an asansör mü merdiven mi daha hızlı olduğunu gösteren karar aracı.
- **Character.** ölçülü, teknik, sakin.
- **World.** gece nöbetindeki bina göstergesi: grafit metal, amber segment rakamlar, ince çizgi.
- **Moments.** (1) kodla çizilmiş **15 katlı şaft diyagramı** (tek/çift ray, seçili biniş ve hedef kat vurgulu) — ekranın tek parlak öğesi; (2) sonuç kartındaki büyük tabular rakamlar.
- **Signature.** asansör kat göstergesi: mono, amber, iki haneli kat okuması + yön oku; sadece sonuç kartında.

Yasaklar (unslop): mor/blue gradyan, glow, gradient text, emoji ikon, uppercase tracked etiketler, `transition-all`, döngüsel animasyon.

### 4.2 Geçişler (spacing → motion)

1. Spacing: 4px ızgara, 32–40 satır ritmi, panel 24 padding.
2. Color: grafit nötr rampası + tek amber accent (kontrast ≥ 4.5:1), semantik renk sadece anlam için.
3. Icons: tek set (inline SVG, 18px, 1.5 stroke), emoji yok.
4. Copy: "Şu an 7. kata merdiven 1 dk 12 sn, asansör 2 dk 40 sn" gibi somut; ünlem yok, süslü sıfat yok.
5. Type: tek aile + mono partner (rakamlar `tabular-nums`), 400/500, sentence case.
6. Layout: uygulama kabuğu (kenar panel 240–280 + içerik), ilk ekran bütün olarak kompoze.
7. Details: iç içe radius, hairline border, odak halkası, seçili satır = yüzey adımı.
8. Visuals: şaft diyagramı gerçek veriden (kat sayısı, grup), dekoratif görsel yok.
9. Motion: 120–180 ms, tek easing; sayı değişimi tween; `prefers-reduced-motion` desteği.

### 4.3 Erişilebilirlik (test edilen)

- Klavye ile tüm akış (Tab sırası, Enter/Space, görünür `:focus-visible`).
- Sonuç değişince `aria-live="polite"` bildirimi.
- Kontrast: metin ≥ 4.5:1, büyük rakam ≥ 3:1.
- Form alanlarında `label`, hata mesajı `aria-describedby`.
- Renk tek başına anlam taşımaz (yoğunluk etiketi metinle de yazılır).

---

## 5. Test planı

### 5.1 Katmanlar

| Katman | Araç | Kapsam |
|---|---|---|
| Birim (model) | `node --test` (sıfır bağımlılık) | formüller, sınırlar, monotonluk, erişilebilirlik kuralı |
| Tutarlılık | `node --test` | UI'da görünen her sayı ↔ `model-params.js`; docs tablosu ↔ kod |
| Statik UI sözleşmesi | `node --test` + regex/DOM'suz kontrol | gerekli `id`/`aria-*`, emoji yok, `transition-all` yok |
| Manuel / UAT | 5 öğrenci, senaryo kartı | 10 sn'de karar verebiliyor mu, güveniyor mu |
| Erişilebilirlik | klavye + kontrast + ekran okuyucu spot | WCAG 2.1 AA hedefi |

### 5.2 Örnek test senaryoları (özet, tam liste `docs/test-plan.md`)

| # | Senaryo | Beklenen |
|---|---|---|
| T01 | Kat 1 → 15, sakin saat | tek grup, sonuç sonlu, asansör önerilir |
| T02 | Kat 2 → 14, yoğun saat | çift grup, `waitSec` sakin saatten büyük |
| T03 | Kat 2 → 7 (ortak kat) | Doğrudan tek asansör, aktarma yok |
| T04 | Erişilebilirlik açık, kat 2 → 3 | merdiven çıktısı yok, öneri asansör |
| T05 | Merdiven belirgin hızlı (kat 1 → 3, yoğun) | öneri merdiven + fark saniye |
| T06 | Fark < 45 s | "fark yok", iki süre de gösterilir |
| T07 | Aynı girdi iki kez | aynı çıktı (determinizm) |
| T08 | 15×15×3 tarama | hiçbir hücrede `NaN`, negatif süre yok |
| T09 | Parametre tablosu ↔ docs | eksik/fazla satır yok |
| T10 | HTML statik kontrol | emoji yok, `aria-live` var, `label` var |

Hedef: **≥ 24 birim/otomatik test**, hepsi yeşil; çıktı `docs/test-report.md`'ye tarih + komut + TAP özetiyle işlenir.

### 5.3 Regression kuralı

Her PR'da `node --test` zorunlu (DoD maddesi). Test kırılırsa PR birleşmez — w01'deki "No Tests" kırılma noktasının doğrudan cevabı.

---

## 6. Sprint planı (4 kişi, 2 hafta, Scrum-inspired)

| Görev | Sahip | Çıktı | DoD |
|---|---|---|---|
| S1 Prompt rubriği + P1/P2 v1→v2 | Ege | `docs/prompt-rubric.md`, `prompts/01,02`, log | Rubrik puanı kayıtlı, v2 kabul |
| S2 Model + parametreler + birim testler | Emre | `src/model.js`, `src/model-params.js`, `tests/model.test.js` | ≥ 18 test yeşil |
| S3 UI iskeleti + unslop yön/pass 1–3 | Fatih | `index.html`, `src/app.js`, `src/styles.css` | Yön onaylı, spacing/color/icon geçti |
| S4 Varsayım paneli + gözlem kaydı + CSV | Eyüp | `src/evidence.js` | JSON/CSV indirme çalışıyor |
| S5 Test planı + koşum + rapor | Ege + Emre | `docs/test-plan.md`, `docs/test-report.md` | Tüm testler yeşil, rapor dolu |
| S6 UAT (5 öğrenci) + bulgu düzeltme | Fatih + Eyüp | `docs/uat-report.md` | 5 oturum kaydı, bulgular kapatıldı |
| S7 README + kapsam/karar dokümanları + AI kayıtları | Tümü | `README.md`, `docs/mvp-scope.md`, AI Usage Record | Review onaylı |

Akış: `Issue → branch → PR (review) → main`. Ana repoya taşıma, onay sonrası ayrı PR.

---

## 7. İzlenebilirlik matrisi (her satır bir kanıt zinciri)

| Gereksinim | Model/Kod | Test | Prompt | Doküman |
|---|---|---|---|---|
| R1: Kat → asansör grubu | `groupForFloor` | T01, T02, T08 | P2 | `docs/model-notes.md` |
| R2: Bekleme tahmini | `estimateWait` | T02, T07, T08 | P2 | `docs/model-notes.md` |
| R3: Merdiven vs asansör karşılaştırması | `compare` | T05, T06 | P1, P2 | `docs/mvp-scope.md` |
| R4: Erişilebilirlik | `accessibilityMode` | T04, T10 | P1 | `docs/mvp-scope.md` |
| R5: Varsayım şeffaflığı | `model-params` | T09 | P1 | `docs/model-notes.md` |
| R6: Kanıt toplama | `evidence.js` | T11 (CSV şeması) | P4 | `docs/test-plan.md` |

---

## 8. Riskler ve geri dönüş

| Risk | Etki | Önlem |
|---|---|---|
| Asansör verisi hiç gelmez | Model doğrulanamaz | Varsayım etiketli v1 + gözlem kaydı ile kalibrasyon; raporda açıkça yazar |
| Kapsam büyür (harita, hesap, ML) | MVP yetişmez | Non-goals listesi + PR'da "kapsam dışı" reddi |
| Ölçüm için zaman kalmaz | Kanıt zayıf | UAT + 1 günlük saha gözlemi (asgari 20 ölçüm) |
| Takım deneyimsiz | Kalite düşer | Küçük PR, tek ekran, sıfır bağımlılık, otomatik test zorunlu |
| MVP "AI ürünü" gibi görünür | Hoca eleştirisi | unslop geçişleri + somut veri + varsayım etiketleri |

---

## 9. Teslim edilecek dosya ağacı

```
campus-elevator-mobility/
  README.md
  index.html              (beş klasik script yükler, çift tıkla açılır)
  src/              model.js, model-params.js, present.js, evidence.js, app.js, styles.css
  tools/            serve.mjs (isteğe bağlı statik sunucu)
  tests/            model, present, evidence, consistency, ui-contract, contrast, load (107 test)
  prompts/          01-problem-frame … 05-report, CHANGELOG.md
  evidence/         prompt-log.md, observation-sample.csv
  docs/             mvp-plan.md (bu), mvp-scope.md, model-notes.md,
                    test-plan.md, test-report.md, test-output.txt,
                    uat-report.md, prompt-rubric.md
```

---

## 10. Kararlar (onaylandı — 15.11.2026)

1. **Kapsam:** 3 ekranlı kapsam (karar + varsayım paneli + gözlem kaydı). ✔
2. **Stack:** sıfır bağımlılık statik site + `node --test`. ✔
3. **UI yönü:** grafit + amber, kodla çizilmiş şaft diyagramı. ✔

## 11. Uygulama durumu

| İş | Durum | Kanıt |
|---|---|---|
| Model + parametreler | bitti | `src/model.js`, `src/model-params.js` |
| Birim + tutarlılık + sözleşme + kontrast + yükleme testleri | bitti | 107 test, `docs/test-report.md` |
| Arayüz + unslop geçişleri | bitti | `index.html`, `src/styles.css`, iki genişlikte görsel kontrol |
| `file://` ile çift tıkla açılış | bitti | klasik script'ler + `globalThis.CEM`; derleme adımı yok |
| Sekme vurgusu ve kat listesi kusurları | bitti | `docs/test-report.md` §4.1 |
| Varsayım paneli | bitti | `#varsayimlar` bölümü, `tests/consistency.test.js` |
| Gözlem kaydı + CSV | bitti | `src/evidence.js`, 15 test |
| Prompt paketi v1→v2 | bitti | `prompts/`, `docs/prompt-rubric.md` |
| Test raporu | bitti | `docs/test-report.md` |
| UAT (5 öğrenci) | bekliyor | kit: `docs/uat-report.md` |

**Not:** Ana repo klasörü (`campus-operations-team-00`) bu çalışma boyunca değiştirilmedi.
Çıktıların repoya taşınması, takım onayından sonra ayrı bir PR ile yapılır.
