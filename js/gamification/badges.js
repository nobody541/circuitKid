/**
 * Badge definitions and unlock logic
 */

export const BADGES = {
  'battery-boss': {
    id: 'battery-boss',
    name: 'Battery Boss',
    description: 'Completed Lesson 1: What is Electricity?',
    icon: '🔋',
    color: '#FFD700',
    lesson: 1
  },
  'led-master': {
    id: 'led-master',
    name: 'LED Master',
    description: 'Completed Lesson 2: LEDs & Light',
    icon: '💡',
    color: '#FF6B6B',
    lesson: 2
  },
  'switch-hero': {
    id: 'switch-hero',
    name: 'Switch Hero',
    description: 'Completed Lesson 3: Switches & Control',
    icon: '🔘',
    color: '#4CAF50',
    lesson: 3
  },
  'parallel-pro': {
    id: 'parallel-pro',
    name: 'Parallel Pro',
    description: 'Completed Lesson 4: Series vs Parallel',
    icon: '🔀',
    color: '#9C27B0',
    lesson: 4
  },
  'circuit-champion': {
    id: 'circuit-champion',
    name: 'Circuit Champion',
    description: 'Completed Lesson 5: Building Complete Circuits',
    icon: '⚡',
    color: '#4A90D9',
    lesson: 5
  },
  'conductor-detective': {
    id: 'conductor-detective',
    name: 'Conductor Detective',
    description: 'Completed Lesson 6: Conductors & Insulators',
    icon: '🔌',
    color: '#FF5722',
    lesson: 6
  },
  'resistance-ranger': {
    id: 'resistance-ranger',
    name: 'Resistance Ranger',
    description: 'Completed Lesson 7: Resistance & Dimming',
    icon: '🔅',
    color: '#795548',
    lesson: 7
  },
  'motor-master': {
    id: 'motor-master',
    name: 'Motor Master',
    description: 'Completed Lesson 8: Motors & Movement',
    icon: '⚙️',
    color: '#607D8B',
    lesson: 8
  },
  'static-spark': {
    id: 'static-spark',
    name: 'Static Spark',
    description: 'Completed Lesson 9: Static Electricity',
    icon: '🎈',
    color: '#E91E63',
    lesson: 9
  },
  'electromagnet-engineer': {
    id: 'electromagnet-engineer',
    name: 'Electromagnet Engineer',
    description: 'Completed Lesson 10: Electromagnets',
    icon: '🧲',
    color: '#3F51B5',
    lesson: 10
  },
  'speed-builder': {
    id: 'speed-builder',
    name: 'Speed Builder',
    description: 'Completed a Timed Challenge',
    icon: '⏱️',
    color: '#FF9800'
  },
  'bug-fixer': {
    id: 'bug-fixer',
    name: 'Bug Fixer',
    description: 'Fixed a Broken Circuit',
    icon: '🔧',
    color: '#00BCD4'
  },
  'master-inventor': {
    id: 'master-inventor',
    name: 'Master Inventor',
    description: 'Reached 1000+ Stars!',
    icon: '🏆',
    color: '#FFD700'
  }
};

export function getBadgeForLesson(lessonId) {
  return Object.values(BADGES).find(b => b.lesson === lessonId) || null;
}

export function getBadgeInfo(badgeId) {
  return BADGES[badgeId] || null;
}
