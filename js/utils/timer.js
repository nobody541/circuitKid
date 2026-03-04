/**
 * Countdown timer utility
 */
export class Timer {
  constructor(durationSeconds, onTick, onComplete) {
    this.duration = durationSeconds;
    this.remaining = durationSeconds;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.intervalId = null;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => {
      this.remaining--;
      if (this.onTick) this.onTick(this.remaining);

      if (this.remaining <= 0) {
        this.stop();
        if (this.onComplete) this.onComplete();
      }
    }, 1000);
  }

  stop() {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.remaining = this.duration;
  }

  getProgress() {
    return 1 - (this.remaining / this.duration);
  }
}

/**
 * Stopwatch (counts up)
 */
export class Stopwatch {
  constructor() {
    this.startTime = null;
    this.elapsed = 0;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.startTime = Date.now() - this.elapsed;
    this.running = true;
  }

  stop() {
    if (!this.running) return;
    this.elapsed = Date.now() - this.startTime;
    this.running = false;
  }

  reset() {
    this.startTime = null;
    this.elapsed = 0;
    this.running = false;
  }

  getSeconds() {
    if (this.running) {
      return Math.floor((Date.now() - this.startTime) / 1000);
    }
    return Math.floor(this.elapsed / 1000);
  }
}
