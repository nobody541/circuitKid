/**
 * Learn Mode - Interactive slides with mascot narration
 */
import { el, mount, icon, svg } from '../utils/dom.js';
import { createMascotWithSpeech } from '../ui/mascot.js';
import { sounds } from '../utils/audio.js';
import { tts } from '../utils/tts.js';

/**
 * Create a visual SVG for a slide based on its visual type
 */
function createSlideVisual(visualType, lessonColor) {
  switch (visualType) {
    case 'electricity-everywhere':
      return createElectricityEverywhereVisual();
    case 'wire-road':
      return createWireRoadVisual();
    case 'battery-plus-minus':
      return createBatteryPlusMinusVisual();
    case 'ready-to-build':
      return createReadyToBuildVisual();
    case 'electron-flow':
      return createElectronFlowVisual();
    case 'battery':
      return createBatteryVisual();
    case 'simple-circuit':
      return createSimpleCircuitVisual();
    case 'led-anatomy':
      return createLEDAnatomyVisual();
    case 'led-polarity':
      return createLEDPolarityVisual();
    case 'led-colors':
      return createLEDColorsVisual();
    case 'switch-intro':
      return createSwitchIntroVisual();
    case 'switch-types':
      return createSwitchTypesVisual();
    case 'switch-circuit':
      return createSwitchCircuitVisual();
    case 'series-circuit':
      return createSeriesVisual();
    case 'parallel-circuit':
      return createParallelVisual();
    case 'series-flow':
      return createSeriesFlowVisual();
    case 'parallel-flow':
      return createParallelFlowVisual();
    case 'brightness-compare':
      return createBrightnessVisual();
    case 'complete-review':
      return createCompleteReviewVisual();
    case 'circuit-design':
      return createCircuitDesignVisual();
    case 'real-world':
      return createRealWorldVisual();
    default:
      return createGenericVisual(visualType, lessonColor);
  }
}

