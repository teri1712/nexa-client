Labels: needs-triage

## Parent
PRD: `.scratch/docs-ux-redesign/prd.md`

## What to build
Transform the search interface from a multi-block form into a unified "omni-bar". The search input, filter dropdown, and action buttons should appear as a single, large, highly-rounded floating pill. Additionally, the list of search results should be contained within a single elevated card to look like a modern "tray" of information.

## Acceptance criteria
- [ ] The `.search-bar-wrapper` is styled as a large pill with a soft shadow and no harsh borders.
- [ ] Native `mat-form-field` outlines within the search bar are removed via CSS overrides so the input and filter blend seamlessly into the pill.
- [ ] The `mat-nav-list` search results are wrapped inside a new elevated `mat-card`.
- [ ] The results card utilizes soft shadows instead of a 1px border.

## Blocked by
- `.scratch/ux-redesign/01-theme-dark-mode.md`
