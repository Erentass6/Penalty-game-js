/* ============================================
   SERVICES / AudioService.js
   Web Audio API ile ses yönetimi servisi
   OOP: Bağımsız servis sınıfı (Encapsulation)
   ============================================ */

class AudioService {
    constructor() {
        this._context = null;
    }

    /**
     * AudioContext'i başlatır (ilk kullanıcı etkileşiminde)
     */
    init() {
        try {
            if (!this._context) {
                this._context = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this._context.state === 'suspended') {
                this._context.resume();
            }
        } catch (e) {
            console.warn('[AudioService] Ses başlatılamadı:', e.message);
        }
    }

    /**
     * Şut (top vurma) sesi çalar
     */
    playKick() {
        if (!this._context) return;
        try {
            const now = this._context.currentTime;
            const bufferSize = this._context.sampleRate * 0.15;
            const buffer = this._context.createBuffer(1, bufferSize, this._context.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
            }
            const source = this._context.createBufferSource();
            source.buffer = buffer;

            const osc = this._context.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

            const noiseGain = this._context.createGain();
            noiseGain.gain.setValueAtTime(0.6, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

            const oscGain = this._context.createGain();
            oscGain.gain.setValueAtTime(0.5, now);
            oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

            source.connect(noiseGain);
            osc.connect(oscGain);
            noiseGain.connect(this._context.destination);
            oscGain.connect(this._context.destination);

            source.start(now);
            osc.start(now);
            source.stop(now + 0.15);
            osc.stop(now + 0.15);
        } catch (e) {
            console.warn('[AudioService] playKick hatası:', e.message);
        }
    }

    /**
     * Gol sesi çalar
     */
    playGoal() {
        if (!this._context) return;
        try {
            const now = this._context.currentTime;
            const notes = [523, 659, 784, 1047];

            notes.forEach((freq, i) => {
                const osc = this._context.createOscillator();
                const gain = this._context.createGain();
                osc.type = 'square';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0, now + i * 0.1);
                gain.gain.linearRampToValueAtTime(0.15, now + i * 0.1 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.25);
                osc.connect(gain);
                gain.connect(this._context.destination);
                osc.start(now + i * 0.1);
                osc.stop(now + i * 0.1 + 0.3);
            });

            const ding = this._context.createOscillator();
            const dingGain = this._context.createGain();
            ding.type = 'sine';
            ding.frequency.value = 1200;
            dingGain.gain.setValueAtTime(0.2, now + 0.35);
            dingGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
            ding.connect(dingGain);
            dingGain.connect(this._context.destination);
            ding.start(now + 0.35);
            ding.stop(now + 0.8);
        } catch (e) {
            console.warn('[AudioService] playGoal hatası:', e.message);
        }
    }

    /**
     * Kurtarış sesi çalar
     */
    playSave() {
        if (!this._context) return;
        try {
            const now = this._context.currentTime;

            const osc1 = this._context.createOscillator();
            const gain1 = this._context.createGain();
            osc1.type = 'sawtooth';
            osc1.frequency.setValueAtTime(180, now);
            osc1.frequency.linearRampToValueAtTime(100, now + 0.3);
            gain1.gain.setValueAtTime(0.2, now);
            gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc1.connect(gain1);
            gain1.connect(this._context.destination);
            osc1.start(now);
            osc1.stop(now + 0.4);

            const osc2 = this._context.createOscillator();
            const gain2 = this._context.createGain();
            osc2.type = 'sawtooth';
            osc2.frequency.setValueAtTime(140, now + 0.15);
            osc2.frequency.linearRampToValueAtTime(80, now + 0.45);
            gain2.gain.setValueAtTime(0.15, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
            osc2.connect(gain2);
            gain2.connect(this._context.destination);
            osc2.start(now + 0.15);
            osc2.stop(now + 0.5);
        } catch (e) {
            console.warn('[AudioService] playSave hatası:', e.message);
        }
    }

    /**
     * Kısa tık sesi çalar (sıfırlama için)
     */
    playReset() {
        if (!this._context) return;
        try {
            const now = this._context.currentTime;
            const osc = this._context.createOscillator();
            const gain = this._context.createGain();
            osc.type = 'sine';
            osc.frequency.value = 800;
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.connect(gain);
            gain.connect(this._context.destination);
            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {
            console.warn('[AudioService] playReset hatası:', e.message);
        }
    }
}
