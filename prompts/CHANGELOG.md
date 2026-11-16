# Prompt değişiklik günlüğü

Kural: her prompt v1 olarak yazılır, ürettiği artefakt gözden geçirilir, kusur listelenir,
v2 yazılır. Puanlar `docs/prompt-rubric.md` rubriğiyle verilir.

| Tarih | Prompt | Sürüm | Puan | Karar | Not |
|---|---|---|---|---|---|
| 16.11.2026 | P1 problem çerçeveleme | v1 → v2 | 6 → 11 | Modify | "Gerçek zamanlı veri" varsayımı ve kapsam şişmesi düzeltildi |
| 16.11.2026 | P2 model spesifikasyonu | v1 → v2 | 5 → 12 | Modify | Parametre sözleşmesi + invariant listesi eklendi |
| 16.11.2026 | P3 arayüz yönü | v1 → v2 | 6 → 10 | Modify | Klişe sıfatlar ve yasak listesi eklendi (unslop yönü) |
| 16.11.2026 | P4 test üretimi | v1 → v2 | 7 → 11 | Modify | Sınır durumları + erişilebilirlik başlıkları zorunlu |
| 16.11.2026 | P5 rapor | v1 → v2 | 6 → 10 | Modify | Test adı zorunluluğu + boşluklar bölümü |

Ortalama: 6,0 → 10,8 (hedef ≥ 10).

## Sürüm geçmişi (özet)

### P1 — problem çerçeveleme
- **v1:** "Asansör bekleme problemi var, çözüm öner." → veri erişimi varsayımı, sınırsız kapsam.
- **v2:** şema + non-goals + "doğrulanmamışı gerçek yazma" kuralı.
- **Etki:** `docs/mvp-scope.md` §3 listesi doğrudan v2'nin non-goals maddelerinden geldi.

### P2 — model spesifikasyonu
- **v1:** "Bekleme süresini hesaplayan fonksiyon yaz." → gömülü sabitler, testsiz.
- **v2:** parametre nesnesi ({value, unit, source, note}), saf fonksiyon imzaları, invariantlar,
  ≥20 test başlığı.
- **Etki:** `src/model-params.js` ve 35 model testi; `source: 'varsayım'` etiketi doğrudan
  bu prompttan çıktı ve `tests/consistency.test.js` ile korunuyor.

### P3 — arayüz yönü
- **v1:** "modern, temiz, dashboard gibi" → şablon sonuç.
- **v2:** 5 satır yön (product/character/world/moments/signature) + yasak listesi + a11y.
- **Etki:** grafit + amber yön, şaft diyagramı; `tests/ui-contract.test.js` yasakları denetliyor.

### P4 — test üretimi
- **v1:** "test yaz" → yalnız mutlu yol.
- **v2:** 10 zorunlu başlık (sınır değerleri, tam tarama, erişilebilirlik, CSV kaçırma,
  HTML sözleşmesi) + "katsayıları sabitleme" yasağı.
- **Etki:** 90 test; 15×15×3 tarama ve erişilebilirlik taraması bu promptla eklendi.

### P5 — rapor
- **v1:** "özet yaz" → iddia var, kanıt yok.
- **v2:** 8 bölümlü şema, "test adı yazacaksın yoksa manuel diyeceksin" kuralı.
- **Etki:** `docs/test-report.md` §3 ve §6; boşlukların gizlenmemesi.

## Tekrar kullanılabilir dersler

1. **Şema olmadan çıktı kontrol edilemiyor.** Beş promptun tamamında en büyük puan
   artışı "çıktı sözleşmesi" boyutundan geldi.
2. **Non-goals, feature listesinden daha değerli.** Kapsam şişmesi projeyi değil,
   teslimi riske atıyor.
3. **"Veri yoksa varsayım yaz" kuralı**, dersin "kanıt" beklentisiyle doğrudan uyumlu;
   bu kural olmadan model kendinden emin ama yanlış sayılar üretiyor.
4. **Test istemi, test listesiyle gelmeli.** "Test yaz" demek kapsamı %30'da bırakıyor.
