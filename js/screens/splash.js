/**
 * Splash Screen
 */
import { el, mount, animateIn } from '../utils/dom.js';
import { createMascotSVG } from '../ui/mascot.js';
import { sounds } from '../utils/audio.js';

export function mountSplash(container, router) {
  // Create floating particles
  const particles = [];
  for (let i = 0; i < 20; i++) {
    const size = 10 + Math.random() * 30;
    particles.push(
      el('div', {
        class: 'splash__particle',
        style: {
          width: size + 'px',
          height: size + 'px',
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%',
          background: ['#FFD700', '#FF6B6B', '#4CAF50', '#FF9800', '#9C27B0'][Math.floor(Math.random() * 5)],
          animationDelay: Math.random() * 4 + 's',
          animationDuration: (4 + Math.random() * 4) + 's',
        }
      })
    );
  }

  const screen = el('div', { class: 'splash' },
    el('div', { class: 'splash__particles' }, ...particles),

    el('div', {},
      createMascotSVG(180)
    ),

    el('h1', { class: 'splash__title' },
      'Circuit Kids'
    ),

    el('p', { class: 'splash__subtitle' },
      'Learn Electronics the Fun Way!'
    ),

    el('button', {
      class: 'btn btn--accent btn--large',
      style: { marginTop: '2rem' },
      onClick: () => {
        sounds.click();
        router.navigate('/profile');
      }
    }, '🚀 Start Playing!')
  );

  mount(container, screen);
  return () => {};
}
