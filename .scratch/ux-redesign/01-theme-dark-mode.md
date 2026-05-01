Labels: needs-triage

## Parent
PRD: `.scratch/ux-redesign/prd.md`

## What to build
Set up the global foundation for the UX redesign. This involves explicitly configuring the Angular Material 3 `violet` theme and establishing the CSS custom properties required for native dark mode support (`@media (prefers-color-scheme: dark)`). This creates the canvas for all subsequent component redesigns.

## Acceptance criteria
- [ ] `styles.scss` explicitly defines the `violet` primary color palette.
- [ ] Base background colors (`body`, `html`) use CSS variables that automatically swap based on system dark mode preference.
- [ ] A subtle CSS transition is applied to the background color for smooth mode switching.
- [ ] The app compiles with no SCSS errors.

## Blocked by
None - can start immediately.
