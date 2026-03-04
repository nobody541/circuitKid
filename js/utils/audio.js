/**
 * Simple Web Audio API sound effects
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio not supported or blocked
  }
}

export const sounds = {
  click() {
    playTone(800, 0.1, 'sine', 0.2);
  },

  success() {
    playTone(523, 0.15, 'sine', 0.3);
    setTimeout(() => playTone(659, 0.15, 'sine', 0.3), 150);
    setTimeout(() => playTone(784, 0.3, 'sine', 0.3), 300);
  },

  error() {
    playTone(200, 0.3, 'square', 0.2);
  },

  star() {
    playTone(1047, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(1319, 0.15, 'sine', 0.25), 100);
  },

  levelUp() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.2, 'sine', 0.3), i * 150);
    });
  },

  connect() {
    playTone(440, 0.1, 'sine', 0.15);
  },

  ledOn() {
    playTone(880, 0.15, 'sine', 0.2);
  },

  switchToggle() {
    playTone(600, 0.05, 'square', 0.15);
  },

  celebrate() {
    const notes = [523, 659, 784, 1047, 784, 1047, 1319];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.15, 'sine', 0.25), i * 120);
    });
  },

  tick() {
    playTone(1000, 0.05, 'sine', 0.1);
  },

  warning() {
    playTone(300, 0.2, 'sawtooth', 0.15);
    setTimeout(() => playTone(300, 0.2, 'sawtooth', 0.15), 250);
  }
};
