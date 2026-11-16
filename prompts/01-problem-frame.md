# P1 — Problem çerçeveleme promptu

**Amaç:** Kod yazmadan önce problemi, kullanıcıyı, varsayımı ve kanıt ihtiyacını ayırmak.
**Üretilen artefakt:** `docs/mvp-scope.md`, `docs/model-notes.md` §5.
**Rubrik:** v1 = 6/12 → v2 = 11/12.

## v1 (naif)

```
Üniversitede asansör bekleme problemi var. Bize bir çözüm önerisi yaz.
```

**Ürettiği kusurlar**

- Gerçek zamanlı asansör verisi varmış gibi "anlık bekleme süresi göster" dedi.
- Kapsam sınırı yok: harita, hesap, bildirim, makine öğrenmesi aynı listede.
- Varsayım/ölçüm ayrımı yok; sayılar kesinmiş gibi.
- Test veya kabul kriteri istemiyor.

## v2 (kısıtlı)

```
Rol: Kıdemli bir gereksinim mühendisi. Takım 4 kişilik, süre 2 hafta.

Bağlam:
- 15 katlı üniversite binası, 4 asansör: 2'si tek katlara, 2'si çift katlara,
  her katta merdiven var.
- Asansör sisteminden gerçek zamanlı veri erişimi HENÜZ DOĞRULANMADI.
- Kullanıcı: ders aralarında kat değiştiren öğrenciler, erişilebilirlik ihtiyacı
  olanlar dahil.

Görev: Aşağıdaki şemayla, EN FAZLA 1.5 katılımcının 10 saniyede karar
verebileceği tek bir kullanıcı problemi tanımla.

Şema:
1. Problem (tek cümle)
2. Kim yaşıyor (2-3 kullanıcı grubu)
3. Şu an ne oluyor (en fazla 6 madde)
4. Varsayımlar (her biri "varsayım" etiketiyle)
5. Eksik kanıt (ölçümle kapanacak maddeler)
6. Non-goals (en az 4 madde, gerekçeli)

Kurallar:
- Doğrulanmamış hiçbir şeyi gerçek gibi yazma; "tahmin" veya "varsayım" yaz.
- Emoji, ünlem, abartılı sıfat (mükemmel, devrim) yok.
- Erişilebilirliği ayrı bir madde yap; merdiven kullanamayanların asansörü tek
  seçenek olarak kullanması gerektiğini açıkça yaz.
- Sonunda "bu tanımı hangi test yanlışlar" sorusuna 2 maddeyle cevap ver.
```

## Fark

| Boyut | v1 | v2 | Değişim |
|---|---|---|---|
| Rol/bağlam | 1 | 2 | Rol + bina + veri erişimi belirsizliği |
| Çıktı sözleşmesi | 0 | 2 | 6 maddeli şema |
| Kapsam sınırı | 0 | 2 | Non-goals zorunlu |
| Belirsizlik kuralı | 0 | 2 | "Doğrulanmamışı gerçek yazma" |
| Doğrulama | 0 | 2 | Yanlışlayıcı test sorusu |
| Dil/biçim | 1 | 1 | Emoji/ünlem yasağı |

**Kabul kanıtı:** `docs/mvp-scope.md` §3 kapsam dışı listesi v2'nin non-goals maddeleriyle
birebir örtüşür; `docs/model-notes.md` §5 "neyi bilmiyoruz" listesi §4 varsayımlarıyla eşleşir.
