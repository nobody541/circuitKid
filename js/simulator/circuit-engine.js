/**
 * Circuit Engine - Graph-based electrical analysis
 * Simplified for kids: only detects complete circuits, active LEDs, switches
 */

export class CircuitEngine {
  constructor() {
    this.components = new Map();
    this.wires = new Map();
  }

  addComponent(component) {
    this.components.set(component.id, component);
  }

  removeComponent(componentId) {
    const comp = this.components.get(componentId);
    if (!comp) return;

    // Remove all wires connected to this component's terminals
    const terminalIds = new Set(comp.terminals.map(t => t.id));
    for (const [wireId, wire] of this.wires) {
      if (terminalIds.has(wire.from) || terminalIds.has(wire.to)) {
        this.wires.delete(wireId);
      }
    }
    this.components.delete(componentId);
  }

  addWire(wire) {
    // Prevent duplicate wires
    for (const [, existing] of this.wires) {
      if ((existing.from === wire.from && existing.to === wire.to) ||
          (existing.from === wire.to && existing.to === wire.from)) {
        return false;
      }
    }
    this.wires.set(wire.id, wire);
    return true;
  }

  removeWire(wireId) {
    this.wires.delete(wireId);
  }

  clear() {
    this.components.clear();
    this.wires.clear();
  }

  /**
   * Build adjacency graph from terminals and wires
   */
  buildGraph() {
    const adj = new Map(); // terminalId -> Set of connected terminalIds

    // Add internal connections (within each component, terminals are connected through the component)
    // But for circuit analysis, we need to handle components specially

    // Add wire connections
    for (const [, wire] of this.wires) {
      if (!adj.has(wire.from)) adj.set(wire.from, new Set());
      if (!adj.has(wire.to)) adj.set(wire.to, new Set());
      adj.get(wire.from).add(wire.to);
      adj.get(wire.to).add(wire.from);
    }

    return adj;
  }

  /**
   * Get the component that owns a terminal
   */
  getComponentByTerminal(terminalId) {
    for (const [, comp] of this.components) {
      for (const t of comp.terminals) {
        if (t.id === terminalId) return comp;
      }
    }
    return null;
  }

  /**
   * Get the other terminal of a component
   */
  getOtherTerminal(component, terminalId) {
    const other = component.terminals.find(t => t.id !== terminalId);
    return other ? other.id : null;
  }

  /**
   * Find all complete circuits (paths from battery + through components back to battery -)
   */
  analyze() {
    const result = {
      isComplete: false,
      activeLEDs: [],
      allLEDs: [],
      shortCircuit: false,
      openSwitches: [],
      paths: []
    };

    // Reset all LEDs
    for (const [, comp] of this.components) {
      if (comp.type === 'led') {
        comp.isLit = false;
        comp.brightness = 0;
        result.allLEDs.push(comp.id);
      }
    }

    // Find all batteries
    const batteries = [];
    for (const [, comp] of this.components) {
      if (comp.type === 'battery') batteries.push(comp);
    }

    if (batteries.length === 0) return result;

    const adj = this.buildGraph();

    // For each battery, try to find paths from positive to negative
    for (const battery of batteries) {
      const posTerminal = battery.terminals.find(t => t.label === '+');
      const negTerminal = battery.terminals.find(t => t.label === '-');
      if (!posTerminal || !negTerminal) continue;

      // BFS/DFS from positive terminal through wires and components to negative terminal
      const paths = this.findPaths(adj, posTerminal.id, negTerminal.id, battery.id);

      for (const path of paths) {
        // Check if path is valid (all switches closed, has at least one load)
        const pathAnalysis = this.analyzePath(path, battery.id);

        if (pathAnalysis.openSwitches.length > 0) {
          result.openSwitches.push(...pathAnalysis.openSwitches);
          continue;
        }

        if (pathAnalysis.leds.length === 0) {
          // Short circuit! Battery connected directly with only wires
          result.shortCircuit = true;
          continue;
        }

        // Valid circuit path! Light up LEDs
        result.isComplete = true;
        result.paths.push(path);

        // Calculate brightness based on number of LEDs in series
        const brightness = 1 / pathAnalysis.leds.length;
        for (const ledId of pathAnalysis.leds) {
          const led = this.components.get(ledId);
          if (led) {
            led.isLit = true;
            led.brightness = Math.max(led.brightness, brightness);
            if (!result.activeLEDs.includes(ledId)) {
              result.activeLEDs.push(ledId);
            }
          }
        }
      }
    }

    return result;
  }

