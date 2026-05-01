Labels: needs-triage

## Parent
PRD: `.scratch/docs-ux-redesign/prd.md`

## What to build
Update the Document Detail and Add Document pages to match the new aesthetic. Replace the flat, 1px outlined borders of their main `mat-card` containers with soft, diffuse drop-shadows to create an elevated, floating effect.

## Acceptance criteria
- [ ] `appearance="outlined"` is removed from the primary `mat-card` elements in `document.component.html` and `add-document.html`.
- [ ] Custom CSS is applied to give these cards a soft `box-shadow`, lifting them off the background.
- [ ] Card border-radiuses (`16px`+) and internal padding align with the premium feel of the rest of the application.

## Blocked by
- `.scratch/ux-redesign/01-theme-dark-mode.md`
