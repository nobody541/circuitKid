/**
 * Free Play Lab - Open circuit building sandbox + challenges
 */
import { el, mount, icon } from '../utils/dom.js';
import { state } from '../state.js';
import { CircuitEngine } from '../simulator/circuit-engine.js';
import { CircuitRenderer } from '../simulator/renderer.js';
import { CircuitInteraction } from '../simulator/interaction.js';
import { ComponentToolbar } from '../simulator/toolbar.js';
import { createMascotWithSpeech } from '../ui/mascot.js';
import { sounds } from '../utils/audio.js';
import { Timer } from '../utils/timer.js';
import { formatTime } from '../utils/helpers.js';
import { CHALLENGES } from '../gamification/challenges.js';

export function mountFreePlay(container, router, params = {}) {
  const mode = params.mode || 'creative';
  let cleanupFns = [];

  // Check unlock
  if (!state.isFreePlayUnlocked()) {
    mount(container,
      el('div', { class: 'screen screen--center text-center' },
        el('div', { style: { fontSize: '4rem', marginBottom: '1rem' } }, '🔒'),
        el('h2', {}, 'Free Play Lab is Locked!'),
        el('p', { style: { color: 'var(--text-secondary)', marginBottom: '1.5rem' } },
          'Complete Lesson 3 to unlock the Free Play Lab!'
        ),
        el('button', {
          class: 'btn btn--primary',
          onClick: () => router.navigate('/dashboard')
        }, 'Back to Dashboard')
      )
    );
    return () => {};
  }

  if (mode === 'menu') {
    mountModeMenu(container, router);
    return () => {};
  }

  // Build the lab
  const engine = new CircuitEngine();

  // Get available components (all + unlocked colors)
  const profileData = state.getActiveProfileData();
  const availableComponents = ['battery', 'led-red', 'led-green', 'led-blue', 'switch', 'push-button'];
  if (profileData.unlockedColors.includes('yellow')) availableComponents.push('led-yellow');
  if (profileData.unlockedColors.includes('white')) availableComponents.push('led-white');
  if (profileData.unlockedColors.includes('purple')) availableComponents.push('led-purple');
  if (profileData.unlockedColors.includes('orange')) availableComponents.push('led-orange');

  // Timer for timed challenge
  let timer = null;
  let timerDisplay = null;

  // Header
  const headerLeft = el('div', { class: 'flex gap-sm', style: { alignItems: 'center' } },
    el('button', {
      class: 'btn btn--small btn--outline',
      onClick: () => {
        sounds.click();
        router.navigate('/dashboard');
      }
    }, icon('home', 18)),
    el('h2', { style: { fontSize: 'var(--font-size-md)' } }, getModeTitle(mode))
  );

  timerDisplay = el('div', {
    class: 'sim-timer',
    style: { display: mode === 'timed' ? 'flex' : 'none' }
  }, '⏱️ ', el('span', { id: 'timer-text' }, '1:00'));

  const headerRight = el('div', { class: 'flex gap-sm' },
    timerDisplay,
    el('button', {
      class: 'btn btn--small btn--outline',
      onClick: () => {
        sounds.click();
        engine.clear();
        renderer.render();
      }
    }, '🗑️ Clear'),
  );

  const header = el('div', { class: 'free-play__header' }, headerLeft, headerRight);

  const toolbarContainer = el('div');
  const workspaceContainer = el('div', {
    class: 'simulator__workspace',
    style: { flex: '1', minHeight: '500px' }
  });

  const statusArea = el('div', { style: { padding: 'var(--space-sm) var(--space-md)' } });

  const screen = el('div', { class: 'free-play' },
    header,
    toolbarContainer,
    workspaceContainer,
    statusArea
  );

  mount(container, screen);

  // Create renderer
  const renderer = new CircuitRenderer(workspaceContainer, engine);
  cleanupFns.push(() => renderer.destroy());

  // Create interaction
  const interaction = new CircuitInteraction(renderer, engine);
  cleanupFns.push(() => interaction.destroy());

  // Create toolbar
  const toolbar = new ComponentToolbar(toolbarContainer, availableComponents, (comp) => {
    interaction.placeComponent(comp);
  });
  toolbar.setOnDelete(() => interaction.deleteSelected());
  cleanupFns.push(() => toolbar.destroy());

  // Status updates
  interaction.onCircuitChanged = (analysis) => {
    const litCount = analysis.activeLEDs.length;
    const totalComps = engine.getComponentCounts();

    mount(statusArea,
      el('div', { class: 'flex gap-md flex--wrap' },
        el('span', { class: 'badge', style: { background: analysis.isComplete ? '#4CAF50' : '#999', color: 'white' } },
          analysis.isComplete ? '⚡ Circuit Active' : '⚡ No Circuit'
        ),
        el('span', { class: 'badge badge--gold' }, `💡 ${litCount} LEDs Lit`),
        el('span', { class: 'badge', style: { background: '#4A90D9', color: 'white' } },
          `🔋 ${totalComps.battery} | 💡 ${totalComps.led} | 🔘 ${totalComps.switch}`
        ),
        analysis.shortCircuit ?
          el('span', { class: 'badge', style: { background: '#F44336', color: 'white' } }, '⚠️ Short Circuit!') : null
      )
    );

    // Timed challenge success check
    if (mode === 'timed' && litCount >= 1 && timer && timer.running) {
      timer.stop();
      sounds.celebrate();
      showTimedSuccess();
    }
  };

  // Timed challenge setup
  if (mode === 'timed') {
    timer = new Timer(60,
      (remaining) => {
        const timerText = document.getElementById('timer-text');
        if (timerText) timerText.textContent = formatTime(remaining);
        if (remaining <= 10) timerDisplay.classList.add('warning');
      },
      () => {
        sounds.warning();
        showTimedFail();
      }
    );
    timer.start();
    cleanupFns.push(() => timer.stop());
  }

  // Initial render
  renderer.render();

  function showTimedSuccess() {
    const overlay = el('div', { class: 'modal-backdrop fade-in' },
      el('div', { class: 'modal bounce-in', style: { textAlign: 'center' } },
        el('div', { style: { fontSize: '4rem' } }, '🎉'),
        el('h2', { style: { color: 'var(--color-success)' } }, 'You did it!'),
        el('p', {}, `Time remaining: ${formatTime(timer.remaining)}`),
        el('div', { class: 'flex flex--center gap-md', style: { marginTop: '1rem' } },
          el('button', { class: 'btn btn--primary', onClick: () => { overlay.remove(); router.navigate('/freeplay'); } }, 'Play Again'),
          el('button', { class: 'btn btn--outline', onClick: () => { overlay.remove(); router.navigate('/dashboard'); } }, 'Home'),
        )
      )
    );
    container.appendChild(overlay);
  }

  function showTimedFail() {
    const overlay = el('div', { class: 'modal-backdrop fade-in' },
      el('div', { class: 'modal bounce-in', style: { textAlign: 'center' } },
        el('div', { style: { fontSize: '4rem' } }, '⏰'),
        el('h2', { style: { color: 'var(--color-danger)' } }, 'Time\'s Up!'),
        el('p', {}, 'Don\'t worry, try again!'),
        el('div', { class: 'flex flex--center gap-md', style: { marginTop: '1rem' } },
          el('button', { class: 'btn btn--primary', onClick: () => { overlay.remove(); router.navigate('/freeplay/timed'); } }, 'Try Again'),
          el('button', { class: 'btn btn--outline', onClick: () => { overlay.remove(); router.navigate('/dashboard'); } }, 'Home'),
        )
      )
    );
    container.appendChild(overlay);
  }

  return () => cleanupFns.forEach(fn => fn());
}

