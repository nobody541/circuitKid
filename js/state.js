/**
 * Central state manager with localStorage persistence and pub-sub
 */
import { getByPath, setByPath, uuid, deepClone } from './utils/helpers.js';

const STORAGE_KEY = 'circuit_kids_app';

class StateManager {
  constructor() {
    this.listeners = new Map();
    this.state = this.load();
  }

  getDefaultState() {
    return {
      version: 1,
      profiles: [],
      activeProfileId: null,
      profileData: {}
    };
  }

  getDefaultProfileData() {
    return {
      stars: 0,
      lessons: {
        1: { unlocked: true, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null },
        2: { unlocked: false, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null },
        3: { unlocked: false, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null },
        4: { unlocked: false, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null },
        5: { unlocked: false, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null },
        6: { unlocked: false, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null },
        7: { unlocked: false, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null },
        8: { unlocked: false, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null },
        9: { unlocked: false, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null },
        10: { unlocked: false, phases: this.getDefaultPhases(), totalTimeSeconds: 0, startedAt: null, completedAt: null }
      },
      badges: [],
      unlockedColors: ['red', 'green', 'blue'],
      unlockedAvatarItems: [],
      savedCircuits: [],
      settings: {
        difficulty: 'normal',
        soundEnabled: true,
        parentPin: '1234'
      }
    };
  }

  getDefaultPhases() {
    return {
      intro: { completed: false, stars: 0, completedAt: null },
      learn: { completed: false, stars: 0, completedAt: null },
      game: { completed: false, stars: 0, completedAt: null },
      practice: { completed: false, stars: 0, completedAt: null },
      project: { completed: false, stars: 0, completedAt: null }
    };
  }

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...this.getDefaultState(), ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage', e);
    }
    return this.getDefaultState();
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Failed to save state', e);
    }
  }

  get(path) {
    if (!path) return this.state;
    return getByPath(this.state, path);
  }

  set(path, value) {
    setByPath(this.state, path, value);
    this.save();
    this.notify(path);
  }

  subscribe(path, callback) {
    if (!this.listeners.has(path)) {
      this.listeners.set(path, new Set());
    }
    this.listeners.get(path).add(callback);
    return () => this.listeners.get(path)?.delete(callback);
  }

  notify(changedPath) {
    for (const [path, callbacks] of this.listeners) {
      if (changedPath.startsWith(path) || path.startsWith(changedPath)) {
        for (const cb of callbacks) {
          cb(this.get(path));
        }
      }
    }
  }

  // Profile management
  createProfile(name, avatarConfig = {}) {
    const id = uuid();
    const profile = {
      id,
      name,
      avatar: {
        body: avatarConfig.body || 'robot',
        color: avatarConfig.color || '#4A90D9',
        hat: null,
        accessory: null,
        ...avatarConfig
      },
      createdAt: Date.now()
    };

    this.state.profiles.push(profile);
    this.state.profileData[id] = this.getDefaultProfileData();
    this.state.activeProfileId = id;
    this.save();
    this.notify('profiles');
    this.notify('activeProfileId');
    return profile;
  }

  selectProfile(id) {
    this.set('activeProfileId', id);
  }

  getActiveProfile() {
    const id = this.state.activeProfileId;
    if (!id) return null;
    return this.state.profiles.find(p => p.id === id) || null;
  }

  getActiveProfileData() {
    const id = this.state.activeProfileId;
    if (!id) return null;
    return this.state.profileData[id] || null;
  }

  // Stars and progress
  addStars(amount) {
    const id = this.state.activeProfileId;
    if (!id) return;
    const current = this.state.profileData[id].stars || 0;
    this.set(`profileData.${id}.stars`, current + amount);
  }

  getStars() {
    const data = this.getActiveProfileData();
    return data?.stars || 0;
  }

  // Lesson progress
  completePhase(lessonId, phaseName, starsEarned) {
    const id = this.state.activeProfileId;
    if (!id) return;

    const lesson = this.state.profileData[id].lessons[lessonId];
    if (!lesson) return;

    // Only award stars if not already completed
    if (!lesson.phases[phaseName].completed) {
      lesson.phases[phaseName] = {
        completed: true,
        stars: starsEarned,
        completedAt: Date.now()
      };
      this.addStars(starsEarned);
    }

    // Check if all phases complete → unlock next lesson
    const allPhases = Object.values(lesson.phases);
    if (allPhases.every(p => p.completed)) {
      lesson.completedAt = Date.now();
      // Unlock next lesson
      const nextLesson = this.state.profileData[id].lessons[lessonId + 1];
      if (nextLesson) {
        nextLesson.unlocked = true;
      }
    }

    this.save();
    this.notify(`profileData.${id}.lessons`);
  }

  isLessonUnlocked(lessonId) {
    const data = this.getActiveProfileData();
    if (!data) return false;
    return data.lessons[lessonId]?.unlocked || false;
  }

  isLessonCompleted(lessonId) {
    const data = this.getActiveProfileData();
    if (!data) return false;
    return data.lessons[lessonId]?.completedAt != null;
  }

  isPhaseCompleted(lessonId, phaseName) {
    const data = this.getActiveProfileData();
    if (!data) return false;
    return data.lessons[lessonId]?.phases[phaseName]?.completed || false;
  }

  isFreePlayUnlocked() {
    return this.isLessonCompleted(5);
  }

  areAdvancedChallengesUnlocked() {
    return this.getStars() >= 500;
  }

  // Badges
  awardBadge(badgeId) {
    const id = this.state.activeProfileId;
    if (!id) return;
    const data = this.state.profileData[id];
    if (!data.badges.includes(badgeId)) {
      data.badges.push(badgeId);
      this.save();
      this.notify(`profileData.${id}.badges`);
    }
  }

  hasBadge(badgeId) {
    const data = this.getActiveProfileData();
    return data?.badges?.includes(badgeId) || false;
  }

  // Time tracking
  addLessonTime(lessonId, seconds) {
    const id = this.state.activeProfileId;
    if (!id) return;
    const lesson = this.state.profileData[id].lessons[lessonId];
    if (lesson) {
      lesson.totalTimeSeconds = (lesson.totalTimeSeconds || 0) + seconds;
      if (!lesson.startedAt) lesson.startedAt = Date.now();
      this.save();
    }
  }

  // Saved circuits
  saveCircuit(name, components, wires) {
    const id = this.state.activeProfileId;
    if (!id) return;
    const circuit = {
      id: uuid(),
      name,
      components: deepClone(components),
      wires: deepClone(wires),
      savedAt: Date.now()
    };
    this.state.profileData[id].savedCircuits.push(circuit);
    this.save();
    return circuit;
  }

  // Settings
  getSetting(key) {
    const data = this.getActiveProfileData();
    return data?.settings?.[key];
  }

  setSetting(key, value) {
    const id = this.state.activeProfileId;
    if (!id) return;
    this.set(`profileData.${id}.settings.${key}`, value);
  }

  // Reset
  resetProfile(profileId) {
    if (this.state.profileData[profileId]) {
      this.state.profileData[profileId] = this.getDefaultProfileData();
      this.save();
      this.notify(`profileData.${profileId}`);
    }
  }
}

// Singleton
export const state = new StateManager();
