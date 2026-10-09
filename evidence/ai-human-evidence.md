# AI-Human Evidence

## Problem Context

Üniversite binası yaklaşık 15 kattan oluşmaktadır.

Binada iki asansör tek numaralı katlara, iki asansör ise çift
numaralı katlara hizmet vermektedir.

Katlar arasında merdiven kullanımı da mümkündür.

Özellikle yoğun saatlerde öğrencilerin asansör bekleme sürelerinin
artması ve gitmek istedikleri kata ulaşmalarının uzun sürmesi
problemi incelenmiştir.

AI aracından öğrencilerin hedef kata toplam ulaşım süresini
azaltmaya yönelik olası çözüm önerileri istenmiştir.

Aşağıdaki öneriler AI tarafından oluşturulmuştur. Nihai değerlendirme
ve karar takım üyelerine aittir.



## AI Proposal 1 — Estimated Elevator Waiting Time

### AI Proposal

Öğrencilere tek ve çift katlara hizmet veren asansörlerin tahmini
bekleme süreleri gösterilebilir.

Örneğin:

Tek Kat Asansörleri:
Tahmini bekleme süresi: 3 dakika

Çift Kat Asansörleri:
Tahmini bekleme süresi: 1 dakika

Bu bilgi sayesinde öğrenci asansörün gelmesinin yaklaşık ne kadar
süreceğini önceden görebilir.


### Human Decision

Accept


### Why?

Bu öneriyi kabul ediyoruz çünkü öğrencilerin asansörü veya merdiveni
kullanacağına karar vermesini kolaylaştırır.

Örneğin bir öğrenci 8.katta fakat asansörler daha 2. kattan falan yukarı
çıkmaya başladı kişi asansörü beklemek yerine merdiveni kullanarak
gideceği kata daha hızlı bir şekilde ulaşabilir.


### Evidence Needed

Tek ve çift kat asansörlerinin gerçek bekleme süreleri
ölçülmelidir.

Asansörlerin mevcut konum veya hareket bilgilerinin teknik olarak
erişilebilir olup olmadığı araştırılmalıdır.

Tahmini bekleme süresinin yeterli doğrulukla hesaplanıp
hesaplanamayacağı test edilmelidir.

Öğrencilerin bekleme süresini bilmesinin davranışlarını değiştirip
değiştirmediği araştırılmalıdır.



## AI Proposal 2 — Fastest Suitable Route Recommendation

### AI Proposal

Sistem öğrencinin gitmek istediği katı dikkate alarak asansör ve
merdiven seçeneklerini karşılaştırabilir.

Tahmini asansör bekleme ve yolculuk süresi ile merdiven
kullanılarak hedef kata ulaşma süresi karşılaştırılabilir.

Örneğin:

Hedef Kat: 2

Çift Kat Asansörü:
Tahmini toplam süre: 3 dakika 20 saniye

Merdiven:
Tahmini toplam süre: 1 dakika 15 saniye

Sistem:

"Şu anda 2. kata merdivenle ulaşmak daha hızlı olabilir."

şeklinde alternatif bir öneri gösterebilir.

Ancak merdiven seçeneği bütün kullanıcılar için uygun değildir.

Merdiven kullanamayan veya erişilebilirlik ihtiyacı bulunan bir
kullanıcı için sistem yalnızca kullanıcıya uygun ulaşım
seçeneklerini değerlendirmelidir.

Kullanıcı açısından merdiven uygun değilse, sistem merdiven daha
hızlı olsa bile bunu öneri olarak göstermemelidir.


### Human Decision

Accept


### Why?

Kısa mesafeler için asansör kullanımını azaltarak üniversite içerisindeki
asansör yoğunluğunu düşürmeyi ve öğrencileri merdiven kullanımına yönlendirdiği
için kabul ettik ayrıca bu yaklaşım daha üst katlara giden ve merdiven kullanamayan
kişiler için daha verimli kullanabilecekler


### Evidence Needed

Farklı katlara merdiven kullanılarak ulaşmanın ortalama süresi
ölçülmelidir.

Asansörlerin ortalama bekleme ve yolculuk süreleri ölçülmelidir.

Özellikle 2., 3., 4. ve 5. katlarda asansör ve merdiven süreleri
karşılaştırılmalıdır.

Önerilerin gerçek hedef kata ulaşım süresini azaltıp azaltmadığı
test edilmelidir.

Merdiven kullanımı her kullanıcı için uygun olmayabileceği için
erişilebilirlik ihtiyacı dikkate alınmalıdır.

Erişilebilirlik ihtiyacı bulunan kullanıcıların alternatif rota
önerilerinden olumsuz etkilenmediği doğrulanmalıdır.



## AI Proposal 3 — Peak-Time Congestion Prediction

### AI Proposal

Ders başlangıç ve bitiş saatleri ile geçmiş asansör yoğunluğu
karşılaştırılarak yoğunluk oluşması beklenen zaman aralıkları
tahmin edilebilir.

Örneğin sistem:

"13:00 ders değişimi nedeniyle 12:50–13:05 arasında yüksek
asansör yoğunluğu bekleniyor."

şeklinde bilgi gösterebilir.

Öğrenci bu bilgiyi kullanarak daha erken hareket etmeyi veya
kendisi için uygunsa alternatif bir ulaşım yöntemini seçmeyi
değerlendirebilir.


### Human Decision

Modify


### Why?

Öğrencilerin büyük bir kısmı ders başlangıç ve bitiş saatlerinde
asansörün yoğun olucağını zaten biliyor. Bu yüzden birçok
öğrenci ders saatinde birkaç dakika önce asansöre giderek beklemeye
başlıyor.

Bu nedenle "şu saatlerde asansör yoğun olacak" şeklinde önceden bilgi
vermenin asıl bekleme süresi problemini tek başına çözeceğini
düşünmüyoruz.

Fakat bu özellik tamamen gereksiz değil Yoğunluk tahmini, Tahmini bekleme süresi
ve Merdiven kullanımı önerileriyle daha faydalı olabilir.


### Evidence Needed

Asansör yoğunluğunun gün içerisinde tekrar eden belirli zaman
aralıklarında oluşup oluşmadığı ölçülmelidir.

Ders başlangıç ve bitiş saatleri ile asansör yoğunluğu arasındaki
ilişki araştırılmalıdır.

Geçmiş verilerin gelecekteki yoğunluğu tahmin etmek için yeterli
olup olmadığı değerlendirilmelidir.

Yoğunluk bilgisinin öğrencilerin hareket zamanlarını veya ulaşım
tercihlerini değiştirip değiştirmediği test edilmelidir.

Önceden bilgilendirmenin öğrencilerin toplam bekleme süresini
gerçekten azaltıp azaltmadığı doğrulanmalıdır.


## AI Usage Record

AI Tool(s): GPT 6.1 Sol  
AI Role: Drafting / Structuring / Reviewing  
Human Review: Completed  
Final Decision: Team
