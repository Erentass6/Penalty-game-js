/* ============================================
   CORE / GameObject.js
   Tüm oyun nesnelerinin temel (base) sınıfı
   OOP: Encapsulation + Kalıtım için temel
   ============================================ */

class GameObject {
    /**
     * @param {string} id - HTML element ID'si
     */
    constructor(id) {
        // Encapsulation: private-like değişkenler
        this._id = id;
        this._element = null;
        this._isActive = false;
    }

    /**
     * DOM elementini yükler
     */
    init() {
        try {
            this._element = document.getElementById(this._id);
            if (!this._element) {
                throw new Error(`Element bulunamadı: #${this._id}`);
            }
            this._isActive = true;
        } catch (e) {
            console.error('[GameObject] init hatası:', e.message);
        }
    }

    /**
     * CSS sınıfı ekler
     * @param {string} className
     */
    addClass(className) {
        try {
            if (!this._element) throw new Error('Element henüz init edilmedi.');
            this._element.classList.add(className);
        } catch (e) {
            console.error('[GameObject] addClass hatası:', e.message);
        }
    }

    /**
     * CSS sınıfı kaldırır
     * @param {string} className
     */
    removeClass(className) {
        try {
            if (!this._element) throw new Error('Element henüz init edilmedi.');
            this._element.classList.remove(className);
        } catch (e) {
            console.error('[GameObject] removeClass hatası:', e.message);
        }
    }

    /**
     * Tüm CSS sınıflarını temel sınıfa sıfırlar
     * @param {string} baseClass - temel CSS sınıfı adı
     */
    resetClass(baseClass) {
        try {
            if (!this._element) throw new Error('Element henüz init edilmedi.');
            this._element.className = baseClass;
        } catch (e) {
            console.error('[GameObject] resetClass hatası:', e.message);
        }
    }

    // Getter'lar (Encapsulation)
    get element() { return this._element; }
    get id() { return this._id; }
    get isActive() { return this._isActive; }
}
