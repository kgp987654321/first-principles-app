# Codex Working Instructions

Before changing the app, read `PRODUCT.md`, `ROADMAP.md`, and `README.md`.

## Product invariants

Do not turn the experience into a worksheet or conventional quiz app. Interaction comes before explanation. Prefer direct manipulation over multiple choice. Learner-facing text must support read-aloud. Wrong answers should teach visually and allow immediate retry. Reward new mastery, persistence, transfer, and conceptual connections more than repetition.

## Engineering priorities

1. Keep the app runnable after every task.
2. Build reusable game engines rather than one-off lesson screens.
3. Keep curriculum data separate from presentation themes and mechanics.
4. Design mobile-first with large child-friendly touch targets.
5. Persist learner progress locally until accounts/backend are deliberately added.
6. Add tests as reusable lesson/game infrastructure grows.
7. Run build/tests before declaring a task complete.

## Current milestone

Turn the starter prototype into an MVP architecture with a reusable lesson schema and the first five tactile game engines: Build, Match, Launch, Pour, and Fold. Populate 10–15 polished lessons spanning foundational reasoning, fractions/ratios, geometry, patterns, coordinates, and early physics intuition.
