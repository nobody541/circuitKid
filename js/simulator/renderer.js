/**
 * SVG Circuit Renderer - renders components and wires as cartoon-style SVGs
 */
import { svg } from '../utils/dom.js';

const LED_COLORS = {
  red: { fill: '#FF0000', glow: '#FF0000', filter: 'url(#glow-red)' },
  green: { fill: '#00CC00', glow: '#00FF00', filter: 'url(#glow-green)' },
  blue: { fill: '#0066FF', glow: '#0088FF', filter: 'url(#glow-blue)' },
  yellow: { fill: '#FFD700', glow: '#FFD700', filter: 'url(#glow-yellow)' },
  white: { fill: '#FFFFFF', glow: '#FFFFFF', filter: 'url(#glow-blue)' },
  purple: { fill: '#9C27B0', glow: '#CE93D8', filter: 'url(#glow-red)' },
  orange: { fill: '#FF9800', glow: '#FFB74D', filter: 'url(#glow-yellow)' },
};

export class CircuitRenderer {
  constructor(containerElement, engine) {
    this.engine = engine;
    this.container = containerElement;
    this.svgRoot = null;
    this.wireLayer = null;
    this.componentLayer = null;
    this.glowLayer = null;
    this.overlayLayer = null;
    this.componentElements = new Map();
    this.wireElements = new Map();
    this.provisionalWire = null;
    this.onComponentClick = null;
    this.onTerminalClick = null;
    this.onSwitchToggle = null;

    this.createSVG();
  }

  createSVG() {
    this.svgRoot = svg('svg', {
      class: 'simulator__svg',
      viewBox: '0 0 800 500',
      preserveAspectRatio: 'xMidYMid meet',
    });

    this.glowLayer = svg('g', { class: 'glow-layer' });
    this.wireLayer = svg('g', { class: 'wire-layer' });
    this.componentLayer = svg('g', { class: 'component-layer' });
    this.overlayLayer = svg('g', { class: 'overlay-layer' });

    this.svgRoot.appendChild(this.glowLayer);
    this.svgRoot.appendChild(this.wireLayer);
    this.svgRoot.appendChild(this.componentLayer);
    this.svgRoot.appendChild(this.overlayLayer);

    this.container.appendChild(this.svgRoot);
  }

  /**
   * Full re-render of the circuit
   */
  render() {
    // Clear layers
    while (this.componentLayer.firstChild) this.componentLayer.removeChild(this.componentLayer.firstChild);
    while (this.wireLayer.firstChild) this.wireLayer.removeChild(this.wireLayer.firstChild);
    while (this.glowLayer.firstChild) this.glowLayer.removeChild(this.glowLayer.firstChild);

    this.componentElements.clear();
    this.wireElements.clear();

    // Render wires
    for (const [, wire] of this.engine.wires) {
      this.renderWire(wire);
    }

    // Render components
    for (const [, comp] of this.engine.components) {
      this.renderComponent(comp);
    }
  }

