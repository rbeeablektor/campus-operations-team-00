Yazılım Geliştirme Süreçleri — Hafta 01

Öğretim Elemanı Değerlendirmesi

Takım: Campus Operations — Team 00
Takım Üyeleri: Ege Kurnaz, Emre Yılmaz, Fatih Elagöz, Eyüp Efe Coşkun
Proje: Üniversite Binasında Asansör Bekleme Süreleri ve Katlar Arası Ulaşım Problemi
Değerlendirme Tarihi: 10 Ekim 2026

⸻

1. Genel Değerlendirme

Sevgili Arkadaşlar,

Birinci hafta kapsamında hazırladığınız GitHub repository incelenmiştir.

Üniversitemizde günlük yaşamı etkileyen somut bir problemi seçmeniz ve bu problemi yazılım mühendisliği perspektifinden değerlendirmeye başlamanız olumlu bulunmuştur.

Özellikle asansör bekleme süreleri, ders başlangıç ve bitiş saatlerindeki yoğunluk, katlar arası ulaşım ve erişilebilirlik gereksinimlerini birlikte ele almanız başarılı bir başlangıçtır.

README.md ve docs/problem-statement-v0.md dosyalarınızda problemin kapsamını, kullanıcıları, varsayımları ve ihtiyaç duyulan kanıtları ayrıntılı biçimde açıklamışsınız.

Bununla birlikte, dönem projenizin kapsamı ile repository içerisinde bulunan bazı mühendislik kanıtlarının ilişkisi konusunda açıklığa kavuşturulması gereken bir husus bulunmaktadır.

2. Dönem Projesinin Kapsamı

Öncelikle önemli bir konuyu netleştirelim.

Sizin dönem projeniz, üniversite binasındaki asansör bekleme süreleri ve katlar arası ulaşım problemine yönelik bir yazılım çözümü geliştirmektir.

Derslerimizde ele aldığımız YerimVar uygulaması, yazılım geliştirme süreçlerinde karşılaşılabilecek mühendislik problemlerini açıklamak amacıyla kullandığımız örnek bir vaka çalışmasıdır (Case Study).

YerimVar uygulamasını geliştirmeniz, genişletmeniz veya dönem projesi olarak kullanmanız beklenmemektedir.

Dönem boyunca gerçekleştireceğiniz problem analizi, gereksinim belirleme, tasarım, geliştirme, test ve doğrulama faaliyetleri kendi seçtiğiniz Campus Operations projesine odaklanmalıdır.

3. Incident Diagnosis Dosyasına İlişkin Değerlendirme

Repository içerisinde bulunan evidence/incident-diagnosis.md dosyasında YerimVar uygulamasına ilişkin üç mühendislik problemi analiz edilmiştir:

1. Two Realities: Aynı sınıfın farklı kullanıcılarda farklı doluluk durumlarında görünmesi.
2. Environment Failure: Uygulamanın farklı bilgisayarlarda aynı şekilde çalışmaması.
3. No Tests: Sistematik test ve doğrulama süreçlerinin bulunmaması.

Bu analiz, birinci hafta dersimizde ele aldığımız YerimVar vaka çalışmasıyla uyumludur.

Ancak burada dikkat etmenizi istediğim önemli bir ayrım bulunmaktadır.

YerimVar vaka analizi, sizin asansör projenizde bu sorunların gerçekten yaşandığını gösteren bir kanıt değildir.

Dolayısıyla bu dosyayı kendi dönem projenizin problemlerini doğrulayan bir çalışma olarak değerlendirmemelisiniz.

Birinci haftada YerimVar vakasının incelenmesi istenmiş olduğundan, bu dosyayı oluşturmuş olmanız tek başına bir hata değildir. Ancak bundan sonraki çalışmalarınızda vaka analizi ile dönem projenize ait mühendislik kanıtlarını açık biçimde ayırmanız gerekmektedir.

Sizlerden Beklentim

Kendi asansör projenizde hangi sorunların gerçekten gözlemlendiğini, hangilerinin varsayım olduğunu ve hangi konularda henüz yeterli kanıt bulunmadığını belirlemenizdir.

Örneğin:

Problem: Ders geçiş saatlerinde asansör bekleme süreleri artıyor olabilir.

Varsayım (Assumption): Yoğunluğun ders başlangıç ve bitiş saatlerinde daha yüksek olduğu düşünülmektedir.

Eksik Kanıt (Missing Evidence): Farklı saatlerde ölçülmüş gerçek asansör bekleme süreleri.

Doğrulama (Validation): Belirli gün ve saatlerde gerçekleştirilecek gözlemler ve süre ölçümleri.

Burada önemli olan, henüz doğrulanmamış bilgileri kesin gerçekler gibi sunmamaktır.

4. AI–Human–Evidence Değerlendirmesi

evidence/ai-human-evidence.md dosyanızda yapay zekâ tarafından önerilen üç farklı yaklaşımı değerlendirmişsiniz.

1. Estimated Elevator Waiting Time

Öğrencilere tahmini asansör bekleme süresinin gösterilmesi.

2. Fastest Suitable Route Recommendation

Öğrencinin hedef kata ulaşması için asansör ve merdiven seçeneklerinin karşılaştırılması.

3. Peak-Time Congestion Prediction

