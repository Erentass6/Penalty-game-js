# Gereksinim Analizi - Penaltı Atışı Oyunu

## 1. Proje Bilgileri
- **Proje Adı:** Penaltı Atışı Oyunu
- **Ders:** BGT 132 - Yazılım Geliştirme Teknolojileri
- **Platform:** Web (HTML, CSS, JavaScript)
- **Kategori:** Oyun

---

## 2. Proje Amacı
Kullanıcının tarayıcı üzerinden oynayabileceği, animasyonlu ve sesli bir penaltı atışı oyunu geliştirmek. Kullanıcı sol, orta veya sağ yönlerden birini seçerek şut atar; kaleci rastgele bir yöne dalar; sonuç hesaplanarak skora yansıtılır.

---

## 3. Fonksiyonel Gereksinimler

| ID   | Gereksinim                                                  | Öncelik |
|------|-------------------------------------------------------------|---------|
| FR-1 | Kullanıcı üç yönden (sol/orta/sağ) birini seçerek şut atabilir | Yüksek  |
| FR-2 | Kaleci her atışta rastgele bir yöne dalar                   | Yüksek  |
| FR-3 | Seçilen yön ile kalecinin yönü aynıysa kurtarış, farklıysa gol sayılır | Yüksek  |
| FR-4 | Gol, kurtarış ve toplam atış sayıları ekranda gösterilir    | Yüksek  |
| FR-5 | Gol olduğunda konfeti animasyonu ve gol sesi çalar          | Orta    |
| FR-6 | Kurtarışta ekran sarsıntısı ve kurtarış sesi çalar          | Orta    |
| FR-7 | Sıfırla butonu tüm sayaçları ve ekranı başa alır            | Yüksek  |
| FR-8 | Klavye kısayolları desteklenir (←/A=Sol, ↑/W=Orta, →/D=Sağ, R=Sıfırla) | Düşük   |

---

## 4. Fonksiyonel Olmayan Gereksinimler

| ID    | Gereksinim                                               |
|-------|----------------------------------------------------------|
| NFR-1 | Tüm modern tarayıcılarda çalışmalı (Chrome, Firefox, Edge) |
| NFR-2 | Animasyonlar akıcı olmalı (60fps hedef)                  |
| NFR-3 | Kod modüler yapıda, klasörlere ayrılmış olmalı           |
| NFR-4 | Tüm kritik fonksiyonlarda try-catch ile hata yönetimi   |
| NFR-5 | OOP prensiplerine uyulmalı (kalıtım, polimorfizm, kapsülleme) |

---

## 5. Kullanım Senaryosu (Use Case)

### UC-1: Penaltı At
- **Aktör:** Kullanıcı
- **Ön Koşul:** Sayfa yüklenmiş, butonlar aktif
- **Ana Akış:**
  1. Kullanıcı Sol, Orta veya Sağ butonuna tıklar
  2. Top seçilen yöne doğru animasyonlu hareket eder
  3. Kaleci rastgele bir yöne dalar
  4. Sonuç hesaplanır ve ekranda gösterilir
  5. Skor güncellenir
- **Alternatif Akış:** Kullanıcı klavye kısayolu kullanır
- **Son Koşul:** Skor güncellendi, butonlar yeniden aktif

### UC-2: Oyunu Sıfırla
- **Aktör:** Kullanıcı
- **Ana Akış:**
  1. Kullanıcı Sıfırla butonuna tıklar
  2. Tüm sayaçlar 0'a döner
  3. Sonuç mesajı gizlenir

---

## 6. Sınıf Listesi (OOP)

| Sınıf          | Konum                    | Açıklama                             |
|----------------|--------------------------|--------------------------------------|
| `GameObject`   | src/core/GameObject.js   | Tüm oyun nesnelerinin temel sınıfı   |
| `ScoreManager` | src/core/ScoreManager.js | Skor yönetimi ve DOM güncelleme      |
| `Game`         | src/core/Game.js         | Ana oyun motoru, modülleri koordine eder |
| `Ball`         | src/modules/Ball.js      | Top nesnesi (GameObject'ten türetilir) |
| `Goalkeeper`   | src/modules/Goalkeeper.js| Kaleci nesnesi (GameObject'ten türetilir) |
| `AudioService` | src/services/AudioService.js | Web Audio API ses yönetimi       |
| `UIManager`    | src/ui/UIManager.js      | Kullanıcı arayüzü yönetimi           |
| `ParticleUtils`| src/utils/ParticleUtils.js | Statik yardımcı fonksiyonlar       |
