/**
 * Game Mode - Quiz and drag-match games
 */
import { el, mount, icon } from '../utils/dom.js';
import { sounds } from '../utils/audio.js';
import { shuffle } from '../utils/helpers.js';
import { createMascotWithSpeech } from '../ui/mascot.js';
import { tts } from '../utils/tts.js';

/**
 * Mount Game Mode based on game type
 */
export function mountGameMode(container, lessonData, onComplete) {
  const gameData = lessonData.gameMode;

  switch (gameData.type) {
    case 'drag-match':
      mountDragMatchGame(container, gameData, lessonData, onComplete);
      break;
    case 'quiz':
      mountQuizGame(container, gameData, lessonData, onComplete);
      break;
    default:
      mountQuizGame(container, gameData, lessonData, onComplete);
  }
}

/**
 * Drag-Match Game: match icons to labels
 */
function mountDragMatchGame(container, gameData, lessonData, onComplete) {
  const pairs = [...gameData.pairs];
  const shuffledLabels = shuffle(pairs.map(p => p.label));
  const matched = new Set();
  let selectedIcon = null;

  function render() {
    const iconCards = pairs.map((pair, i) => {
      const isMatched = matched.has(i);
      const card = el('div', {
        class: `card ${isMatched ? 'completed' : ''} ${selectedIcon === i ? 'active' : ''}`,
        style: {
          textAlign: 'center',
          padding: '1rem',
          cursor: isMatched ? 'default' : 'pointer',
          opacity: isMatched ? '0.5' : '1',
          border: selectedIcon === i ? '3px solid var(--color-primary)' : '3px solid transparent',
          minWidth: '100px'
        },
        onClick: () => {
          if (isMatched) return;
          sounds.click();
          selectedIcon = i;
          render();
        }
      },
        el('div', { style: { fontSize: '2.5rem', marginBottom: '0.25rem' } }, pair.icon),
        el('div', { style: { fontSize: '0.75rem', color: 'var(--text-secondary)' } }, pair.description || '')
      );
      return card;
    });

    const labelCards = shuffledLabels.map((label, i) => {
      const originalIndex = pairs.findIndex(p => p.label === label);
      const isMatched = matched.has(originalIndex);

      return el('div', {
        class: `card ${isMatched ? 'completed' : ''}`,
        style: {
          textAlign: 'center',
          padding: '1rem',
          cursor: isMatched ? 'default' : 'pointer',
          opacity: isMatched ? '0.5' : '1',
          background: isMatched ? '#E8F5E9' : 'var(--bg-card)',
          minWidth: '100px'
        },
        onClick: () => {
          if (isMatched || selectedIcon === null) return;

          if (selectedIcon === originalIndex) {
            // Correct match!
            matched.add(originalIndex);
            sounds.success();
            selectedIcon = null;

            if (matched.size === pairs.length) {
              // All matched!
              setTimeout(() => onComplete(), 800);
            }
          } else {
            // Wrong match
            sounds.error();
            selectedIcon = null;
          }
          render();
        }
      },
        el('div', { style: { fontSize: 'var(--font-size-md)', fontWeight: '700' } }, label),
        isMatched ? el('div', { style: { color: 'var(--color-success)' } }, icon('check', 20)) : null
      );
    });

    const content = el('div', { class: 'screen-enter', style: { width: '100%', maxWidth: '600px' } },
      el('h2', { style: { textAlign: 'center', color: lessonData.color, marginBottom: '0.5rem' } }, 'Match Game!'),
      el('p', { style: { textAlign: 'center', marginBottom: '1rem', color: 'var(--text-secondary)' } }, gameData.instruction),
      el('p', { style: { textAlign: 'center', marginBottom: '1rem', fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' } },
        selectedIcon !== null ? 'Now click the matching name!' : 'Click an icon first, then its name!'
      ),

      el('div', { style: { display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' } },
        ...iconCards
      ),

      el('div', { style: { display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' } },
        ...labelCards
      ),

      el('div', { style: { textAlign: 'center', marginTop: '1rem' } },
        el('span', { class: 'badge badge--gold' }, `${matched.size}/${pairs.length} Matched`)
      )
    );

    mount(container, content);
  }

  render();
}

/**
 * Quiz Game: multiple choice questions
 */
function mountQuizGame(container, gameData, lessonData, onComplete) {
  let currentQ = 0;
  let correct = 0;
  let answered = false;
  let selectedAnswer = null;
  const questions = gameData.questions;

  function renderQuestion() {
    tts.cancel();
    const q = questions[currentQ];
    answered = false;
    selectedAnswer = null;

    // Read the question aloud
    setTimeout(() => tts.speak(q.question), 300);

    const choiceButtons = q.choices.map((choice, i) => {
      return el('button', {
        class: 'btn btn--outline',
        style: {
          width: '100%',
          textAlign: 'left',
          justifyContent: 'flex-start',
          marginBottom: '0.5rem',
          minHeight: '48px',
          fontSize: 'var(--font-size-md)'
        },
        id: `choice-${i}`,
        onClick: () => {
          if (answered) return;
          answered = true;
          selectedAnswer = i;

          const isCorrect = i === q.correct;
          const btn = document.getElementById(`choice-${i}`);
          const correctBtn = document.getElementById(`choice-${q.correct}`);

          if (isCorrect) {
            btn.style.background = '#4CAF50';
            btn.style.color = 'white';
            btn.style.borderColor = '#4CAF50';
            correct++;
            sounds.success();
          } else {
            btn.style.background = '#F44336';
            btn.style.color = 'white';
            btn.style.borderColor = '#F44336';
            correctBtn.style.background = '#4CAF50';
            correctBtn.style.color = 'white';
            correctBtn.style.borderColor = '#4CAF50';
            sounds.error();
          }

          // Show next button after short delay
          setTimeout(() => {
            const nextBtn = document.getElementById('quiz-next-btn');
            if (nextBtn) nextBtn.style.display = 'inline-flex';
          }, 600);
        }
      },
        el('span', { style: { marginRight: '0.5rem', fontWeight: '700' } }, String.fromCharCode(65 + i) + '.'),
        choice
      );
    });

    const content = el('div', { class: 'screen-enter', style: { width: '100%', maxWidth: '600px' } },
      // Progress
      el('div', { class: 'flex flex--between', style: { marginBottom: '1rem' } },
        el('span', { class: 'badge badge--gold' }, `Question ${currentQ + 1}/${questions.length}`),
        el('span', { class: 'stars' }, icon('star', 18), ` ${correct}`)
      ),

      el('div', { class: 'progress-bar', style: { height: '8px', marginBottom: '1.5rem' } },
        el('div', { class: 'progress-bar__fill', style: { width: (currentQ / questions.length * 100) + '%', background: lessonData.color } })
      ),

      // Question
      el('div', { class: 'card', style: { marginBottom: '1.5rem', textAlign: 'center' } },
        el('h3', { style: { fontSize: 'var(--font-size-lg)', marginBottom: '0.5rem' } }, q.question)
      ),

      // Choices
      el('div', { style: { marginBottom: '1rem' } }, ...choiceButtons),

      // Next button (hidden initially)
      el('div', { style: { textAlign: 'center' } },
        el('button', {
          class: 'btn btn--primary',
          id: 'quiz-next-btn',
          style: { display: 'none' },
          onClick: () => {
            sounds.click();
            if (currentQ < questions.length - 1) {
              currentQ++;
              renderQuestion();
            } else {
              // Quiz complete!
              tts.cancel();
              onComplete();
            }
          }
        }, currentQ < questions.length - 1 ? 'Next Question' : 'Complete!')
      )
    );

    mount(container, content);
  }

  renderQuestion();
}
