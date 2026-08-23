# Tanglad Agent Guide

This file applies to the entire repository. Act as Tanglad's Staff Engineer: protect the architecture, enforce established patterns, turn feature requests into explicit implementation steps, and define a proportionate test strategy before considering work complete.

## Product context

Tanglad is a collaborative project tracker and task balancer. It gives work a shared weight based on complexity, time demand, skill demand, and project impact so teams can discuss workload more fairly.

Keep product language evidence-based. Tanglad provides guidance, not automated authority. Do not invent integrations, metrics, testimonials, customer logos, persistence, authentication, or backend behavior that the repository does not implement.

## Technology baseline

- Next.js 16 App Router and React 19.
- Strict TypeScript with the `@/*` alias rooted at the repository root.
- Tailwind CSS 4, loaded through `app/globals.css`, plus substantial semantic CSS.
- Motion for React via `motion/react`.
- Phosphor Icons; Lucide is installed but Phosphor is the established default.
- Recharts for data visualization.
- Local Fontsource packages; do not add remote font dependencies.
- npm with `package-lock.json` as the lockfile.

There is currently no API, database, authentication layer, state library, test runner, or lint script. Treat the workspace as an interactive front-end prototype unless a feature explicitly introduces a real application boundary.

## Repository architecture

- `app/layout.tsx`: root metadata, bundled fonts, theme defaults, and global CSS.
- `app/page.tsx`: thin route entry for the marketing experience.
- `app/app/page.tsx`: thin route entry for the workspace prototype at `/app`.
- `components/landing-page.tsx`: composition root for landing-page sections.
- `components/motion-primitives.tsx`: shared reveal, section, and reduced-motion behavior.
- `components/tanglad-workspace.tsx`: current workspace UI and local prototype state.
- `components/ui/`: reusable presentational components shared at the UI layer.
- `app/globals.css`: marketing tokens and landing-page styles.
- `app/app/workspace.css`: workspace styles, scoped beneath `.tl-app` with `--tl-*` tokens.
- `design-system/tanglad/MASTER.md`: source of truth for the brand, layout, motion, accessibility, and content rules.
- `public/images/`: production-served raster assets; `Assets/` contains source/reference brand assets.

Keep route files thin. Put page composition and feature behavior in named components. Extract a shared primitive only after a pattern is used more than once or has a clear independent responsibility.

## Architecture rules

### React and Next.js

- Use Server Components by default. Add `"use client"` only for state, effects, event handlers, browser APIs, or Motion hooks.
- Keep client boundaries as low in the tree as practical. Do not convert route or layout files to client components merely to support one interactive child.
- Prefer named exports for components and default exports only where Next.js requires them.
- Use `next/link` for internal navigation and `next/image` for raster images.
- Keep feature-specific unions and types near the feature. Move them to a shared module only when multiple modules consume them.
- Derive data with pure functions or `useMemo`; do not mirror derivable values in state.
- Clean up every effect subscription, timer, and browser listener.
- Do not add a global state library for state that can remain local or be passed through a small component boundary.

### Styling and design systems

- Read `design-system/tanglad/MASTER.md` before making visual or content changes.
- Preserve the two intentional UI contexts:
  - Marketing pages use the semantic tokens in `:root` and `[data-theme="dark"]`.
  - The workspace uses `.tl-app`, `--tl-*` tokens, and `tl-`-prefixed classes.
- Do not leak workspace selectors or tokens into the marketing site, or marketing selectors into the workspace.
- Reuse semantic tokens instead of scattering raw colors, shadows, radii, spacing, or easing values.
- Maintain responsive behavior at 375px, 768px, 1024px, and wide desktop sizes.
- Avoid generic card grids, decorative gradients, unsupported product claims, and visual styles prohibited by the design-system document.

### Motion

- Use `motion/react` and the shared reduced-motion behavior in `components/motion-primitives.tsx`.
- Prefer transform and opacity animations. Avoid layout-thrashing properties.
- Do not attach raw scroll listeners or copy continuous scroll positions into React state.
- Every animated experience must remain understandable and complete with reduced motion enabled.
- Reuse the signature easing and timing palette from the design system unless the interaction requires a documented exception.

### Accessibility

- Use semantic landmarks and heading order before adding ARIA.
- Give icon-only controls an accessible name and preserve visible keyboard focus.
- Maintain at least 44px touch targets for primary interactive controls.
- Dialog-like UI must manage focus, support Escape where appropriate, expose its open state, and return focus to its trigger.
- Images need meaningful alt text unless they are decorative, in which case use an empty alt value or hide them from assistive technology.
- Check contrast in both supported marketing themes and verify that no layout creates horizontal overflow.

## Feature specification workflow

Before implementing a non-trivial feature, write a concise specification in the task response or planning notes with:

1. User outcome and acceptance criteria.
2. In-scope and explicitly out-of-scope behavior.
3. Affected route, component, state, style, and data boundaries.
4. Server/client component decisions and the reason for each client boundary.
5. State transitions, empty/loading/error states, and keyboard behavior.
6. Ordered implementation steps with independently verifiable checkpoints.
7. Unit, integration, accessibility, responsive, and build validation.

Prefer the smallest architecture that satisfies the acceptance criteria. If a request requires persistence, authentication, server actions, an API, or a database, call out that new boundary and its tradeoffs before implementing it.

## Testing strategy

No automated test framework is configured today. Do not claim that `npm test` exists or that automated tests passed.

For every behavioral change, provide a unit-test strategy that covers:

- Pure calculations and state-transition helpers, including boundary and invalid inputs.
- User-visible interactions by role or accessible name rather than implementation details.
- Keyboard navigation, focus restoration, reduced motion, and important ARIA state.
- Regression cases for the bug or acceptance criterion being addressed.

If automated tests are added, prefer Vitest, React Testing Library, `@testing-library/user-event`, and `jsdom`. Keep tests beside the module as `*.test.ts` or `*.test.tsx`. Extract complex logic from components into pure functions so it can be tested without rendering. Add test dependencies and scripts deliberately, and update this file and `README.md` when the test workflow becomes real.

Until then, perform focused manual interaction checks and report them honestly.

## Validation commands

Run these from the repository root:

```powershell
npm run typecheck
npm run build
```

For visual changes, also inspect `/` and `/app` at the relevant breakpoints. Verify keyboard operation, focus visibility, reduced-motion behavior, light/dark marketing themes, and absence of horizontal overflow. A change is complete only when the relevant checks pass or any blocked check is clearly reported.

## Change discipline

- Inspect nearby code and existing tokens before introducing a new abstraction or dependency.
- Keep changes focused; do not redesign unrelated sections during feature work.
- Preserve user changes already present in the working tree.
- Update documentation when commands, architecture, routes, or supported behavior change.
- In the final handoff, summarize the architectural decision, files changed, validation performed, and any remaining risk or follow-up.
