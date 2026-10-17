# Software Development Process Selection

## 1. Project Information

- **Project Name:** Campus Elevator Mobility
- **Team Name:** Campus Operations — Team 00
- **Repository:** https://github.com/rbeeablektor/campus-operations-team-00
- **Date:** 17 Ekim 2026
- **Version:** 1.0

## 2. Project Overview

Bu proje, üniversite binamızdaki asansör bekleme süreleri ve katlar arası ulaşım problemini ele almaktadır.

Üniversite binamız yaklaşık 15 kattan oluşmaktadır. Binada iki asansör tek numaralı katlara, iki asansör ise çift numaralı katlara hizmet vermektedir. Katlar arasında merdiven kullanımı da mümkündür.

Özellikle ders başlangıç ve bitiş saatlerinde çok sayıda öğrencinin aynı anda kat değiştirmek istemesi nedeniyle asansörlerde yoğunluk oluşabilmekte ve bekleme süreleri artabilmektedir. Öğrenciler asansörün ne zaman geleceğini veya hedef kata ulaşmalarının toplam ne kadar süreceğini önceden bilememektedir.

### Who are the intended users?

Hedef kullanıcılar, bina içerisinde farklı katlar arasında hareket etmek zorunda olan üniversite öğrencileridir.

Özellikle şu kullanıcı grupları problemden daha fazla etkilenmektedir:

- Üst katlarda dersi bulunan öğrenciler.
- İki ders arasında kısa süre içerisinde farklı bir kata ulaşması gereken öğrenciler.
- Merdiven kullanması mümkün olmayan veya merdiven kullanımında zorlanan, erişilebilirlik ihtiyacı bulunan öğrenciler.

Problem bütün öğrenciler için aynı şekilde değerlendirilemez. Merdiven kullanamayan öğrenciler için asansör tek uygulanabilir ulaşım seçeneği olabilir.

### What problem are you addressing?

Öğrencilerin yoğun saatlerde asansör bekleme sürelerinin artması ve hedef kata ulaşmak için harcadıkları toplam sürenin uzaması problemidir.

Mevcut durumda öğrenciler belirli bir anda asansörü beklemek ile merdiveni kullanmak arasında hangisinin daha hızlı olacağını kolay şekilde değerlendiremeyebilmektedir.

### What value will your solution provide?

Proje kapsamında öğrencilere aşağıdaki değerler sunulması hedeflenmektedir:

- Asansörlerin tahmini bekleme süresinin gösterilmesi sayesinde öğrencilerin bilinçli ulaşım kararı verebilmesi.
- Asansör ve merdiven seçeneklerinin karşılaştırılarak hedef kata en hızlı ulaşım yönteminin önerilmesi.
- Erişilebilirlik ihtiyacı bulunan kullanıcılar için yalnızca uygun ulaşım seçeneklerinin değerlendirilmesi.

Bu değerlerin gerçekten sağlanıp sağlanamayacağı dönem boyunca toplanacak kanıtlarla doğrulanacaktır.

## 3. Project Characteristics

Projemiz aşağıdaki kriterler üzerinden değerlendirilmiştir.

