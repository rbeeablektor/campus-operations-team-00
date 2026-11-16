# P2 — Model spesifikasyonu promptu

**Amaç:** Formülleri, katsayıları ve invariantları tek seferde, test edilebilir biçimde almak.
**Üretilen artefakt:** `src/model-params.js`, `src/model.js`, `tests/model.test.js`.
**Rubrik:** v1 = 5/12 → v2 = 12/12.

## v1 (naif)

```
Asansör bekleme süresini hesaplayan bir fonksiyon yaz.
2 asansör tek katlara 2 asansör çift katlara bakıyor, 15 kat var.
```

**Ürettiği kusurlar**

- Katsayılar kodun içine gömüldü, tek dosyada toplanmadı; hiçbiri etiketli değil.
- Formül açıklanmadı: bekleme, tur süresi ve talebin birbirine bağlı olduğu görülmedi.
- `NaN`, sıfıra bölme, negatif süre gibi durumlar düşünülmedi.
- Erişilebilirlik (merdiven kapalı) hiç geçmiyor.
- Test istenmediği için çıktı doğrulanamadı.

## v2 (kısıtlı)

```
Rol: Sayısal model ve test tasarımı yapan bir yazılım mühendisi.

Bağlam: 15 kat; 2 asansör tek katlara (1,3,...,15), 2 asansör çift katlara
(2,4,...,14); her katta merdiven.

Görev: Aşağıdaki sözleşmeye uyan bir hesaplama modeli üret.

A) Parametre dosyası: her katsayı { value, unit, source, note } nesnesi olsun.
   source ∈ {"varsayım","bilinen","ölçüm"}. Ölçüm verisi yoksa "varsayım" yaz.
   Katsayılar: kat seyri, kapı döngüsü, yolcu binme, taban talep, durak açma oranı,
   merdiven çıkış/iniş, hol, kat içi yürüme, başabaş eşiği, ders geçişi çarpanları.

B) Fonksiyonlar (saf, yan etkisiz, deterministik):
   groupForFloor(floor), waitModel(group, minutes), elevatorSeconds(from,to,minutes),
   stairsSeconds(from,to), decideOutcome({elevatorTotal,stairsTotal,stairsAllowed,
   transferRequired,sameFloor}), estimate(input).

C) Kurallar:
   - Tur süresi ile talep döngüsel: en fazla 2 adım sabit nokta ile çöz, sınırla.
   - Erişilebilirlik kapalıysa üretilen nesnede merdiven alanı BULUNMASIN.
   - Gruplar arası geçiş "transferRequired" olarak işaretlenir, asansör süresi üretilmez.
   - Başabaş eşiğinin altındaki fark "tie" döner.
   - Her fonksiyon için: NaN, negatif, 0, 15 dışı kat, geçersiz saat.

D) Çıktı sözleşmesi: (1) parametre tablosu, (2) formüller, (3) invariant listesi,
   (4) test başlıkları listesi (en az 20), (5) 3 örnek girdi-çıktı.

Kurallar: kod yorumları Türkçe ve sade; emoji yok; "kesin", "doğru" gibi iddialar yok;
her sayı için hangi parametreden geldiği yorumda yazılı.
```

## Fark

| Boyut | v1 | v2 | Değişim |
|---|---|---|---|
| Rol/bağlam | 1 | 2 | Bina ve grup yapısı explicit |
| Çıktı sözleşmesi | 0 | 2 | Parametre tablosu + fonksiyon imzaları |
| Kapsam sınırı | 0 | 2 | "Merdiven alanı üretilmeyecek" gibi negatif kurallar |
| Belirsizlik kuralı | 0 | 2 | source ∈ {varsayım, bilinen, ölçüm} |
| Doğrulama | 0 | 2 | ≥20 test başlığı + sınır durumları |
| Dil/biçim | 1 | 2 | Türkçe yorum, emoji yok, iddiasız dil |

**Kabul kanıtı:** `tests/model.test.js` içindeki 35 test, v2'nin (D4) test listesi ve (C5)
sınır durumlarıyla birebir eşleşir; `tests/consistency.test.js` parametre dosyasının tek
kaynak olduğunu doğrular.

## Not: modelin sınırı

Prompt, "gerçekçi" değil **şeffaf ve kalibre edilebilir** bir model istiyor. Bu bilinçli:
veri yokken gerçekçilik iddiası kurulamaz. Katsayılar `varsayım` etiketiyle durur,
`docs/model-notes.md` §6 hangi ölçümün hangi katsayıyı güncelleyeceğini yazar.
