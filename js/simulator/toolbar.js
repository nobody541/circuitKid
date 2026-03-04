/**
 * Component Toolbar - palette of draggable components
 */
import { el, svg, icon } from '../utils/dom.js';
import { createComponent } from './components.js';
import { sounds } from '../utils/audio.js';

const COMPONENT_DEFS = {
  battery: { label: 'Battery', icon: '🔋', color: '#FFD700' },
  'led-red': { label: 'Red LED', icon: '🔴', color: '#FF0000' },
  'led-green': { label: 'Green LED', icon: '🟢', color: '#00CC00' },
  'led-blue': { label: 'Blue LED', icon: '🔵', color: '#0066FF' },
  'led-yellow': { label: 'Yellow LED', icon: '🟡', color: '#FFD700' },
  'led-white': { label: 'White LED', icon: '⚪', color: '#CCCCCC' },
  'led-purple': { label: 'Purple LED', icon: '🟣', color: '#9C27B0' },
  'led-orange': { label: 'Orange LED', icon: '🟠', color: '#FF9800' },
  switch: { label: 'Switch', icon: '🔘', color: '#4CAF50' },
  'push-button': { label: 'Button', icon: '⏺️', color: '#2196F3' },
};

export class ComponentToolbar {
  constructor(container, availableTypes, onPlaceComponent) {
    this.container = container;
    this.availableTypes = availableTypes;
    this.onPlaceComponent = onPlaceComponent;
    this.element = null;
    this.render();
  }

  render() {
    const items = this.availableTypes.map(type => {
      const def = COMPONENT_DEFS[type];
      if (!def) return null;

      const item = el('div', {
        class: 'sim-toolbar__item',
        onClick: () => {
          sounds.click();
          // Place at center of workspace with some randomness
          const x = 200 + Math.random() * 400;
          const y = 150 + Math.random() * 200;
          const comp = createComponent(type, Math.round(x / 20) * 20, Math.round(y / 20) * 20);
          if (comp && this.onPlaceComponent) {
            this.onPlaceComponent(comp);
          }
        }
      },
        el('div', {
          class: 'sim-toolbar__icon',
          style: { fontSize: '2.5rem', lineHeight: '56px', textAlign: 'center', width: '56px', height: '56px' }
        }, def.icon),
        el('div', { class: 'sim-toolbar__label', style: { fontSize: '0.85rem' } }, def.label)
      );
      return item;
    }).filter(Boolean);

    this.element = el('div', { class: 'sim-toolbar' },
      ...items,
      el('div', { class: 'sim-toolbar__divider' }),
      el('div', { class: 'sim-toolbar__actions' },
        el('button', {
          class: 'btn btn--small btn--outline',
          title: 'Delete selected (Del)',
          onClick: () => {
            if (this.onDelete) this.onDelete();
          }
        }, icon('delete', 18)),
        el('button', {
          class: 'btn btn--small btn--outline',
          title: 'Undo',
          onClick: () => {
            if (this.onUndo) this.onUndo();
          }
        }, icon('undo', 18)),
      )
    );

    this.container.appendChild(this.element);
  }

  setOnDelete(fn) { this.onDelete = fn; }
  setOnUndo(fn) { this.onUndo = fn; }

  destroy() {
    if (this.element) this.element.remove();
  }
}
