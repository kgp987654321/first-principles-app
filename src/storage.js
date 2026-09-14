import { migrateV1Progress } from './progressMigration';

const KEY = 'first-principles-progress-v2';
const LEGACY_KEY = 'first-principles-progress-v1';

export const defaultProgress = {
  theme: 'building',
  coins: 0,
  mastery: 0,
  completedLessons: {},
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaultProgress, ...JSON.parse(raw) };

    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const migrated = migrateV1Progress(JSON.parse(legacyRaw));
      localStorage.setItem(KEY, JSON.stringify(migrated));
      return { ...defaultProgress, ...migrated };
    }

    return defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Learning remains usable even if storage is unavailable.
  }
}
