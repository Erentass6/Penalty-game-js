# ⚽ Penaltı Atışı Oyunu

## Proje Adı
Penaltı Atışı Oyunu (Penalty Kick Game)

## Proje Amacı
Tarayıcı tabanlı, animasyonlu ve sesli bir penaltı atışı oyunudur. Kullanıcı sol, orta veya sağ yönlerden birini seçerek şut atar; kaleci rastgele bir yöne dalar; sonuç hesaplanarak skora yansıtılır. Proje, BGT 132 dersi kapsamında OOP prensiplerini uygulayan modüler bir JavaScript oyunudur.

---

## Özellikler
- 🎮 Sol / Orta / Sağ yönlü penaltı atışı
- 🧤 Rastgele dalış yapan animasyonlu kaleci
- 🎵 Web Audio API ile gerçek zamanlı ses efektleri
- 🎊 Gol kutlaması konfeti animasyonu
- 📊 Canlı skor takibi
- ⌨️ Klavye desteği

---

## Kurulum ve Çalıştırma

### Gereksinimler
- Modern bir web tarayıcısı (Chrome, Firefox, Edge, Safari)
- Herhangi bir kurulum gerekmez

### Çalıştırma
1. Projeyi indirin veya klonlayın:
   ```bash
   git clone https://github.com/KULLANICI_ADI/penalti-oyunu.git
   ```
2. `index.html` dosyasını bir web tarayıcısında açın.
   - Doğrudan çift tıklayarak açabilirsiniz
   - Ya da VS Code'da **Live Server** eklentisi ile çalıştırabilirsiniz

### Klavye Kısayolları
| Tuş | İşlev |
|-----|-------|
| ← veya A | Sol'a şut at |
| ↑ veya W | Ortaya şut at |
| → veya D | Sağ'a şut at |
| R | Oyunu sıfırla |

---

## Proje Klasör Yapısı

```
PenaltiOyunu/
├── docs/
│   ├── GereksinimAnalizi.md
│   └── UML_Diyagramlari.md
├── src/
│   ├── core/
│   │   ├── GameObject.js      ← Tüm nesnelerin temel sınıfı
│   │   ├── ScoreManager.js    ← Skor yönetimi
│   │   └── Game.js            ← Ana oyun motoru
│   ├── modules/
│   │   ├── Ball.js            ← Top nesnesi
│   │   └── Goalkeeper.js      ← Kaleci nesnesi
│   ├── services/
│   │   └── AudioService.js    ← Ses yönetimi
│   ├── ui/
│   │   └── UIManager.js       ← Arayüz yönetimi
│   └── utils/
│       └── ParticleUtils.js   ← Yardımcı fonksiyonlar
├── assets/
│   ├── images/
│   ├── sounds/
│   └── icons/
├── data/
│   └── data/
├── tests/
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

---

## OOP Yapısı

- **Kalıtım:** `Ball` ve `Goalkeeper` sınıfları `GameObject`'ten türetilmiştir
- **Polimorfizm:** `Ball.reset()` ve `Goalkeeper.reset()` üst sınıf metodunu override eder
- **Kapsülleme:** Tüm sınıflarda `_` önekli private değişkenler ve getter metodlar kullanılmıştır

---

## Teknolojiler
- HTML5, CSS3, JavaScript (ES6+)
- Web Audio API
- CSS Animations & Transitions

---

## Ders Bilgisi
**BGT 132 - Yazılım Geliştirme Teknolojileri** | Final Projesi
