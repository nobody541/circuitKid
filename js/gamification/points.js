/**
 * Points, levels, and unlock logic
 */

const LEVEL_THRESHOLDS = [
  { min: 0, max: 99, title: 'Spark Starter', tier: 1, icon: 'spark' },
  { min: 100, max: 299, title: 'Circuit Explorer', tier: 2, icon: 'explorer' },
  { min: 300, max: 599, title: 'Power Builder', tier: 3, icon: 'builder' },
  { min: 600, max: 999, title: 'Junior Engineer', tier: 4, icon: 'engineer' },
  { min: 1000, max: Infinity, title: 'Master Inventor', tier: 5, icon: 'master' },
];

export function getLevelTitle(stars) {
  for (const level of LEVEL_THRESHOLDS) {
    if (stars >= level.min && stars <= level.max) {
      return level;
    }
  }
  return LEVEL_THRESHOLDS[0];
}

export function getNextLevelProgress(stars) {
  const current = getLevelTitle(stars);
  if (current.tier === 5) {
    return { progress: 1, nextThreshold: null };
  }
  const nextLevel = LEVEL_THRESHOLDS[current.tier]; // next tier
  return {
    progress: (stars - current.min) / (nextLevel.min - current.min),
    nextThreshold: nextLevel.min
  };
}

export const STARS_PER_PHASE = {
  intro: 0,
  learn: 10,
  game: 20,
  practice: 30,
  project: 40
};

export function getTotalPossibleStars(lessonCount = 5) {
  const perLesson = Object.values(STARS_PER_PHASE).reduce((a, b) => a + b, 0);
  return perLesson * lessonCount;
}
