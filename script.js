/* ============================================
   PENALTI ATIŞI OYUNU - SCRIPT.JS
   Oyun mantığı, animasyonlar ve ses efektleri
   ============================================ */

// === Oyun Durumu ===
const gameState = {
    goals: 0,       // Gol sayısı
    saves: 0,       // Kurtarış sayısı
    total: 0,       // Toplam atış sayısı
    isPlaying: false // Animasyon devam ediyor mu?
};

// === DOM Elementleri ===
const elements = {
    ball: document.getElementById('ball'),
    goalkeeper: document.getElementById('goalkeeper'),
    goalCount: document.getElementById('goalCount'),
    saveCount: document.getElementById('saveCount'),
    totalCount: document.getElementById('totalCount'),
    resultMessage: document.getElementById('resultMessage'),
    resultText: document.getElementById('resultText'),
    fieldArea: document.getElementById('fieldArea'),
    gameContainer: document.getElementById('gameContainer'),
    confettiContainer: document.getElementById('confettiContainer'),
    btnLeft: document.getElementById('btnLeft'),
    btnCenter: document.getElementById('btnCenter'),
    btnRight: document.getElementById('btnRight'),
    zoneLeft: document.getElementById('zoneLeft'),
    zoneCenter: document.getElementById('zoneCenter'),
    zoneRight: document.getElementById('zoneRight'),
};

// === Yönler ===
const DIRECTIONS = ['left', 'center', 'right'];

// === Web Audio API - Ses Motoru ===
let audioContext = null;

/**
 * AudioContext'i başlatır.
 * Tarayıcı politikaları gereği, ilk kullanıcı etkileşiminden sonra oluşturulmalıdır.
 */
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Eğer suspended durumundaysa resume et
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
}

/**
 * Şut sesi çalar.
 * Kısa, sert bir darbe sesi oluşturur.
 */
function playKickSound() {
    if (!audioContext) return;
    try {
        const now = audioContext.currentTime;

        // Gürültü kaynağı (darbe efekti)
        const bufferSize = audioContext.sampleRate * 0.15;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }
        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = buffer;

        // Düşük frekans darbe
        const osc = audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

        // Gain kontrolleri
        const noiseGain = audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.6, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        const oscGain = audioContext.createGain();
        oscGain.gain.setValueAtTime(0.5, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        // Bağlantılar
        noiseSource.connect(noiseGain);
        osc.connect(oscGain);
        noiseGain.connect(audioContext.destination);
        oscGain.connect(audioContext.destination);

        noiseSource.start(now);
        osc.start(now);
        noiseSource.stop(now + 0.15);
        osc.stop(now + 0.15);
    } catch (e) {
        console.warn('Ses çalma hatası:', e);
    }
}

/**
 * Gol sesi çalar.
 * Yükselen, neşeli bir melodi oluşturur.
 */
function playGoalSound() {
    if (!audioContext) return;
    try {
        const now = audioContext.currentTime;
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.25);

            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
        });

        // Ek: Parlak "ding" efekti
        const ding = audioContext.createOscillator();
        const dingGain = audioContext.createGain();
        ding.type = 'sine';
        ding.frequency.value = 1200;
        dingGain.gain.setValueAtTime(0.2, now + 0.35);
        dingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        ding.connect(dingGain);
        dingGain.connect(audioContext.destination);
        ding.start(now + 0.35);
        ding.stop(now + 0.8);
    } catch (e) {
        console.warn('Ses çalma hatası:', e);
    }
}

/**
 * Kurtarış sesi çalar.
 * Düşük, buzzer benzeri bir ses oluşturur.
 */
function playSaveSound() {
    if (!audioContext) return;
    try {
        const now = audioContext.currentTime;

        // Düşük buzzer
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(180, now);
        osc1.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        osc1.start(now);
        osc1.stop(now + 0.4);

        // İkinci buzzer (düşük)
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(140, now + 0.15);
        osc2.frequency.linearRampToValueAtTime(80, now + 0.45);
        gain2.gain.setValueAtTime(0.15, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.5);
    } catch (e) {
        console.warn('Ses çalma hatası:', e);
    }
}

// === Arka Plan Parçacıkları ===
/**
 * Arka planda süzülen dekoratif parçacıklar oluşturur.
 */
function createBackgroundParticles() {
    const container = document.getElementById('bgParticles');
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 6 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = -(Math.random() * 20) + 's';

        container.appendChild(particle);
    }
}

// === Konfeti Efekti ===
/**
 * Gol kutlaması için konfeti parçacıkları oluşturur.
 */
