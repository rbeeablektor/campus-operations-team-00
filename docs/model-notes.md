# Model notları — nasıl hesaplanıyor, neyi bilmiyoruz

Bu belge tahmin modelinin tek açıklamasıdır. Kodla çelişirse kod doğrudur; çelişki
`tests/consistency.test.js` tarafından yakalanır.

## 1. Bina ve asansör kuralı

- 15 kat. **1 = zemin kat.**
- Dört asansör, iki grup: **tek kat asansörleri** ve **çift kat asansörleri** (her grupta 2 asansör).
- **Ortak katlar: 1, 2 ve 3.** Dört asansör de bu katlara uğrar; bu katlardan her
  asansöre binilebilir ve bu katlara her asansörle gidilebilir.
- **4. kattan yukarısı:** tek katlar (5, 7, …, 15) yalnız tek asansörlere, çift katlar
  (4, 6, …, 14) yalnız çift asansörlere.
- Sonuç: 1–3 arası her yolculuk doğrudur (ör. 3 → 2, 2 → 3, 1 → 2). 2 → 7 de doğrudur,
  çünkü tek asansör 2. kata uğrar. **Aktarma** yalnızca iki kat da 4 ve üstünde ve
  farklı grupta olduğunda gerekir (ör. 5 → 6, 15 → 14); ortak bir katta (1, 2 veya 3)
  tek asansörden çift asansöre geçilir.

## 2. Bekleme modeli

Tur süresi ile talep birbirine bağlı olduğu için iki adımlı sabit nokta kullanılır:

```
factor      = peakFactor(saat)                     // tablo 3
baseTrip    = 2 × (grubun en üst katı − 1) × secondsPerFloor
roundTrip₀  = baseTrip + 2 × doorCycleSeconds
riders      = baseDemandPerMinute × factor × roundTrip / 60
stops       = clamp(ceil(riders × stopShare), 2, gruptaki kat sayısı)
roundTrip   = baseTrip + stops × (doorCycleSeconds + boardSecondsPerRider)
headway     = roundTrip / gruptaki asansör sayısı
wait        = headway / 2 + (riders × boardSecondsPerRider) / gruptaki asansör sayısı
```

Süreler:

```
seyir(a → b)  = |b − a| × secondsPerFloor + doorCycleSeconds
doğrudan      = wait(grup) + seyir(a → b) + corridorSeconds
aktarmalı     = wait(g1) + seyir(a → v) + transferWalkSeconds
              + wait(g2) + seyir(v → b) + corridorSeconds
merdiven      = |b − a| × (çıkışsa stairsSecondsPerFloorUp, inişse …Down)
              + landingSeconds + corridorSeconds
```

Doğrudan birden fazla grup mümkünse (iki kat da 1–3 arasında) **en kısa toplam**
seçilir. Aktarmada ortak katlar tek tek denenir, toplamı en küçük olan kazanır;
sayısal olarak her zaman 3. kat en iyisidir (her iki bacağı da kısaltır).

Karar:

1. Aynı kat → süre yok.
2. Merdiven kapalı → asansör (aktarmalı olsa bile).
3. |asansör − merdiven| ≤ `tieThresholdSeconds` → "başabaş".
4. Aksi halde kısa olan önerilir.

## 3. Katsayılar ve etiketleri

Her katsayı `src/model-params.js` içinde tek satırdır. `varsayım` etiketi
"ölçülmedi" demektir; rapor ve arayüz bu sayıları ölçüm gibi sunmaz.

| Anahtar | Değer | Kaynak |
|---|---|---|
| `secondsPerFloor` | 2.4 s/kat | varsayım |
| `doorCycleSeconds` | 7 s | varsayım |
| `boardSecondsPerRider` | 1.2 s/yolcu | varsayım |
| `baseDemandPerMinute` | 3.0 kişi/dk | varsayım |
| `stopShare` | 0.6 | varsayım |
| `stairsSecondsPerFloorUp` | 13 s/kat | varsayım |
| `stairsSecondsPerFloorDown` | 11 s/kat | varsayım |
| `landingSeconds` | 6 s | varsayım |
| `transferWalkSeconds` | 25 s | varsayım |
| `corridorSeconds` | 20 s | varsayım |
| `tieThresholdSeconds` | 12 s | varsayım |

Yoğunluk çarpanları (ders değişimi pencereleri):

