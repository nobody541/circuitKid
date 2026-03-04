/**
 * Home Dashboard Screen
 */
import { el, mount, icon } from '../utils/dom.js';
import { state } from '../state.js';
import { createSmallMascot, createMascotWithSpeech } from '../ui/mascot.js';
import { sounds } from '../utils/audio.js';
import { getLevelTitle, getNextLevelProgress } from '../gamification/points.js';

const LESSONS_INFO = [
  { id: 1, title: 'What is Electricity?', subtitle: 'Meet the Battery!', color: '#FFD700', icon: '🔋' },
  { id: 2, title: 'LEDs & Light', subtitle: 'Colors of Electricity!', color: '#FF6B6B', icon: '💡' },
  { id: 3, title: 'Switches & Control', subtitle: 'On and Off!', color: '#4CAF50', icon: '🔘' },
  { id: 4, title: 'Series vs Parallel', subtitle: 'Two Paths of Power!', color: '#9C27B0', icon: '🔀' },
  { id: 5, title: 'Complete Circuits', subtitle: 'Build Amazing Things!', color: '#4A90D9', icon: '⚡' },
  { id: 6, title: 'Conductors & Insulators', subtitle: 'What Lets Electricity Through?', color: '#FF9800', icon: '🔌' },
  { id: 7, title: 'Resistance & Dimming', subtitle: 'Slow Down the Electrons!', color: '#795548', icon: '🔅' },
  { id: 8, title: 'Motors & Movement', subtitle: 'Make Things Spin!', color: '#E91E63', icon: '⚙️' },
  { id: 9, title: 'Static Electricity', subtitle: 'Zap and Attract!', color: '#00BCD4', icon: '🎈' },
  { id: 10, title: 'Electromagnets', subtitle: 'Magnet Power!', color: '#3F51B5', icon: '🧲' },
];

