import { migrateV1Progress } from './progressMigration';

const KEY = 'first-principles-progress-v2';
const LEGACY_KEY = 'first-principles-progress-v1';

export const defaultProgress = {
  theme: 'building',
  coins: 0,
  mastery: 0,
  lessonIndex: 0,
  completedLessons: {},
  world: { placements: {} },
};

function normalize(progress){
  const completedLessons = Object.fromEntries(
    Object.entries(progress?.completedLessons || {}).map(([id, lessonProgress]) => {
      const { supportLevel: _retiredSupportLevel, ...cleanProgress } = lessonProgress || {};
      return [id, cleanProgress];
    })
  );

  return {
    ...defaultProgress,
    ...progress,
    lessonIndex: Number.isInteger(progress?.lessonIndex) ? progress.lessonIndex : 0,
    completedLessons,
    world: { ...defaultProgress.world, ...(progress?.world || {}) },
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));

    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (legacyRaw) {
      const migrated = normalize(migrateV1Progress(JSON.parse(legacyRaw)));
      localStorage.setItem(KEY, JSON.stringify(migrated));
      return migrated;
    }

    return defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(normalize(progress)));
  } catch {
    // Learning remains usable even if storage is unavailable.
  }
}
