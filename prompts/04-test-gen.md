# P4 — Test üretimi promptu

**Amaç:** "Çalışıyor gibi görünüyor"dan, sınır durumlarını ve erişilebilirliği kapsayan
test setine geçmek.
**Üretilen artefakt:** `tests/model.test.js`, `tests/evidence.test.js`, `tests/ui-contract.test.js`.
**Rubrik:** v1 = 7/12 → v2 = 11/12.

## v1 (naif)

```
Bu model için testler yaz.
```

**Ürettiği kusurlar**

- Yalnızca "mutlu yol" testleri: birkaç kat için süre döndüğünü kontrol etti.
- Sınır değerleri yok: kat 0, kat 16, `NaN`, negatif süre, gece yarısı.
- Erişilebilirlik kuralı test edilmedi.
- Determinizm, eşik sınırı (tam 12 sn), aktarma durumu yok.
- Sayılar sabit yazıldığı için parametre değişince testler kırılacaktı.

## v2 (kısıtlı)

```
Rol: Test mühendisi. Proje: src/model.js, src/evidence.js, src/present.js.
Kural: testler yalnızca genel API'yi kullanır, iç değişkenlere dokunmaz; katsayılar
sabit yazılmaz, MODEL_PARAMS üzerinden okunur.

Kapsanacak başlıklar (hepsi zorunlu):
1. Kat/grup eşlemesi: 1, 2, 15, 14, 0, 16, 3.5, NaN.
2. Saat: "08:45", "00:00", "23:59", "24:00", "12:60", "abc".
3. Yoğunluk: pencere başı, pencere sonu (hariç), pencere dışı.
4. Bekleme: pozitif + sonlu, yoğun ≥ sakin, determinizm, durak sayısı sınırı.
5. Süreler: toplam = parçaların toplamı, iniş < çıkış, mesafe monotonluğu.
6. Karar kuralı: merdiven/asansör/başabaş (tam eşik ve eşik+1), erişilebilirlik,
   aktarma, rota yok, aynı kat.
7. Tam tarama: 15×15 kat × 3 zaman dilimi; NaN/negatif yok; erişilebilirlik modunda
   merdiven alanı yok.
8. Kanıt: doğrulama (boş, 0, 901, ondalık), 500 kayıt sınırı, CSV kaçırma
   (virgül, tırnak, satır sonu), bozuk localStorage.
9. Sözleşme: app.js'deki her element kimliği HTML'de var mı; emoji/ünlem yok;
   `transition-all` yok; `aria-live` var.
10. Metin: her sonuç için başlık + gerekçe; ünlem/emoji yok; erişilebilirlik
    metninde "merdiven" geçmez.

Ek kurallar:
- Her testin adı Türkçe ve davranışı söyler ("... yönlendirir").
- Bir test birden fazla şeyi kontrol ediyorsa başlıkta hangi kuralı doğruladığı yazsın.
- Kırılgan tam sayı beklentisi yerine ilişki beklentisi kullan (a > b gibi).
```

## Fark

| Boyut | v1 | v2 | Değişim |
|---|---|---|---|
| Rol/bağlam | 1 | 2 | Dosya listesi + API kuralı |
| Çıktı sözleşmesi | 1 | 2 | 10 zorunlu başlık |
| Kapsam sınırı | 1 | 1 | Sınır durumları listelendi, non-goals kısmi |
| Belirsizlik kuralı | 1 | 1 | Katsayıları sabitleme yasağı |
| Doğrulama | 2 | 2 | Sınır değerleri + tam tarama |
| Dil/biçim | 1 | 2 | Türkçe test adları |

**Kabul kanıtı:** 90 test, 20 süite; `docs/test-report.md` T01–T12 eşlemesi.

## Ne öğrendik

Naif "test yaz" istemi %70 kapsama değil, **%30** kapsama üretiyor: mutlu yol testleri
geçiyor, erişilebilirlik ve sınır durumları hiç test edilmiyor. Asıl fark, teste değil
**testin listesine** yatırım yapmak.