function createConfetti() {
    const container = elements.confettiContainer;
    const colors = ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#f472b6'];
    const shapes = ['square', 'circle'];
    const count = 50;

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti-piece');

        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const size = Math.random() * 8 + 5;
        const left = Math.random() * 100;
        const duration = Math.random() * 2 + 1.5;
        const delay = Math.random() * 0.5;

        confetti.style.width = size + 'px';
        confetti.style.height = shape === 'circle' ? size + 'px' : size * 0.6 + 'px';
        confetti.style.background = color;
        confetti.style.left = left + '%';
        confetti.style.borderRadius = shape === 'circle' ? '50%' : '2px';
        confetti.style.animationDuration = duration + 's';
        confetti.style.animationDelay = delay + 's';

        container.appendChild(confetti);

        // Animasyon bittikten sonra kaldır
        setTimeout(() => {
            confetti.remove();
        }, (duration + delay) * 1000 + 100);
    }
}

// === Butonları Devre Dışı Bırak / Aktifleştir ===
/**
 * Atış butonlarını devre dışı bırakır veya aktifleştirir.
 * @param {boolean} disabled - true ise butonlar devre dışı kalır
 */
function setButtonsDisabled(disabled) {
    elements.btnLeft.disabled = disabled;
    elements.btnCenter.disabled = disabled;
    elements.btnRight.disabled = disabled;
}

// === Skor Güncelleme ===
/**
 * Skor tablosunu günceller ve animasyonlu gösterir.
 * @param {string} type - 'goal' veya 'save'
 */
function updateScore(type) {
    gameState.total++;

    if (type === 'goal') {
        gameState.goals++;
        // Gol sayısı animasyonu
        elements.goalCount.textContent = gameState.goals;
        elements.goalCount.classList.remove('score-pop');
        void elements.goalCount.offsetWidth; // reflow tetikle
        elements.goalCount.classList.add('score-pop');
    } else {
        gameState.saves++;
        // Kurtarış sayısı animasyonu
        elements.saveCount.textContent = gameState.saves;
        elements.saveCount.classList.remove('score-pop');
        void elements.saveCount.offsetWidth;
        elements.saveCount.classList.add('score-pop');
    }

    // Toplam güncelle
    elements.totalCount.textContent = gameState.total;
    elements.totalCount.classList.remove('score-pop');
    void elements.totalCount.offsetWidth;
    elements.totalCount.classList.add('score-pop');
}

// === Sonuç Mesajı Göster ===
/**
 * Sonuç mesajını (Gol/Kurtarış) ekranda gösterir.
 * @param {string} type - 'goal' veya 'save'
 */
function showResult(type) {
    const resultText = elements.resultText;

    if (type === 'goal') {
        resultText.textContent = '⚽ GOOOL!';
        resultText.className = 'result-text goal';
    } else {
        resultText.textContent = '🧤 KURTARILDI!';
        resultText.className = 'result-text save';
    }

    elements.resultMessage.classList.add('show');
}

// === Sonuç Mesajını Gizle ===
function hideResult() {
    elements.resultMessage.classList.remove('show');
}

// === Kale Bölgesi Highlight ===
/**
 * Topun gittiği kale bölgesini vurgular.
 * @param {string} direction - 'left', 'center' veya 'right'
 * @param {string} type - 'goal' veya 'save'
 */
function highlightZone(direction, type) {
    const zoneMap = {
        left: elements.zoneLeft,
        center: elements.zoneCenter,
        right: elements.zoneRight,
    };

    const zone = zoneMap[direction];
    const className = type === 'goal' ? 'highlight-goal' : 'highlight-save';
    zone.classList.add(className);

    // 1.5 saniye sonra kaldır
    setTimeout(() => {
        zone.classList.remove(className);
    }, 1500);
}

// === Saha Flash Efekti ===
/**
 * Saha alanında gol veya kurtarış flash efekti gösterir.
 * @param {string} type - 'goal' veya 'save'
 */
function fieldFlash(type) {
    const className = type === 'goal' ? 'goal-flash' : 'save-flash';
    elements.fieldArea.classList.add(className);

    setTimeout(() => {
        elements.fieldArea.classList.remove(className);
    }, 600);
}

// === Ekran Sarsıntısı ===
/**
 * Kurtarış durumunda hafif ekran sarsıntısı efekti uygular.
 */
function screenShake() {
    elements.gameContainer.classList.add('shake');
    setTimeout(() => {
        elements.gameContainer.classList.remove('shake');
    }, 400);
}

// === Pozisyonları Sıfırla ===
/**
 * Top ve kaleci pozisyonlarını başlangıç konumuna getirir.
 */
