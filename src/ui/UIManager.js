/* ============================================
   UI / UIManager.js
   Kullanıcı arayüzü yönetimi
   OOP: Bağımsız UI servisi (Encapsulation)
   ============================================ */

class UIManager {
    constructor() {
        this._buttons = {};
        this._zones   = {};
        this._resultMessage = null;
        this._resultText    = null;
        this._fieldArea     = null;
        this._gameContainer = null;
        this._confettiContainer = null;
    }

    /**
     * Tüm UI elementlerini başlatır
     */
    init() {
        try {
            this._buttons = {
                left:   document.getElementById('btnLeft'),
                center: document.getElementById('btnCenter'),
                right:  document.getElementById('btnRight'),
                reset:  document.getElementById('btnReset'),
            };
            this._zones = {
                left:   document.getElementById('zoneLeft'),
                center: document.getElementById('zoneCenter'),
                right:  document.getElementById('zoneRight'),
            };
            this._resultMessage     = document.getElementById('resultMessage');
            this._resultText        = document.getElementById('resultText');
            this._fieldArea         = document.getElementById('fieldArea');
            this._gameContainer     = document.getElementById('gameContainer');
            this._confettiContainer = document.getElementById('confettiContainer');

            // Kontrol et
            Object.entries(this._buttons).forEach(([key, el]) => {
                if (!el) throw new Error(`Buton bulunamadı: ${key}`);
            });
        } catch (e) {
            console.error('[UIManager] init hatası:', e.message);
        }
    }

    /**
     * Atış butonlarını etkinleştirir veya devre dışı bırakır
     * @param {boolean} disabled
     */
    setButtonsDisabled(disabled) {
        try {
            ['left', 'center', 'right'].forEach(dir => {
                const btn = this._buttons[dir];
                if (!btn) throw new Error(`Buton yok: ${dir}`);
                btn.disabled = disabled;
            });
        } catch (e) {
            console.error('[UIManager] setButtonsDisabled hatası:', e.message);
        }
    }

    /**
     * Sonuç mesajını gösterir
     * @param {'goal'|'save'} type
     */
    showResult(type) {
        try {
            if (!this._resultText || !this._resultMessage) {
                throw new Error('Sonuç elementleri bulunamadı.');
            }
            if (type === 'goal') {
                this._resultText.textContent = '⚽ GOOOL!';
                this._resultText.className = 'result-text goal';
            } else if (type === 'save') {
                this._resultText.textContent = '🧤 KURTARILDI!';
                this._resultText.className = 'result-text save';
            } else {
                throw new Error(`Geçersiz sonuç tipi: ${type}`);
            }
            this._resultMessage.classList.add('show');
        } catch (e) {
            console.error('[UIManager] showResult hatası:', e.message);
        }
    }

    /**
     * Sonuç mesajını gizler
     */
    hideResult() {
        if (this._resultMessage) {
            this._resultMessage.classList.remove('show');
        }
    }

    /**
     * Kale bölgesini vurgular
     * @param {'left'|'center'|'right'} direction
     * @param {'goal'|'save'} type
     */
    highlightZone(direction, type) {
        try {
            const zone = this._zones[direction];
            if (!zone) throw new Error(`Zone bulunamadı: ${direction}`);
            const cls = type === 'goal' ? 'highlight-goal' : 'highlight-save';
            zone.classList.add(cls);
            setTimeout(() => zone.classList.remove(cls), 1500);
        } catch (e) {
            console.error('[UIManager] highlightZone hatası:', e.message);
        }
    }

    /**
     * Saha flash animasyonu
     * @param {'goal'|'save'} type
     */
    fieldFlash(type) {
        try {
            if (!this._fieldArea) throw new Error('fieldArea bulunamadı.');
            const cls = type === 'goal' ? 'goal-flash' : 'save-flash';
            this._fieldArea.classList.add(cls);
            setTimeout(() => this._fieldArea.classList.remove(cls), 600);
        } catch (e) {
            console.error('[UIManager] fieldFlash hatası:', e.message);
        }
    }

    /**
     * Ekran sarsıntısı efekti
     */
    screenShake() {
        try {
            if (!this._gameContainer) throw new Error('gameContainer bulunamadı.');
            this._gameContainer.classList.add('shake');
            setTimeout(() => this._gameContainer.classList.remove('shake'), 400);
        } catch (e) {
            console.error('[UIManager] screenShake hatası:', e.message);
        }
    }

    /**
     * Konfeti efekti oluşturur
     */
    createConfetti() {
        try {
            if (!this._confettiContainer) throw new Error('confettiContainer bulunamadı.');
            const colors = ['#10b981','#34d399','#fbbf24','#f59e0b','#3b82f6','#8b5cf6','#ef4444','#f472b6'];
            const shapes = ['square', 'circle'];

            for (let i = 0; i < 50; i++) {
                const el = document.createElement('div');
                el.classList.add('confetti-piece');
                const color    = colors[Math.floor(Math.random() * colors.length)];
                const shape    = shapes[Math.floor(Math.random() * shapes.length)];
                const size     = Math.random() * 8 + 5;
                const duration = Math.random() * 2 + 1.5;
                const delay    = Math.random() * 0.5;

                el.style.cssText = `
                    width:${size}px;
                    height:${shape==='circle'?size:size*0.6}px;
                    background:${color};
                    left:${Math.random()*100}%;
                    border-radius:${shape==='circle'?'50%':'2px'};
                    animation-duration:${duration}s;
                    animation-delay:${delay}s;
                `;
                this._confettiContainer.appendChild(el);
                setTimeout(() => el.remove(), (duration + delay) * 1000 + 100);
            }
        } catch (e) {
            console.error('[UIManager] createConfetti hatası:', e.message);
        }
    }
}