| Criterion | Assessment | Explanation |
|-----------|------------|-------------|
| Requirements Clarity | Medium | Kullanıcı ihtiyaçları problem-statement-v0 ile belirlenmiştir ancak teknik gereksinimler (asansör sisteminden veri erişimi, sensör altyapısı) henüz netleşmemiştir. Hangi özelliğe öncelik verileceği kesinleşmemiştir. |
| Requirements Volatility | High | Kanıt toplama sürecinin sonuçlarına bağlı olarak gereksinimler değişebilir. Örneğin asansör sisteminden gerçek zamanlı veri alınamadığı anlaşılırsa tahmini bekleme süresi özelliğinin kapsamı tamamen değişecektir. Üç farklı özellik önerisi mevcuttur ve hangisinin uygulanabilir olduğu henüz doğrulanmamıştır. |
| Technical Complexity | Medium | Asansör verilerine dijital erişimin mümkün olup olmadığı bilinmemektedir. Gerçek zamanlı tahmin modeli oluşturmak teknik karmaşıklık içerebilir. Erişilebilirlik gereksinimlerinin çözüme entegre edilmesi ek mühendislik çalışması gerektirecektir. |
| Project Risk | Medium | Ana risk, asansör sisteminden veri alınamamasıdır. Bu durumda çözüm yaklaşımı temelden değişmek zorunda kalabilir. Ayrıca dönem takvimi sınırlıdır ve varsayımların doğrulanması zaman alabilir. |
| Stakeholder Feedback Need | High | Çözümün gerçekten bekleme süresini azaltıp azaltmadığı ancak öğrencilerden geri bildirim alınarak doğrulanabilir. Öğrencilerin bekleme süresini bilmesinin davranışlarını değiştirip değiştirmediği test edilmelidir. Öğretim elemanının haftalık değerlendirmeleri de sürekli geri bildirim gerektirmektedir. |
| Team Experience | Low–Medium | Takımımız dört kişiden oluşan bir öğrenci grubudur. Dönem projesi deneyimimiz sınırlıdır. Yazılım geliştirme süreçlerini bu derste öğrenmekteyiz ve ilk kez yapılandırılmış bir süreçle proje yönetimi uygulayacağız. |

### Belirsizlik ve Risk Değerlendirmesi

Projemizdeki temel belirsizlikleri, değişim olasılıklarını ve riskleri aşağıdaki şekilde özetleyebiliriz:

**Belirsizlikler (Uncertainty):**
- Asansörlerin anlık konum, yön veya çağrı bilgilerinin dijital olarak erişilebilir olup olmadığını bilmiyoruz.
- Güvenilir bir tahmini bekleme süresinin hesaplanıp hesaplanamayacağını bilmiyoruz.
- Merdiven ile asansör karşılaştırmasının hangi katlarda anlamlı bir fark oluşturduğunu henüz ölçmedik.

**Değişim Olasılığı (Change):**
- Kanıt toplama sonuçları gereksinimleri değiştirebilir.
- Teknik araştırma sonucunda asansör verisine erişim mümkün olmazsa çözüm yaklaşımı değişecektir.
- Kullanıcı geri bildirimleri öncelikleri yeniden belirleyebilir.

**Riskler (Risk):**
- Asansör sisteminden veri alınamama riski.
- Varsayımların sahada doğrulanamaması riski.
- Dönem takviminin kısıtlı olması nedeniyle kapsamın tamamlanamama riski.
- Üç özelliği aynı anda geliştirmeye çalışmanın projeyi karmaşıklaştırma riski.

## 4. Process Alternatives

Projemiz için en az dört farklı yazılım geliştirme yaklaşımını değerlendirdik.

| Approach | Advantages for Our Project | Limitations |
|---|---|---|
| Waterfall | Aşamalar net tanımlıdır, her aşamanın dokümantasyonu öğretim elemanına izlenebilir teslim sağlar. Planlama aşamasında gereksinimler detaylı belgelenebilir. | Gereksinimlerimiz henüz netleşmediği için erken aşamada dondurmak risklidir. Kanıt toplama sonuçlarına göre geri dönüş gerekirse maliyet yüksektir. Kullanıcı geri bildirimi projenin sonuna kalır. |
| Scrum | Sprint yapısı düzenli teslim döngüsü sağlar ve dönem takvimiyle eşleştirilebilir. Sprint Review ile hem kullanıcılardan hem öğretim elemanından düzenli geri bildirim alınır. Sprint Retrospective ile süreç sürekli iyileştirilir. | 4 kişilik takımda resmi Scrum rolleri (Product Owner, Scrum Master, Developer) ağır kalabilir. Daily Standup ve Sprint Planning gibi toplantılar küçük takımda zaman alıcı olabilir. Deneyimsiz takım için Sprint tahminleri zor olabilir. |
| Kanban | Esnek iş akışı belirsiz gereksinimlere uygundur. WIP (Work in Progress) limiti ile takım odaklanabilir. Görsel board ile ilerleme kolayca izlenebilir. Toplantı yükü düşüktür. | Zaman kutulaması olmadığı için teslim tarihleri belirsizleşebilir. Dönem takvimindeki haftalık teslimlerle uyum sağlamak ek planlama gerektirir. Önceliklendirme disiplini gerektirir. |
| Iterative / Incremental | Her iterasyonda küçük bir artış sağlanır ve risk erken aşamalarda azaltılır. Belirsiz gereksinimlere uygundur çünkü her döngüde öğrenilen bilgilerle gereksinimler güncellenir. Erken prototiplerle teknik fizibilite doğrulanabilir. | Dönem takvimiyle iterasyon planlamasının uyumu dikkatle yapılmalıdır. Her iterasyonun sonunda çalışan bir çıktı beklentisi baskı oluşturabilir. |

