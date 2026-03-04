/**
 * Circuit component classes
 */
import { uuid } from '../utils/helpers.js';

export class CircuitComponent {
  constructor(type, x = 0, y = 0) {
    this.id = uuid();
    this.type = type;
    this.x = x;
    this.y = y;
    this.rotation = 0;
    this.terminals = [];
  }

  getTerminalPositions() {
    const rad = (this.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return this.terminals.map(t => ({
      id: t.id,
      x: this.x + t.relX * cos - t.relY * sin,
      y: this.y + t.relX * sin + t.relY * cos,
      label: t.label
    }));
  }

  rotate() {
    this.rotation = (this.rotation + 90) % 360;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      x: this.x,
      y: this.y,
      rotation: this.rotation,
      extraData: this.getExtraData()
    };
  }

  getExtraData() { return {}; }
}

export class Battery extends CircuitComponent {
  constructor(x, y) {
    super('battery', x, y);
    this.voltage = 3;
    this.terminals = [
      { id: this.id + '_pos', relX: -75, relY: 0, label: '+' },
      { id: this.id + '_neg', relX: 75, relY: 0, label: '-' }
    ];
  }
}

export class LED extends CircuitComponent {
  constructor(x, y, color = 'red') {
    super('led', x, y);
    this.color = color;
    this.isLit = false;
    this.brightness = 0;
    this.terminals = [
      { id: this.id + '_anode', relX: -55, relY: 0, label: '+' },
      { id: this.id + '_cathode', relX: 55, relY: 0, label: '-' }
    ];
  }

  getExtraData() { return { color: this.color, isLit: this.isLit }; }
}

export class Switch extends CircuitComponent {
  constructor(x, y, switchType = 'slide') {
    super('switch', x, y);
    this.switchType = switchType;
    this.isClosed = false;
    this.terminals = [
      { id: this.id + '_a', relX: -60, relY: 0, label: 'A' },
      { id: this.id + '_b', relX: 60, relY: 0, label: 'B' }
    ];
  }

  toggle() {
    this.isClosed = !this.isClosed;
    return this.isClosed;
  }

  getExtraData() { return { switchType: this.switchType, isClosed: this.isClosed }; }
}

export class Wire {
  constructor(fromTerminalId, toTerminalId) {
    this.id = uuid();
    this.from = fromTerminalId;
    this.to = toTerminalId;
  }

  serialize() {
    return { id: this.id, from: this.from, to: this.to };
  }
}

// Factory
export function createComponent(type, x, y, options = {}) {
  switch (type) {
    case 'battery': return new Battery(x, y);
    case 'led': return new LED(x, y, options.color || 'red');
    case 'led-red': return new LED(x, y, 'red');
    case 'led-green': return new LED(x, y, 'green');
    case 'led-blue': return new LED(x, y, 'blue');
    case 'led-yellow': return new LED(x, y, 'yellow');
    case 'led-white': return new LED(x, y, 'white');
    case 'led-purple': return new LED(x, y, 'purple');
    case 'led-orange': return new LED(x, y, 'orange');
    case 'switch': return new Switch(x, y, options.switchType || 'slide');
    case 'push-button': return new Switch(x, y, 'push');
    default: return null;
  }
}
