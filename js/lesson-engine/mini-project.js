/**
 * Mini Project - Placeholder for user to add their own project content
 */
import { el, mount, icon } from '../utils/dom.js';
import { createMascotWithSpeech } from '../ui/mascot.js';
import { sounds } from '../utils/audio.js';

export function mountMiniProject(container, lessonData, onComplete) {
  const projectData = lessonData.miniProject;

  const content = el('div', { class: 'screen-enter', style: { maxWidth: '700px', width: '100%', textAlign: 'center' } },
    el('div', {
      style: {
        fontSize: '4rem',
        marginBottom: 'var(--space-md)'
      }
    }, '🛠️'),

    el('h2', { style: { color: lessonData.color, marginBottom: 'var(--space-sm)' } }, projectData.title || 'Mini Project'),
    el('p', { style: { fontSize: 'var(--font-size-lg)', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' } },
      projectData.description || 'Time for a hands-on project!'
    ),

    createMascotWithSpeech('Great job getting here! This project section is coming soon!', 60),

    el('div', { style: { marginTop: 'var(--space-xl)' } },
      el('button', {
        class: 'btn btn--success btn--large',
        onClick: () => {
          sounds.celebrate();
          onComplete();
        }
      }, '✅ Complete Lesson!')
    )
  );

  mount(container, content);
  return () => {};
}