## 5. Selected Development Approach

### 5.1 Our Decision

- **Development Approach:** Iterative & Incremental (Agile temelli)
- **Team Management Framework:** Lightweight Scrum (hafifletilmiş Scrum)
- **Workflow Visualization Method:** Kanban Board (GitHub Projects)

Projemizde Scrum'ın sprint yapısını ve düzenli geri bildirim mekanizmalarını kullanacak, ancak resmi rolleri ve ağır toplantı formatlarını takım büyüklüğümüze uygun şekilde hafifletecek bir yaklaşım benimsiyoruz. İş takibi ve görselleştirme için Kanban board kullanacağız.

### 5.2 Selection Rationale

Bu yaklaşımı seçmemizin gerekçeleri aşağıda açıklanmıştır.

**1. Proje Gereksinimleri (Project Requirements):**
Gereksinimlerimiz henüz tam olarak netleşmemiştir. Üç farklı özellik önerimiz bulunmaktadır ancak hangisine öncelik vereceğimiz kanıt toplama sürecine bağlıdır. Iteratif yaklaşım sayesinde her sprint sonunda elde edilen veriler ışığında gereksinimleri güncelleyebilir ve bir sonraki iterasyonun kapsamını buna göre belirleyebiliriz. Waterfall gibi gereksinim donduran bir yaklaşım bu projede uygun değildir.

**2. Beklenen Değişiklikler (Expected Changes):**
Kanıt toplama sürecimiz devam etmektedir. Asansör sisteminden gerçek zamanlı veri alınıp alınamayacağı, merdiven süresi ölçümleri ve öğrenci anket sonuçları gereksinimleri değiştirebilir. Örneğin asansör verisine dijital erişim mümkün olmazsa tahmini bekleme süresi özelliğimizin kapsamı tamamen değişecektir. Scrum'ın sprint döngüleri bu değişikliklere her iki haftada bir yanıt verme esnekliği sağlamaktadır.

**3. Takım Büyüklüğü ve Deneyimi (Team Size and Experience):**
Takımımız dört kişiden oluşmaktadır. Bu büyüklükte bir takımda ağır süreç modelleri verimli değildir. Hafifletilmiş Scrum yaklaşımı ile resmi Scrum rollerini katı biçimde uygulamak yerine görevleri esnek şekilde dağıtabiliriz. Kanban board ise iş akışımızı görsel olarak takip etmemizi sağlayarak ekstra toplantı yükü oluşturmadan ilerlememize yardımcı olur.

**4. Teknik Riskler (Technical Risks):**
Projemizin en büyük teknik riski asansör sisteminden veri erişiminin mümkün olup olmadığıdır. Iteratif yaklaşım ile ilk sprintlerde bu riski araştırmaya ve teknik fizibilite doğrulamaya odaklanabiliriz. Risk erken aşamada tespit edilirse çözüm yaklaşımımızı proje ilerlemeden değiştirebiliriz. Waterfall modelinde bu risk ancak geliştirme aşamasında ortaya çıkardı ve geri dönüş maliyeti çok daha yüksek olurdu.

**5. Geri Bildirim ve Teslim İhtiyaçları (Feedback and Delivery Needs):**
Öğretim elemanımız haftalık değerlendirmeler yapmaktadır. Sprint sonlarında çalışan veya doğrulanabilir bir çıktı sunmak bu geri bildirim döngüsüyle uyumludur. Ayrıca çözümümüzün gerçekten işe yarayıp yaramadığını ancak öğrencilerden geri bildirim alarak doğrulayabiliriz. Sprint Review toplantıları bu doğrulamayı düzenli aralıklarla yapmamızı sağlar.

