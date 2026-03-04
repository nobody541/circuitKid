/**
 * Circuit Kids - Main Application Entry Point
 */
import { Router } from './router.js';
import { state } from './state.js';
import { $ } from './utils/dom.js';
import { mountSplash } from './screens/splash.js';
import { mountProfileSelect } from './screens/profile-select.js';
import { mountDashboard } from './screens/dashboard.js';
import { mountLesson } from './screens/lesson.js';
import { mountFreePlay } from './screens/free-play.js';
import { mountParentDashboard } from './screens/parent-dashboard.js';
import { mountReward } from './screens/reward.js';

// Initialize app
const app = $('#app');
const router = new Router(app);

// Make router globally accessible for screens
window.appRouter = router;
window.appState = state;

// Register routes
router
  .on('/', (container) => mountSplash(container, router))
  .on('/profile', (container) => mountProfileSelect(container, router))
  .on('/dashboard', (container) => mountDashboard(container, router))
  .on('/lesson/:id/:phase', (container, params) => mountLesson(container, router, params))
  .on('/lesson/:id', (container, params) => mountLesson(container, router, { ...params, phase: 'intro' }))
  .on('/freeplay', (container) => mountFreePlay(container, router, { mode: 'menu' }))
  .on('/freeplay/:mode', (container, params) => mountFreePlay(container, router, params))
  .on('/parent', (container) => mountParentDashboard(container, router))
  .on('/reward/:lessonId', (container, params) => mountReward(container, router, params));

// Start routing
router.resolve();
