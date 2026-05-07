/* ============================================
   script.js - Oyun Başlatıcı
   Tüm modüller yüklendikten sonra Game nesnesi
   oluşturulur ve global fonksiyonlar tanımlanır.
   ============================================ */

// Global oyun nesnesi
let game;

document.addEventListener('DOMContentLoaded', () => {
    try {
        game = new Game();
        game.init();
    } catch (e) {
        console.error('[Main] Oyun başlatılamadı:', e.message);
    }
});

/**
 * HTML butonlarından çağrılan global şut fonksiyonu
 * @param {'left'|'center'|'right'} direction
 */
function shoot(direction) {
    try {
        if (!game) throw new Error('Oyun nesnesi hazır değil.');
        game.shoot(direction);
    } catch (e) {
        console.error('[Main] shoot hatası:', e.message);
    }
}

/**
 * HTML butonundan çağrılan global sıfırlama fonksiyonu
 */
function resetGame() {
    try {
        if (!game) throw new Error('Oyun nesnesi hazır değil.');
        game.reset();
    } catch (e) {
        console.error('[Main] resetGame hatası:', e.message);
    }
}
