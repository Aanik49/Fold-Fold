import { ProgressMap } from './types';

const PROGRESS_KEY = 'fold_fold_progress_v1';
const SETTINGS_KEY = 'fold_fold_settings_v1';

export interface AudioSettings {
  sfx: boolean;
  music: boolean;
}

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function saveProgress(progress: ProgressMap) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota errors in private contexts
  }
}

export function loadAudioSettings(): AudioSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { sfx: true, music: true };
    const parsed = JSON.parse(raw);
    return {
      sfx: typeof parsed.sfx === 'boolean' ? parsed.sfx : true,
      music: typeof parsed.music === 'boolean' ? parsed.music : true,
    };
  } catch {
    return { sfx: true, music: true };
  }
}

export function saveAudioSettings(settings: AudioSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}
