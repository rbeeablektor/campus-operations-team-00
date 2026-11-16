# Test raporu

- **Tarih:** 15 Kasım 2026
- **Sürüm:** MVP v1.0 (commit öncesi çalışma kopyası)
- **Koşum ortamı:** Windows, Node.js v24.13.0 (proje Node 20+ hedefler)
- **Komut:** `node --test --test-isolation=none` (kısıtlı ortam notu: `docs/test-plan.md` §6)
- **Ham çıktı:** [`test-output.txt`](test-output.txt)

## 1. Özet

| Metrik | Değer |
|---|---|
| Süite (describe) | 24 |
| Test | 117 |
| Geçen | 117 |
| Başarısız | 0 |
| Atlanan | 0 |
| Süre | ~80 ms |

```
ℹ tests 117
ℹ pass 117
ℹ fail 0
```

## 2. Katman bazında sonuç

| Dosya | Süite | Test | Durum |
|---|---|---|---|
| `tests/model.test.js` | 7 | 45 | geçti |
| `tests/present.test.js` | 3 | 13 | geçti |
| `tests/evidence.test.js` | 5 | 19 | geçti |
| `tests/consistency.test.js` | 3 | 12 | geçti |
| `tests/ui-contract.test.js` | 4 | 18 | geçti |
| `tests/load.test.js` | 1 | 6 | geçti |
| `tests/contrast.test.js` | 1 | 4 | geçti |

## 3. Kabul senaryoları (T01–T12)

| ID | Senaryo | Otomatik karşılığı | Durum |
|---|---|---|---|
| T01 | Sakin saatte 1 → 15 asansör önerilir | `estimate: uçtan uca` | geçti |
| T02 | Yoğun saatte bekleme büyür | `bekleme modeli` / `estimate` | geçti |
| T03 | Ortak kat: 2 → 7 doğrudan, aktarma yok | `ortak kat sayesinde 2 → 7 aktarma istemez` | geçti |
| T04 | Erişilebilirlik: merdiven üretilmez | `erişilebilirlik modunda merdiven verisi üretmez` | geçti |
| T05 | 12:50, 1 → 3 merdiven daha hızlı | `kısa mesafede yoğun saatte merdivene yönlendirir` | geçti |
| T06 | 12:50, 2 → 6 başabaş | `estimate` + başabaş metni | geçti |
| T07 | 4 → 4 aynı kat | `aynı katta süre üretmez` | geçti |
| T08 | 15×15×3 tam tarama | `15x15 kat ve 3 zaman diliminde...` | geçti |
| T09 | Doküman ↔ kod tutarlılığı | `doküman ↔ kod tutarlılığı` | geçti |
| T10 | Arayüz sözleşmesi | `HTML sözleşmesi`, `metin kuralları` | geçti |
| T11 | CSV şeması ve kaçırma | `CSV çıktısı` | geçti |
| T12 | Determinizm | `aynı girdi aynı sonucu üretir` | geçti |
| T13 | Aktarma planı (5 → 6, 3. katta) | `farklı gruplarda kalan katlar için aktarma üretir` | geçti |
| T14 | Erişilebilir aktarma (5 → 6, merdiven kapalı) | `aktarmalı yol erişilebilirlik modunda tek seçenek olur` | geçti |

## 4. Görsel doğrulama

Başsız Chrome ile iki genişlikte ekran görüntüsü alındı ve incelendi:

| Genişlik | Bulgu | Düzeltme |
|---|---|---|
| 1440 px | Şaft sütunları kesikli görünüyordu, "Tek/Çift" başlıkları hizasız | satır aralığı 0, başlığa sütun boşluğu |
| 1440 px | Sağ kolon boşta kalıyordu | "Bilinmesi gereken" paneli sol kolona taşındı |
| 500 px | Süre değerleri iki satıra kırılıyordu | değer kolonu 96 px + `nowrap` |
| 500 px | "2,4 s/kat" değeri birimden kopuyordu | sayı–birim arasına bölünmez boşluk |

Konsol: Chrome `--enable-logging=stderr` ile koşuldu, **hata/uyarı yok**.

Sınırlama: gerçek tarayıcı etkileşim testi (tıklama, klavye) bu ortamda otomatik
koşulamadı; arayüz sözleşmesi statik olarak doğrulandı, etkileşim UAT adımına bırakıldı.

### 4.1 Kullanıcı bildirimiyle bulunan kusurlar

Kullanıcı raporu: "sekmelere basınca vurgu değişmiyor, kat kutuları boş".

| # | Kök neden | Düzeltme | Doğrulama |
|---|---|---|---|
| B1 | Bölüm vurgusu yalnızca `IntersectionObserver` bandına bağlıydı; dar bantta tıklama vurguyu güncellemiyordu | Tıklama anında `setActiveSection` çağrılır, kaydırmada bölüm konumu hesaplanır; aktif bağlantıya `aria-current="true"` eklenir | CDP ile tıklandı: `#varsayimlar` → aktif `varsayimlar`, `aria-current=true` |
| B2 | Dosya `file://` ile açıldığında `type="module"` betikleri CORS nedeniyle çalışmıyordu; `select` boş kalıyordu | Modüller klasik script'e çevrildi (`globalThis.CEM` ad alanı); `index.html` beş `<script src>` yükler, derleme/`dist` yok | CDP ile `file://.../index.html` açıldı: `CEM` yüklendi, 15 seçenek, sonuç ve şaft doldu, konsol hatası yok |
| B3 | Açılır liste metni işletim sistemi temasında okunamıyordu | `select` üzerinde `color-scheme: dark`, `option` ve `option:checked` için açık renk | `tests/ui-contract.test.js` (renk + color-scheme) |
| B4 | `file://` ve gizli sekmede `localStorage` erişimi hata verebiliyordu | `resolveStorage()`: erişim yoksa bellek içi depolamaya düşer; kaydet/sil hataları yutulur | `tests/evidence.test.js` (4 test) |
| B5 | Aynı sekmeye ikinci kez basınca vurgu değişiyor ama sayfa gitmiyordu (hash zaten aynı olduğu için tarayıcı yeniden atlamıyor) | Tıklamada `preventDefault` + `scrollIntoView`; kaydırma boyunca vurgu kilitli (`lockUntil`), adres `replaceState` ile güncelleniyor | CDP: `#varsayimlar` seçiliyken yukarı kaydırıp tekrar tıklandı → `scrollY 1549`, bölüm üstü 24 px |

