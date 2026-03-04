/**
 * Text-to-Speech utility using browser SpeechSynthesis API
 * Kid-friendly voice settings (slower, slightly higher pitch)
 */
import { state } from '../state.js';

/**
 * Check if SpeechSynthesis is available
 */
function isSupported() {
  return 'speechSynthesis' in window;
}

/**
 * Get a preferred voice (English, female if available)
 */
function getVoice() {
  if (!isSupported()) return null;
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Prefer English female voices (sound friendlier for kids)
  const preferred = voices.find(v =>
    v.lang.startsWith('en') && v.name.toLowerCase().includes('female')
  );
  if (preferred) return preferred;

  // Fallback: any English voice
  const english = voices.find(v => v.lang.startsWith('en'));
  if (english) return english;

  // Last resort: default voice
  return voices[0];
}

export const tts = {
  /**
   * Speak text aloud. Cancels any in-progress speech first.
   * @param {string} text - The text to speak
   */
  speak(text) {
    try {
      if (!isSupported()) return;
      if (!text || text.trim().length === 0) return;

      // Respect sound setting
      const soundEnabled = state.getSetting('soundEnabled');
      if (soundEnabled === false) return;

      // Cancel anything currently speaking
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Kid-friendly voice settings
      utterance.rate = 0.9;    // Slightly slower for kids
      utterance.pitch = 1.1;   // Slightly higher pitch
      utterance.volume = 1.0;

      // Try to set a good voice
      const voice = getVoice();
      if (voice) {
        utterance.voice = voice;
      }

      speechSynthesis.speak(utterance);
    } catch (e) {
      // Silently fail — TTS is non-critical
      console.warn('TTS error:', e);
    }
  },

  /**
   * Stop any in-progress speech immediately
   */
  cancel() {
    try {
      if (!isSupported()) return;
      speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  },

  /**
   * Check if currently speaking
   * @returns {boolean}
   */
  isSpeaking() {
    try {
      if (!isSupported()) return false;
      return speechSynthesis.speaking;
    } catch (e) {
      return false;
    }
  }
};

// Voices may load asynchronously — warm up the voice list
if (isSupported()) {
  speechSynthesis.getVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices();
    };
  }
}
