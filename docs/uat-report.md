# UAT kiti ve raporu

> **Durum:** Oturumlar henüz yapılmadı. Bu dosya hem kiti (yapılacaklar) hem de
> doldurulacak raporu içerir. Sonuçlar işlendiğinde "Bulgular" ve "Karar" bölümleri dolar.
> Uydurma katılımcı sonucu yazılmaz; boş bırakmak, sahte veri yazmaktan iyidir.

## 1. Amaç

Üç soruya kanıtla cevap vermek:

1. Kullanıcı **10 saniye içinde** asansör/merdiven kararını verebiliyor mu?
2. Öneriye **güveniyor** mu, yoksa sayılar uydurma mı geliyor?
3. **Erişilebilirlik modu** beklendiği gibi anlaşılıyor mu?

## 2. Katılımcı profili

5 öğrenci: en az 2'si düzenli olarak üst katlara (7+) çıkan, en az 1'i merdiven
kullanamayan veya kullanmak istemeyen. Katılımcı adı yerine kod kullanılır (K1–K5).

## 3. Oturum akışı (kişi başı 6–8 dk)

| Adım | Yapılan | Kayıt |
|---|---|---|
| 1 | Sayfa tanıtılmadan açılır, 3 saniye bakmasına izin verilir | "İlk bakışta ne anladın?" |
| 2 | Görev 1: "12:50'de 1. kattan 7. kata gideceksin. Asansör mü merdiven mi?" | karar süresi (sn), seçim, gerekçe |
| 3 | Görev 2: "Merdiven kullanamıyorsun. Ekran ne öneriyor?" | anlaşıldı mı (evet/hayır), alıntı |
| 4 | Görev 3: "Gerçek bir bekleme süresi kaydet ve CSV indir." | tamamlandı mı, takıldığı yer |
| 5 | 3 soru: "Sayılara güveniyor musun?", "Neden?", "Neyi değiştirirdin?" | 1–5 güven puanı + serbest metin |

Görev 1 ve 2'de süre, kullanıcı ekrana bakmaya başladığında başlar, kararını söylediğinde biter.

## 4. Görev kartları (katılımcıya okunacak metin)

```
Görev 1 — "Saat 12:50. 1. kattasın, 7. kata çıkacaksın. Ne yaparsın?"
Görev 2 — "Merdiven kullanamıyorsun. Bu ekran sana ne öneriyor, nasıl anlarsın?"
Görev 3 — "Bir kez gerçek asansör bekleme süresi ölçtün: 95 saniye, 7. kat.
           Bunu araca kaydet ve CSV olarak indir."
```

## 5. Kayıt tablosu (doldurulacak)

| K | Görev 1 süre (sn) | Görev 1 seçim | Görev 2 anlaşıldı | Görev 3 tamam | Güven (1–5) | Not |
|---|---|---|---|---|---|---|
| K1 | | | | | | |
| K2 | | | | | | |
| K3 | | | | | | |
| K4 | | | | | | |
| K5 | | | | | | |

**Başarı eşiği:** Görev 1 medyanı ≤ 10 sn, Görev 2'de 5/5 anlama, Görev 3'te 4/5 tamamlama.

## 6. Bulgular (doldurulacak)

| # | Bulgu | Ciddiyet | Karar (düzelt / kapsam dışı) |
|---|---|---|---|
| 1 | | | |
| 2 | | | |

## 7. Karar (doldurulacak)

- Yön doğrulandı mı, hangi iki değişiklik yapılacak?
- Hangi bulgu v1.1'e taşındı?
- Tarih, katılımcı sayısı, oturumu yapan kişi.

## 8. Erişilebilirlik turu (aynı oturumda)

- [ ] Yalnızca klavye ile tüm görevler tamamlandı.
- [ ] Odak halkası her adımda görünür.
- [ ] Ekran okuyucu (NVDA veya Narrator) sonucu kendiliğinden okudu.
- [ ] Metin kontrastı ölçüldü: gövde ≥ 4,5:1, büyük rakam ≥ 3:1.
- [ ] `prefers-reduced-motion` açıkken geçişler durdu.
