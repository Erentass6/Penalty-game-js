/* ============================================
   CORE / Game.js
   Ana Oyun Motoru
   Tüm modülleri (Ball, Goalkeeper, ScoreManager,
   AudioService, UIManager) koordine eder.
   OOP: Composition (has-a ilişkisi)
   ============================================ */

class Game {
    constructor() {
        // Encapsulation: oyun nesneleri private-like
        this._ball       = new Ball();
        this._goalkeeper = new Goalkeeper();
        this._score      = new ScoreManager();
        this._audio      = new AudioService();
        this._ui         = new UIManager();

        this._isPlaying  = false;
        this._DIRECTIONS = ['left', 'center', 'right'];
    }

    /**
     * Oyunu başlatır, tüm modülleri init eder
     */
    init() {
        try {
            this._ball.init();
            this._goalkeeper.init();
            this._score.init();
            this._ui.init();

            // Arka plan parçacıklarını oluştur
            ParticleUtils.createBackgroundParticles();

            // Klavye desteği
            this._setupKeyboard();

            console.log('%c⚽ Penaltı Atışı Oyunu Yüklendi!', 'color:#10b981;font-size:16px;font-weight:bold;');
            console.log('%cKlavye: ← Sol | ↑ Orta | → Sağ | R Sıfırla', 'color:#94a3b8;font-size:12px;');
        } catch (e) {
            console.error('[Game] init hatası:', e.message);
        }
    }

    /**
     * Kullanıcı yönünü alır, şut atar ve sonucu değerlendirir
     * @param {'left'|'center'|'right'} playerDirection
     */
    shoot(playerDirection) {
        // Animasyon devam ediyorsa çık
        if (this._isPlaying) return;

        try {
            // Ses motorunu başlat
            this._audio.init();

            this._isPlaying = true;
            this._ui.setButtonsDisabled(true);
            this._ui.hideResult();

            // Önceki animasyonları sıfırla
            this._ball.reset();
            this._goalkeeper.reset();

            // === AŞAMA 1: Şut sesi + top animasyonu ===
            this._audio.playKick();
            this._ball.shoot(playerDirection);

            // === AŞAMA 2: Kaleci dalışı (100ms sonra) ===
            setTimeout(() => {
                this._goalkeeper.dive();
            }, 100);

            // === AŞAMA 3: Sonuç (650ms sonra) ===
            setTimeout(() => {
                const isGoal = !this._goalkeeper.didSave(playerDirection);
                const resultType = isGoal ? 'goal' : 'save';

                if (isGoal) {
                    this._audio.playGoal();
                    this._ui.createConfetti();
                } else {
                    this._audio.playSave();
                    this._ui.screenShake();
                }

                this._score.update(resultType);
                this._ui.showResult(resultType);
                this._ui.highlightZone(playerDirection, resultType);
                this._ui.fieldFlash(resultType);
            }, 650);

            // === AŞAMA 4: Sıfırla ve aktifleştir (2200ms sonra) ===
            setTimeout(() => {
                this._ball.reset();
                this._goalkeeper.reset();
                this._ui.setButtonsDisabled(false);
                this._isPlaying = false;
            }, 2200);

        } catch (e) {
            console.error('[Game] shoot hatası:', e.message);
            // Hata durumunda oyunu kilitleme
            this._isPlaying = false;
            this._ui.setButtonsDisabled(false);
        }
    }

    /**
     * Oyunu sıfırlar
     */
    reset() {
        if (this._isPlaying) return;
        try {
            this._score.reset();
            this._ball.reset();
            this._goalkeeper.reset();
            this._ui.hideResult();
            this._audio.init();
            this._audio.playReset();
        } catch (e) {
            console.error('[Game] reset hatası:', e.message);
        }
    }

    /**
     * Klavye kısayollarını ayarlar
     * @private
     */
    _setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowLeft':  case 'a': case 'A': this.shoot('left');   break;
                case 'ArrowUp':   case 'ArrowDown':
                case 'w': case 'W': case 's': case 'S': this.shoot('center'); break;
                case 'ArrowRight': case 'd': case 'D': this.shoot('right');  break;
                case 'r': case 'R': this.reset(); break;
            }
        });
    }

    get isPlaying() { return this._isPlaying; }
}