  /**
   * Find all simple paths from start terminal to end terminal
   * Traverses through wires and through components (terminal A -> terminal B)
   */
  findPaths(adj, startTerminal, endTerminal, batteryId) {
    const paths = [];
    const maxPaths = 10;

    const dfs = (current, visited, path) => {
      if (paths.length >= maxPaths) return;
      if (current === endTerminal) {
        paths.push([...path]);
        return;
      }

      // Get wire connections from current terminal
      const wireNeighbors = adj.get(current) || new Set();

      for (const neighbor of wireNeighbors) {
        if (visited.has(neighbor)) continue;

        // This neighbor is a terminal connected by wire
        // Find what component it belongs to
        const comp = this.getComponentByTerminal(neighbor);
        if (!comp) continue;

        // Don't go back through the same battery
        if (comp.type === 'battery' && comp.id !== batteryId) continue;
        if (comp.type === 'battery' && comp.id === batteryId) {
          // We can only reach the battery's negative terminal as end
          if (neighbor === endTerminal) {
            visited.add(neighbor);
            path.push(neighbor);
            paths.push([...path]);
            path.pop();
            visited.delete(neighbor);
          }
          continue;
        }

        // Traverse through the component to its other terminal
        const otherTerminal = this.getOtherTerminal(comp, neighbor);
        if (!otherTerminal || visited.has(otherTerminal)) continue;

        visited.add(neighbor);
        visited.add(otherTerminal);
        path.push(neighbor, otherTerminal);

        // Continue from the other terminal through wires
        const nextNeighbors = adj.get(otherTerminal) || new Set();
        for (const next of nextNeighbors) {
          if (!visited.has(next)) {
            dfs(next, visited, path);
          }
          // Also check if otherTerminal IS the endTerminal
        }
        if (otherTerminal === endTerminal) {
          paths.push([...path]);
        }

        path.pop();
        path.pop();
        visited.delete(otherTerminal);
        visited.delete(neighbor);
      }
    };

    const visited = new Set([startTerminal]);
    dfs(startTerminal, visited, [startTerminal]);
    return paths;
  }

  /**
   * Analyze a specific path to check for open switches and count LEDs
   */
  analyzePath(path, batteryId) {
    const leds = [];
    const openSwitches = [];
    const visitedComponents = new Set();

    for (const terminalId of path) {
      const comp = this.getComponentByTerminal(terminalId);
      if (!comp || visitedComponents.has(comp.id)) continue;
      visitedComponents.add(comp.id);

      if (comp.id === batteryId) continue;

      if (comp.type === 'led') {
        leds.push(comp.id);
      } else if (comp.type === 'switch') {
        if (!comp.isClosed) {
          openSwitches.push(comp.id);
        }
      }
    }

    return { leds, openSwitches };
  }

  /**
   * Detect circuit topology (series, parallel, mixed)
   */
  detectTopology() {
    const analysis = this.analyze();
    if (!analysis.isComplete) return 'incomplete';
    if (analysis.paths.length === 0) return 'incomplete';
    if (analysis.paths.length === 1) return 'series';
    if (analysis.activeLEDs.length > 1) return 'parallel';
    return 'series';
  }

  /**
   * Get component count by type
   */
  getComponentCounts() {
    const counts = { battery: 0, led: 0, switch: 0 };
    for (const [, comp] of this.components) {
      counts[comp.type] = (counts[comp.type] || 0) + 1;
    }
    return counts;
  }

  /**
   * Check if a terminal has any wire connected
   */
  isTerminalConnected(terminalId) {
    for (const [, wire] of this.wires) {
      if (wire.from === terminalId || wire.to === terminalId) return true;
    }
    return false;
  }

  /**
   * Get all wires connected to a terminal
   */
  getWiresForTerminal(terminalId) {
    const result = [];
    for (const [, wire] of this.wires) {
      if (wire.from === terminalId || wire.to === terminalId) {
        result.push(wire);
      }
    }
    return result;
  }
}
