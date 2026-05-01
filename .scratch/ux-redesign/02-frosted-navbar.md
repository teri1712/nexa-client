Labels: needs-triage

## Parent
PRD: `.scratch/ux-redesign/prd.md`

## What to build
Modernize the main layout by transforming the standard Angular Material top toolbar (`mat-toolbar`) into a premium, floating frosted-glass navigation bar. This involves removing solid background colors in favor of transparency and `backdrop-filter: blur()`, allowing main content to scroll smoothly underneath.

## Acceptance criteria
- [ ] The top `.navbar` in `home.scss` uses a semi-transparent background color.
- [ ] A `backdrop-filter: blur(12px)` (or similar) is applied to create the frosted glass effect.
- [ ] A soft drop-shadow visually separates the navbar from the content below it.
- [ ] The `.app-shell` layout accommodates the scrolling behavior correctly so the blur effect is visible.

## Blocked by
- `.scratch/ux-redesign/01-theme-dark-mode.md`