### 4.2 Kendi denetimimde çıkan kusurlar (16.11.2026)

Kullanıcı bildirimi dışında, başsız Chrome + CDP denetiminde iki kusur daha çıktı:

| # | Bulgu | Ölçüm | Düzeltme |
|---|---|---|---|
| D1 | `--text-3` zemininde AA eşiği geçmiyordu | `#8b8378` / `#262320` = **4.18:1** (< 4.5) | `#958e83` yapıldı → 4.82:1; kontrast `tests/contrast.test.js` ile otomatik denetleniyor |
| D2 | Varsayım tablosu 360 px ekranda kesiliyordu | `.table-wrap` `overflow: hidden`, tablo 408 px | `overflow-x: auto` + `role="region"` + `tabindex="0"` + `aria-label`; sayfa taşmıyor (`scrollWidth = 360`), tablo kaydırılıyor |

Denetimde ayrıca doğrulananlar: bölge işaretleri (1 `main`, 1 `nav`, 1 `aside`, 1 `footer`,
tek `h1`), etiketsiz alan 0, adsız düğme 0, odak halkası `solid 2px`, Enter ile bölüm geçişi,
kayıt kalıcılığı (yenileme sonrası korunuyor), CSV başlığı, konsol hatası 0.

### 4.3 Bina kuralı güncellemesi (16.11.2026)

Kullanıcı bildirimi: "1. kattaki tüm asansörler 1, 2 ve 3'e gidiyor; sonrasında tekler
teke, çiftler çifte." Model buna göre yeniden kuruldu:

| Önce | Sonra |
|---|---|
| Tek asansör 1,3,…,15; çift asansör 2,4,…,14 | Ortak katlar **1, 2, 3**: dört asansör de uğrar; 4+ tek/çift |
| 2 → 7 imkânsız ("aktarma" uyarısı, asansör süresi yok) | 2 → 7 **doğrudan** (tek asansör 2'ye de uğrar) |
| Aktarma yalnızca uyarıydı, süre üretilmiyordu | Aktarma **hesaplanıyor**: 5 → 6 için 3. katta geçiş, iki bekleme + hol yürümesi |
| Erişilebilir kullanıcı 5 → 6 için "rota yok" görüyordu | Aynı kullanıcı **aktarmalı asansör** rotası görüyor |

Doğrulama: `tests/model.test.js` (ortak kat, doğrudan/aktarma planı, 15×15×3 tarama) ve
tarayıcı ölçümü — 2 → 7 "İki seçenek başabaş" (asansör 1 dk 20 sn), 5 → 6 "Merdiven
1 dk 52 sn daha hızlı" (asansör 3. katta aktarma, 2 dk 31 sn), erişilebilirlik modunda
"Aktarmalı asansör".

## 5. Erişilebilirlik durumu

| Kontrol | Durum | Kanıt |
|---|---|---|
| Etiketler (`for`/`id`) | geçti | `HTML sözleşmesi` |
| Canlı bölge (`role=status`, `aria-live`) | geçti | aynı test |
| Form hatası (`role=alert`, `aria-describedby`) | geçti | aynı test |
| Görünür odak halkası | geçti | CDP: `solid 2px` amber |
| Azaltılmış hareket | geçti | `prefers-reduced-motion` |
| Kontrast (AA 4.5:1) | geçti | `tests/contrast.test.js` (14 çift) |
| Klavye ile gezinme + Enter | geçti | CDP: Tab sırası okunur, Enter bölümü açar |
| Kaydırılabilir tablo bölgesi | geçti | `role="region"`, `tabindex="0"`, `aria-label` |

## 6. Bilinen boşluklar

1. Uçtan uca tarayıcı testi depoda otomatik değil: etkileşim ve erişilebilirlik
   kontrolleri başsız Chrome + CDP ile **elle koşuldu** (sonuçlar §4.2'de), `node --test`
   kapsamında değil. Otomasyon için Chrome/CDP bağımlılığı gerekir.
2. UAT henüz yapılmadı — kit hazır: [`uat-report.md`](uat-report.md).
3. Model doğruluğu test edilmiyor (test edilemez): katsayılar varsayım, doğruluk ancak
   saha ölçümüyle ölçülür. Testler modelin *tutarlılığını* doğrular, *gerçekliğini* değil.
4. Saha ölçümü sayısı 0: kalibrasyon için en az 20 kayıt gerekiyor (araç hazır).

## 7. Regression kuralı

Her PR'da `node --test` çalışır ve yeşil olmak zorundadır. Test kırılırsa PR birleşmez.
Bu kural `docs/mvp-plan.md` içindeki Definition of Done maddesidir.
