/* ============================================
   UTILS / ParticleUtils.js
   Arka plan parçacıkları yardımcı fonksiyonu
   OOP: Utility fonksiyonları (static metodlar)
   ============================================ */

class ParticleUtils {
    /**
     * Arka planda yüzen dekoratif parçacıklar oluşturur
     * @param {string} containerId - hedef container HTML ID'si
     * @param {number} count - oluşturulacak parçacık sayısı
     */
    static createBackgroundParticles(containerId = 'bgParticles', count = 20) {
        try {
            const container = document.getElementById(containerId);
            if (!container) throw new Error(`Parçacık konteyneri bulunamadı: #${containerId}`);

            const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

            for (let i = 0; i < count; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');

                const size  = Math.random() * 6 + 2;
                const color = colors[Math.floor(Math.random() * colors.length)];

                particle.style.cssText = `
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    left: ${Math.random() * 100}%;
                    animation-duration: ${Math.random() * 15 + 10}s;
                    animation-delay: ${-(Math.random() * 20)}s;
                `;
                container.appendChild(particle);
            }
        } catch (e) {
            console.error('[ParticleUtils] createBackgroundParticles hatası:', e.message);
        }
    }

    /**
     * Rastgele tam sayı üretir (min dahil, max hariç)
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