## 6. Team Organization

| Team Member | Responsibilities |
|---|---|
| Ege KURNAZ | Genel proje araştırması, problem analizi |
| Emre YILMAZ | Genel proje araştırması, problem analizi |
| Fatih ELAGÖZ | Genel proje araştırması, problem analizi |
| Eyüp Efe COŞKUN | Genel proje araştırması, problem analizi |

Projemiz şu anda araştırma ve problem analizi aşamasındadır. Tüm takım üyeleri birlikte projenin genel kapsamını anlamaya, mevcut problemi incelemeye ve kanıt toplama yöntemlerini belirlemeye odaklanmıştır. Henüz bireysel rol ataması yapılmamıştır.

Bireysel sorumluluklar (backend, frontend, test, koordinasyon vb.) araştırma aşaması tamamlandıktan ve projenin teknik gereksinimleri netleştikten sonra belirlenecektir.

### Koordinasyon Yöntemi

Takım olarak çalışmalarımızı aşağıdaki şekilde koordine edeceğiz:

- **Haftalık toplantı:** Her hafta en az bir kez yüz yüze veya çevrimiçi toplantı yaparak ilerlemeyi değerlendireceğiz.
- **İletişim:** Günlük iletişim için anlık mesajlaşma grubu kullanacağız. Teknik konular ve kararlar GitHub Issues üzerinden belgelenecektir.
- **Görev takibi:** GitHub Projects üzerinde Kanban board ile görevleri izleyeceğiz.
- **Kod yönetimi:** Feature branch stratejisi ile çalışacağız. Her değişiklik Pull Request ile review edildikten sonra main branch'e birleştirilecektir.
- **Sorumluluk esnekliği:** Araştırma aşaması tamamlandığında görev dağılımı netleştirilecek ve sprint retrospektiflerinde ihtiyaca göre yeniden düzenlenebilecektir.

## 7. Development Workflow

Projemizdeki bir görev aşağıdaki aşamalardan geçerek tamamlanır:

```
Backlog → To Do → In Progress → Review → Done
```

### Aşamaların Açıklaması

**Backlog:**
Yapılması gereken tüm görevlerin toplandığı havuzdur. Yeni fikirler, gereksinimler ve teknik görevler buraya eklenir.

**To Do:**
Sprint planning sırasında Backlog'dan seçilerek mevcut sprint kapsamına alınan görevlerdir. Önceliklendirme, projenin mevcut aşamasına ve risk durumuna göre yapılır.

**In Progress:**
Bir takım üyesinin aktif olarak üzerinde çalıştığı görevlerdir. WIP limiti olarak her takım üyesi aynı anda en fazla iki görev üzerinde çalışabilir.

**Review:**
Görev tamamlandığında en az bir başka takım üyesi tarafından incelenir. Kod içeren görevlerde Pull Request review yapılır. Dokümantasyon görevlerinde içerik incelemesi yapılır.

**Done:**
Definition of Done kriterlerini karşılayan ve review sürecini geçen görevler bu aşamaya taşınır.

### Görev Seçimi

Sprint planning toplantısında Backlog'daki görevler öncelik sırasına göre değerlendirilir. Önceliklendirmede şu kriterler dikkate alınır:

- Teknik risklerin erken doğrulanması.
- Öğretim elemanı geri bildirimlerindeki beklentiler.
- Kanıt toplama ihtiyaçları.
- Görevler arası bağımlılıklar.

### Sorumluluk Atama

Görevler GitHub Issues olarak oluşturulur ve takım üyelerine atanır. Her görevin bir sorumlusu vardır ancak gerektiğinde eşli çalışma (pair work) yapılabilir.

### İlerleme İzleme

- GitHub Projects Kanban board üzerinden görsel izleme.
- Haftalık toplantılarda sözlü ilerleme değerlendirmesi.
- Sprint sonunda tamamlanan ve tamamlanamayan görevlerin değerlendirilmesi.

