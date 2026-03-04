/**
 * Circuit Interaction Handler - drag-drop, wire drawing, component placement
 */
import { snapToGrid } from '../utils/helpers.js';
import { sounds } from '../utils/audio.js';
import { Wire } from './components.js';

export class CircuitInteraction {
  constructor(renderer, engine) {
    this.renderer = renderer;
    this.engine = engine;
    this.dragState = null;
    this.wireDrawState = null;
    this.selectedComponent = null;
    this.onCircuitChanged = null;
    this.onComponentSelected = null;

    this.setupEvents();
    this.setupRendererCallbacks();
  }

  setupRendererCallbacks() {
    this.renderer.onTerminalClick = (terminalId, x, y) => {
      this.handleTerminalClick(terminalId, x, y);
    };

    this.renderer.onSwitchToggle = (switchId) => {
      this.handleSwitchToggle(switchId);
    };
  }

  setupEvents() {
    const svgRoot = this.renderer.svgRoot;

    svgRoot.addEventListener('pointerdown', (e) => this.onPointerDown(e));
    svgRoot.addEventListener('pointermove', (e) => this.onPointerMove(e));
    svgRoot.addEventListener('pointerup', (e) => this.onPointerUp(e));

    // Keyboard
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        this.deleteSelected();
      }
      if (e.key === 'r' || e.key === 'R') {
        this.rotateSelected();
      }
      if (e.key === 'Escape') {
        this.cancelWireDraw();
        this.deselect();
      }
    });
  }

  onPointerDown(e) {
    const point = this.renderer.getSVGPoint(e);

    // Check if we clicked on a component
    const compEl = e.target.closest('[data-component-id]');
    if (compEl && !e.target.closest('[data-terminal-id]')) {
      const compId = compEl.dataset.componentId;
      const comp = this.engine.components.get(compId);
      if (!comp) return;

      // Start dragging
      this.dragState = {
        componentId: compId,
        startX: comp.x,
        startY: comp.y,
        offsetX: point.x - comp.x,
        offsetY: point.y - comp.y
      };

      this.selectComponent(compId);
      compEl.classList.add('dragging');
      e.preventDefault();
      return;
    }

    // Clicked on empty space - deselect
    if (!e.target.closest('[data-terminal-id]')) {
      this.deselect();
      this.cancelWireDraw();
    }
  }

  onPointerMove(e) {
    const point = this.renderer.getSVGPoint(e);

    if (this.dragState) {
      const comp = this.engine.components.get(this.dragState.componentId);
      if (comp) {
        comp.x = snapToGrid(point.x - this.dragState.offsetX, 20);
        comp.y = snapToGrid(point.y - this.dragState.offsetY, 20);
        this.rerender();
      }
    }

    if (this.wireDrawState) {
      this.renderer.showProvisionalWire(
        this.wireDrawState.fromX,
        this.wireDrawState.fromY,
        point.x,
        point.y
      );
    }
  }

  onPointerUp(e) {
    if (this.dragState) {
      const compEl = this.renderer.componentElements.get(this.dragState.componentId);
      if (compEl) compEl.classList.remove('dragging');
      this.dragState = null;
      this.analyzeAndUpdate();
    }
  }

  handleTerminalClick(terminalId, x, y) {
    if (!this.wireDrawState) {
      // Start drawing wire from this terminal
      this.wireDrawState = {
        fromTerminalId: terminalId,
        fromX: x,
        fromY: y
      };
      sounds.click();
    } else {
      // Complete wire to this terminal
      if (terminalId !== this.wireDrawState.fromTerminalId) {
        const wire = new Wire(this.wireDrawState.fromTerminalId, terminalId);
        const added = this.engine.addWire(wire);
        if (added) {
          sounds.connect();
        }
      }
      this.renderer.hideProvisionalWire();
      this.wireDrawState = null;
      this.analyzeAndUpdate();
    }
  }

  handleSwitchToggle(switchId) {
    const sw = this.engine.components.get(switchId);
    if (sw && sw.type === 'switch') {
      sw.toggle();
      sounds.switchToggle();
      this.analyzeAndUpdate();
    }
  }

  selectComponent(compId) {
    this.deselect();
    this.selectedComponent = compId;
    const el = this.renderer.componentElements.get(compId);
    if (el) el.classList.add('selected');
    if (this.onComponentSelected) this.onComponentSelected(compId);
  }

  deselect() {
    if (this.selectedComponent) {
      const el = this.renderer.componentElements.get(this.selectedComponent);
      if (el) el.classList.remove('selected');
      this.selectedComponent = null;
    }
  }

  deleteSelected() {
    if (this.selectedComponent) {
      this.engine.removeComponent(this.selectedComponent);
      this.selectedComponent = null;
      sounds.click();
      this.analyzeAndUpdate();
    }
  }

  rotateSelected() {
    if (this.selectedComponent) {
      const comp = this.engine.components.get(this.selectedComponent);
      if (comp) {
        comp.rotate();
        sounds.click();
        this.analyzeAndUpdate();
      }
    }
  }

  cancelWireDraw() {
    this.wireDrawState = null;
    this.renderer.hideProvisionalWire();
  }

  /**
   * Place a new component on the canvas
   */
  placeComponent(component) {
    this.engine.addComponent(component);
    sounds.click();
    this.rerender();
    this.selectComponent(component.id);
  }

  rerender() {
    const analysis = this.engine.analyze();
    this.renderer.update(analysis);
  }

  analyzeAndUpdate() {
    const analysis = this.engine.analyze();
    this.renderer.update(analysis);

    // Check for newly lit LEDs
    if (analysis.activeLEDs.length > 0) {
      sounds.ledOn();
    }

    if (this.onCircuitChanged) {
      this.onCircuitChanged(analysis);
    }
  }

  destroy() {
    // Cleanup events would go here
  }
}
