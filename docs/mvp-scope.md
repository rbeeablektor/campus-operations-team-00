# MVP kapsamı — v1

## 1. Tek cümlelik problem

Öğrenci, binada bulunduğu kattan gitmek istediği kata çıkarken hangi asansör grubunun
ona hizmet verdiğini ve o anda asansörle mi merdivenle mi daha hızlı gideceğini bilemiyor.

## 2. Kapsam içi

| # | Özellik | Neden MVP'de |
|---|---|---|
| F1 | Kat → asansör grubu eşlemesi (1, 2, 3, 15 ortak; arada tek/çift) | Problemin en net, tartışmasız parçası; veri gerektirmez |
| F2 | Bekleme ve toplam süre tahmini | Kullanıcının kararının girdisi |
| F3 | Asansör ↔ merdiven karşılaştırması ve öneri | Kullanıcıya değer üreten tek çıktı |
| F4 | Erişilebilirlik modu | Merdiven herkes için uygun değil; öneri üretilmemeli |
| F5 | Varsayım şeffaflığı | Ölçülmemiş sayıyı ölçüm gibi sunmamak |
| F6 | Gözlem kaydı + CSV | Modelin kalibrasyon kanıtını üretmek |

## 3. Kapsam dışı (bilinçli)

- Gerçek zamanlı asansör konumu/çağrı verisi (erişim doğrulanmadı).
- Kullanıcı hesabı, sunucu, veritabanı, bildirim, çoklu cihaz senkronizasyonu.
- İç mekân haritası ve adım adım rota.
- Kapasite/dolu kabin simülasyonu, kuyruk teorisi modeli.
- Makine öğrenmesi; veri yokken anlamsız.
- Tek/çift grup yük dengesizliğinin canlı gösterimi.

Her kapsam dışı madde, `docs/model-notes.md` §5'te "neyi bilmiyoruz" veya §7 "bilinen
sınırlar" altında gerekçesiyle duruyor.

## 4. Kullanıcı akışı

1. Kullanıcı biniş katını, hedef katını ve saati seçer (saat varsayılan olarak şimdidir).
2. Merdiven kullanamıyorsa anahtarı açar.
3. Sonuç anında güncellenir: öneri, gerekçe, iki süre, yoğunluk etiketi.
4. Şaft diyagramında biniş ve hedef kat vurgulanır.
5. Gözlem bölümünde gerçek bekleme süresi kaydedilir, CSV indirilir.

## 5. Kabul kriterleri (MVP = bitti)

- [x] `node tools/serve.mjs` ile açılıyor, konsol hatası yok.
- [x] 15×15×3 taramada `NaN`/negatif süre yok (T08).
- [x] Erişilebilirlik modunda merdiven önerilmiyor (T04).
- [x] Her görünen sayı `model-params.js` kaynaklı ve varsayım panelinde listeli (T09).
- [x] Otomatik testler yeşil, rapor tarihli (T01–T12).
- [x] Prompt paketi v1→v2 farkı ve gerekçesi `prompts/CHANGELOG.md` içinde.
- [ ] 5 öğrenci ile UAT — kit hazır, oturum yapılacak.
- [ ] Kontrast ölçümü ve klavye turu — UAT ile birlikte.

## 6. Sonraki sürüm (v1.1) için adaylar

1. Gözlem CSV'sinden otomatik kalibrasyon (ölçüm/ortalama oranı katsayıya yansır).
2. Aktarmalı rota süresi (merdiven + tek asansör kombinasyonu).
3. Ders programı verisinden yoğunluk pencerelerinin otomatik güncellenmesi.
4. Kapasite modeli (dolu kabin atlaması).

Bunlar MVP'ye eklenmez; kapsam büyümesi riski nedeniyle ayrı sürüme bırakıldı.
