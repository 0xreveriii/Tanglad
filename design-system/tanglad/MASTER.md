# Tanglad Design System

**Product:** Collaborative project tracker and task balancer  
**Direction:** Organic technology with editorial restraint  
**Design dials:** Variance 8/10 | Motion 8/10 | Density 3/10

## Brand idea

Tanglad means lemongrass. Its visual language uses slender lines, woven structures, and balanced organic clusters to express many contributions becoming one coherent workload. The brand should feel precise, calm, inclusive, and quietly intelligent.

## Color

Green is an accent, not the page background. Surfaces remain near-black or off-white.

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#F6F7F2` | `#0B0D0A` |
| Secondary surface | `#EDF0E8` | `#11150F` |
| Raised surface | `#FFFFFF` | `#141813` |
| Primary text | `#10130F` | `#F3F5EE` |
| Secondary text | `#5F675C` | `#A7AFA2` |
| Hunter accent | `#355E3B` | `#6D9571` |
| Olive accent | `#6F7751` | `#979F73` |
| Moss accent | `#8A9A5B` | `#A5B36E` |
| Sage support | `#727E6E` | `#8F9B88` |

Rules:

- Maintain WCAG AA contrast for all functional text.
- Use one green accent per component. Avoid multicolor gradients.
- Do not introduce red, purple, blue glow, bright lime, or wellness-spa color treatments.
- Theme is selected at page level and remains consistent through the full scroll.

## Typography

- Display: Space Grotesk Variable, locally bundled.
- Body and interface: DM Sans Variable, locally bundled.
- Technical labels and measured details: JetBrains Mono Variable, locally bundled.
- Headlines use tight tracking and controlled scale, with a maximum of two lines in the hero.
- Body text remains 15-19px with comfortable line height.

## Shape and material

- Cards and image frames use a 20-26px radius.
- Primary calls to action and compact controls use a full pill.
- Important visuals use a nested shell and inner core with concentric radii.
- Shadows are broad, tinted, and low opacity. Avoid hard black drop shadows.
- Borders use translucent semantic line tokens, never generic solid gray.

## Layout

- Desktop uses asymmetric editorial splits and generous empty space.
- Section families must vary. Do not repeat equal three-card rows.
- Mobile collapses every asymmetric layout to one column below 768px.
- Full-height moments use `min-height: 100dvh`.
- No pricing section is part of the Tanglad landing page.

## Motion identity

**Personality:** Premium and calm  
**Signature easing:** `cubic-bezier(0.16, 1, 0.3, 1)`  
**Timing palette:** 180ms quick | 520ms standard | 900ms cinematic

- Hero copy and imagery compress, drift, and dissolve as the user leaves the opening scene.
- Major sections enter and softly fade near their end to create continuity between chapters.
- The method uses a sticky four-stage scroll narrative tied to task weighting and team choice.
- Animate transforms and opacity only.
- Never attach raw scroll listeners or store continuous scroll values in React state.
- Honor `prefers-reduced-motion` and preserve a complete static experience.

## Content principles

- Lead with the core truth: fair work has weight.
- Describe task weight using complexity, time demand, skill demand, and project impact.
- Explain recommendations as evidence-based guidance, never automated authority.
- Keep TANGLAD inclusive of developers, researchers, designers, writers, students, and administrative teams.
- Do not claim external Git or enterprise integrations. Chapter 1 explicitly excludes them from scope.
- Do not invent metrics, testimonials, company logos, or adoption claims.

## Delivery checks

- Test light and dark themes.
- Test 375px, 768px, 1024px, and wide desktop layouts.
- Verify no horizontal overflow.
- Verify keyboard focus, 44px touch targets, semantic headings, and descriptive image alt text.
- Verify no runtime, hydration, or build errors.
- Verify every scroll effect has an intact reduced-motion fallback.