Ders başlangıç ve bitiş saatlerinde oluşabilecek yoğunluğun tahmin edilmesi.

Özellikle üçüncü öneriyi doğrudan kabul etmek yerine MODIFY kararı vermeniz olumlu bulunmuştur.

Bu yaklaşım, dersimizde vurguladığımız AI → Human → Evidence anlayışıyla uyumludur.

Ancak önemli bir mühendislik ilkesini hatırlatmak istiyorum:

Yapay zekâ tarafından sunulan bir önerinin kabul edilmesi, o önerinin teknik olarak uygulanabilir veya başarılı olduğunun kanıtlandığı anlamına gelmez.

Örneğin asansörlerin gerçek zamanlı konum bilgilerine erişimin mümkün olup olmadığını henüz bilmiyoruz.

Bu nedenle önerilerinizin uygulanabilirliğini araştırmanız ve kararlarınızı mümkün olduğunca ölçülebilir kanıtlara dayandırmanız gerekmektedir.

5. Proje Kapsamının Yönetilmesi

Proje fikrinizin zaman içerisinde gereğinden fazla genişlememesine dikkat etmenizi istiyorum.

Şu anda üç farklı özellik üzerinde düşünüyorsunuz:

1. Asansör bekleme süresinin tahmin edilmesi.
2. En uygun ulaşım yönteminin önerilmesi.
3. Yoğun saatlerin önceden tahmin edilmesi.

Bu özelliklerin tamamını aynı anda geliştirmeye çalışmak, dönem projenizin kapsamını ve teknik karmaşıklığını artırabilir.

Bu nedenle öncelikle en önemli kullanıcı problemini belirlemenizi ve bu probleme yönelik küçük, doğrulanabilir bir başlangıç çözümü (Initial Product Scope) oluşturmanızı öneriyorum.

Ayrıca erişilebilirlik gereksinimlerini göz ardı etmemeniz önemlidir. Merdiven kullanımı her öğrenci için uygun bir seçenek değildir.

6. Repository Düzeni ve Mühendislik İzlenebilirliği

Mevcut repository yapınız genel olarak anlaşılır durumdadır.

Ancak farklı amaçlarla hazırlanan dosyaların birbirine karıştırılmaması gerekmektedir.

Özellikle README.md içerisinde şu ayrımı açıklamanızı istiyorum:

YerimVar: Birinci hafta kapsamında gerçekleştirilen eğitim amaçlı vaka analizi.

Campus Elevator Mobility: Dönem boyunca geliştireceğiniz asıl yazılım projesi.

Mevcut dosyalarınızı silmenizi istemiyorum.

Bunun yerine geçmiş çalışmalarınızı koruyarak gerekli açıklamaları ve yeni mühendislik kanıtlarını eklemenizi bekliyorum.

Unutmayın:

GitHub yalnızca dosyaların saklandığı bir alan değil, mühendislik kararlarınızın ve gelişim sürecinizin izlenebildiği ortak çalışma ortamıdır.

7. Sonraki Hafta İçin Beklentiler

İkinci hafta kapsamında ele aldığımız Software Process Selection konusunu kendi asansör projenize uygulamanızı bekliyorum.

Bu kapsamda:

1. Projenizin belirsizliklerini (Uncertainty) değerlendirin.
2. Gereksinimlerin değişme olasılığını (Change) inceleyin.
3. Teknik ve operasyonel riskleri (Risk) belirleyin.
4. Kullanıcılardan ne kadar hızlı geri bildirim alabileceğinizi (Feedback Speed) değerlendirin.
5. Takımınızın çalışma yapısını (Team Context) dikkate alın.

Ardından seçtiğiniz geliştirme yaklaşımını gerekçelendirerek decisions/process-choice-v1.md dosyasında belgelendirin.

Burada yalnızca bir yöntem seçmeniz yeterli değildir. Bu yöntemi neden seçtiğinizi, hangi alternatifleri değerlendirdiğinizi ve kararınızın hangi varsayımlara dayandığını açıklamanız gerekmektedir.

8. Sonuç ve Öğretim Elemanı Görüşü

Sevgili Arkadaşlar,

Birinci hafta çalışmalarınız genel olarak olumlu değerlendirilmiştir.

Özellikle problemin tanımlanması, kullanıcı ihtiyaçlarının ele alınması ve yapay zekâ önerilerinin insan değerlendirmesinden geçirilmesi başarılı yönlerinizdir.

Bununla birlikte, dönem projenizin kapsamını netleştirmenizi ve bundan sonraki mühendislik çalışmalarınızı kendi seçtiğiniz asansör problemine odaklamanızı bekliyorum.

YerimVar uygulaması dersimizde öğrendiğimiz mühendislik kavramlarını anlamak için kullanılan bir örnektir. Asıl hedefimiz, bu kavramları kendi yazılım projenizde uygulayabilmenizdir.

Dönem boyunca yalnızca çalışan bir yazılım geliştirmenizi değil; aldığınız kararları açıklayabilmenizi, bu kararları kanıtlarla destekleyebilmenizi ve geliştirme sürecinizi izlenebilir biçimde yönetebilmenizi bekliyorum.

Çalışmalarınızda başarılar diliyorum.

Dr. Öğr. Üyesi Murat Göksu
Yazılım Geliştirme Süreçleri
