/**
 * Unlockable rewards
 */

export const UNLOCKABLE_COLORS = {
  'led-yellow': { lesson: 2, name: 'Yellow LED', color: '#FFD700' },
  'led-white': { lesson: 3, name: 'White LED', color: '#FFFFFF' },
  'led-purple': { lesson: 4, name: 'Purple LED', color: '#9C27B0' },
  'led-orange': { lesson: 5, name: 'Orange LED', color: '#FF9800' },
};

export const AVATAR_ITEMS = {
  'hat-hard': { stars: 100, name: 'Hard Hat', type: 'hat' },
  'hat-cap': { stars: 200, name: 'Baseball Cap', type: 'hat' },
  'hat-crown': { stars: 500, name: 'Golden Crown', type: 'hat' },
  'acc-glasses': { stars: 150, name: 'Cool Glasses', type: 'accessory' },
  'acc-cape': { stars: 300, name: 'Super Cape', type: 'accessory' },
  'acc-wings': { stars: 800, name: 'Lightning Wings', type: 'accessory' },
};

export function getUnlocksForLesson(lessonId) {
  const colors = Object.entries(UNLOCKABLE_COLORS)
    .filter(([, v]) => v.lesson === lessonId)
    .map(([k, v]) => ({ type: 'color', id: k, ...v }));
  return colors;
}
