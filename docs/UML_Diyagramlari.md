# UML Diyagramları - Penaltı Atışı Oyunu

## 1. Use Case Diyagramı

```
        ┌─────────────────────────────────────────┐
        │           Penaltı Atışı Sistemi          │
        │                                         │
        │   ┌──────────────────┐                  │
        │   │  Penaltı At      │                  │
        │   └──────────────────┘                  │
        │            ▲                            │
        │            │  <<include>>               │
        │   ┌──────────────────┐                  │
        │   │  Sonucu Hesapla  │                  │
        │   └──────────────────┘                  │
        │            ▲                            │
        │            │  <<include>>               │
        │   ┌──────────────────┐                  │
        │   │  Skoru Güncelle  │                  │
        │   └──────────────────┘                  │
        │                                         │
        │   ┌──────────────────┐                  │
        │   │  Oyunu Sıfırla   │                  │
        │   └──────────────────┘                  │
        └─────────────────────────────────────────┘
               ▲                    ▲
          [Kullanıcı]          [Klavye Kısayolu]
```

---

## 2. Class Diyagramı

```
┌─────────────────────────────────┐
│          GameObject             │
├─────────────────────────────────┤
│ - _id: string                   │
│ - _element: HTMLElement         │
│ - _isActive: boolean            │
├─────────────────────────────────┤
│ + init(): void                  │
│ + addClass(className): void     │
│ + removeClass(className): void  │
│ + resetClass(baseClass): void   │
│ + get element()                 │
│ + get id()                      │
└────────────┬────────────────────┘
             │ extends
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────┐   ┌─────────────────┐
│   Ball   │   │   Goalkeeper    │
├──────────┤   ├─────────────────┤
│ _current │   │ _diveDirection  │
│ Direction│   ├─────────────────┤
├──────────┤   │ + dive(): string│
│ +shoot() │   │ + didSave(): bool│
│ +reset() │   │ + reset(): void │
└──────────┘   └─────────────────┘

┌───────────────────────────────────┐
│              Game                 │
├───────────────────────────────────┤
│ - _ball: Ball                     │
│ - _goalkeeper: Goalkeeper         │
│ - _score: ScoreManager            │
│ - _audio: AudioService            │
│ - _ui: UIManager                  │
│ - _isPlaying: boolean             │
├───────────────────────────────────┤
│ + init(): void                    │
│ + shoot(direction): void          │
│ + reset(): void                   │
│ - _setupKeyboard(): void          │
└───────────────────────────────────┘

┌─────────────────────┐   ┌──────────────────────┐
│    ScoreManager     │   │     AudioService     │
├─────────────────────┤   ├──────────────────────┤
│ - _goals: number    │   │ - _context: Audio    │
│ - _saves: number    │   │   Context            │
│ - _total: number    │   ├──────────────────────┤
├─────────────────────┤   │ + init(): void       │
│ + init(): void      │   │ + playKick(): void   │
│ + update(type): void│   │ + playGoal(): void   │
│ + reset(): void     │   │ + playSave(): void   │
│ + get goalRate()    │   │ + playReset(): void  │
└─────────────────────┘   └──────────────────────┘

┌──────────────────────────┐   ┌────────────────────┐
│       UIManager          │   │   ParticleUtils    │
├──────────────────────────┤   ├────────────────────┤
│ - _buttons: object       │   │ (statik sınıf)     │
│ - _zones: object         │   ├────────────────────┤
│ - _resultMessage: el     │   │ +static create     │
├──────────────────────────┤   │  Background        │
│ + init(): void           │   │  Particles()       │
│ + setButtonsDisabled()   │   │ +static randomInt()│
│ + showResult(type): void │   └────────────────────┘
│ + hideResult(): void     │
│ + highlightZone(): void  │
│ + fieldFlash(): void     │
│ + screenShake(): void    │
│ + createConfetti(): void │
└──────────────────────────┘
```

---

## 3. OOP İlkeleri Uygulaması

| İlke           | Nerede uygulandı                                                        |
|----------------|-------------------------------------------------------------------------|
| **Kalıtım**    | `Ball` ve `Goalkeeper`, `GameObject`'ten `extends` ile türetildi        |
| **Polimorfizm**| `Ball.reset()` ve `Goalkeeper.reset()` üst sınıfın metodunu override eder |
| **Kapsülleme** | Tüm sınıflarda `_` önekli private değişkenler, getter metodlar          |
| **Soyutlama**  | `GameObject` temel sınıfı ortak davranışları soyutlar                   |
