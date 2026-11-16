# Test planı

Amaç: modelin, arayüzün ve kanıt toplama akışının doğruluğunu **tekrarlanabilir** biçimde
göstermek. Tüm otomatik testler sıfır bağımlılıkla `node --test` üzerinde çalışır.

## 1. Nasıl çalıştırılır

```
npm test                    # paket betiği
node --test                 # doğrudan
node --test --test-isolation=none   # alt süreç kısıtlı ortamlarda (bkz. §6)
```

Beklenen sonuç: tüm testler `pass`, `fail 0`.

## 2. Katmanlar

| Katman | Dosya | Ne doğrular |
|---|---|---|
| Birim — model | `tests/model.test.js` | kat/grup eşlemesi, bekleme modeli, süreler, karar kuralı, erişilebilirlik |
| Birim — sunum | `tests/present.test.js` | süre biçimi, sonuç metinleri, ünlem/emoji yasağı, etiketler |
| Birim — kanıt | `tests/evidence.test.js` | doğrulama, kayıt sınırı, CSV kaçırma, bozuk veri, depolama yedeği |
| Tutarlılık | `tests/consistency.test.js` | kod ↔ doküman ↔ HTML kimlikleri |
| Arayüz sözleşmesi | `tests/ui-contract.test.js` | etiketler, aria, emoji/ünlem yok, CSS kural seti, güvenlik |
| Derleme / yükleme | `tests/load.test.js` | `index.html` klasik script sırası, modül sözdizimi yok, `CEM` ad alanı |

## 3. Kabul senaryoları

| ID | Senaryo | Girdi | Beklenen |
|---|---|---|---|
| T01 | Sakin saatte uzun yolculuk | 09:30, 1 → 15 | Asansör önerilir; asansör merdivenden kısa |
| T02 | Yoğun saatte bekleme büyür | 09:30 vs 12:50, 1 → 15 | Yoğun saatte `waitSeconds` daha büyük |
| T03 | Ortak kat kuralı | 2 → 7 | Doğrudan tek asansör; `transferRequired` false |
| T04 | Erişilebilirlik | 2 → 4, merdiven kapalı | Sonuç asansör; `stairs` alanı yok; metinde "merdiven" geçmez |
| T05 | Kısa mesafe, yoğun saat | 12:50, 1 → 3 | Merdiven daha hızlı; fark > 12 sn |
| T06 | Başabaş | 12:50, 2 → 6 | "Başabaş"; fark ≤ 12 sn |
| T07 | Aynı kat | 4 → 4 | Sonuç `same-floor`, süre alanları boş |
| T08 | Tam tarama | 15×15×3 zaman | Hiçbir hücrede `NaN`, sonsuz veya negatif süre yok |
| T09 | Doküman tutarlılığı | — | Her katsayı `docs/model-notes.md` içinde |
| T10 | Arayüz sözleşmesi | — | Emoji/ünlem yok, `aria-live` var, etiketler bağlı |
| T11 | CSV şeması | 1 kayıt | Başlık + satır sayısı doğru; özel karakter kaçırılır |
| T12 | Aynı girdi aynı çıktı | 12:50, 2 → 14 (iki kez) | Nesneler birebir eşit |

## 4. Erişilebilirlik kontrol listesi (manuel)

- [ ] Klavye ile tüm alanlar dolaşılabilir; odak halkası görünür.
- [ ] Sekme sırası okuma sırasıyla aynı (rail → form → sonuç → varsayımlar → gözlemler).
- [ ] Sonuç değişince ekran okuyucu `role="status"` ile bildirir.
- [ ] Kontrast: gövde metni ≥ 4,5:1, büyük rakamlar ≥ 3:1.
- [ ] Hata mesajı `role="alert"` ve alan `aria-invalid` + `aria-describedby` ile bağlı.
- [ ] Renk tek başına anlam taşımaz (yoğunluk ve öneri metinle de yazılır).
- [ ] `prefers-reduced-motion` açıkken geçişler durur.

## 5. UAT (kullanıcı kabul testi)

5 öğrenci, 3 görev:

1. "7. kata gideceksin, 12:50. Asansör mü merdiven mi?"
2. "Merdiven kullanamıyorsun. Ekran sana ne öneriyor?"
3. "Bir kez gerçek bekleme süresini kaydet ve CSV indir."

Ölçülen: karar süresi (sn), öneriye güven (1–5), anlaşılmayan terim sayısı.
Sonuçlar `docs/uat-report.md` içine işlenir.

## 6. Ortam notu

Bazı kısıtlı ortamlar `node --test` alt süreç açmasını engelleyebilir (`spawn EPERM`).
O durumda testler aynı süreçte çalıştırılır:

```
node --test --test-isolation=none
```

Bu yalnızca koşum biçimini değiştirir, testlerin kendisi aynıdır.
