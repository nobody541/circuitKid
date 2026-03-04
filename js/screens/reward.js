/**
 * Reward Screen - shown after completing a lesson
 */
import { el, mount, icon } from '../utils/dom.js';
import { state } from '../state.js';
import { sounds } from '../utils/audio.js';
import { createConfetti } from '../utils/helpers.js';
import { getLevelTitle } from '../gamification/points.js';
import { getBadgeForLesson } from '../gamification/badges.js';
import { createMascotSVG } from '../ui/mascot.js';

export function mountReward(container, router, params) {
  const lessonId = parseInt(params.lessonId);
  const profile = state.getActiveProfile();
  const data = state.getActiveProfileData();
  const lessonData = data.lessons[lessonId];
  const phases = lessonData?.phases || {};

  // Calculate stars earned this lesson
  const starsEarned = Object.values(phases).reduce((sum, p) => sum + (p.stars || 0), 0);
  const totalStars = data.stars;
  const level = getLevelTitle(totalStars);
  const badge = getBadgeForLesson(lessonId);

  // Award badge if lesson completed
  if (badge && !state.hasBadge(badge.id)) {
    state.awardBadge(badge.id);
  }

  const lessonNames = {
    1: 'What is Electricity?',
    2: 'LEDs & Light',
    3: 'Switches & Control',
    4: 'Series vs Parallel',
    5: 'Complete Circuits',
    6: 'Conductors & Insulators',
    7: 'Resistance & Dimming',
    8: 'Motors & Movement',
    9: 'Static Electricity',
    10: 'Electromagnets'
  };

  // Star items
  const starItems = [];
  const phaseNames = { learn: 'Learn Mode', game: 'Game Mode', practice: 'Practice', project: 'Mini Project' };
  for (const [key, label] of Object.entries(phaseNames)) {
    const p = phases[key];
    if (p && p.completed) {
      starItems.push(
        el('div', {
          class: 'flex flex--between',
          style: {
            width: '100%',
            maxWidth: '300px',
            padding: '0.5rem 0',
            borderBottom: '1px solid rgba(255,255,255,0.2)'
          }
        },
          el('span', {}, label),
          el('span', { class: 'stars', style: { color: '#FFD700' } },
            icon('star', 20),
            ' +' + p.stars
          )
        )
      );
    }
  }

  const screen = el('div', { class: 'reward-screen' },
    // Mascot celebrating
    el('div', { class: 'float' },
      createMascotSVG(120)
    ),

    el('h1', { class: 'reward-screen__title' },
      '🎉 Awesome Job!'
    ),

    el('p', { style: { fontSize: 'var(--font-size-lg)' } },
      `You completed Lesson ${lessonId}: ${lessonNames[lessonId] || ''}`
    ),

    // Stars breakdown
    el('div', { class: 'flex flex--column', style: { alignItems: 'center', gap: '0.25rem', margin: '1rem 0' } },
      ...starItems
    ),

    // Total stars
    el('div', {
      class: 'reward-screen__stars',
    },
      icon('star', 48),
      el('span', {}, `+${starsEarned}`)
    ),

    // Badge
    badge ? el('div', {},
      el('div', { class: 'reward-screen__badge' },
        el('span', { style: { fontSize: '3rem' } }, badge.icon)
      ),
      el('p', { style: { marginTop: '0.5rem', fontWeight: '700', fontSize: 'var(--font-size-md)' } },
        `Badge: ${badge.name}!`
      )
    ) : null,

    // Level info
    el('div', {
      style: { margin: '0.5rem 0' }
    },
      el('span', { class: 'badge badge--gold', style: { fontSize: '1rem', padding: '0.5rem 1rem' } },
        `${level.title} - ${totalStars} Stars`
      )
    ),

    // Buttons
    el('div', {
      class: 'flex gap-md',
      style: { flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }
    },
      el('button', {
        class: 'btn btn--accent btn--large',
        onClick: () => {
          sounds.click();
          // Go to next lesson if available
          const nextLesson = lessonId + 1;
          if (nextLesson <= 10 && state.isLessonUnlocked(nextLesson)) {
            router.navigate(`/lesson/${nextLesson}/intro`);
          } else {
            router.navigate('/dashboard');
          }
        }
      }, lessonId < 10 ? 'Next Lesson! ▶' : '🏠 Back to Home'),

      el('button', {
        class: 'btn btn--outline',
        style: { borderColor: 'white', color: 'white' },
        onClick: () => {
          sounds.click();
          router.navigate('/dashboard');
        }
      }, icon('home', 20), ' Dashboard')
    )
  );

  mount(container, screen);

  // Trigger confetti and celebration sound
  setTimeout(() => {
    createConfetti(container, 60);
    sounds.celebrate();
  }, 500);

  return () => {};
}
