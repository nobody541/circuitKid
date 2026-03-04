/**
 * Profile Selection Screen
 */
import { el, mount, icon } from '../utils/dom.js';
import { state } from '../state.js';
import { createSmallMascot } from '../ui/mascot.js';
import { sounds } from '../utils/audio.js';
import { getLevelTitle } from '../gamification/points.js';

const AVATAR_COLORS = ['#4A90D9', '#FF6B6B', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4', '#E91E63', '#FFD700'];

export function mountProfileSelect(container, router) {
  function render() {
    const profiles = state.get('profiles') || [];

    const profileCards = profiles.map(profile => {
      const data = state.get(`profileData.${profile.id}`);
      const level = getLevelTitle(data?.stars || 0);

      return el('div', {
        class: 'profile-card bounce-in',
        onClick: () => {
          sounds.click();
          state.selectProfile(profile.id);
          router.navigate('/dashboard');
        }
      },
        el('div', { class: 'avatar-circle', style: { borderColor: profile.avatar.color, background: profile.avatar.color + '20' } },
          createSmallMascot(48)
        ),
        el('div', { class: 'profile-card__name' }, profile.name),
        el('div', { class: 'profile-card__stars' },
          icon('star', 16),
          ' ' + (data?.stars || 0)
        ),
        el('div', { class: 'badge badge--gold', style: { fontSize: '0.7rem' } }, level.title)
      );
    });

    // Add profile card
    const addCard = el('div', {
      class: 'profile-card profile-card--add bounce-in',
      style: { animationDelay: (profiles.length * 0.1) + 's' },
      onClick: () => {
        sounds.click();
        showCreateProfile();
      }
    },
      el('div', { style: { fontSize: '3rem', lineHeight: '1' } }, '+'),
      el('div', { class: 'profile-card__name' }, 'New Player')
    );

    const screen = el('div', { class: 'profile-select screen' },
      el('h1', { class: 'profile-select__title bounce-in' }, 'Who\'s Playing?'),
      el('div', { class: 'profile-grid stagger-children' },
        ...profileCards,
        addCard
      ),
      el('button', {
        class: 'btn btn--outline btn--small',
        style: { marginTop: 'auto', paddingTop: '1rem' },
        onClick: () => router.navigate('/')
      }, 'Back')
    );

    mount(container, screen);
  }

  function showCreateProfile() {
    let selectedColor = AVATAR_COLORS[0];

    const colorPicker = el('div', {
      class: 'flex gap-sm',
      style: { flexWrap: 'wrap', justifyContent: 'center' }
    },
      ...AVATAR_COLORS.map(color =>
        el('button', {
          class: 'btn btn--round',
          style: {
            background: color,
            width: '48px',
            height: '48px',
            border: color === selectedColor ? '4px solid #2C3E50' : '4px solid transparent',
            boxShadow: 'none'
          },
          onClick: (e) => {
            selectedColor = color;
            // Update borders
            const siblings = e.target.parentElement.children;
            for (const sib of siblings) {
              sib.style.border = '4px solid transparent';
            }
            e.target.style.border = '4px solid #2C3E50';
          }
        })
      )
    );

    const nameInput = el('input', {
      class: 'input',
      type: 'text',
      placeholder: 'Enter your name...',
      maxlength: '20',
      style: { textAlign: 'center', fontSize: 'var(--font-size-lg)' }
    });

    const modal = el('div', { class: 'modal-backdrop fade-in' },
      el('div', { class: 'modal bounce-in' },
        el('h2', { style: { textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-primary)' } }, 'Create Your Profile'),

        el('div', { class: 'flex flex--center', style: { marginBottom: '1.5rem' } },
          createSmallMascot(80)
        ),

        el('div', { style: { marginBottom: '1.5rem' } }, nameInput),

        el('p', { style: { textAlign: 'center', marginBottom: '0.5rem', fontWeight: '700' } }, 'Pick Your Color'),
        el('div', { style: { marginBottom: '1.5rem' } }, colorPicker),

        el('div', { class: 'flex flex--center gap-md' },
          el('button', {
            class: 'btn btn--outline',
            onClick: () => {
              sounds.click();
              modal.remove();
            }
          }, 'Cancel'),
          el('button', {
            class: 'btn btn--primary',
            onClick: () => {
              const name = nameInput.value.trim();
              if (!name) {
                nameInput.style.borderColor = 'var(--color-danger)';
                nameInput.classList.add('shake');
                setTimeout(() => nameInput.classList.remove('shake'), 500);
                return;
              }
              sounds.success();
              state.createProfile(name, { color: selectedColor });
              modal.remove();
              router.navigate('/dashboard');
            }
          }, 'Let\'s Go!')
        )
      )
    );

    container.appendChild(modal);
    nameInput.focus();
  }

  render();
  return () => {};
}
