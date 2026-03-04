/**
 * Avatar builder/display
 */
import { el, svg } from '../utils/dom.js';

export function createAvatar(config = {}, size = 80) {
  const {
    body = 'robot',
    color = '#4A90D9',
    hat = null,
    accessory = null
  } = config;

  const scale = size / 80;

  return el('div', {
    class: 'avatar-circle',
    style: {
      width: size + 'px',
      height: size + 'px',
      borderColor: color,
      background: color + '15'
    }
  },
    svg('svg', { viewBox: '0 0 60 70', width: size * 0.7, height: size * 0.8 },
      // Body
      svg('rect', { x: '10', y: '30', width: '40', height: '30', rx: '8', fill: color }),
      // Head
      svg('rect', { x: '13', y: '8', width: '34', height: '25', rx: '10', fill: color }),
      // Eyes
      svg('circle', { cx: '23', cy: '20', r: '4', fill: 'white' }),
      svg('circle', { cx: '37', cy: '20', r: '4', fill: 'white' }),
      svg('circle', { cx: '23', cy: '20', r: '2', fill: '#333' }),
      svg('circle', { cx: '37', cy: '20', r: '2', fill: '#333' }),
      // Mouth
      svg('path', { d: 'M 22 27 Q 30 32 38 27', fill: 'none', stroke: '#333', 'stroke-width': '1.5', 'stroke-linecap': 'round' }),
      // Antenna
      svg('line', { x1: '30', y1: '2', x2: '30', y2: '8', stroke: '#666', 'stroke-width': '2' }),
      svg('circle', { cx: '30', cy: '2', r: '3', fill: '#FFD700' }),
      // Chest
      svg('circle', { cx: '30', cy: '43', r: '5', fill: '#FFD700', opacity: '0.7' }),
      // Hat
      hat === 'hard' ? svg('rect', { x: '10', y: '2', width: '40', height: '10', rx: '3', fill: '#FFD700' }) : null,
      hat === 'crown' ? svg('polygon', { points: '15,8 20,0 25,6 30,0 35,6 40,0 45,8', fill: '#FFD700', stroke: '#FFA000', 'stroke-width': '1' }) : null,
      hat === 'cap' ? svg('path', { d: 'M 10,10 Q 30,0 50,10 L 55,12 L 5,12 Z', fill: '#FF6B6B' }) : null,
      // Accessory
      accessory === 'glasses' ? [
        svg('circle', { cx: '23', cy: '20', r: '6', fill: 'none', stroke: '#333', 'stroke-width': '1.5' }),
        svg('circle', { cx: '37', cy: '20', r: '6', fill: 'none', stroke: '#333', 'stroke-width': '1.5' }),
        svg('line', { x1: '29', y1: '20', x2: '31', y2: '20', stroke: '#333', 'stroke-width': '1.5' }),
      ] : null,
    )
  );
}
