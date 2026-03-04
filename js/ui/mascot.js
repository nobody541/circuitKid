/**
 * Sparky the Robot Mascot
 */
import { el, svg } from '../utils/dom.js';

export function createMascotSVG(size = 120) {
  return svg('svg', { viewBox: '0 0 120 140', width: size, height: size * 140 / 120, class: 'mascot-svg' },
    // Antenna
    svg('line', { x1: '60', y1: '10', x2: '60', y2: '25', stroke: '#666', 'stroke-width': '3', 'stroke-linecap': 'round' }),
    // Lightbulb on antenna
    svg('circle', { cx: '60', cy: '8', r: '7', fill: '#FFD700', class: 'mascot-bulb' }),
    svg('circle', { cx: '60', cy: '8', r: '4', fill: '#FFF8DC', opacity: '0.8' }),

    // Head
    svg('rect', { x: '30', y: '25', width: '60', height: '45', rx: '15', fill: '#4A90D9' }),

    // Eyes
    svg('g', { class: 'mascot-eyes blink' },
      svg('circle', { cx: '47', cy: '45', r: '8', fill: 'white' }),
      svg('circle', { cx: '73', cy: '45', r: '8', fill: 'white' }),
      svg('circle', { cx: '47', cy: '45', r: '4', fill: '#2C3E50' }),
      svg('circle', { cx: '73', cy: '45', r: '4', fill: '#2C3E50' }),
      svg('circle', { cx: '49', cy: '43', r: '2', fill: 'white' }),
      svg('circle', { cx: '75', cy: '43', r: '2', fill: 'white' }),
    ),

    // Mouth
    svg('path', {
      d: 'M 48 58 Q 60 66 72 58',
      fill: 'none',
      stroke: '#2C3E50',
      'stroke-width': '2.5',
      'stroke-linecap': 'round',
      class: 'mascot-mouth'
    }),

    // Body
    svg('rect', { x: '25', y: '75', width: '70', height: '45', rx: '12', fill: '#5BA0E9' }),

    // Chest circle (like an arc reactor)
    svg('circle', { cx: '60', cy: '95', r: '10', fill: '#FFD700', opacity: '0.8' }),
    svg('circle', { cx: '60', cy: '95', r: '6', fill: '#FFF', opacity: '0.6' }),

    // Arms
    svg('rect', { x: '8', y: '80', width: '18', height: '10', rx: '5', fill: '#4A90D9' }),
    svg('rect', { x: '94', y: '80', width: '18', height: '10', rx: '5', fill: '#4A90D9' }),

    // Hands
    svg('circle', { cx: '8', cy: '85', r: '6', fill: '#4A90D9' }),
    svg('circle', { cx: '112', cy: '85', r: '6', fill: '#4A90D9' }),

    // Feet
    svg('rect', { x: '32', y: '118', width: '20', height: '12', rx: '6', fill: '#3A7BC8' }),
    svg('rect', { x: '68', y: '118', width: '20', height: '12', rx: '6', fill: '#3A7BC8' }),
  );
}

export function createMascotWithSpeech(message, size = 100) {
  const wrapper = el('div', { class: 'mascot-wrapper', style: { display: 'flex', alignItems: 'flex-end', gap: '12px' } },
    el('div', { class: 'float' }, createMascotSVG(size)),
    message ? el('div', { class: 'speech-bubble bounce-in' },
      el('p', {}, message)
    ) : null
  );
  return wrapper;
}

export function createSmallMascot(size = 48) {
  return svg('svg', { viewBox: '0 0 120 140', width: size, height: size * 140 / 120 },
    svg('circle', { cx: '60', cy: '8', r: '7', fill: '#FFD700' }),
    svg('line', { x1: '60', y1: '10', x2: '60', y2: '25', stroke: '#666', 'stroke-width': '3' }),
    svg('rect', { x: '30', y: '25', width: '60', height: '45', rx: '15', fill: '#4A90D9' }),
    svg('circle', { cx: '47', cy: '45', r: '5', fill: 'white' }),
    svg('circle', { cx: '73', cy: '45', r: '5', fill: 'white' }),
    svg('circle', { cx: '47', cy: '45', r: '2.5', fill: '#2C3E50' }),
    svg('circle', { cx: '73', cy: '45', r: '2.5', fill: '#2C3E50' }),
    svg('path', { d: 'M 48 58 Q 60 66 72 58', fill: 'none', stroke: '#2C3E50', 'stroke-width': '2.5', 'stroke-linecap': 'round' }),
    svg('rect', { x: '25', y: '75', width: '70', height: '45', rx: '12', fill: '#5BA0E9' }),
    svg('circle', { cx: '60', cy: '95', r: '8', fill: '#FFD700', opacity: '0.8' }),
    svg('rect', { x: '32', y: '118', width: '20', height: '12', rx: '6', fill: '#3A7BC8' }),
    svg('rect', { x: '68', y: '118', width: '20', height: '12', rx: '6', fill: '#3A7BC8' }),
  );
}