function resetPositions() {
    // Top animasyon sınıflarını temizle
    elements.ball.className = 'ball';

    // Kaleci animasyon sınıflarını temizle
    elements.goalkeeper.className = 'goalkeeper';
}

// === ANA ŞUT FONKSİYONU ===
/**
 * Kullanıcının seçtiği yöne top atar.
 * Kaleci rastgele bir yöne dalar.
 * Sonucu değerlendirir ve uygun animasyon/ses oynatır.
 * @param {string} playerDirection - 'left', 'center' veya 'right'
 */
function shoot(playerDirection) {
    // Eğer animasyon devam ediyorsa çık
    if (gameState.isPlaying) return;

    // Ses motorunu başlat (ilk tıklamada)
    initAudio();

    // Oyun durumunu güncelle
    gameState.isPlaying = true;

    // Butonları devre dışı bırak
    setButtonsDisabled(true);

    // Önceki sonucu gizle
    hideResult();

    // Pozisyonları sıfırla (önceki animasyonlardan)
    resetPositions();

    // Kalecinin rastgele yönünü belirle
    const keeperDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];

    // Sonucu belirle: Aynı yön = kurtarışı, farklı yön = gol
    const isGoal = playerDirection !== keeperDirection;

    // 1. AŞAMA: Şut sesi ve top animasyonu (hemen)
    playKickSound();
    elements.ball.classList.add(`shoot-${playerDirection}`);

    // 2. AŞAMA: Kaleci dalışı (toptan biraz sonra)
    setTimeout(() => {
        elements.goalkeeper.classList.add(`dive-${keeperDirection}`);
    }, 100);

    // 3. AŞAMA: Sonuç (animasyondan sonra)
    setTimeout(() => {
        if (isGoal) {
            // === GOL ===
            playGoalSound();
            updateScore('goal');
            showResult('goal');
            highlightZone(playerDirection, 'goal');
            fieldFlash('goal');
            createConfetti();
        } else {
            // === KURTARIŞ ===
            playSaveSound();
            updateScore('save');
            showResult('save');
            highlightZone(playerDirection, 'save');
            fieldFlash('save');
            screenShake();
        }
    }, 650);

    // 4. AŞAMA: Pozisyonları sıfırla ve butonları aktifleştir
    setTimeout(() => {
        resetPositions();
        setButtonsDisabled(false);
        gameState.isPlaying = false;
    }, 2200);
}

// === OYUNU SIFIRLA ===
/**
 * Oyun skorunu ve tüm görsel durumları sıfırlar.
 */
function resetGame() {
    // Eğer animasyon devam ediyorsa çık
    if (gameState.isPlaying) return;

    // Skorları sıfırla
    gameState.goals = 0;
    gameState.saves = 0;
    gameState.total = 0;

    // UI güncelle
    elements.goalCount.textContent = '0';
    elements.saveCount.textContent = '0';
    elements.totalCount.textContent = '0';

    // Pozisyonları sıfırla
    resetPositions();

    // Sonuç mesajını gizle
    hideResult();

    // Skor animasyonu
    [elements.goalCount, elements.saveCount, elements.totalCount].forEach(el => {
        el.classList.remove('score-pop');
        void el.offsetWidth;
        el.classList.add('score-pop');
    });

    // Reset ses efekti (kısa tık)
    initAudio();
    if (audioContext) {
        try {
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.value = 800;
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {
            console.warn('Ses hatası:', e);
        }
    }
}

// === Klavye Desteği ===
/**
 * Klavye kısayollarıyla oyunu kontrol eder.
 * Sol ok / A = Sol
 * Yukarı ok / W / S = Orta
 * Sağ ok / D = Sağ
 * R = Sıfırla
 */
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            shoot('left');
            break;
        case 'ArrowUp':
        case 'ArrowDown':
        case 'w':
        case 'W':
        case 's':
        case 'S':
            shoot('center');
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            shoot('right');
            break;
        case 'r':
        case 'R':
            resetGame();
            break;
    }
});

// === Başlangıç ===
/**
 * Sayfa yüklendiğinde başlangıç ayarlarını yapar.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Arka plan parçacıklarını oluştur
    createBackgroundParticles();

    // İlk yükleme mesajı (konsol)
    console.log('%c⚽ Penaltı Atışı Oyunu Yüklendi!', 'color: #10b981; font-size: 16px; font-weight: bold;');
    console.log('%cKlavye: ← Sol | ↑ Orta | → Sağ | R Sıfırla', 'color: #94a3b8; font-size: 12px;');
});