function createElectricityEverywhereVisual() {
  const items = [
    { x: 60, y: 50, emoji: '💡', label: 'Lights' },
    { x: 180, y: 40, emoji: '📱', label: 'Tablet' },
    { x: 300, y: 50, emoji: '📺', label: 'TV' },
    { x: 120, y: 140, emoji: '🎮', label: 'Games' },
    { x: 240, y: 140, emoji: '❄️', label: 'Fridge' },
  ];
  return svg('svg', { viewBox: '0 0 400 220', width: '100%', style: 'max-width:400px' },
    // Central lightning bolt
    svg('text', { x: '200', y: '110', 'font-size': '50', 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'pulse' }, '⚡'),
    // Items around
    ...items.map(it => [
      svg('line', { x1: '200', y1: '100', x2: String(it.x), y2: String(it.y + 10), stroke: '#FFD700', 'stroke-width': '2', 'stroke-dasharray': '4,4', opacity: '0.5' }),
      svg('text', { x: String(it.x), y: String(it.y), 'font-size': '28', 'text-anchor': 'middle' }, it.emoji),
      svg('text', { x: String(it.x), y: String(it.y + 28), 'font-size': '11', fill: '#555', 'text-anchor': 'middle', 'font-weight': 'bold' }, it.label),
    ]).flat(),
    svg('text', { x: '200', y: '200', 'font-size': '14', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'All of these use electricity!')
  );
}

function createWireRoadVisual() {
  return svg('svg', { viewBox: '0 0 400 220', width: '100%', style: 'max-width:400px' },
    // Road/wire path
    svg('path', { d: 'M 40 120 Q 120 40, 200 120 Q 280 200, 360 120', fill: 'none', stroke: '#B87333', 'stroke-width': '12', 'stroke-linecap': 'round' }),
    // Copper shine
    svg('path', { d: 'M 40 118 Q 120 38, 200 118 Q 280 198, 360 118', fill: 'none', stroke: '#D4956A', 'stroke-width': '4', 'stroke-linecap': 'round', opacity: '0.5' }),
    // Electrons traveling
    svg('circle', { cx: '80', cy: '88', r: '8', fill: '#4A90D9', class: 'pulse' }),
    svg('text', { x: '80', y: '91', 'font-size': '8', fill: 'white', 'text-anchor': 'middle' }, 'e-'),
    svg('circle', { cx: '200', cy: '120', r: '8', fill: '#4A90D9', class: 'pulse', style: 'animation-delay:0.4s' }),
    svg('text', { x: '200', y: '123', 'font-size': '8', fill: 'white', 'text-anchor': 'middle' }, 'e-'),
    svg('circle', { cx: '310', cy: '142', r: '8', fill: '#4A90D9', class: 'pulse', style: 'animation-delay:0.8s' }),
    svg('text', { x: '310', y: '145', 'font-size': '8', fill: 'white', 'text-anchor': 'middle' }, 'e-'),
    // Label
    svg('text', { x: '200', y: '35', 'font-size': '15', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'A wire is a road for electrons!'),
    svg('text', { x: '200', y: '195', 'font-size': '12', fill: '#B87333', 'text-anchor': 'middle' }, '🟤 Copper wire'),
  );
}

function createBatteryPlusMinusVisual() {
  return svg('svg', { viewBox: '0 0 400 250', width: '100%', style: 'max-width:400px' },
    // Battery body
    svg('rect', { x: '100', y: '60', width: '200', height: '110', rx: '14', fill: '#555', stroke: '#333', 'stroke-width': '3' }),
    // Plus side (left)
    svg('rect', { x: '55', y: '82', width: '50', height: '66', rx: '10', fill: '#CC0000', stroke: '#333', 'stroke-width': '2' }),
    svg('text', { x: '80', y: '125', 'font-size': '36', fill: 'white', 'text-anchor': 'middle', 'font-weight': 'bold' }, '+'),
    // Minus side (right)
    svg('rect', { x: '295', y: '82', width: '50', height: '66', rx: '10', fill: '#333', stroke: '#222', 'stroke-width': '2' }),
    svg('text', { x: '320', y: '125', 'font-size': '36', fill: 'white', 'text-anchor': 'middle', 'font-weight': 'bold' }, '−'),
    // Voltage label
    svg('text', { x: '200', y: '125', 'font-size': '26', fill: '#FFD700', 'text-anchor': 'middle', 'font-weight': 'bold' }, '3V'),
    // Labels
    svg('text', { x: '80', y: '55', 'font-size': '14', fill: '#CC0000', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'PLUS (+)'),
    svg('text', { x: '320', y: '55', 'font-size': '14', fill: '#888', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'MINUS (−)'),
    // Arrows showing push/pull
    svg('text', { x: '80', y: '175', 'font-size': '12', fill: '#CC0000', 'text-anchor': 'middle' }, 'Pushes e- OUT'),
    svg('polygon', { points: '30,115 50,105 50,125', fill: '#CC0000' }),
    svg('text', { x: '320', y: '175', 'font-size': '12', fill: '#888', 'text-anchor': 'middle' }, 'Pulls e- IN'),
    svg('polygon', { points: '370,115 350,105 350,125', fill: '#888' }),
    // Bottom tip
    svg('text', { x: '200', y: '215', 'font-size': '13', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Plus Pushes! Remember that!'),
  );
}

function createReadyToBuildVisual() {
  return svg('svg', { viewBox: '0 0 400 220', width: '100%', style: 'max-width:400px' },
    // Celebration stars
    svg('text', { x: '60', y: '50', 'font-size': '24', class: 'pulse' }, '⭐'),
    svg('text', { x: '340', y: '50', 'font-size': '24', class: 'pulse', style: 'animation-delay:0.3s' }, '⭐'),
    svg('text', { x: '200', y: '30', 'font-size': '28', class: 'pulse', style: 'animation-delay:0.6s' }, '🌟'),
    // Checkmarks for things learned
    svg('text', { x: '100', y: '80', 'font-size': '14', fill: '#4CAF50', 'font-weight': 'bold' }, '✅ Electricity'),
    svg('text', { x: '100', y: '105', 'font-size': '14', fill: '#4CAF50', 'font-weight': 'bold' }, '✅ Electrons'),
    svg('text', { x: '100', y: '130', 'font-size': '14', fill: '#4CAF50', 'font-weight': 'bold' }, '✅ Wires'),
    svg('text', { x: '100', y: '155', 'font-size': '14', fill: '#4CAF50', 'font-weight': 'bold' }, '✅ Batteries'),
    svg('text', { x: '100', y: '180', 'font-size': '14', fill: '#4CAF50', 'font-weight': 'bold' }, '✅ Circuits'),
    // Robot mascot area
    svg('text', { x: '300', y: '130', 'font-size': '60', 'text-anchor': 'middle' }, '🤖'),
    svg('text', { x: '300', y: '170', 'font-size': '12', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'You got this!'),
    // Bottom
    svg('text', { x: '200', y: '210', 'font-size': '15', fill: '#FF6B6B', 'text-anchor': 'middle', 'font-weight': 'bold' }, "Time to build your first circuit! Let's go!"),
  );
}

function createElectronFlowVisual() {
  return svg('svg', { viewBox: '0 0 400 250', width: '100%', style: 'max-width:400px' },
    // Wire
    svg('line', { x1: '50', y1: '125', x2: '350', y2: '125', stroke: '#666', 'stroke-width': '8', 'stroke-linecap': 'round' }),
    // Electrons flowing
    svg('circle', { cx: '80', cy: '125', r: '10', fill: '#4A90D9', class: 'pulse' }),
    svg('circle', { cx: '150', cy: '125', r: '10', fill: '#4A90D9', class: 'pulse', style: 'animation-delay: 0.3s' }),
    svg('circle', { cx: '220', cy: '125', r: '10', fill: '#4A90D9', class: 'pulse', style: 'animation-delay: 0.6s' }),
    svg('circle', { cx: '290', cy: '125', r: '10', fill: '#4A90D9', class: 'pulse', style: 'animation-delay: 0.9s' }),
    // Labels
    svg('text', { x: '80', y: '123', 'font-size': '10', fill: 'white', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, 'e-'),
    svg('text', { x: '150', y: '123', 'font-size': '10', fill: 'white', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, 'e-'),
    svg('text', { x: '220', y: '123', 'font-size': '10', fill: 'white', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, 'e-'),
    svg('text', { x: '290', y: '123', 'font-size': '10', fill: 'white', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, 'e-'),
    // Arrow
    svg('polygon', { points: '360,125 340,115 340,135', fill: '#FFD700' }),
    // Labels
    svg('text', { x: '200', y: '80', 'font-size': '16', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Electrons flow through wires!'),
    svg('text', { x: '200', y: '180', 'font-size': '13', fill: '#666', 'text-anchor': 'middle' }, 'Like tiny invisible balls rolling along'),
  );
}

function createBatteryVisual() {
  return svg('svg', { viewBox: '0 0 400 250', width: '100%', style: 'max-width:400px' },
    // Battery body
    svg('rect', { x: '100', y: '75', width: '200', height: '100', rx: '12', fill: '#555', stroke: '#333', 'stroke-width': '3' }),
    // Positive cap
    svg('rect', { x: '60', y: '95', width: '45', height: '60', rx: '8', fill: '#CC0000', stroke: '#333', 'stroke-width': '2' }),
    // Negative cap
    svg('rect', { x: '295', y: '95', width: '45', height: '60', rx: '8', fill: '#333', stroke: '#222', 'stroke-width': '2' }),
    // Plus
    svg('text', { x: '82', y: '135', 'font-size': '32', fill: 'white', 'text-anchor': 'middle', 'font-weight': 'bold' }, '+'),
    // Minus
    svg('text', { x: '318', y: '135', 'font-size': '32', fill: 'white', 'text-anchor': 'middle', 'font-weight': 'bold' }, '-'),
    // Voltage label
    svg('text', { x: '200', y: '135', 'font-size': '24', fill: '#FFD700', 'text-anchor': 'middle', 'font-weight': 'bold' }, '3V'),
    // Labels
    svg('text', { x: '82', y: '70', 'font-size': '14', fill: '#CC0000', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Positive'),
    svg('text', { x: '318', y: '70', 'font-size': '14', fill: '#666', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Negative'),
  );
}

function createSimpleCircuitVisual() {
  return svg('svg', { viewBox: '0 0 400 300', width: '100%', style: 'max-width:400px' },
    // Circuit loop
    svg('rect', { x: '80', y: '60', width: '240', height: '180', rx: '20', fill: 'none', stroke: '#666', 'stroke-width': '4' }),
    // Battery at top
    svg('rect', { x: '160', y: '45', width: '80', height: '30', rx: '6', fill: '#555', stroke: '#333', 'stroke-width': '2' }),
    svg('text', { x: '185', y: '66', 'font-size': '12', fill: '#FFF', 'font-weight': 'bold' }, '+'),
    svg('text', { x: '225', y: '66', 'font-size': '14', fill: '#FFF', 'font-weight': 'bold' }, '-'),
    // LED at bottom
    svg('polygon', { points: '185,230 215,230 200,210', fill: '#FF0000', stroke: '#333', 'stroke-width': '2' }),
    svg('circle', { cx: '200', cy: '220', r: '20', fill: 'rgba(255,0,0,0.2)', class: 'pulse' }),
    // Arrows showing flow direction
    svg('polygon', { points: '100,140 110,130 110,150', fill: '#4A90D9' }),
    svg('polygon', { points: '300,160 290,150 290,170', fill: '#4A90D9' }),
    // Label
    svg('text', { x: '200', y: '280', 'font-size': '14', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'A complete circuit loop!'),
  );
}

function createLEDAnatomyVisual() {
  return svg('svg', { viewBox: '0 0 400 250', width: '100%', style: 'max-width:400px' },
    // LED dome
    svg('ellipse', { cx: '200', cy: '80', rx: '50', ry: '60', fill: '#FF6B6B', stroke: '#333', 'stroke-width': '2' }),
    svg('ellipse', { cx: '190', cy: '60', rx: '15', ry: '20', fill: 'rgba(255,255,255,0.4)' }),
    // Base
    svg('rect', { x: '155', y: '135', width: '90', height: '20', rx: '4', fill: '#888', stroke: '#333', 'stroke-width': '2' }),
    // Legs
    svg('line', { x1: '180', y1: '155', x2: '180', y2: '220', stroke: '#999', 'stroke-width': '4', 'stroke-linecap': 'round' }),
    svg('line', { x1: '220', y1: '155', x2: '220', y2: '200', stroke: '#999', 'stroke-width': '4', 'stroke-linecap': 'round' }),
    // Labels
    svg('text', { x: '170', y: '240', 'font-size': '13', fill: '#CC0000', 'text-anchor': 'middle', 'font-weight': 'bold' }, '+ Long'),
    svg('text', { x: '230', y: '218', 'font-size': '13', fill: '#666', 'text-anchor': 'middle', 'font-weight': 'bold' }, '- Short'),
    svg('text', { x: '200', y: '50', 'font-size': '11', fill: '#FFF', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'LED'),
  );
}

function createLEDPolarityVisual() {
  return createLEDAnatomyVisual(); // Reuse with different context
}

function createLEDColorsVisual() {
  const colors = [
    { cx: 80, color: '#FF0000', label: 'Red' },
    { cx: 160, color: '#00CC00', label: 'Green' },
    { cx: 240, color: '#0066FF', label: 'Blue' },
    { cx: 320, color: '#FFD700', label: 'Yellow' },
  ];
  return svg('svg', { viewBox: '0 0 400 200', width: '100%', style: 'max-width:400px' },
    ...colors.map(c => [
      svg('circle', { cx: c.cx, cy: '80', r: '30', fill: c.color, opacity: '0.3', class: 'pulse' }),
      svg('polygon', { points: `${c.cx-15},100 ${c.cx+15},100 ${c.cx},70`, fill: c.color, stroke: '#333', 'stroke-width': '2' }),
      svg('rect', { x: c.cx - 15, y: '100', width: '30', height: '8', rx: '2', fill: '#888' }),
      svg('text', { x: c.cx, y: '130', 'font-size': '13', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, c.label),
    ]).flat()
  );
}

function createSwitchIntroVisual() {
  return svg('svg', { viewBox: '0 0 400 200', width: '100%', style: 'max-width:400px' },
    // ON switch
    svg('rect', { x: '40', y: '60', width: '120', height: '40', rx: '8', fill: '#DDD', stroke: '#333', 'stroke-width': '2' }),
    svg('circle', { cx: '65', cy: '80', r: '8', fill: '#FFD700' }),
    svg('circle', { cx: '135', cy: '80', r: '8', fill: '#FFD700' }),
    svg('line', { x1: '65', y1: '80', x2: '135', y2: '80', stroke: '#4CAF50', 'stroke-width': '6', 'stroke-linecap': 'round' }),
    svg('text', { x: '100', y: '130', 'font-size': '16', fill: '#4CAF50', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'ON'),
    // OFF switch
    svg('rect', { x: '240', y: '60', width: '120', height: '40', rx: '8', fill: '#DDD', stroke: '#333', 'stroke-width': '2' }),
    svg('circle', { cx: '265', cy: '80', r: '8', fill: '#FFD700' }),
    svg('circle', { cx: '335', cy: '80', r: '8', fill: '#FFD700' }),
    svg('line', { x1: '265', y1: '80', x2: '310', y2: '45', stroke: '#FF6B6B', 'stroke-width': '6', 'stroke-linecap': 'round' }),
    svg('text', { x: '300', y: '130', 'font-size': '16', fill: '#FF6B6B', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'OFF'),
  );
}

function createSwitchTypesVisual() { return createSwitchIntroVisual(); }
function createSwitchCircuitVisual() { return createSimpleCircuitVisual(); }
function createSeriesVisual() {
  return svg('svg', { viewBox: '0 0 400 200', width: '100%', style: 'max-width:400px' },
    svg('text', { x: '200', y: '25', 'font-size': '16', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Series: One Path'),
    svg('rect', { x: '30', y: '50', width: '340', height: '120', rx: '15', fill: 'none', stroke: '#666', 'stroke-width': '3' }),
    svg('rect', { x: '50', y: '95', width: '50', height: '30', rx: '5', fill: '#555' }),
    svg('text', { x: '75', y: '115', 'font-size': '10', fill: '#FFD700', 'text-anchor': 'middle', 'font-weight': 'bold' }, '3V'),
    svg('polygon', { points: '180,130 200,130 190,110', fill: '#FF0000', stroke: '#333', 'stroke-width': '2' }),
    svg('polygon', { points: '260,130 280,130 270,110', fill: '#00CC00', stroke: '#333', 'stroke-width': '2' }),
    svg('text', { x: '200', y: '180', 'font-size': '12', fill: '#666', 'text-anchor': 'middle' }, 'LEDs share the power = dimmer'),
  );
}
function createParallelVisual() {
  return svg('svg', { viewBox: '0 0 400 200', width: '100%', style: 'max-width:400px' },
    svg('text', { x: '200', y: '25', 'font-size': '16', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Parallel: Multiple Paths'),
    // Main wires
    svg('line', { x1: '80', y1: '60', x2: '80', y2: '160', stroke: '#666', 'stroke-width': '3' }),
    svg('line', { x1: '320', y1: '60', x2: '320', y2: '160', stroke: '#666', 'stroke-width': '3' }),
    // Battery
    svg('rect', { x: '55', y: '95', width: '50', height: '30', rx: '5', fill: '#555' }),
    svg('text', { x: '80', y: '115', 'font-size': '10', fill: '#FFD700', 'text-anchor': 'middle', 'font-weight': 'bold' }, '3V'),
    // Branch 1
    svg('line', { x1: '80', y1: '80', x2: '320', y2: '80', stroke: '#666', 'stroke-width': '2' }),
    svg('polygon', { points: '190,90 210,90 200,70', fill: '#FF0000', stroke: '#333', 'stroke-width': '2' }),
    // Branch 2
    svg('line', { x1: '80', y1: '140', x2: '320', y2: '140', stroke: '#666', 'stroke-width': '2' }),
    svg('polygon', { points: '190,150 210,150 200,130', fill: '#00CC00', stroke: '#333', 'stroke-width': '2' }),
    svg('text', { x: '200', y: '185', 'font-size': '12', fill: '#666', 'text-anchor': 'middle' }, 'Each LED gets full power = bright!'),
  );
}
function createBrightnessVisual() { return createParallelVisual(); }

function createCompleteReviewVisual() {
  return svg('svg', { viewBox: '0 0 400 200', width: '100%', style: 'max-width:400px' },
    // Checklist board
    svg('rect', { x: '120', y: '20', width: '160', height: '160', rx: '12', fill: '#E8F5E9', stroke: '#4CAF50', 'stroke-width': '2' }),
    svg('text', { x: '200', y: '50', 'font-size': '14', 'font-weight': 'bold', fill: '#2E7D32', 'text-anchor': 'middle' }, 'Review'),
    // Check items
    svg('text', { x: '150', y: '80', 'font-size': '16', fill: '#4CAF50' }, '✅'),
    svg('text', { x: '175', y: '82', 'font-size': '12', fill: '#333' }, 'Circuits'),
    svg('text', { x: '150', y: '105', 'font-size': '16', fill: '#4CAF50' }, '✅'),
    svg('text', { x: '175', y: '107', 'font-size': '12', fill: '#333' }, 'LEDs'),
    svg('text', { x: '150', y: '130', 'font-size': '16', fill: '#4CAF50' }, '✅'),
    svg('text', { x: '175', y: '132', 'font-size': '12', fill: '#333' }, 'Switches'),
    svg('text', { x: '150', y: '155', 'font-size': '16', fill: '#4CAF50' }, '✅'),
    svg('text', { x: '175', y: '157', 'font-size': '12', fill: '#333' }, 'Series & Parallel'),
    // Star
    svg('text', { x: '200', y: '195', 'font-size': '24', 'text-anchor': 'middle' }, '⭐'),
  );
}

function createCircuitDesignVisual() {
  return svg('svg', { viewBox: '0 0 400 200', width: '100%', style: 'max-width:400px' },
    // Blueprint background
    svg('rect', { x: '50', y: '20', width: '300', height: '160', rx: '8', fill: '#E3F2FD', stroke: '#1565C0', 'stroke-width': '2', 'stroke-dasharray': '6 3' }),
    // Pencil icon
    svg('text', { x: '80', y: '55', 'font-size': '24' }, '✏️'),
    // Circuit sketch lines
    svg('line', { x1: '120', y1: '60', x2: '300', y2: '60', stroke: '#1565C0', 'stroke-width': '2' }),
    svg('line', { x1: '300', y1: '60', x2: '300', y2: '140', stroke: '#1565C0', 'stroke-width': '2' }),
    svg('line', { x1: '300', y1: '140', x2: '120', y2: '140', stroke: '#1565C0', 'stroke-width': '2' }),
    svg('line', { x1: '120', y1: '140', x2: '120', y2: '60', stroke: '#1565C0', 'stroke-width': '2' }),
    // Components on circuit
    svg('rect', { x: '190', y: '50', width: '30', height: '20', fill: '#FF9800', rx: '3' }), // battery
    svg('text', { x: '205', y: '65', 'font-size': '10', 'text-anchor': 'middle', fill: '#fff' }, '🔋'),
    svg('circle', { cx: '210', cy: '140', r: '10', fill: '#F44336' }), // LED
    svg('text', { x: '210', y: '144', 'font-size': '10', 'text-anchor': 'middle', fill: '#fff' }, '💡'),
    // Label
    svg('text', { x: '200', y: '190', 'font-size': '14', fill: '#1565C0', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Your Circuit Design'),
  );
}

function createRealWorldVisual() {
  return svg('svg', { viewBox: '0 0 400 200', width: '100%', style: 'max-width:400px' },
    // House outline
    svg('polygon', { points: '200,20 320,80 320,180 80,180 80,80', fill: '#FFF3E0', stroke: '#E65100', 'stroke-width': '2' }),
    svg('polygon', { points: '200,20 80,80 320,80', fill: '#FFCC80', stroke: '#E65100', 'stroke-width': '2' }), // roof
    // Door
    svg('rect', { x: '175', y: '120', width: '50', height: '60', fill: '#795548', rx: '3' }),
    svg('circle', { cx: '215', cy: '152', r: '3', fill: '#FFD54F' }), // doorknob
    // Windows with glow
    svg('rect', { x: '100', y: '100', width: '40', height: '35', fill: '#FFF176', stroke: '#F9A825', 'stroke-width': '1.5', rx: '2' }),
    svg('rect', { x: '260', y: '100', width: '40', height: '35', fill: '#FFF176', stroke: '#F9A825', 'stroke-width': '1.5', rx: '2' }),
    // Lightning bolts coming to house
    svg('text', { x: '50', y: '60', 'font-size': '22' }, '⚡'),
    svg('text', { x: '340', y: '60', 'font-size': '22' }, '⚡'),
    // Appliances inside
    svg('text', { x: '112', y: '122', 'font-size': '16', 'text-anchor': 'middle' }, '💡'),
    svg('text', { x: '272', y: '122', 'font-size': '16', 'text-anchor': 'middle' }, '📺'),
  );
}

function createSeriesFlowVisual() {
  return svg('svg', { viewBox: '0 0 420 260', width: '100%', style: 'max-width:420px' },
    svg('text', { x: '210', y: '22', 'font-size': '15', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Series: Electricity flows in ONE path'),
    /* Circuit loop */
    svg('rect', { x: '40', y: '40', width: '340', height: '170', rx: '16', fill: 'none', stroke: '#666', 'stroke-width': '4' }),
    /* Battery at top-left */
    svg('rect', { x: '50', y: '30', width: '80', height: '30', rx: '6', fill: '#546E7A', stroke: '#37474F', 'stroke-width': '2' }),
    svg('rect', { x: '40', y: '33', width: '14', height: '24', rx: '3', fill: '#C62828' }),
    svg('text', { x: '47', y: '50', 'font-size': '14', fill: '#fff', 'text-anchor': 'middle', 'font-weight': 'bold' }, '+'),
    svg('rect', { x: '126', y: '33', width: '14', height: '24', rx: '3', fill: '#37474F' }),
    svg('text', { x: '133', y: '50', 'font-size': '14', fill: '#fff', 'text-anchor': 'middle', 'font-weight': 'bold' }, '\u2212'),
    svg('text', { x: '90', y: '50', 'font-size': '9', fill: '#ECEFF1', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'BATTERY'),
    /* LED 1 at bottom-left */
    svg('polygon', { points: '120,210 150,210 135,185', fill: '#F44336', stroke: '#C62828', 'stroke-width': '2' }),
    svg('rect', { x: '122', y: '208', width: '26', height: '5', fill: '#9E9E9E' }),
    svg('circle', { cx: '135', cy: '196', r: '18', fill: 'rgba(255,68,68,0.2)', class: 'pulse' }),
    svg('text', { x: '135', y: '238', 'font-size': '10', fill: '#555', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'LED 1'),
    /* LED 2 at bottom-right */
    svg('polygon', { points: '260,210 290,210 275,185', fill: '#4CAF50', stroke: '#2E7D32', 'stroke-width': '2' }),
    svg('rect', { x: '262', y: '208', width: '26', height: '5', fill: '#9E9E9E' }),
    svg('circle', { cx: '275', cy: '196', r: '18', fill: 'rgba(76,175,80,0.2)', class: 'pulse' }),
    svg('text', { x: '275', y: '238', 'font-size': '10', fill: '#555', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'LED 2'),
    /* Flow arrows (clockwise) */
    svg('polygon', { points: '270,40 280,33 280,47', fill: '#FFD700' }),
    svg('polygon', { points: '380,140 387,130 373,130', fill: '#FFD700' }),
    svg('polygon', { points: '200,210 190,217 190,203', fill: '#FFD700' }),
    svg('polygon', { points: '40,140 33,150 47,150', fill: '#FFD700' }),
    /* Electron dots flowing */
    svg('circle', { cx: '200', cy: '40', r: '6', fill: '#4A90D9', class: 'pulse' }),
    svg('text', { x: '200', y: '43', 'font-size': '7', fill: '#fff', 'text-anchor': 'middle' }, 'e\u2212'),
    svg('circle', { cx: '380', cy: '100', r: '6', fill: '#4A90D9', class: 'pulse', style: 'animation-delay:0.3s' }),
    svg('text', { x: '380', y: '103', 'font-size': '7', fill: '#fff', 'text-anchor': 'middle' }, 'e\u2212'),
    svg('circle', { cx: '200', cy: '210', r: '6', fill: '#4A90D9', class: 'pulse', style: 'animation-delay:0.6s' }),
    svg('text', { x: '200', y: '213', 'font-size': '7', fill: '#fff', 'text-anchor': 'middle' }, 'e\u2212'),
    svg('circle', { cx: '40', cy: '100', r: '6', fill: '#4A90D9', class: 'pulse', style: 'animation-delay:0.9s' }),
    svg('text', { x: '40', y: '103', 'font-size': '7', fill: '#fff', 'text-anchor': 'middle' }, 'e\u2212'),
    /* Label */
    svg('text', { x: '210', y: '256', 'font-size': '11', fill: '#666', 'text-anchor': 'middle' }, 'One path \u2192 shared power \u2192 dimmer LEDs'),
  );
}

function createParallelFlowVisual() {
  return svg('svg', { viewBox: '0 0 420 280', width: '100%', style: 'max-width:420px' },
    svg('text', { x: '210', y: '22', 'font-size': '15', fill: '#333', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Parallel: Multiple paths for electricity!'),
    /* Main vertical bus wires */
    svg('line', { x1: '70', y1: '50', x2: '70', y2: '230', stroke: '#666', 'stroke-width': '4' }),
    svg('line', { x1: '350', y1: '50', x2: '350', y2: '230', stroke: '#666', 'stroke-width': '4' }),
    /* Battery (top, connecting the two buses) */
    svg('line', { x1: '70', y1: '50', x2: '140', y2: '50', stroke: '#666', 'stroke-width': '3' }),
    svg('rect', { x: '140', y: '36', width: '140', height: '30', rx: '6', fill: '#546E7A', stroke: '#37474F', 'stroke-width': '2' }),
    svg('rect', { x: '132', y: '39', width: '14', height: '24', rx: '3', fill: '#37474F' }),
    svg('text', { x: '139', y: '56', 'font-size': '12', fill: '#fff', 'text-anchor': 'middle', 'font-weight': 'bold' }, '\u2212'),
    svg('rect', { x: '274', y: '39', width: '14', height: '24', rx: '3', fill: '#C62828' }),
    svg('text', { x: '281', y: '56', 'font-size': '12', fill: '#fff', 'text-anchor': 'middle', 'font-weight': 'bold' }, '+'),
    svg('text', { x: '210', y: '56', 'font-size': '9', fill: '#ECEFF1', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'BATTERY'),
    svg('line', { x1: '280', y1: '50', x2: '350', y2: '50', stroke: '#666', 'stroke-width': '3' }),
    /* Branch 1 (top) */
    svg('line', { x1: '70', y1: '110', x2: '350', y2: '110', stroke: '#999', 'stroke-width': '2', 'stroke-dasharray': '4 2' }),
    svg('polygon', { points: '195,120 225,120 210,95', fill: '#F44336', stroke: '#C62828', 'stroke-width': '2' }),
    svg('rect', { x: '198', y: '118', width: '24', height: '4', fill: '#9E9E9E' }),
    svg('circle', { cx: '210', cy: '106', r: '16', fill: 'rgba(255,68,68,0.25)', class: 'pulse' }),
    svg('text', { x: '210', y: '140', 'font-size': '10', fill: '#F44336', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'LED 1 (bright!)'),
    /* Branch 2 (bottom) */
    svg('line', { x1: '70', y1: '190', x2: '350', y2: '190', stroke: '#999', 'stroke-width': '2', 'stroke-dasharray': '4 2' }),
    svg('polygon', { points: '195,200 225,200 210,175', fill: '#4CAF50', stroke: '#2E7D32', 'stroke-width': '2' }),
    svg('rect', { x: '198', y: '198', width: '24', height: '4', fill: '#9E9E9E' }),
    svg('circle', { cx: '210', cy: '186', r: '16', fill: 'rgba(76,175,80,0.25)', class: 'pulse', style: 'animation-delay:0.3s' }),
    svg('text', { x: '210', y: '220', 'font-size': '10', fill: '#4CAF50', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'LED 2 (bright!)'),
    /* Flow arrows on branch 1 */
    svg('polygon', { points: '130,110 140,104 140,116', fill: '#FFD700' }),
    svg('polygon', { points: '300,110 290,104 290,116', fill: '#FFD700' }),
    /* Flow arrows on branch 2 */
    svg('polygon', { points: '130,190 140,184 140,196', fill: '#FFD700' }),
    svg('polygon', { points: '300,190 290,184 290,196', fill: '#FFD700' }),
    /* Electron dots */
    svg('circle', { cx: '110', cy: '110', r: '5', fill: '#4A90D9', class: 'pulse' }),
    svg('text', { x: '110', y: '113', 'font-size': '6', fill: '#fff', 'text-anchor': 'middle' }, 'e\u2212'),
    svg('circle', { cx: '110', cy: '190', r: '5', fill: '#4A90D9', class: 'pulse', style: 'animation-delay:0.4s' }),
    svg('text', { x: '110', y: '193', 'font-size': '6', fill: '#fff', 'text-anchor': 'middle' }, 'e\u2212'),
    svg('circle', { cx: '310', cy: '110', r: '5', fill: '#4A90D9', class: 'pulse', style: 'animation-delay:0.6s' }),
    svg('text', { x: '310', y: '113', 'font-size': '6', fill: '#fff', 'text-anchor': 'middle' }, 'e\u2212'),
    svg('circle', { cx: '310', cy: '190', r: '5', fill: '#4A90D9', class: 'pulse', style: 'animation-delay:0.8s' }),
    svg('text', { x: '310', y: '193', 'font-size': '6', fill: '#fff', 'text-anchor': 'middle' }, 'e\u2212'),
    /* Bus arrows */
    svg('polygon', { points: '350,80 357,90 343,90', fill: '#FFD700' }),
    svg('polygon', { points: '70,170 63,160 77,160', fill: '#FFD700' }),
    /* Label */
    svg('text', { x: '210', y: '252', 'font-size': '11', fill: '#666', 'text-anchor': 'middle' }, 'Each LED gets its own path \u2192 full power!'),
    svg('text', { x: '210', y: '270', 'font-size': '11', fill: '#4A90D9', 'text-anchor': 'middle', 'font-weight': 'bold' }, 'Electrons split into separate lanes'),
  );
}

function createGenericVisual(type, color) {
  return svg('svg', { viewBox: '0 0 400 200', width: '100%', style: 'max-width:400px' },
    svg('circle', { cx: '200', cy: '100', r: '60', fill: color || '#4A90D9', opacity: '0.2' }),
    svg('text', { x: '200', y: '100', 'font-size': '40', 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, '⚡'),
    svg('text', { x: '200', y: '180', 'font-size': '14', fill: '#666', 'text-anchor': 'middle' }, type),
  );
}

/**
 * Mount Learn Mode
 */
export function mountLearnMode(container, lessonData, onComplete) {
  let currentSlide = 0;
  const slides = lessonData.learnMode.slides;

  function renderSlide() {
    tts.cancel();
    const slide = slides[currentSlide];

    // Speak the mascot text aloud after a short delay for the slide to render
    setTimeout(() => tts.speak(slide.mascotSays), 300);

    const content = el('div', { class: 'learn-slide screen-enter' },
      // Visual
      el('div', { class: 'learn-slide__visual' },
        createSlideVisual(slide.visual, lessonData.color)
      ),

      // Title
      el('h2', { style: { color: lessonData.color, fontSize: 'var(--font-size-xl)' } }, slide.title),

      // Mascot speaks — this is the only text, and it's read aloud
      createMascotWithSpeech(slide.mascotSays, 50),

      // Navigation
      el('div', { class: 'learn-slide__nav' },
        el('button', {
          class: 'btn btn--outline btn--small',
          disabled: currentSlide === 0,
          onClick: () => {
            sounds.click();
            currentSlide--;
            renderSlide();
          }
        }, icon('arrow_left', 20), ' Back'),

        // Dots
        el('div', { class: 'slide-dots' },
          ...slides.map((_, i) =>
            el('div', { class: `slide-dot ${i === currentSlide ? 'active' : ''}` })
          )
        ),

        currentSlide < slides.length - 1 ?
          el('button', {
            class: 'btn btn--primary btn--small',
            onClick: () => {
              sounds.click();
              currentSlide++;
              renderSlide();
            }
          }, 'Next ', icon('arrow_right', 20)) :
          el('button', {
            class: 'btn btn--success btn--small',
            onClick: () => {
              tts.cancel();
              sounds.success();
              onComplete();
            }
          }, 'Done! ', icon('check', 20))
      )
    );

    mount(container, content);
  }

  renderSlide();
}