  renderComponent(comp) {
    let group;
    switch (comp.type) {
      case 'battery': group = this.renderBattery(comp); break;
      case 'led': group = this.renderLED(comp); break;
      case 'switch': group = this.renderSwitch(comp); break;
      default: return;
    }

    group.setAttribute('data-component-id', comp.id);
    group.setAttribute('transform', `translate(${comp.x}, ${comp.y}) rotate(${comp.rotation})`);
    group.classList.add('circuit-component');

    this.componentLayer.appendChild(group);
    this.componentElements.set(comp.id, group);

    // Add terminal interaction points — big and easy to tap
    const terminals = comp.getTerminalPositions();
    for (const t of terminals) {
      const connected = this.engine.isTerminalConnected(t.id);

      // Outer ring for visibility
      const outerRing = svg('circle', {
        cx: t.x,
        cy: t.y,
        r: connected ? 12 : 16,
        fill: 'none',
        stroke: connected ? '#4CAF50' : '#FF9800',
        'stroke-width': '3',
        'stroke-dasharray': connected ? 'none' : '4 2',
        opacity: connected ? '0.5' : '0.8'
      });
      this.componentLayer.appendChild(outerRing);

      // Main circle — much bigger
      const circle = svg('circle', {
        cx: t.x,
        cy: t.y,
        r: connected ? 9 : 13,
        fill: connected ? '#4CAF50' : '#FF9800',
        stroke: '#333',
        'stroke-width': '2.5',
        class: `terminal ${connected ? 'connected' : 'highlight'}`,
        'data-terminal-id': t.id,
        style: 'cursor: crosshair'
      });

      // Large invisible hit area for easy tapping
      const hitArea = svg('circle', {
        cx: t.x,
        cy: t.y,
        r: '22',
        fill: 'transparent',
        style: 'cursor: crosshair',
        'data-terminal-id': t.id,
      });

      hitArea.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (this.onTerminalClick) this.onTerminalClick(t.id, t.x, t.y);
      });
      circle.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (this.onTerminalClick) this.onTerminalClick(t.id, t.x, t.y);
      });

      this.componentLayer.appendChild(circle);
      this.componentLayer.appendChild(hitArea);
    }
  }

  renderBattery(battery) {
    const g = svg('g', {},
      // Body
      svg('rect', { x: '-55', y: '-28', width: '110', height: '56', rx: '12', fill: '#555', stroke: '#333', 'stroke-width': '3' }),
      // Positive cap
      svg('rect', { x: '-68', y: '-20', width: '16', height: '40', rx: '5', fill: '#CC0000', stroke: '#333', 'stroke-width': '2' }),
      // Negative cap
      svg('rect', { x: '52', y: '-20', width: '16', height: '40', rx: '5', fill: '#333', stroke: '#222', 'stroke-width': '2' }),
      // Plus sign
      svg('text', { x: '-50', y: '8', 'font-size': '24', 'font-weight': 'bold', fill: '#FFF', 'text-anchor': 'middle' }, '+'),
      // Minus sign
      svg('text', { x: '50', y: '8', 'font-size': '26', 'font-weight': 'bold', fill: '#FFF', 'text-anchor': 'middle' }, '−'),
      // Label
      svg('text', { x: '0', y: '8', 'font-size': '16', 'font-weight': 'bold', fill: '#FFD700', 'text-anchor': 'middle' }, '3V'),
      // Top label
      svg('text', { x: '0', y: '-36', 'font-size': '13', 'font-weight': 'bold', fill: '#888', 'text-anchor': 'middle' }, 'BATTERY'),
    );
    return g;
  }

  renderLED(led) {
    const colorInfo = LED_COLORS[led.color] || LED_COLORS.red;
    const colorName = led.color.charAt(0).toUpperCase() + led.color.slice(1);

    const g = svg('g', {},
      // Glow effect (only visible when lit)
      svg('circle', {
        cx: '0', cy: '-8', r: '50',
        fill: colorInfo.glow,
        opacity: led.isLit ? '0.4' : '0',
        class: `led-glow ${led.isLit ? 'lit' : ''}`,
        filter: led.isLit ? colorInfo.filter : 'none'
      }),
      // LED dome (triangular body) — big
      svg('polygon', {
        points: '-28,20 28,20 0,-32',
        fill: led.isLit ? colorInfo.fill : colorInfo.fill + '66',
        stroke: '#333',
        'stroke-width': '3',
        'stroke-linejoin': 'round'
      }),
      // Flat bottom
      svg('rect', { x: '-28', y: '20', width: '56', height: '10', rx: '3', fill: '#888', stroke: '#333', 'stroke-width': '2' }),
      // Legs — thicker, longer
      svg('line', { x1: '-14', y1: '30', x2: '-50', y2: '0', stroke: '#999', 'stroke-width': '4', 'stroke-linecap': 'round' }),
      svg('line', { x1: '14', y1: '30', x2: '50', y2: '0', stroke: '#999', 'stroke-width': '4', 'stroke-linecap': 'round' }),

      // PLUS label — big red circle with white +
      svg('circle', { cx: '-58', cy: '-16', r: '16', fill: '#CC0000', stroke: '#fff', 'stroke-width': '2' }),
      svg('text', { x: '-58', y: '-9', 'font-size': '28', 'font-weight': 'bold', fill: '#FFF', 'text-anchor': 'middle' }, '+'),

      // MINUS label — big dark circle with white −
      svg('circle', { cx: '58', cy: '-16', r: '16', fill: '#444', stroke: '#fff', 'stroke-width': '2' }),
      svg('text', { x: '58', y: '-8', 'font-size': '30', 'font-weight': 'bold', fill: '#FFF', 'text-anchor': 'middle' }, '−'),

      // Color label below
      svg('text', { x: '0', y: '48', 'font-size': '13', 'font-weight': 'bold', fill: '#666', 'text-anchor': 'middle' }, colorName + ' LED'),
      // Light shine on dome when lit
      led.isLit ? svg('circle', { cx: '-5', cy: '-14', r: '7', fill: 'rgba(255,255,255,0.6)' }) : null,
    );
    return g;
  }

  renderSwitch(sw) {
    const g = svg('g', {},
      // Base — bigger
      svg('rect', { x: '-50', y: '-14', width: '100', height: '28', rx: '8', fill: '#DDD', stroke: '#333', 'stroke-width': '3' }),
      // Contact points — bigger
      svg('circle', { cx: '-36', cy: '0', r: '7', fill: '#FFD700', stroke: '#333', 'stroke-width': '2' }),
      svg('circle', { cx: '36', cy: '0', r: '7', fill: '#FFD700', stroke: '#333', 'stroke-width': '2' }),
      // Lever — thicker
      svg('line', {
        x1: '-36', y1: '0',
        x2: sw.isClosed ? '36' : '16',
        y2: sw.isClosed ? '0' : '-34',
        stroke: sw.isClosed ? '#4CAF50' : '#FF6B6B',
        'stroke-width': '6',
        'stroke-linecap': 'round',
        class: 'switch-lever'
      }),
      // Label — bigger
      svg('text', {
        x: '0', y: '36',
        'font-size': '16',
        'font-weight': 'bold',
        fill: sw.isClosed ? '#4CAF50' : '#FF6B6B',
        'text-anchor': 'middle'
      }, sw.isClosed ? 'ON' : 'OFF'),
      // Top label
      svg('text', { x: '0', y: '-22', 'font-size': '12', 'font-weight': 'bold', fill: '#888', 'text-anchor': 'middle' }, 'SWITCH'),
      // Tap instruction
      svg('text', { x: '0', y: '52', 'font-size': '10', fill: '#AAA', 'text-anchor': 'middle' }, '(tap to toggle)'),
    );

    // Click to toggle — bigger hit area
    const hitArea = svg('rect', {
      x: '-55', y: '-40', width: '110', height: '90',
      fill: 'transparent',
      style: 'cursor: pointer'
    });
    hitArea.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.onSwitchToggle) this.onSwitchToggle(sw.id);
    });
    g.appendChild(hitArea);

    return g;
  }

  renderWire(wire) {
    const fromComp = this.engine.getComponentByTerminal(wire.from);
    const toComp = this.engine.getComponentByTerminal(wire.to);
    if (!fromComp || !toComp) return;

    const fromPos = fromComp.getTerminalPositions().find(t => t.id === wire.from);
    const toPos = toComp.getTerminalPositions().find(t => t.id === wire.to);
    if (!fromPos || !toPos) return;

    // Check if this wire is in an active path
    const analysis = this.lastAnalysis;
    let isActive = false;
    if (analysis && analysis.isComplete) {
      // Simple check: if both terminals' components have lit LEDs or are batteries
      isActive = analysis.activeLEDs.length > 0;
    }

    // Create L-shaped wire path
    const midX = (fromPos.x + toPos.x) / 2;
    const path = `M ${fromPos.x} ${fromPos.y} L ${midX} ${fromPos.y} L ${midX} ${toPos.y} L ${toPos.x} ${toPos.y}`;

    const wirePath = svg('path', {
      d: path,
      class: `wire ${isActive ? 'active' : ''}`,
      'data-wire-id': wire.id,
    });

    wirePath.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    this.wireLayer.appendChild(wirePath);
    this.wireElements.set(wire.id, wirePath);
  }

  /**
   * Show a provisional wire while drawing
   */
  showProvisionalWire(fromX, fromY, toX, toY) {
    if (this.provisionalWire) {
      this.provisionalWire.remove();
    }
    const midX = (fromX + toX) / 2;
    const path = `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
    this.provisionalWire = svg('path', {
      d: path,
      class: 'wire provisional'
    });
    this.overlayLayer.appendChild(this.provisionalWire);
  }

  hideProvisionalWire() {
    if (this.provisionalWire) {
      this.provisionalWire.remove();
      this.provisionalWire = null;
    }
  }

  /**
   * Update render after analysis
   */
  update(analysis) {
    this.lastAnalysis = analysis;
    this.render();
  }

  /**
   * Get SVG coordinates from pointer event
   */
  getSVGPoint(event) {
    const rect = this.svgRoot.getBoundingClientRect();
    const viewBox = this.svgRoot.viewBox.baseVal;
    const scaleX = viewBox.width / rect.width;
    const scaleY = viewBox.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  destroy() {
    if (this.svgRoot && this.svgRoot.parentNode) {
      this.svgRoot.parentNode.removeChild(this.svgRoot);
    }
  }
}
