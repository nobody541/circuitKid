/**
 * DOM helper utilities
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Create an HTML element with attributes and children
 */
export function el(tag, attrs = {}, ...children) {
  const element = document.createElement(tag);

  for (const [key, val] of Object.entries(attrs)) {
    if (val === null || val === undefined) continue;
    if (key === 'class' || key === 'className') {
      element.className = val;
    } else if (key === 'style' && typeof val === 'object') {
      Object.assign(element.style, val);
    } else if (key === 'dataset' && typeof val === 'object') {
      Object.assign(element.dataset, val);
    } else if (key.startsWith('on') && typeof val === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), val);
    } else {
      element.setAttribute(key, val);
    }
  }

  appendChildren(element, children);
  return element;
}

/**
 * Create an SVG element with attributes and children
 */
export function svg(tag, attrs = {}, ...children) {
  const element = document.createElementNS(SVG_NS, tag);

  for (const [key, val] of Object.entries(attrs)) {
    if (val === null || val === undefined) continue;
    if (key === 'class' || key === 'className') {
      element.setAttribute('class', val);
    } else if (key.startsWith('on') && typeof val === 'function') {
      element.addEventListener(key.slice(2).toLowerCase(), val);
    } else {
      element.setAttribute(key, val);
    }
  }

  appendChildren(element, children);
  return element;
}

function appendChildren(parent, children) {
  for (const child of children.flat(Infinity)) {
    if (child === null || child === undefined || child === false) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      parent.appendChild(document.createTextNode(String(child)));
    } else if (child instanceof Node) {
      parent.appendChild(child);
    }
  }
}

/**
 * Query selector shorthand
 */
export function $(selector, parent = document) {
  return parent.querySelector(selector);
}

/**
 * Query selector all shorthand (returns array)
 */
export function $$(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

/**
 * Clear all children from an element
 */
export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Mount content into a container (clears existing content first)
 */
export function mount(container, ...elements) {
  clearElement(container);
  for (const element of elements.flat()) {
    if (element instanceof Node) {
      container.appendChild(element);
    }
  }
}

/**
 * Animate element entrance
 */
export function animateIn(element, animClass = 'screen-enter') {
  element.classList.add(animClass);
  element.addEventListener('animationend', () => {
    element.classList.remove(animClass);
  }, { once: true });
  return element;
}

/**
 * Create an SVG icon (star, lock, check, etc.)
 */
export function icon(name, size = 24) {
  const icons = {
    star: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' })
    ),
    lock: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' })
    ),
    check: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' })
    ),
    arrow_right: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z' })
    ),
    arrow_left: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' })
    ),
    home: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' })
    ),
    play: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M8 5v14l11-7z' })
    ),
    close: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' })
    ),
    settings: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.48.48 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z' })
    ),
    trophy: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z' })
    ),
    delete: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' })
    ),
    undo: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z' })
    ),
    print: () => svg('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'currentColor' },
      svg('path', { d: 'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z' })
    ),
  };

  return icons[name] ? icons[name]() : null;
}