export function mountDashboard(container, router) {
  const profile = state.getActiveProfile();
  if (!profile) {
    router.navigate('/profile');
    return () => {};
  }

  const data = state.getActiveProfileData();
  const stars = data.stars;
  const level = getLevelTitle(stars);
  const progress = getNextLevelProgress(stars);

  // Determine mascot message
  let mascotMsg = `Welcome back, ${profile.name}! Ready to learn?`;
  if (stars === 0) {
    mascotMsg = `Hi ${profile.name}! I'm Sparky! Let's start your first lesson!`;
  } else if (stars >= 1000) {
    mascotMsg = `Amazing work, ${profile.name}! You're a Master Inventor!`;
  }

  // Build lesson cards
  const lessonCards = LESSONS_INFO.map((lesson, i) => {
    const lessonData = data.lessons[lesson.id];
    const unlocked = lessonData?.unlocked;
    const completed = lessonData?.completedAt != null;
    const phases = lessonData?.phases || {};
    const phaseCount = Object.values(phases).filter(p => p.completed).length;
    const totalPhases = 5;
    const isCurrent = unlocked && !completed;

    let statusClass = 'locked';
    if (completed) statusClass = 'completed';
    else if (isCurrent) statusClass = 'current';
    else if (unlocked) statusClass = '';

    // Connector between cards
    const connector = i > 0 ? el('div', {
      class: `lesson-path__connector ${state.isLessonCompleted(lesson.id - 1) ? 'completed' : ''}`
    }) : null;

    const card = el('div', {
      class: `lesson-card ${statusClass}`,
      onClick: () => {
        if (!unlocked) {
          sounds.error();
          return;
        }
        sounds.click();
        // Find first incomplete phase
        const phaseOrder = ['intro', 'learn', 'game', 'practice', 'project'];
        let targetPhase = 'intro';
        for (const p of phaseOrder) {
          if (!phases[p]?.completed) {
            targetPhase = p;
            break;
          }
        }
        if (completed) targetPhase = 'intro'; // Replay from start
        router.navigate(`/lesson/${lesson.id}/${targetPhase}`);
      }
    },
      el('div', {
        class: 'lesson-card__icon',
        style: { background: unlocked ? lesson.color + '20' : '#F0F0F0', fontSize: '1.8rem' }
      }, lesson.icon),
      el('div', { class: 'lesson-card__info' },
        el('div', { class: 'lesson-card__title' }, `Lesson ${lesson.id}: ${lesson.title}`),
        el('div', { class: 'lesson-card__subtitle' }, lesson.subtitle),
        unlocked && !completed ? el('div', { class: 'lesson-card__progress' },
          el('div', { class: 'progress-bar', style: { height: '8px' } },
            el('div', { class: 'progress-bar__fill', style: { width: (phaseCount / totalPhases * 100) + '%', background: lesson.color } })
          )
        ) : null
      ),
      !unlocked ? el('div', { class: 'lock-overlay' }, icon('lock', 28)) : null,
      completed ? el('div', { class: 'lesson-card__check' }, icon('check', 28)) : null,
    );

    return connector ? [connector, card] : [card];
  }).flat();

  const freePlayUnlocked = state.isFreePlayUnlocked();

  const screen = el('div', { class: 'dashboard screen-enter' },
    // Header
    el('div', { class: 'dashboard__header container' },
      el('div', {},
        el('div', { class: 'dashboard__welcome' }, `Hi, ${profile.name}!`),
        el('div', { class: 'dashboard__level' },
          el('span', { class: 'badge badge--gold' }, level.title),
        )
      ),
      el('div', { class: 'flex gap-md', style: { alignItems: 'center' } },
        el('div', { class: 'stars' },
          icon('star', 24),
          el('span', {}, String(stars))
        ),
        el('button', {
          class: 'btn btn--round btn--outline',
          style: { width: '40px', height: '40px' },
          onClick: () => {
            sounds.click();
            router.navigate('/profile');
          }
        },
          el('div', { class: 'avatar-circle', style: { width: '32px', height: '32px', borderWidth: '2px', borderColor: profile.avatar.color } },
            createSmallMascot(20)
          )
        )
      )
    ),

    // Level progress
    el('div', { class: 'container', style: { marginBottom: 'var(--space-lg)', maxWidth: '600px' } },
      el('div', { class: 'flex flex--between', style: { marginBottom: '4px' } },
        el('span', { class: 'badge badge--gold', style: { fontSize: '0.7rem' } }, level.title),
        progress.nextThreshold ? el('span', { style: { fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' } }, `${stars}/${progress.nextThreshold}`) : null
      ),
      el('div', { class: 'progress-bar', style: { height: '10px' } },
        el('div', { class: 'progress-bar__fill', style: { width: (progress.progress * 100) + '%' } })
      )
    ),

    // Mascot
    el('div', { class: 'container', style: { maxWidth: '600px', marginBottom: 'var(--space-lg)' } },
      createMascotWithSpeech(mascotMsg, 60)
    ),

    // Lesson path
    el('div', { class: 'container' },
      el('div', { class: 'lesson-path stagger-children' },
        ...lessonCards
      )
    ),

    // Bottom nav
    el('div', { class: 'dashboard__nav' },
      el('button', {
        class: `btn ${freePlayUnlocked ? 'btn--accent' : 'btn--outline'}`,
        disabled: !freePlayUnlocked,
        onClick: () => {
          if (freePlayUnlocked) {
            sounds.click();
            router.navigate('/freeplay');
          }
        }
      },
        '🧪 Free Play Lab',
        !freePlayUnlocked ? el('span', { style: { fontSize: '0.75rem', opacity: '0.7', display: 'block' } }, 'Complete Lesson 5') : null
      ),
      el('button', {
        class: 'btn btn--outline',
        onClick: () => {
          sounds.click();
          router.navigate('/parent');
        }
      }, '👨‍👩‍👧 Parent Zone')
    )
  );

  mount(container, screen);
  return () => {};
}