| Aralık | Çarpan | Etiket |
|---|---|---|
| 08:45–09:00 | 2.0 | Sabah ders başlangıcı |
| 10:45–11:00 | 1.6 | İkinci ders geçişi |
| 12:45–13:00 | 2.2 | Öğle ders geçişi |
| 14:45–15:00 | 1.6 | Öğleden sonra geçişi |
| 16:45–17:00 | 1.8 | Gün sonu geçişi |
| diğer | 1.0 | Ders geçişi dışı |

Pencere bitiş anı dahil değildir (09:00 → 1.0).

## 4. Modelin ürettiği örnek sonuçlar (12:50, öğle geçişi)

| Yolculuk | Asansör | Merdiven | Sonuç |
|---|---|---|---|
| 1 → 3 | 71 sn | 52 sn | Merdiven 19 sn daha hızlı |
| 1 → 5 | 77 sn | 78 sn | Başabaş (fark 1 sn) |
| 1 → 7 | 82 sn | 104 sn | Asansör 22 sn daha hızlı |
| 1 → 15 | 101 sn | 208 sn | Asansör 107 sn daha hızlı |
| 2 → 7 | 80 sn (doğrudan, tek asansör) | 91 sn | Başabaş (fark 11 sn) |
| 2 → 4 | 71 sn | 52 sn | Merdiven 19 sn daha hızlı |
| 2 → 6 | 76 sn | 78 sn | Başabaş (fark 2 sn) |
| 5 → 6 | 151 sn (3. katta aktarma) | 39 sn | Merdiven 112 sn daha hızlı |
| 3 → 1 | 71 sn | 48 sn | Merdiven 23 sn daha hızlı |

Sakin saatte (09:30) 1 → 15: asansör 86 sn, merdiven 208 sn → asansör.

Bu tablo `docs/test-report.md` içindeki kabul testleriyle aynı senaryoları kullanır.

## 5. Neyi bilmiyoruz (dürüst liste)

- Gerçek asansör konum/çağrı verisine dijital erişim var mı? Doğrulanmadı.
- Gerçek ortalama bekleme süresi, tur süresi ve durak sayısı ölçülmedi.
- Ortak katların (1–3) gerçekten dört asansör tarafından servis edildiği **saha
  gözlemiyle** doğrulanmadı; kural takımın bina bilgisine dayanıyor.
- Merdiven hızı kişiye göre değişir; tek katsayı ile temsil ediliyor.
- Yoğunluk pencereleri ders programından **tahmin edildi**, ölçülmedi.
- Aktarmada iki bekleme bağımsız toplanıyor; gerçekte ikinci asansörün gelişi
  birinciyle ilişkili olabilir.
- Kapasite (dolu kabin) etkisi modellenmiyor; kuyruk yalnızca ortalama ile temsil ediliyor.

## 6. Kalibrasyon planı (v1.1)

| Ölçüm | Güncellenecek katsayı |
|---|---|
| Sayaçla 20 bekleme ölçümü (ders geçişi + sakin) | `baseDemandPerMinute`, `tieThresholdSeconds` |
| Merdivenle 2/3/5 kat süre ölçümü | `stairsSecondsPerFloorUp/Down`, `landingSeconds` |
| Asansör tur gözlemi (durak sayısı, kapı süresi) | `doorCycleSeconds`, `stopShare` |
| Ortak katlarda hangi asansörlerin durduğunun gözlemi | `commonFloors` |
| Aktarmalı yolculukta hol yürümesi kronometresi | `transferWalkSeconds` |
| Kat içi yürüme mesafesi ölçümü | `corridorSeconds` |

Ölçümler arayüzdeki **Gözlem kaydı** bölümünden CSV olarak toplanır.

## 7. Bilinen sınırlar

- Aktarmalı süre iki ayrı beklemenin toplamı; kuyruk etkileşimi modellenmiyor.
- Asansör kapasitesi ve dolu kabin atlaması yok.
- Tek/çift grup yük dengesizliği canlı gösterilmez (veri gerektirir).
- Model kişiye özel hız, yaş, engel durumu farkını yalnızca "merdiven kapalı" anahtarıyla ele alır.

## 8. Neden bu yaklaşım

Gerçek asansör verisine erişim doğrulanmadığı için model, ölçüm gelene kadar
**şeffaf ve kalibre edilebilir** kalmayı hedefler: her sayı tek dosyadan gelir,
her sayı etiketlidir, her varsayım bir ölçümle değiştirilebilir. Veri gelirse
katsayılar güncellenir, formüller değişmez.
