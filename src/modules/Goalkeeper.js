/* ============================================
   MODULES / Goalkeeper.js
   Kaleci nesnesi
   OOP: GameObject'ten KALITIM alır (extends)
   Polymorphism: reset() metodu override edildi
   ============================================ */

class Goalkeeper extends GameObject {
    constructor() {
        super('goalkeeper');
        this._diveDirection = null;
    }

    /**
     * Kaleciye rastgele bir yöne dalış yaptırır
     * @returns {'left'|'center'|'right'} seçilen yön
     */
    dive() {
        try {
            const directions = ['left', 'center', 'right'];
            const direction = directions[Math.floor(Math.random() * directions.length)];
            this._diveDirection = direction;
            this.addClass(`dive-${direction}`);
            return direction;
        } catch (e) {
            console.error('[Goalkeeper] dive hatası:', e.message);
            return 'center'; // fallback
        }
    }

    /**
     * Kalecinin belirli bir yöne dalıp dalmaadığını kontrol eder
     * @param {'left'|'center'|'right'} playerDirection
     * @returns {boolean} kurtarış yaptı mı?
     */
    didSave(playerDirection) {
        return this._diveDirection === playerDirection;
    }

    /**
     * Kaleci pozisyonunu sıfırlar
     * Polymorphism: üst sınıfın resetClass metodunu override eder
     */
    reset() {
        this.resetClass('goalkeeper');
        this._diveDirection = null;
    }

    get diveDirection() { return this._diveDirection; }
}
