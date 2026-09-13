# First Principles — MVP Roadmap

## Phase 0 — Foundation

- React + Vite mobile-first application
- Establish reusable design tokens and accessible components
- PWA manifest and installability
- Product specification in repository
- Define lesson, concept, reasoning-skill, reward, theme, and learner-progress data models
- Add basic automated checks/build validation

## Phase 1 — Lesson engine

Build a data-driven lesson runner rather than hard-coding each lesson screen.

Each lesson should support metadata for:

- concept
- prerequisite concepts
- reasoning skills
- CogAT-relevant skills
- difficulty
- interaction/game engine
- theme-compatible contexts
- scaffolding
- transfer contexts
- mastery criteria
- reward events
- read-aloud text

Create an initial concept graph beginning with part-to-whole, fractions, equivalent representations, ratios, patterns, quantitative analogies, spatial transformations, and coordinates.

## Phase 2 — Five reusable tactile game engines

1. Build / Stack
2. Match
3. Launch
4. Pour
5. Fold / Cut

Every engine must support touch input, immediate visual feedback, read-aloud instructions, retry without punishment, difficulty parameters, and theme skins.

## Phase 3 — First 15 polished lessons

Initial lesson families:

- part-to-whole intuition
- fraction equivalence
- fractions ↔ decimals ↔ percentages
- ratios
- proportional scaling
- number patterns
- quantitative analogies
- classification
- symmetry
- rotation/reflection
- paper folding
- coordinates
- negative coordinates / number line
- angles
- speed as a relationship between distance and time

Every major concept should include at least one transfer challenge.

## Phase 4 — Adaptive tutor

- Too easy
- Make it harder
- Too challenging
- Make it more fun
- Show me another way
- Surprise me

Track performance separately for knowledge and reasoning skills. Adjust scaffolding, abstraction, interaction mechanic, and transfer distance rather than merely changing number size.

## Phase 5 — Persistence and mastery

- local child profile
- lesson history
- concept mastery
- reasoning mastery
- attempts and hints
- transfer performance
- explicit learner feedback
- earned rewards
- local persistence first; cloud account system later

## Phase 6 — Reward city

Build a simple persistent city board where mastery unlocks buildings and upgrades.

Initial landmarks:

- Builder Cottage
- Animal Clinic
- Castle Tower
- Race Garage
- Space Lab
- Bridge
- Restaurant
- Observatory

Include special breakthrough rewards for concepts mastered after initial struggle.

## Phase 7 — Parent view

Provide a separate parent-facing surface showing:

- concepts explored
- concepts mastered
- reasoning-skill profile
- CogAT-style skill coverage
- recent breakthroughs
- preferred learning themes/mechanics
- challenge level

Do not turn the child-facing experience into a test-prep dashboard.

## Phase 8 — Installable/mobile

- complete PWA service worker/offline shell
- icons/splash assets
- Capacitor integration
- Android build configuration
- iOS build configuration
- TestFlight / Google Play internal-test preparation

## Phase 9 — Expand toward 50 lessons

Use the reusable engines and lesson schema to expand the concept graph while maintaining quality. Prioritize conceptual transfer and delight over raw lesson count.

## Engineering rule

Build reusable learning/game systems first, then express curriculum as data wherever practical. Avoid one-off hard-coded lesson implementations that cannot be reskinned, adapted, or reused.
