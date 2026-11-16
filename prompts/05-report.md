# P5 — Rapor ve izlenebilirlik promptu

**Amaç:** Yapılanı "anlatan" değil, **kanıtla bağlayan** bir rapor üretmek.
**Üretilen artefakt:** `docs/test-report.md`, `docs/mvp-plan.md` §7 izlenebilirlik matrisi.
**Rubrik:** v1 = 6/12 → v2 = 10/12.

## v1 (naif)

```
Projeyi özetleyen bir rapor yaz. Neler yaptık, hangi testleri çalıştırdık.
```

**Ürettiği kusurlar**

- "Tüm testler başarılı" cümlesi, hangi testin hangi gereksinimi doğruladığını göstermiyor.
- Ortam, tarih, komut yok → tekrar üretilemez.
- Başarısız/ertelenen maddeler yazılmıyor (yalnız iyi haber).
- Modelin doğruluğu ile tutarlılığı karıştırılıyor.

## v2 (kısıtlı)

```
Rol: Kalite güvence lideri. Rapor, iddiaları kanıtla bağlamak zorunda.

Şema:
1. Künye: tarih, sürüm, ortam (OS, Node sürümü), tam komut, ham çıktı dosyası.
2. Özet tablo: süite/test/geçen/kalan, süre.
3. Katman tablosu: dosya → süite → test → durum.
4. Kabul senaryoları: ID → senaryo → otomatik test adı → durum.
5. Görsel doğrulama: genişlik → bulgu → düzeltme.
6. Erişilebilirlik: kontrol → durum → kanıt (otomatik/manuel ayrımı).
7. Bilinen boşluklar: numaralı, her biri neden kapsam dışı.
8. Regression kuralı: hangi komut, hangi eşik.

Kurallar:
- "Test edildi" yazıyorsan test adı yazacaksın; adı yoksa "manuel" yazacaksın.
- Başarısız ve ertelenen maddeler ayrı başlıkta, gizlenmeden.
- Modelin doğruluğu iddia edilmeyecek: testler tutarlılığı doğrular, gerçekliği değil.
- Emoji ve ünlem yok; sayılar tek biçimde.
```

## Fark

| Boyut | v1 | v2 | Değişim |
|---|---|---|---|
| Rol/bağlam | 1 | 2 | QA rolü + kanıt zorunluluğu |
| Çıktı sözleşmesi | 0 | 2 | 8 bölümlü şema |
| Kapsam sınırı | 0 | 1 | "Doğruluk iddia edilmeyecek" |
| Belirsizlik kuralı | 1 | 1 | Manuel/otomatik ayrımı |
| Doğrulama | 2 | 2 | Test adı zorunlu |
| Dil/biçim | 2 | 2 | Emoji/ünlem yok |

**Kabul kanıtı:** `docs/test-report.md` §3 tablosunda her satır bir test adına bağlı;
§6'da dört boşluk açıkça listeli.

## İzlenebilirlik matrisi (raporun çekirdeği)

| Gereksinim | Kod | Test | Prompt | Doküman |
|---|---|---|---|---|
| R1 grup eşlemesi | `groupForFloor` | T01, T02, T08 | P2 | model-notes §1 |
| R2 bekleme tahmini | `waitModel` | T02, T12 | P2 | model-notes §2 |
| R3 karşılaştırma | `decideOutcome` | T05, T06 | P1, P2 | mvp-scope §2 |
| R4 erişilebilirlik | `estimate.stairsAllowed` | T04, T10 | P1 | mvp-scope §3 |
| R5 varsayım şeffaflığı | `MODEL_PARAMS.source` | T09 | P1 | model-notes §3 |
| R6 kanıt toplama | `evidence.js` | T11 | P4 | test-plan §5 |
