const KEY = 'first-principles-progress-v1';

export const defaultProgress = {
  theme: 'building',
  coins: 0,
  mastery: 0,
  completedLessons: {},
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
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
