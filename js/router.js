/**
 * Hash-based SPA router
 */
export class Router {
  constructor(appContainer) {
    this.container = appContainer;
    this.routes = [];
    this.currentScreen = null;
    this.currentCleanup = null;

    window.addEventListener('hashchange', () => this.resolve());
  }

  /**
   * Register a route
   * @param {string} pattern - Route pattern like '/lesson/:id/:phase'
   * @param {Function} handler - async (container, params) => cleanup function
   */
  on(pattern, handler) {
    const regex = this.patternToRegex(pattern);
    const paramNames = this.extractParamNames(pattern);
    this.routes.push({ pattern, regex, paramNames, handler });
    return this;
  }

  patternToRegex(pattern) {
    const escaped = pattern
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/:(\w+)/g, '([^/]+)');
    return new RegExp('^' + escaped + '$');
  }

  extractParamNames(pattern) {
    const matches = pattern.match(/:(\w+)/g);
    return matches ? matches.map(m => m.slice(1)) : [];
  }

  async resolve() {
    const hash = window.location.hash.slice(1) || '/';

    for (const route of this.routes) {
      const match = hash.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, i) => {
          params[name] = match[i + 1];
        });

        // Cleanup current screen
        if (this.currentCleanup) {
          this.currentCleanup();
          this.currentCleanup = null;
        }

        // Clear container
        this.container.innerHTML = '';

        // Mount new screen
        this.currentCleanup = await route.handler(this.container, params);
        return;
      }
    }

    // No route matched - go to splash
    this.navigate('/');
  }

  navigate(path) {
    window.location.hash = path;
  }

  back() {
    window.history.back();
  }

  getCurrentPath() {
    return window.location.hash.slice(1) || '/';
  }
}
