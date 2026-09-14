import { lessons } from './data/lessons';

export function migrateV1Progress(v1) {
  const oldCompleted = v1?.completedLessons || {};
  const completedLessons = {};
  let coins = 0;
  let mastery = 0;

  for (const lesson of lessons) {
    const previous = oldCompleted[lesson.id];
    const discovered = Boolean(previous?.discovered);
    completedLessons[lesson.id] = {
      discovered,
      // v1 transfer could be earned by clicking a confirmation button,
      // so none of those claims count under the evidence-based system.
      transferred: false,
    };

    if (discovered) {
      coins += lesson.rewards.discover;
      mastery += 1;
    }
  }

  return {
    theme: v1?.theme || 'building',
    coins,
    mastery,
    completedLessons,
  };
}
