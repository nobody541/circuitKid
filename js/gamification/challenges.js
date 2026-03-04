/**
 * Challenge mode definitions
 */

export const CHALLENGES = {
  timed: {
    id: 'timed',
    name: 'Timed Challenge',
    description: 'Build a circuit in 60 seconds!',
    icon: '⏱️',
    timeLimit: 60,
    tasks: [
      {
        id: 'timed-1',
        name: 'Simple Light',
        description: 'Connect a battery to an LED',
        requiredComponents: ['battery', 'led'],
        successCondition: 'anyLedLit'
      },
      {
        id: 'timed-2',
        name: 'Switch Control',
        description: 'Build a circuit with a switch that turns an LED on and off',
        requiredComponents: ['battery', 'led', 'switch'],
        successCondition: 'switchControlled'
      },
      {
        id: 'timed-3',
        name: 'Double Light',
        description: 'Light up 2 LEDs at the same time',
        requiredComponents: ['battery', 'led', 'led'],
        successCondition: 'twoLedsLit'
      }
    ]
  },
  fix: {
    id: 'fix',
    name: 'Fix the Circuit',
    description: 'Find and fix the broken circuit!',
    icon: '🔧',
    puzzles: [
      {
        id: 'fix-1',
        name: 'Broken Wire',
        description: 'One wire is missing! Add it to complete the circuit.',
        hint: 'Look for the gap in the wires'
      },
      {
        id: 'fix-2',
        name: 'Wrong Direction',
        description: 'The LED is backwards! Fix it to make it light up.',
        hint: 'LEDs only work in one direction'
      },
      {
        id: 'fix-3',
        name: 'Open Switch',
        description: 'The switch is off! Click it to turn on the circuit.',
        hint: 'Click the switch to close it'
      }
    ]
  },
  creative: {
    id: 'creative',
    name: 'Creative Build',
    description: 'Build anything you can imagine!',
    icon: '🎨',
  }
};
