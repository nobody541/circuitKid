/**
 * Lesson Screen - Orchestrates the 5 phases of each lesson
 */
import { el, mount, icon } from '../utils/dom.js';
import { state } from '../state.js';
import { sounds } from '../utils/audio.js';
import { tts } from '../utils/tts.js';
import { LESSONS } from '../lesson-engine/lesson-data.js';
import { mountLearnMode } from '../lesson-engine/learn-mode.js';
import { mountGameMode } from '../lesson-engine/game-mode.js';
import { mountPracticeSim } from '../lesson-engine/practice-sim.js';
import { mountMiniProject } from '../lesson-engine/mini-project.js';
import { createMascotWithSpeech } from '../ui/mascot.js';
import { STARS_PER_PHASE } from '../gamification/points.js';
import { Stopwatch } from '../utils/timer.js';

const PHASES = ['intro', 'learn', 'game', 'practice', 'project'];
const PHASE_LABELS = {
  intro: 'Introduction',
  learn: 'Learn',
  game: 'Game',
  practice: 'Practice',
  project: 'Mini Project'
};

export function mountLesson(container, router, params) {
  const lessonId = parseInt(params.id);
  const phase = params.phase || 'intro';
  const lessonData = LESSONS[lessonId];
  let phaseCleanup = null;

  if (!lessonData) {
    router.navigate('/dashboard');
    return () => {};
  }

  // Check unlock
  if (!state.isLessonUnlocked(lessonId)) {
    router.navigate('/dashboard');
    return () => {};
  }

  // Start time tracking
  const stopwatch = new Stopwatch();
  stopwatch.start();

  const phaseIndex = PHASES.indexOf(phase);

  // Phase dots
  const phaseDots = PHASES.map((p, i) => {
    const completed = state.isPhaseCompleted(lessonId, p);
    const isCurrent = i === phaseIndex;
    return el('div', {
      class: `phase-dot ${completed ? 'completed' : ''} ${isCurrent ? 'current' : ''}`
    });
  });

  // Header
  const header = el('div', { class: 'lesson-screen__header' },
    el('button', {
      class: 'btn btn--small btn--outline',
      onClick: () => {
        tts.cancel();
        sounds.click();
        stopwatch.stop();
        state.addLessonTime(lessonId, stopwatch.getSeconds());
        router.navigate('/dashboard');
      }
    }, icon('close', 20)),

    el('div', { style: { textAlign: 'center' } },
      el('div', { style: { fontWeight: '700', fontSize: 'var(--font-size-md)', color: lessonData.color } },
        `Lesson ${lessonId}: ${lessonData.title}`
      ),
      el('div', { style: { fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' } },
        PHASE_LABELS[phase]
      )
    ),

    el('div', { class: 'lesson-screen__phase-dots' }, ...phaseDots)
  );

  // Content area
  const contentArea = el('div', { class: 'lesson-screen__content' });

  const screen = el('div', { class: 'lesson-screen' },
    header,
    contentArea
  );

  mount(container, screen);

  // Navigate to next phase
  function goNextPhase() {
    const currentIndex = PHASES.indexOf(phase);
    if (currentIndex < PHASES.length - 1) {
      const nextPhase = PHASES[currentIndex + 1];
      router.navigate(`/lesson/${lessonId}/${nextPhase}`);
    } else {
      // All phases done - go to reward screen
      stopwatch.stop();
      state.addLessonTime(lessonId, stopwatch.getSeconds());
      router.navigate(`/reward/${lessonId}`);
    }
  }

  // Mount the current phase content
  function mountPhase() {
    tts.cancel();
    switch (phase) {
      case 'intro':
        mountIntro();
        break;
      case 'learn':
        mountLearnMode(contentArea, lessonData, () => {
          state.completePhase(lessonId, 'learn', STARS_PER_PHASE.learn);
          goNextPhase();
        });
        break;
      case 'game':
        mountGameMode(contentArea, lessonData, () => {
          state.completePhase(lessonId, 'game', STARS_PER_PHASE.game);
          goNextPhase();
        });
        break;
      case 'practice':
        phaseCleanup = mountPracticeSim(contentArea, lessonData, () => {
          state.completePhase(lessonId, 'practice', STARS_PER_PHASE.practice);
          goNextPhase();
        });
        break;
      case 'project':
        phaseCleanup = mountMiniProject(contentArea, lessonData, () => {
          state.completePhase(lessonId, 'project', STARS_PER_PHASE.project);
          goNextPhase();
        });
        break;
    }
  }

  function mountIntro() {
    const introContent = el('div', {
      class: 'screen-enter',
      style: {
        textAlign: 'center',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-lg)',
        paddingTop: 'var(--space-xl)'
      }
    },
      // Lesson icon
      el('div', {
        style: {
          fontSize: '5rem',
          width: '120px',
          height: '120px',
          borderRadius: 'var(--radius-round)',
          background: lessonData.color + '20',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      }, lessonData.icon),

      el('h1', {
        style: { color: lessonData.color }
      }, lessonData.title),

      // Mascot speaks the intro — only text on screen
      el('div', {},
        createMascotWithSpeech(lessonData.mascotIntro, 70)
      ),

      // Start button
      el('button', {
        class: 'btn btn--primary btn--large',
        onClick: () => {
          tts.cancel();
          sounds.click();
          state.completePhase(lessonId, 'intro', STARS_PER_PHASE.intro);
          goNextPhase();
        }
      }, "Let's Start! ▶")
    );

    mount(contentArea, introContent);

    // Speak the mascot intro aloud
    setTimeout(() => tts.speak(lessonData.mascotIntro), 500);
  }

  mountPhase();

  return () => {
    tts.cancel();
    stopwatch.stop();
    state.addLessonTime(lessonId, stopwatch.getSeconds());
    if (phaseCleanup) phaseCleanup();
  };
}
