# Problem Statement v0

## Problem Area

Üniversite Binasında Asansör Bekleme Süresi ve Katlar Arası Ulaşım Problemi

## Who Experiences the Problem?

Bu problem üniversite binasında farklı katlar arasında hareket
etmek zorunda olan öğrenciler tarafından yaşanabilir.

Özellikle ders başlangıç ve bitiş saatlerinde çok sayıda
öğrencinin aynı anda kat değiştirmesi nedeniyle asansör kullanan
öğrenciler daha uzun bekleme süreleriyle karşılaşabilir.

Üst katlarda dersi bulunan öğrenciler ve iki ders arasında kısa
süre içerisinde farklı bir kata ulaşması gereken öğrenciler
problemden daha fazla etkilenebilir.

Merdiven kullanması mümkün olmayan, merdiven kullanımında zorlanan
veya erişilebilirlik ihtiyacı bulunan öğrenciler için asansör tek
uygulanabilir ulaşım seçeneği olabilir.

Bu nedenle problem bütün öğrenciler için aynı şekilde
değerlendirilemez.


## What Happens Currently?

Üniversite binası yaklaşık 15 kattan oluşmaktadır.

Katlar arası ulaşım için dört asansör ve merdivenler
kullanılmaktadır.

Mevcut durumda iki asansör tek numaralı katlara, iki asansör ise
çift numaralı katlara hizmet vermektedir.

Örneğin tek numaralı bir kata gitmek isteyen öğrenci tek katlara
hizmet veren iki asansörü, çift numaralı bir kata gitmek isteyen
öğrenci ise çift katlara hizmet veren iki asansörü kullanmaktadır.

Özellikle yoğun saatlerde çok sayıda öğrencinin aynı anda asansör
kullanmak istemesi nedeniyle asansörlerin önünde kalabalık ve
bekleme sıraları oluşabilmektedir.

Öğrenciler asansörün ne zaman geleceğini veya hedef kata
ulaşmalarının toplam ne kadar süreceğini önceden bilememektedir.

Merdiven kullanabilen öğrenciler için merdiven alternatif bir
ulaşım yöntemi olmasına rağmen öğrenci, belirli bir anda asansörü
beklemek ile merdiveni kullanmak arasında hangisinin daha hızlı
olacağını kolay şekilde değerlendiremeyebilir.

Örneğin ikinci kata gitmek isteyen bir öğrenci asansörü birkaç
dakika beklerken aynı kata merdiven kullanarak daha kısa sürede
ulaşabilecek olabilir.

Ancak bunun gerçekten daha hızlı olup olmadığını henüz ölçmüş
değiliz.


## Why Is This Problem Important?

Uzun asansör bekleme süreleri öğrencilerin bina içerisinde
gereksiz zaman kaybetmesine neden olabilir.

Özellikle iki ders arasında sınırlı süre bulunan durumlarda bu
gecikme öğrencilerin bir sonraki dersine geç kalmasına yol açabilir.

Asansör önlerinde oluşan kalabalık bina içerisindeki insan akışını
da olumsuz etkileyebilir.

Düşük katlara giden ve merdiven kullanabilecek öğrencilerin asansör
kullanması, yoğun saatlerde asansör talebini artırıyor olabilir.

Diğer taraftan merdiven kullanamayacak öğrencilerin bulunduğu
unutulmamalıdır.

Asansör talebini azaltmaya yönelik herhangi bir yaklaşım bu
öğrencilerin erişimini zorlaştırmamalıdır.

Problem bu nedenle yalnızca asansörlerin hızından değil;
öğrencilerin hedef kata mümkün olan en uygun ve erişilebilir
yöntemle ulaşabilmesinden oluşmaktadır.


## What Don't We Know Yet?

Asansörlerin ortalama bekleme süresinin ne kadar olduğunu henüz
bilmiyoruz.

Bekleme sürelerinin hangi saatlerde en yüksek seviyeye ulaştığını
bilmiyoruz.

Ders başlangıç ve bitiş saatlerinin asansör yoğunluğuna etkisinin
ne kadar olduğunu bilmiyoruz.

Tek katlara hizmet veren asansörler ile çift katlara hizmet veren
asansörlerin yoğunluk seviyeleri arasında fark olup olmadığını
bilmiyoruz.

