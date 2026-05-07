/* ============================================
   PENALTI ATIŞI OYUNU - SCRIPT.JS
   Oyun mantığı, animasyonlar ve ses efektleri
   ============================================ */

(() => {
    'use strict';

    const DIRECTIONS = ['left', 'center', 'right'];
    const SHOOT_DELAY_MS = 100;
    const RESULT_DELAY_MS = 650;
    const ROUND_RESET_DELAY_MS = 2200;
    const ZONE_HIGHLIGHT_MS = 1500;

    const gameState = {
        goals: 0,
        saves: 0,
        total: 0,
        isPlaying: false,
    };

    const timers = new Set();
    let elements = {};
    let audioContext = null;

    function setTimer(callback, delay) {
        const timerId = window.setTimeout(() => {
            timers.delete(timerId);
            callback();
        }, delay);
        timers.add(timerId);
        return timerId;
    }

    function clearTimers() {
        timers.forEach((timerId) => window.clearTimeout(timerId));
        timers.clear();
    }

    function getRequiredElements() {
        const ids = [
            'ball',
            'goalkeeper',
            'goalCount',
            'saveCount',
            'totalCount',
            'resultMessage',
            'resultText',
            'fieldArea',
            'gameContainer',
            'confettiContainer',
            'btnLeft',
            'btnCenter',
            'btnRight',
            'btnReset',
            'zoneLeft',
            'zoneCenter',
            'zoneRight',
            'bgParticles',
        ];

        const found = ids.reduce((accumulator, id) => {
            accumulator[id] = document.getElementById(id);
            return accumulator;
        }, {});

        const missing = ids.filter((id) => !found[id]);
        if (missing.length > 0) {
            throw new Error(`Eksik HTML elemanları: ${missing.join(', ')}`);
        }

        return found;
    }

    function initAudio() {
        const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextConstructor) {
            return;
        }

        if (!audioContext) {
            audioContext = new AudioContextConstructor();
        }

        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    function playKickSound() {
        if (!audioContext) return;

        try {
            const now = audioContext.currentTime;
            const bufferSize = audioContext.sampleRate * 0.15;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i += 1) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
            }

            const noiseSource = audioContext.createBufferSource();
            const noiseGain = audioContext.createGain();
            const osc = audioContext.createOscillator();
            const oscGain = audioContext.createGain();

            noiseSource.buffer = buffer;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

            noiseGain.gain.setValueAtTime(0.6, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
            oscGain.gain.setValueAtTime(0.5, now);
            oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

            noiseSource.connect(noiseGain).connect(audioContext.destination);
            osc.connect(oscGain).connect(audioContext.destination);

            noiseSource.start(now);
            osc.start(now);
            noiseSource.stop(now + 0.15);
            osc.stop(now + 0.15);
        } catch (error) {
            console.warn('Ses çalma hatası:', error);
        }
    }

    function playGoalSound() {
        if (!audioContext) return;

        try {
            const now = audioContext.currentTime;
            const notes = [523, 659, 784, 1047];

            notes.forEach((frequency, index) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const startAt = now + index * 0.1;

                osc.type = 'square';
                osc.frequency.value = frequency;
                gain.gain.setValueAtTime(0, startAt);
                gain.gain.linearRampToValueAtTime(0.15, startAt + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, startAt + 0.25);

                osc.connect(gain).connect(audioContext.destination);
                osc.start(startAt);
                osc.stop(startAt + 0.3);
            });

            const ding = audioContext.createOscillator();
            const dingGain = audioContext.createGain();
            ding.type = 'sine';
            ding.frequency.value = 1200;
            dingGain.gain.setValueAtTime(0.2, now + 0.35);
            dingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
            ding.connect(dingGain).connect(audioContext.destination);
            ding.start(now + 0.35);
            ding.stop(now + 0.8);
        } catch (error) {
            console.warn('Ses çalma hatası:', error);
        }
    }

    function playSaveSound() {
        if (!audioContext) return;

        try {
            const now = audioContext.currentTime;
            const tones = [
                { frequency: 180, endFrequency: 100, start: 0, duration: 0.4, volume: 0.2 },
                { frequency: 140, endFrequency: 80, start: 0.15, duration: 0.35, volume: 0.15 },
            ];

            tones.forEach((tone) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                const startAt = now + tone.start;
                const stopAt = startAt + tone.duration;

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(tone.frequency, startAt);
                osc.frequency.linearRampToValueAtTime(tone.endFrequency, stopAt - 0.1);
                gain.gain.setValueAtTime(tone.volume, startAt);
                gain.gain.exponentialRampToValueAtTime(0.01, stopAt);

                osc.connect(gain).connect(audioContext.destination);
                osc.start(startAt);
                osc.stop(stopAt);
            });
        } catch (error) {
            console.warn('Ses çalma hatası:', error);
        }
    }

    function createBackgroundParticles() {
        const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
        const fragment = document.createDocumentFragment();

        elements.bgParticles.replaceChildren();

        for (let i = 0; i < 20; i += 1) {
            const particle = document.createElement('div');
            const size = Math.random() * 6 + 2;

            particle.className = 'particle';
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particle.style.animationDelay = `${-(Math.random() * 20)}s`;
            fragment.appendChild(particle);
        }

        elements.bgParticles.appendChild(fragment);
    }

    function createConfetti() {
        const colors = ['#10b981', '#34d399', '#fbbf24', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444', '#f472b6'];
        const shapes = ['square', 'circle'];

        for (let i = 0; i < 50; i += 1) {
            const confetti = document.createElement('div');
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const size = Math.random() * 8 + 5;
            const duration = Math.random() * 2 + 1.5;
            const delay = Math.random() * 0.5;

            confetti.className = 'confetti-piece';
            confetti.style.width = `${size}px`;
            confetti.style.height = shape === 'circle' ? `${size}px` : `${size * 0.6}px`;
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.borderRadius = shape === 'circle' ? '50%' : '2px';
            confetti.style.animationDuration = `${duration}s`;
            confetti.style.animationDelay = `${delay}s`;

            elements.confettiContainer.appendChild(confetti);
            setTimer(() => confetti.remove(), (duration + delay) * 1000 + 100);
        }
    }

    function setButtonsDisabled(disabled) {
        [elements.btnLeft, elements.btnCenter, elements.btnRight, elements.btnReset].forEach((button) => {
            button.disabled = disabled;
        });
    }

    function animateScore(element) {
        element.classList.remove('score-pop');
        void element.offsetWidth;
        element.classList.add('score-pop');
    }

    function updateScore(type) {
        gameState.total += 1;

        if (type === 'goal') {
            gameState.goals += 1;
            elements.goalCount.textContent = gameState.goals;
            animateScore(elements.goalCount);
        } else {
            gameState.saves += 1;
            elements.saveCount.textContent = gameState.saves;
            animateScore(elements.saveCount);
        }

        elements.totalCount.textContent = gameState.total;
        animateScore(elements.totalCount);
    }

    function showResult(type) {
        elements.resultText.textContent = type === 'goal' ? '⚽ GOOOL!' : '🧤 KURTARILDI!';
        elements.resultText.className = `result-text ${type}`;
        elements.resultMessage.classList.add('show');
    }

    function hideResult() {
        elements.resultMessage.classList.remove('show');
    }

    function highlightZone(direction, type) {
        const zoneMap = {
            left: elements.zoneLeft,
            center: elements.zoneCenter,
            right: elements.zoneRight,
        };
        const zone = zoneMap[direction];
        const className = type === 'goal' ? 'highlight-goal' : 'highlight-save';

        zone.classList.add(className);
        setTimer(() => zone.classList.remove(className), ZONE_HIGHLIGHT_MS);
    }

    function fieldFlash(type) {
        const className = type === 'goal' ? 'goal-flash' : 'save-flash';
        elements.fieldArea.classList.add(className);
        setTimer(() => elements.fieldArea.classList.remove(className), 600);
    }

    function screenShake() {
        elements.gameContainer.classList.add('shake');
        setTimer(() => elements.gameContainer.classList.remove('shake'), 400);
    }

    function resetPositions() {
        elements.ball.className = 'ball';
        elements.goalkeeper.className = 'goalkeeper';
        [elements.zoneLeft, elements.zoneCenter, elements.zoneRight].forEach((zone) => {
            zone.classList.remove('highlight-goal', 'highlight-save');
        });
        elements.fieldArea.classList.remove('goal-flash', 'save-flash');
        elements.gameContainer.classList.remove('shake');
    }

    function shoot(playerDirection) {
        if (gameState.isPlaying || !DIRECTIONS.includes(playerDirection)) return;

        initAudio();
        gameState.isPlaying = true;
        setButtonsDisabled(true);
        hideResult();
        resetPositions();

        const keeperDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        const isGoal = playerDirection !== keeperDirection;

        playKickSound();
        elements.ball.classList.add(`shoot-${playerDirection}`);

        setTimer(() => {
            elements.goalkeeper.classList.add(`dive-${keeperDirection}`);
        }, SHOOT_DELAY_MS);

        setTimer(() => {
            if (isGoal) {
                playGoalSound();
                updateScore('goal');
                showResult('goal');
                highlightZone(playerDirection, 'goal');
                fieldFlash('goal');
                createConfetti();
            } else {
                playSaveSound();
                updateScore('save');
                showResult('save');
                highlightZone(playerDirection, 'save');
                fieldFlash('save');
                screenShake();
            }
        }, RESULT_DELAY_MS);

        setTimer(() => {
            resetPositions();
            gameState.isPlaying = false;
            setButtonsDisabled(false);
        }, ROUND_RESET_DELAY_MS);
    }

    function playResetSound() {
        initAudio();
        if (!audioContext) return;

        try {
            const now = audioContext.currentTime;
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = 800;
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain).connect(audioContext.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch (error) {
            console.warn('Ses hatası:', error);
        }
    }

    function resetGame() {
        clearTimers();
        gameState.goals = 0;
        gameState.saves = 0;
        gameState.total = 0;
        gameState.isPlaying = false;

        elements.goalCount.textContent = '0';
        elements.saveCount.textContent = '0';
        elements.totalCount.textContent = '0';
        elements.confettiContainer.replaceChildren();

        resetPositions();
        hideResult();
        setButtonsDisabled(false);
        [elements.goalCount, elements.saveCount, elements.totalCount].forEach(animateScore);
        playResetSound();
    }

    function handleKeydown(event) {
        const keyMap = {
            ArrowLeft: 'left',
            a: 'left',
            A: 'left',
            ArrowUp: 'center',
            ArrowDown: 'center',
            w: 'center',
            W: 'center',
            s: 'center',
            S: 'center',
            ArrowRight: 'right',
            d: 'right',
            D: 'right',
        };

        if (keyMap[event.key]) {
            event.preventDefault();
            shoot(keyMap[event.key]);
            return;
        }

        if (event.key === 'r' || event.key === 'R') {
            event.preventDefault();
            resetGame();
        }
    }

    function bindEvents() {
        elements.btnLeft.addEventListener('click', () => shoot('left'));
        elements.btnCenter.addEventListener('click', () => shoot('center'));
        elements.btnRight.addEventListener('click', () => shoot('right'));
        elements.btnReset.addEventListener('click', resetGame);
        document.addEventListener('keydown', handleKeydown);
    }

    function initGame() {
        elements = getRequiredElements();
        bindEvents();
        createBackgroundParticles();
        window.shoot = shoot;
        window.resetGame = resetGame;
        window.PenaltyGame = { shoot, resetGame, state: gameState };

        console.log('%c⚽ Penaltı Atışı Oyunu Yüklendi!', 'color: #10b981; font-size: 16px; font-weight: bold;');
        console.log('%cKlavye: ← Sol | ↑/↓ Orta | → Sağ | R Sıfırla', 'color: #94a3b8; font-size: 12px;');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame, { once: true });
    } else {
        initGame();
    }
})();
