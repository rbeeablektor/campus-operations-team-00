# YerimVar Incident Diagnosis

## Breakpoint 1 — Two Realities

### What Happened?

YerimVar sisteminde aynı sınıf için iki farklı kullanıcı farklı
durum bilgileri görebilmektedir.

Örneğin bir kullanıcının ekranında Sınıf 204 "DOLU" görünürken
başka bir kullanıcının ekranında aynı sınıf "BOŞ"
görünebilmektedir.

Aynı sistem içerisinde iki farklı gerçekliğin oluşması, hangi
bilginin doğru olduğunun belirsiz hale gelmesine neden olmaktadır.


### Process Gap

Sorun yalnızca ekranda yanlış bir bilginin gösterilmesi değildir.

Birden fazla kullanıcının kullandığı ortak durum bilgisinin nasıl
yönetileceği ve senkronize edileceği yeterince tanımlanmamış veya
doğrulanmamıştır.

Sistemin tek ve güvenilir bir veri kaynağının
(source of truth) nasıl korunacağı konusunda yeterli mühendislik
süreci uygulanmamıştır.


### Missing Evidence

Birden fazla kullanıcının aynı anda aynı sınıf için aynı durumu
gördüğünü doğrulayan test sonuçları eksiktir.

İstemciler arasındaki durum senkronizasyonunun nasıl çalışacağını
açıklayan yeterli bir mühendislik kaydı bulunmamaktadır.

Birden fazla kullanıcıyla gerçekleştirilmiş eş zamanlı testlere
ait sonuçlar bulunmamaktadır.



## Breakpoint 2 — Environment Failure

### What Happened?

YerimVar uygulaması geliştiricinin kendi bilgisayarında çalışmasına
rağmen başka bir bilgisayarda çalıştırılmak istendiğinde gerekli
bağımlılıklardan biri bulunamamıştır.

Bu durum uygulamanın yalnızca geliştiricinin kendi ortamında
çalışmasının, ürünün başka ortamlarda da güvenilir şekilde
çalışacağı anlamına gelmediğini göstermektedir.


### Process Gap

Projenin çalışması için gerekli bağımlılıklar ve geliştirme ortamı
tekrar oluşturulabilir şekilde yönetilmemiştir.

Başka bir geliştiricinin projeyi sıfırdan kurarak aynı sonucu
alabileceğini doğrulayan bir süreç oluşturulmamıştır.

Çalışan geliştirme ortamı ile ürünün gerçekten taşınabilir şekilde
çalışması birbirine karıştırılmıştır.


### Missing Evidence

Projenin ihtiyaç duyduğu bağımlılıkların güvenilir bir listesi
eksiktir.

Temiz bir bilgisayarda projenin kurulup çalıştırıldığını gösteren
doğrulama sonucu bulunmamaktadır.

Kurulum, bağımlılık ve çalıştırma adımlarını açıklayan yeterli
dokümantasyon bulunmamaktadır.



## Breakpoint 3 — No Tests

### What Happened?

YerimVar projesinde sistemin doğrulanması büyük ölçüde manuel
denemelere dayanmaktadır.

Bir özelliğin geliştirici tarafından bir kez denenmesi ve çalışması,
ürünün bütün koşullarda doğru çalıştığını kanıtlamamaktadır.

Yeterli ve sistematik test kanıtlarının bulunmaması, değişiklikler
sonrasında sistemin hâlâ doğru çalışıp çalışmadığının
anlaşılmasını zorlaştırmaktadır.


### Process Gap

Sistematik bir test ve doğrulama süreci oluşturulmamıştır.

Sistemin hangi davranışlarının hangi testlerle doğrulanacağı
tanımlanmamıştır.

Yapılan bir değişikliğin daha önce çalışan özellikleri bozup
bozmadığını kontrol edecek düzenli bir regression testing süreci
bulunmamaktadır.


### Missing Evidence

Beklenen sistem davranışlarını doğrulayan test sonuçları
bulunmamaktadır.

Özelliklere ait kabul kriterleri ve bunlarla bağlantılı test
senaryoları eksiktir.

Yeni değişikliklerden sonra eski özelliklerin hâlâ doğru çalıştığını
gösteren regression test kanıtları bulunmamaktadır.


## AI Usage Record

AI Tool(s): GPT 6.1 SOL, Claude Opus 5.5  
AI Role: Drafting / Structuring / Reviewing / Copyediting  
Human Review: Completed  
