/**
 * Certificate generator - creates an SVG certificate for printing
 */
import { svg } from '../utils/dom.js';
import { getLevelTitle } from '../gamification/points.js';
import { formatDate } from '../utils/helpers.js';

export function generateCertificate(name, stars, profileData) {
  const level = getLevelTitle(stars);
  const completedLessons = Object.entries(profileData.lessons)
    .filter(([, l]) => l.completedAt)
    .length;

  const date = formatDate(Date.now());

  const cert = svg('svg', {
    viewBox: '0 0 1100 800',
    width: '1100',
    height: '800',
    xmlns: 'http://www.w3.org/2000/svg',
    class: 'certificate'
  },
    // Background
    svg('rect', { x: '0', y: '0', width: '1100', height: '800', fill: '#FFFEF5', rx: '0' }),

    // Border
    svg('rect', { x: '20', y: '20', width: '1060', height: '760', fill: 'none', stroke: '#FFD700', 'stroke-width': '4', rx: '15' }),
    svg('rect', { x: '30', y: '30', width: '1040', height: '740', fill: 'none', stroke: '#4A90D9', 'stroke-width': '2', rx: '12' }),

    // Corner decorations (circuit-style)
    ...createCornerCircuits(),

    // Title
    svg('text', {
      x: '550', y: '120',
      'font-size': '48',
      'font-family': 'Nunito, sans-serif',
      'font-weight': '900',
      fill: '#4A90D9',
      'text-anchor': 'middle'
    }, 'Certificate of Achievement'),

    // Subtitle
    svg('text', {
      x: '550', y: '165',
      'font-size': '22',
      'font-family': 'Nunito, sans-serif',
      fill: '#666',
      'text-anchor': 'middle'
    }, 'Circuit Kids Electronics Learning Program'),

    // Divider
    svg('line', { x1: '200', y1: '190', x2: '900', y2: '190', stroke: '#FFD700', 'stroke-width': '2' }),

    // Awarded to
    svg('text', {
      x: '550', y: '250',
      'font-size': '22',
      'font-family': 'Nunito, sans-serif',
      fill: '#888',
      'text-anchor': 'middle'
    }, 'This certificate is proudly awarded to'),

    // Name
    svg('text', {
      x: '550', y: '320',
      'font-size': '56',
      'font-family': 'Nunito, sans-serif',
      'font-weight': '900',
      fill: '#2C3E50',
      'text-anchor': 'middle'
    }, name),

    // Line under name
    svg('line', { x1: '250', y1: '340', x2: '850', y2: '340', stroke: '#2C3E50', 'stroke-width': '2' }),

    // Achievement text
    svg('text', {
      x: '550', y: '400',
      'font-size': '20',
      'font-family': 'Nunito, sans-serif',
      fill: '#555',
      'text-anchor': 'middle'
    }, `For achieving the rank of ${level.title}`),

    svg('text', {
      x: '550', y: '435',
      'font-size': '18',
      'font-family': 'Nunito, sans-serif',
      fill: '#888',
      'text-anchor': 'middle'
    }, `with ${stars} stars earned across ${completedLessons} completed lessons`),

    // Star decoration
    ...createStarRow(550, 480, 5),

    // Mascot
    svg('text', {
      x: '550', y: '550',
      'font-size': '48',
      'text-anchor': 'middle'
    }, '🤖'),

    // Badge icons for completed lessons
    svg('text', {
      x: '550', y: '600',
      'font-size': '14',
      'font-family': 'Nunito, sans-serif',
      fill: '#888',
      'text-anchor': 'middle'
    }, 'Badges:  ' + (profileData.badges || []).map(b => {
      const icons = { 'battery-boss': '🔋', 'led-master': '💡', 'switch-hero': '🔘', 'parallel-pro': '🔀', 'circuit-champion': '⚡' };
      return icons[b] || '⭐';
    }).join('  ')),

    // Date
    svg('text', {
      x: '300', y: '700',
      'font-size': '16',
      'font-family': 'Nunito, sans-serif',
      fill: '#888',
      'text-anchor': 'middle'
    }, `Date: ${date}`),

    // Signature line
    svg('line', { x1: '650', y1: '700', x2: '900', y2: '700', stroke: '#999', 'stroke-width': '1' }),
    svg('text', {
      x: '775', y: '720',
      'font-size': '14',
      'font-family': 'Nunito, sans-serif',
      fill: '#888',
      'text-anchor': 'middle'
    }, 'Sparky the Robot'),
    svg('text', {
      x: '775', y: '690',
      'font-size': '20',
      'text-anchor': 'middle'
    }, '🤖'),
  );

  const wrapper = document.createElement('div');
  wrapper.appendChild(cert);
  return wrapper;
}

function createCornerCircuits() {
  const elements = [];
  const corners = [
    { x: 50, y: 50 },
    { x: 1050, y: 50 },
    { x: 50, y: 750 },
    { x: 1050, y: 750 }
  ];

  for (const c of corners) {
    elements.push(
      svg('circle', { cx: c.x, cy: c.y, r: '8', fill: '#FFD700', opacity: '0.6' }),
      svg('circle', { cx: c.x, cy: c.y, r: '4', fill: '#FF9800' }),
    );
  }
  return elements;
}

function createStarRow(cx, cy, count) {
  const elements = [];
  const spacing = 40;
  const startX = cx - (count - 1) * spacing / 2;

  for (let i = 0; i < count; i++) {
    elements.push(
      svg('text', {
        x: startX + i * spacing,
        y: cy,
        'font-size': '28',
        'text-anchor': 'middle'
      }, '⭐')
    );
  }
  return elements;
}