### Görev Tamamlanma Kriteri

Bir görev, aşağıdaki Bölüm 8'de tanımlanan Definition of Done kriterlerinin tamamını karşıladığında tamamlanmış sayılır.

## 8. Quality Assurance

Takım olarak tamamlanan işlerin kalitesini aşağıdaki yöntemlerle doğrulayacağız:

- Her kod değişikliği Pull Request aracılığıyla en az bir takım üyesi tarafından incelenecektir.
- Dokümantasyon değişiklikleri de aynı review sürecinden geçecektir.
- Kullanıcıya sunulan özellikler erişilebilirlik açısından kontrol edilecektir.
- Varsayımlara dayanan kararlar, toplanan kanıtlarla karşılaştırılacaktır.

### Definition of Done

A task is considered Done when:

- [x] Görev kapsamındaki çalışma (kod, dokümantasyon veya araştırma) tamamlandı.
- [x] En az bir takım üyesi tarafından review edildi ve onaylandı.
- [x] İlgili dokümantasyon oluşturuldu veya güncellendi.
- [x] Kod içeren görevlerde testler yazıldı ve başarıyla geçti (uygulanabilir olduğunda).
- [x] Erişilebilirlik gereksinimleri kontrol edildi (kullanıcıya yönelik özellikler için).
- [x] GitHub repository'ye commit ve push yapıldı.
- [x] İlgili GitHub Issue kapatıldı ve Kanban board güncellendi.

## 9. Process Evaluation and Improvement

### Süreç Problemlerinin Tespiti

Takım olarak süreç problemlerini aşağıdaki yollarla tespit edeceğiz:

- Her sprint sonunda kısa bir retrospektif toplantısı yaparak nelerin iyi gittiğini, nelerin iyileştirilebileceğini ve hangi engellerin yaşandığını tartışacağız.
- Tamamlanamayan görevlerin nedenlerini analiz edeceğiz.
- Öğretim elemanının haftalık geri bildirimlerini süreç iyileştirme girdisi olarak kullanacağız.

### Gözden Geçirme Sıklığı

İş akışımızı her iki haftada bir (sprint bitiminde) gözden geçireceğiz. Acil bir sorun tespit edildiğinde haftalık toplantılarda da süreç değişikliği kararı alınabilir.

### Yaklaşım Değişikliği Planı

Seçtiğimiz yaklaşımın beklendiği gibi çalışmaması durumunda aşağıdaki adımları uygulayacağız:

1. Sorunu retrospektifte belirleyip kök nedenini analiz edeceğiz.
2. Sprint süresini kısaltma (örneğin 2 haftadan 1 haftaya) veya uzatma seçeneğini değerlendireceğiz.
3. Eğer sprint yapısı takımımıza uymuyorsa tamamen Kanban tabanlı sürekli akış modeline geçmeyi değerlendireceğiz.
4. WIP limitlerini ihtiyaca göre ayarlayacağız.
5. Görev dağılımını yeniden düzenleyeceğiz.

Önemli olan, seçtiğimiz sürecin sabit kalması değil; projenin ihtiyaçlarına göre adapte edilebilmesidir.

## 10. AI Usage Declaration

Bu dokümanın hazırlanmasında yapay zekâ araçları kullanılmıştır.

- **AI Tool:** Claude Opus 4.6
- **Purpose of Use:** Structuring / Reviewing / Copyediting — Doküman yapısının oluşturulması, içeriğin düzenlenmesi ve gözden geçirilmesi amacıyla kullanılmıştır.
- **Human Verification:** Completed — Tüm içerik takım tarafından incelenmiş ve onaylanmıştır.
- **Final Decision Made By:** Team

## 11. Team Decision

Seçilen geliştirme yaklaşımının takım tarafından tartışılıp üzerinde uzlaşıldığını onaylıyoruz.

| Team Member | Agreement |
|-------------|-----------|
| Ege KURNAZ      | Agree |
| Emre YILMAZ     | Agree |
| Fatih ELAGÖZ    | Agree |
| Eyüp Efe COŞKUN | Agree |
