# Prompt rubriği

Amaç: "prompt daha iyi" iddiasını ölçülebilir yapmak. Her prompt v1 (naif) ve v2 (kısıtlı)
olarak yazılır, aynı rubrikle puanlanır, fark `prompts/CHANGELOG.md` içine işlenir.

## 1. Boyutlar (her biri 0–2)

| # | Boyut | 0 | 1 | 2 |
|---|---|---|---|---|
| 1 | Rol ve bağlam | rol yok | rol var, bağlam eksik | rol + hedef kullanıcı + bina/proje bağlamı |
| 2 | Çıktı sözleşmesi | serbest metin | başlıklar var | alan listesi/şema + biçim + uzunluk sınırı |
| 3 | Kapsam sınırı | sınır yok | "şunları yapma" var | açık non-goals + kapsam dışı örnekleri |
| 4 | Belirsizlik kuralı | veri yoksa uydurur | "emin değilsen söyle" | "veri yoksa varsayım etiketiyle yaz, ölçüm gibi sunma" |
| 5 | Doğrulama isteği | test yok | "test et" der | kabul kriteri + test maddesi + sınır durumları ister |
| 6 | Dil ve biçim | süslü, abartılı | sade | sade + emoji yok + terim tutarlı + ünlem yok |

Toplam 12. Hedef: **≥ 10** ve hiçbir boyutta 0 yok.

## 2. Puanlama kuralları

- Puan, **üretilen çıktıya** bakılarak verilir, promptun ne kadar uzun olduğuna bakılmaz.
- Uzun ama çıktı sözleşmesi olmayan prompt 2 alamaz (boyut 2).
- "Veri yoksa varsayım yaz" kuralı olmadan üretilen sayı, boyut 4'te 0 sayılır.
- Aynı prompt iki farklı artefakt üretmişse ikisi de puanlanır, düşük olan geçerlidir.

## 3. Bu projedeki puanlar

| Prompt | v1 | v2 | Fark | Kapanan kusur |
|---|---|---|---|---|
| P1 problem çerçeveleme | 6 | 11 | +5 | Veri erişimi doğrulanmadan "gerçek zamanlı göster" yazdı; non-goals yoktu |
| P2 model spesifikasyonu | 5 | 12 | +7 | Formül ve parametre tablosu yoktu, invariant istemiyordu |
| P3 arayüz yönü | 6 | 10 | +4 | "Modern, temiz" gibi klişeler; emoji ve gradyan yasağı yoktu |
| P4 test üretimi | 7 | 11 | +4 | Erişilebilirlik ve sınır durumları listelenmemişti |
| P5 rapor ve izlenebilirlik | 6 | 10 | +4 | Gereksinim→test matrisi istenmiyordu |

Ortalama: v1 **6,0** → v2 **10,8**. Hedef eşiği (10) yalnızca v2'de aşıldı.

## 4. Prompt yazarken uygulanan beş kural

1. Çıktıyı **şema** olarak iste, paragraf olarak değil.
2. **Yapma listesi** yaz; modelin en sık hatası kapsamı büyütmek.
3. **Varsayım etiketi** kuralını prompta koy: "ölçmediysen ölçüm gibi yazma".
4. **Kabul kriteri** iste: "bu çıktı hangi testi geçince doğru sayılır".
5. **Dil** kuralını açıkça yaz: sade Türkçe, emoji yok, ünlem yok, abartı yok.

## 5. Neden bu rubrik

Dersin vurgusu "promptlarımızı en iyi hale getirmek". "İyi" ölçülmeden söylenemeyeceği için
rubrik, promptun ürettiği artefaktın **doğrulanabilirliğini** ölçer. Böylece prompt kalitesi
test sonuçlarıyla bağlanır: P2'nin invariantları doğrudan `tests/model.test.js` içindedir.
