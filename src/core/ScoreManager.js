/* ============================================
   CORE / ScoreManager.js
   Skor yönetimi sınıfı
   OOP: Encapsulation (private state)
   ============================================ */

class ScoreManager {
    constructor() {
        // Encapsulation: dışarıdan doğrudan erişilemesin
        this._goals = 0;
        this._saves = 0;
        this._total = 0;

        // DOM referansları
        this._goalEl  = null;
        this._saveEl  = null;
        this._totalEl = null;
    }

    /**
     * DOM elementlerini bağlar
     */
    init() {
        try {
            this._goalEl  = document.getElementById('goalCount');
            this._saveEl  = document.getElementById('saveCount');
            this._totalEl = document.getElementById('totalCount');

            if (!this._goalEl || !this._saveEl || !this._totalEl) {
                throw new Error('Skor elementleri bulunamadı!');
            }
        } catch (e) {
            console.error('[ScoreManager] init hatası:', e.message);
        }
    }

    /**
     * Gol veya kurtarışa göre skoru günceller
     * @param {'goal'|'save'} type
     */
    update(type) {
        try {
            this._total++;
            if (type === 'goal') {
                this._goals++;
                this._animateElement(this._goalEl, this._goals);
            } else if (type === 'save') {
                this._saves++;
                this._animateElement(this._saveEl, this._saves);
            } else {
                throw new Error(`Geçersiz skor tipi: ${type}`);
            }
            this._animateElement(this._totalEl, this._total);
        } catch (e) {
            console.error('[ScoreManager] update hatası:', e.message);
        }
    }

    /**
     * Tüm skorları sıfırlar
     */
    reset() {
        this._goals = 0;
        this._saves = 0;
        this._total = 0;

        [this._goalEl, this._saveEl, this._totalEl].forEach(el => {
            if (el) {
                el.textContent = '0';
                this._triggerAnimation(el);
            }
        });
    }

    /**
     * Elementi günceller ve animasyon tetikler
     * @private
     */
    _animateElement(el, value) {
        if (!el) return;
        el.textContent = value;
        this._triggerAnimation(el);
    }

    /**
     * CSS animasyonunu yeniden tetikler
     * @private
     */
    _triggerAnimation(el) {
        el.classList.remove('score-pop');
        void el.offsetWidth; // reflow
        el.classList.add('score-pop');
    }

    // Getter'lar
    get goals() { return this._goals; }
    get saves() { return this._saves; }
    get total() { return this._total; }

    /**
     * Yüzde gol oranı döner
     */
    get goalRate() {
        return this._total === 0 ? 0 : Math.round((this._goals / this._total) * 100);
    }
}
