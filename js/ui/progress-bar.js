/**
 * Animated progress bar component
 */
import { el } from '../utils/dom.js';

export function createProgressBar(progress, options = {}) {
  const {
    height = '16px',
    color = null,
    showLabel = false,
    animated = true
  } = options;

  const percentage = Math.round(progress * 100);

  const fill = el('div', {
    class: 'progress-bar__fill',
    style: {
      width: animated ? '0%' : percentage + '%',
      background: color || undefined,
      transition: animated ? 'width 1s ease' : 'none'
    }
  });

  const bar = el('div', { class: 'progress-bar', style: { height } },
    fill,
    showLabel ? el('span', {
      style: {
        position: 'absolute',
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '0.7rem',
        fontWeight: '700',
        color: percentage > 50 ? 'white' : 'var(--text-secondary)'
      }
    }, percentage + '%') : null
  );

  // Animate after mount
  if (animated) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fill.style.width = percentage + '%';
      });
    });
  }

  return bar;
}