Hangi katlara daha fazla öğrenci hareketi gerçekleştiğini
bilmiyoruz.

Düşük katlara giden öğrencilerin ne kadarının merdiven yerine
asansör kullandığını bilmiyoruz.

İkinci, üçüncü veya dördüncü kata ulaşırken hangi koşullarda
merdivenin asansörden daha hızlı olduğunu bilmiyoruz.

Bir öğrencinin merdiven kullanarak farklı katlara ulaşmasının
ortalama ne kadar sürdüğünü bilmiyoruz.

Asansörlerin ortalama yolculuk süresini bilmiyoruz.

Yoğun saatlerde bir asansörün ortalama kaç öğrenci taşıdığını
bilmiyoruz.

Asansörlerin anlık kat, yön veya çağrı bilgilerinin dijital olarak
erişilebilir olup olmadığını bilmiyoruz.

Mevcut sistem kullanılarak güvenilir bir tahmini bekleme süresinin
hesaplanıp hesaplanamayacağını bilmiyoruz.

Öğrencilere alternatif yollar sunulmasının gerçekten ortalama
ulaşım süresini azaltıp azaltmayacağını bilmiyoruz.


## Assumptions

Ders başlangıç ve bitiş saatlerinde asansör yoğunluğunun arttığını
varsayıyoruz.

Öğrencilerin önemli bir bölümünün özellikle yüksek katlara
giderken asansör kullanmayı tercih ettiğini varsayıyoruz.

Düşük katlara giden bazı öğrencilerin de asansör kullanması
nedeniyle yoğunluğun arttığını varsayıyoruz.

Bazı koşullarda düşük katlara merdivenle ulaşmanın asansörü
beklemekten daha hızlı olabileceğini varsayıyoruz.

Tek ve çift katlara hizmet veren asansörlerin yoğunluk seviyelerinin
birbirinden farklı olabileceğini varsayıyoruz.

Öğrencinin tahmini asansör bekleme süresini bilmesi halinde daha
uygun bir ulaşım yöntemi seçebileceğini varsayıyoruz.

Asansör ve merdiven gibi alternatif yöntemlerin karşılaştırılmasının
bazı öğrencilerin hedef kata daha hızlı ulaşmasına yardımcı
olabileceğini varsayıyoruz.

Merdiven kullanımının bütün öğrenciler için uygun olmadığını ve
herhangi bir çözümün erişilebilirlik ihtiyaçlarını dikkate alması
gerektiğini varsayıyoruz.


## Evidence Needed

Farklı gün ve saatlerde gerçek asansör bekleme süreleri
ölçülmelidir.

Özellikle ders başlangıç ve bitiş saatlerindeki asansör yoğunluğu
gözlemlenmelidir.

Tek kat ve çift kat asansör gruplarının bekleme süreleri ayrı ayrı
ölçülmelidir.

Farklı katlara merdiven kullanılarak ulaşmanın ortalama süreleri
ölçülmelidir.

Özellikle ikinci, üçüncü, dördüncü ve beşinci kat gibi daha düşük
katlarda asansör ile merdiven süreleri karşılaştırılmalıdır.

Asansör geldikten sonra hedef kata ulaşmanın ortalama yolculuk
süresi de ölçülmelidir.

Yoğun saatlerde asansör başına ortalama yolcu sayısı
gözlemlenmelidir.

Öğrencilerle kısa anket veya görüşmeler yapılmalıdır.

Öğrencilere hangi saatlerde asansör problemi yaşadıkları, ortalama
ne kadar bekledikleri ve düşük katlarda merdiven kullanıp
kullanmadıkları sorulmalıdır.

Merdiven kullanımının uygun olmadığı öğrencilerin ihtiyaçları
göz önünde bulundurulmalıdır.

Asansör sisteminden anlık konum, yön veya çağrı verisinin alınıp
alınamayacağı teknik olarak araştırılmalıdır.

Alternatif ulaşım önerilerinin gerçek hedef kata ulaşım süresini
azaltıp azaltmadığı daha sonra kullanıcı testleriyle
doğrulanmalıdır.


## AI Usage Record

AI Tool(s): GPT 6.1 SOL, Gemini 3.8 Flash  
AI Role: Copyediting / Reviewing / Suggestions  
Human Review: Completed  
Final Decision: Team
