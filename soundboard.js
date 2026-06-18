(function () {
    const WILHELM_URL = 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Wilhelm_Scream.ogg';
    let audioCtx = null;

    function ctx() {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        return audioCtx;
    }

    // ── Sounds ──────────────────────────────────────────────

    function playWilhelm() {
        const a = new Audio(WILHELM_URL);
        a.volume = 0.7;
        return a.play();
    }

    function playAwooga() {
        const c = ctx();
        const t = c.currentTime;

        // Two oscillators for a richer horn timbre
        [1, 0.5].forEach(function (amp, i) {
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(190 * (i + 1), t);
            osc.frequency.linearRampToValueAtTime(390 * (i + 1), t + 0.38);
            osc.frequency.linearRampToValueAtTime(230 * (i + 1), t + 0.85);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(amp * 0.45, t + 0.06);
            gain.gain.setValueAtTime(amp * 0.45, t + 0.75);
            gain.gain.linearRampToValueAtTime(0, t + 0.95);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(t);
            osc.stop(t + 1);
        });
    }

    function playFart() {
        const c = ctx();
        const t = c.currentTime;
        const dur = 0.3 + Math.random() * 0.35;
        const sr = c.sampleRate;

        const buf = c.createBuffer(1, Math.floor(sr * dur), sr);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const src = c.createBufferSource();
        src.buffer = buf;

        const lpf = c.createBiquadFilter();
        lpf.type = 'lowpass';
        lpf.frequency.setValueAtTime(420, t);
        lpf.frequency.linearRampToValueAtTime(60, t + dur);

        const gain = c.createGain();
        gain.gain.setValueAtTime(1.0, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + dur);

        src.connect(lpf);
        lpf.connect(gain);
        gain.connect(c.destination);
        src.start(t);
        src.stop(t + dur + 0.05);
    }

    // ── Page-load scream ─────────────────────────────────────

    function attemptScream() {
        playWilhelm().catch(function () {
            // Autoplay blocked — fire on first click anywhere
            document.addEventListener('click', function onFirst() {
                playWilhelm().catch(function () {});
                document.removeEventListener('click', onFirst);
            }, { once: true });
        });
    }

    if (document.readyState === 'complete') {
        attemptScream();
    } else {
        window.addEventListener('load', attemptScream);
    }

    // ── Soundboard buttons ───────────────────────────────────

    document.getElementById('btn-wilhelm').addEventListener('click', function () {
        playWilhelm().catch(function () {});
    });
    document.getElementById('btn-awooga').addEventListener('click', playAwooga);
    document.getElementById('btn-fart').addEventListener('click', playFart);
})();