function getModeTitle(mode) {
  switch (mode) {
    case 'timed': return '⏱️ Timed Challenge';
    case 'fix': return '🔧 Fix the Circuit';
    case 'creative': return '🎨 Creative Lab';
    default: return '🧪 Free Play Lab';
  }
}

function mountModeMenu(container, router) {
  const advancedUnlocked = state.areAdvancedChallengesUnlocked();

  const screen = el('div', { class: 'screen screen--center screen-enter' },
    el('h1', { style: { marginBottom: '0.5rem', textAlign: 'center' } }, '🧪 Free Play Lab'),
    el('p', { style: { textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' } }, 'Choose your mode!'),

    el('div', { class: 'grid grid--3', style: { maxWidth: '700px', width: '100%' } },
      // Creative mode
      el('div', {
        class: 'card card--lesson',
        style: { cursor: 'pointer', textAlign: 'center' },
        onClick: () => { sounds.click(); router.navigate('/freeplay/creative'); }
      },
        el('div', { style: { fontSize: '3rem', marginBottom: '0.5rem' } }, '🎨'),
        el('h3', {}, 'Creative Build'),
        el('p', { style: { fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' } }, 'Build anything!')
      ),

      // Timed challenge
      el('div', {
        class: `card card--lesson ${!advancedUnlocked ? 'locked' : ''}`,
        style: { cursor: advancedUnlocked ? 'pointer' : 'not-allowed', textAlign: 'center' },
        onClick: () => {
          if (advancedUnlocked) { sounds.click(); router.navigate('/freeplay/timed'); }
          else sounds.error();
        }
      },
        el('div', { style: { fontSize: '3rem', marginBottom: '0.5rem' } }, '⏱️'),
        el('h3', {}, 'Timed Challenge'),
        el('p', { style: { fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' } },
          advancedUnlocked ? 'Build in 60 seconds!' : 'Need 500 stars to unlock'
        ),
        !advancedUnlocked ? icon('lock', 24) : null
      ),

      // Fix the circuit
      el('div', {
        class: `card card--lesson ${!advancedUnlocked ? 'locked' : ''}`,
        style: { cursor: advancedUnlocked ? 'pointer' : 'not-allowed', textAlign: 'center' },
        onClick: () => {
          if (advancedUnlocked) { sounds.click(); router.navigate('/freeplay/creative'); }
          else sounds.error();
        }
      },
        el('div', { style: { fontSize: '3rem', marginBottom: '0.5rem' } }, '🔧'),
        el('h3', {}, 'Fix the Circuit'),
        el('p', { style: { fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' } },
          advancedUnlocked ? 'Find and fix bugs!' : 'Need 500 stars to unlock'
        ),
        !advancedUnlocked ? icon('lock', 24) : null
      ),
    ),

    el('button', {
      class: 'btn btn--outline',
      style: { marginTop: '2rem' },
      onClick: () => { sounds.click(); router.navigate('/dashboard'); }
    }, icon('arrow_left', 18), ' Back to Dashboard')
  );

  mount(container, screen);
}
