/**
 * Reusable modal component
 */
import { el } from '../utils/dom.js';
import { sounds } from '../utils/audio.js';

export function showModal(container, { title, content, buttons = [], icon: iconEmoji }) {
  const buttonElements = buttons.map(btn =>
    el('button', {
      class: `btn ${btn.class || 'btn--primary'}`,
      onClick: () => {
        sounds.click();
        if (btn.onClick) btn.onClick();
        modal.remove();
      }
    }, btn.label)
  );

  const modal = el('div', { class: 'modal-backdrop fade-in' },
    el('div', { class: 'modal bounce-in', style: { textAlign: 'center' } },
      iconEmoji ? el('div', { style: { fontSize: '3rem', marginBottom: '0.5rem' } }, iconEmoji) : null,
      title ? el('h2', { style: { marginBottom: '0.5rem' } }, title) : null,
      content ? el('div', { style: { marginBottom: '1rem', color: 'var(--text-secondary)' } }, content) : null,
      el('div', { class: 'flex flex--center gap-md' }, ...buttonElements)
    )
  );

  container.appendChild(modal);
  return modal;
}

export function closeModal(modal) {
  if (modal && modal.parentNode) {
    modal.remove();
  }
}
