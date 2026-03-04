/**
 * Animated star counter display
 */
import { el, icon } from '../utils/dom.js';

export function createStarCounter(count, options = {}) {
  const { size = 24, animate = false } = options;

  const counter = el('div', { class: 'stars' },
    icon('star', size),
    el('span', { id: 'star-count-value' }, String(count))
  );

  if (animate) {
    counter.classList.add('bounce-in');
  }

  return counter;
}

/**
 * Animate star count incrementing
 */
export function animateStarCount(element, from, to, duration = 1000) {
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(from + (to - from) * progress);
    element.textContent = String(current);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
