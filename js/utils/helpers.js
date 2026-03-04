/**
 * General utility functions
 */

/**
 * Generate a unique ID
 */
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Clamp a number between min and max
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Debounce a function
 */
export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle a function
 */
export function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Snap a value to the nearest grid point
 */
export function snapToGrid(value, gridSize = 20) {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Calculate distance between two points
 */
export function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/**
 * Format time in seconds to MM:SS
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Format a date to readable string
 */
export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Wait for a number of milliseconds
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Shuffle an array (Fisher-Yates)
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick a random element from an array
 */
export function randomPick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Linear interpolation
 */
export function lerp(start, end, t) {
  return start + (end - start) * t;
}

/**
 * Deep clone an object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Get nested property by dot-path
 */
export function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

/**
 * Set nested property by dot-path
 */
export function setByPath(obj, path, value) {
  const keys = path.split('.');
  const last = keys.pop();
  const target = keys.reduce((acc, key) => {
    if (acc[key] === undefined) acc[key] = {};
    return acc[key];
  }, obj);
  target[last] = value;
}

/**
 * Create confetti effect
 */
export function createConfetti(container, count = 50) {
  const colors = ['#FF6B6B', '#4A90D9', '#FFD700', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4'];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + '%';
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty('--fall-duration', (2 + Math.random() * 3) + 's');
    piece.style.animationDelay = Math.random() * 2 + 's';
    piece.style.width = (6 + Math.random() * 8) + 'px';
    piece.style.height = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    container.appendChild(piece);

    setTimeout(() => piece.remove(), 5000);
  }
}
