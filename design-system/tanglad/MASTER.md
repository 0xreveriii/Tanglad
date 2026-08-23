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

- Display: Space Grotesk Variable, locally bundled. Use it only for marketing display headings, workspace page titles, and other genuinely prominent headings.
- Body and interface: DM Sans Variable, locally bundled. It is the default for body copy, navigation, controls, tables, forms, tabs, task content, helper text, and general interface text.
- Technical labels and measured details: JetBrains Mono Variable, locally bundled. Reserve it for keyboard shortcuts, tabular or measured values, chart axes, and compact technical labels.
- Marketing typography is defined by the semantic `--type-*` tokens in `app/globals.css`. Its editorial display headings may use section-specific fluid sizes, but body and interface roles must use the shared scale and families.
- Workspace typography is defined by `--tl-type-*` tokens scoped beneath `.tl-app` in `app/app/workspace.css`. Do not use marketing typography selectors inside the workspace.
- Workspace page titles are 30-34px on desktop and 25-28px on mobile; section headings are 18-20px; primary body and row titles are 14-15px; controls and navigation are 13-14px; metadata and helper text never fall below 12px.
- Use 9-10px only for nonessential chart ticks, keyboard hints, avatar initials, counters, or truly tiny badges. Do not pair these exceptional sizes with faint contrast when the text is functional.
- Use weight 400 for reading text, 500 for controls and emphasis, and 600 for headings and selected states. Avoid unneeded intermediate variable-font weights.
- Interface text uses normal or near-normal tracking. Tight tracking is reserved for large headings; positive tracking is limited to compact technical labels.
- Default workspace line height is 1.55. Body and helper copy use 1.55-1.65, controls use 1.35, and display headings use 1.08-1.2.
- Headlines use tight tracking and controlled scale, with a maximum of two lines in the hero. Body text remains 15-19px on marketing pages with comfortable line height.
- Verify the system at 375px, 768px, 1024px, 1440px, and 1920px, and at 200% browser zoom without horizontal overflow.

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
