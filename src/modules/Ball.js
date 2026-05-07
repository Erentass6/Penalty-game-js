/* ============================================
   MODULES / Ball.js
   Top nesnesi
   OOP: GameObject'ten KALITIM alır (extends)
   ============================================ */

class Ball extends GameObject {
    constructor() {
        super('ball'); // Üst sınıf (GameObject) constructor'ını çağır
        this._currentDirection = null;
    }

    /**
     * Topu verilen yöne atar (animasyon sınıfı ekler)
     * @param {'left'|'center'|'right'} direction
     */
    shoot(direction) {
        try {
            const validDirections = ['left', 'center', 'right'];
            if (!validDirections.includes(direction)) {
                throw new Error(`Geçersiz atış yönü: ${direction}`);
            }
            this._currentDirection = direction;
            this.addClass(`shoot-${direction}`);
        } catch (e) {
            console.error('[Ball] shoot hatası:', e.message);
        }
    }

    /**
     * Topu başlangıç pozisyonuna sıfırlar
     * Polymorphism: üst sınıfın resetClass metodunu özelleştirir
     */
    reset() {
        this.resetClass('ball');
        this._currentDirection = null;
    }

    get currentDirection() { return this._currentDirection; }
}
