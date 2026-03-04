/**
 * Parent Dashboard - Progress tracking, settings, certificates
 */
import { el, mount, icon } from '../utils/dom.js';
import { state } from '../state.js';
import { sounds } from '../utils/audio.js';
import { getLevelTitle } from '../gamification/points.js';
import { getBadgeInfo } from '../gamification/badges.js';
import { formatTime, formatDate } from '../utils/helpers.js';
import { generateCertificate } from '../ui/certificate.js';

export function mountParentDashboard(container, router) {
  const profile = state.getActiveProfile();
  if (!profile) {
    router.navigate('/profile');
    return () => {};
  }

  // PIN verification
  let verified = false;

  function showPinEntry() {
    let pinDigits = ['', '', '', ''];
    let currentDigit = 0;

    const inputs = [];
    for (let i = 0; i < 4; i++) {
      const input = el('input', {
        class: 'pin-digit',
        type: 'password',
        maxlength: '1',
        inputmode: 'numeric',
        dataset: { index: i },
        onInput: (e) => {
          pinDigits[i] = e.target.value;
          if (e.target.value && i < 3) {
            inputs[i + 1].focus();
          }
          // Check if all filled
          if (pinDigits.every(d => d)) {
            const pin = pinDigits.join('');
            const correctPin = state.getSetting('parentPin') || '1234';
            if (pin === correctPin) {
              verified = true;
              sounds.success();
              showDashboard();
            } else {
              sounds.error();
              inputs.forEach(inp => {
                inp.value = '';
                inp.classList.add('shake');
                setTimeout(() => inp.classList.remove('shake'), 500);
              });
              pinDigits = ['', '', '', ''];
              inputs[0].focus();
            }
          }
        },
        onKeydown: (e) => {
          if (e.key === 'Backspace' && !e.target.value && i > 0) {
            inputs[i - 1].focus();
          }
        }
      });
      inputs.push(input);
    }

    const screen = el('div', { class: 'screen screen--center screen-enter' },
      el('h2', { style: { marginBottom: '0.5rem', textAlign: 'center' } }, '🔒 Parent Zone'),
      el('p', { style: { color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' } },
        'Enter PIN to access (default: 1234)'
      ),
      el('div', { class: 'pin-input', style: { marginBottom: '2rem' } }, ...inputs),
      el('button', {
        class: 'btn btn--outline',
        onClick: () => { sounds.click(); router.navigate('/dashboard'); }
      }, 'Back')
    );

    mount(container, screen);
    inputs[0].focus();
  }

  function showDashboard() {
    const data = state.getActiveProfileData();
    const stars = data.stars;
    const level = getLevelTitle(stars);

    // Calculate stats
    let totalTime = 0;
    let lessonsCompleted = 0;
    let totalPhases = 0;
    let completedPhases = 0;

    for (let i = 1; i <= 5; i++) {
      const lesson = data.lessons[i];
      totalTime += lesson.totalTimeSeconds || 0;
      if (lesson.completedAt) lessonsCompleted++;
      for (const phase of Object.values(lesson.phases)) {
        totalPhases++;
        if (phase.completed) completedPhases++;
      }
    }

    // Lesson rows
    const lessonRows = [];
    for (let i = 1; i <= 5; i++) {
      const lesson = data.lessons[i];
      const phases = lesson.phases;
      const phasesDone = Object.values(phases).filter(p => p.completed).length;

      lessonRows.push(
        el('div', { class: 'lesson-progress-row' },
          el('div', {},
            el('strong', {}, `Lesson ${i}`),
            el('div', { style: { fontSize: '0.75rem', color: 'var(--text-secondary)' } },
              lesson.completedAt ? 'Completed ' + formatDate(lesson.completedAt) :
              lesson.unlocked ? 'In progress' : 'Locked'
            )
          ),
          el('div', { style: { textAlign: 'center' } },
            `${phasesDone}/5`
          ),
          el('div', { style: { textAlign: 'center' } },
            lesson.totalTimeSeconds > 0 ? formatTime(lesson.totalTimeSeconds) : '-'
          ),
          el('div', { style: { textAlign: 'center' } },
            lesson.completedAt ?
              el('span', { style: { color: 'var(--color-success)' } }, icon('check', 18)) :
              el('span', { style: { color: '#CCC' } }, '—')
          )
        )
      );
    }

    // Badges
    const badgeElements = data.badges.map(badgeId => {
      const info = getBadgeInfo(badgeId);
      if (!info) return null;
      return el('div', {
        class: 'card',
        style: {
          textAlign: 'center',
          padding: '0.75rem',
          background: info.color + '15',
          borderLeft: `4px solid ${info.color}`
        }
      },
        el('div', { style: { fontSize: '1.5rem' } }, info.icon),
        el('div', { style: { fontWeight: '700', fontSize: '0.85rem' } }, info.name)
      );
    }).filter(Boolean);

    const screen = el('div', { class: 'parent-dashboard screen-enter' },
      // Header
      el('div', { class: 'parent-dashboard__header' },
        el('div', {},
          el('h1', { class: 'parent-dashboard__title' }, '👨‍👩‍👧 Parent Dashboard'),
          el('p', { style: { color: 'var(--text-secondary)' } }, `${profile.name}'s Progress`)
        ),
        el('button', {
          class: 'btn btn--outline btn--small',
          onClick: () => { sounds.click(); router.navigate('/dashboard'); }
        }, icon('close', 18))
      ),

      // Stats cards
      el('div', { class: 'stats-grid' },
        el('div', { class: 'stat-card' },
          el('div', { class: 'stat-card__value' }, String(stars)),
          el('div', { class: 'stat-card__label' }, 'Total Stars')
        ),
        el('div', { class: 'stat-card' },
          el('div', { class: 'stat-card__value' }, `${lessonsCompleted}/5`),
          el('div', { class: 'stat-card__label' }, 'Lessons Completed')
        ),
        el('div', { class: 'stat-card' },
          el('div', { class: 'stat-card__value' }, level.title),
          el('div', { class: 'stat-card__label' }, 'Current Level')
        ),
        el('div', { class: 'stat-card' },
          el('div', { class: 'stat-card__value' }, totalTime > 0 ? formatTime(totalTime) : '0:00'),
          el('div', { class: 'stat-card__label' }, 'Total Time')
        ),
      ),

      // Lesson progress table
      el('h3', { style: { marginBottom: '0.5rem' } }, 'Lesson Progress'),
      el('div', { class: 'lesson-progress-table', style: { marginBottom: 'var(--space-xl)' } },
        el('div', { class: 'lesson-progress-row lesson-progress-row--header' },
          el('div', {}, 'Lesson'),
          el('div', { style: { textAlign: 'center' } }, 'Phases'),
          el('div', { style: { textAlign: 'center' } }, 'Time'),
          el('div', { style: { textAlign: 'center' } }, 'Done')
        ),
        ...lessonRows
      ),

      // Badges
      badgeElements.length > 0 ?
        el('div', { style: { marginBottom: 'var(--space-xl)' } },
          el('h3', { style: { marginBottom: '0.5rem' } }, 'Badges Earned'),
          el('div', { class: 'flex gap-sm flex--wrap' }, ...badgeElements)
        ) : null,

      // Settings
      el('h3', { style: { marginBottom: '0.5rem' } }, 'Settings'),
      el('div', { class: 'card', style: { marginBottom: 'var(--space-xl)' } },
        // Difficulty
        el('div', { class: 'flex flex--between', style: { marginBottom: '1rem', alignItems: 'center' } },
          el('label', { style: { fontWeight: '700' } }, 'Difficulty'),
          el('select', {
            class: 'input',
            style: { width: 'auto', minWidth: '150px' },
            onChange: (e) => {
              state.setSetting('difficulty', e.target.value);
              sounds.click();
            }
          },
            el('option', { value: 'easy', selected: data.settings.difficulty === 'easy' }, 'Easy'),
            el('option', { value: 'normal', selected: data.settings.difficulty === 'normal' }, 'Normal'),
            el('option', { value: 'hard', selected: data.settings.difficulty === 'hard' }, 'Hard'),
          )
        ),

        // Sound
        el('div', { class: 'flex flex--between', style: { marginBottom: '1rem', alignItems: 'center' } },
          el('label', { style: { fontWeight: '700' } }, 'Sound Effects'),
          el('button', {
            class: `btn btn--small ${data.settings.soundEnabled ? 'btn--success' : 'btn--outline'}`,
            onClick: (e) => {
              const newVal = !state.getSetting('soundEnabled');
              state.setSetting('soundEnabled', newVal);
              e.target.textContent = newVal ? 'ON' : 'OFF';
              e.target.className = `btn btn--small ${newVal ? 'btn--success' : 'btn--outline'}`;
            }
          }, data.settings.soundEnabled ? 'ON' : 'OFF')
        ),

        // Change PIN
        el('div', { class: 'flex flex--between', style: { alignItems: 'center' } },
          el('label', { style: { fontWeight: '700' } }, 'Change PIN'),
          el('button', {
            class: 'btn btn--small btn--outline',
            onClick: () => showChangePinModal()
          }, 'Change')
        ),
      ),

      // Actions
      el('div', { class: 'flex gap-md flex--wrap' },
        el('button', {
          class: 'btn btn--accent',
          onClick: () => {
            sounds.click();
            printCertificate();
          }
        }, icon('print', 18), ' Print Certificate'),

        el('button', {
          class: 'btn btn--outline',
          style: { borderColor: 'var(--color-danger)', color: 'var(--color-danger)' },
          onClick: () => {
            showResetConfirm();
          }
        }, 'Reset Progress'),
      )
    );

    mount(container, screen);
  }

  function showChangePinModal() {
    const newPinInput = el('input', {
      class: 'input',
      type: 'password',
      maxlength: '4',
      placeholder: 'New 4-digit PIN',
      inputmode: 'numeric',
      style: { textAlign: 'center', fontSize: 'var(--font-size-lg)', letterSpacing: '0.5em' }
    });

    const modal = el('div', { class: 'modal-backdrop fade-in' },
      el('div', { class: 'modal bounce-in' },
        el('h3', { style: { marginBottom: '1rem', textAlign: 'center' } }, 'Change PIN'),
        newPinInput,
        el('div', { class: 'flex flex--center gap-md', style: { marginTop: '1rem' } },
          el('button', { class: 'btn btn--outline', onClick: () => modal.remove() }, 'Cancel'),
          el('button', {
            class: 'btn btn--primary',
            onClick: () => {
              const pin = newPinInput.value;
              if (pin.length === 4 && /^\d+$/.test(pin)) {
                state.setSetting('parentPin', pin);
                sounds.success();
                modal.remove();
              } else {
                newPinInput.classList.add('shake');
                setTimeout(() => newPinInput.classList.remove('shake'), 500);
                sounds.error();
              }
            }
          }, 'Save')
        )
      )
    );
    container.appendChild(modal);
    newPinInput.focus();
  }

  function showResetConfirm() {
    const modal = el('div', { class: 'modal-backdrop fade-in' },
      el('div', { class: 'modal bounce-in', style: { textAlign: 'center' } },
        el('div', { style: { fontSize: '3rem', marginBottom: '0.5rem' } }, '⚠️'),
        el('h3', { style: { marginBottom: '0.5rem' } }, 'Reset All Progress?'),
        el('p', { style: { color: 'var(--text-secondary)', marginBottom: '1rem' } },
          'This will erase all stars, badges, and lesson progress. This cannot be undone!'
        ),
        el('div', { class: 'flex flex--center gap-md' },
          el('button', { class: 'btn btn--outline', onClick: () => modal.remove() }, 'Cancel'),
          el('button', {
            class: 'btn btn--secondary',
            onClick: () => {
              state.resetProfile(profile.id);
              sounds.click();
              modal.remove();
              showDashboard();
            }
          }, 'Reset Everything')
        )
      )
    );
    container.appendChild(modal);
  }

  function printCertificate() {
    const certContainer = generateCertificate(profile.name, state.getStars(), state.getActiveProfileData());
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head><title>Certificate - ${profile.name}</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
          @media print { @page { size: landscape; margin: 0.5in; } }
        </style>
        </head>
        <body>${certContainer.outerHTML}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }

  showPinEntry();
  return () => {};
}
