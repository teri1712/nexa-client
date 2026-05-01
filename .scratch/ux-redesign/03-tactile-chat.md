Labels: needs-triage

## Parent
PRD: `.scratch/ux-redesign/prd.md`

## What to build
Redesign the chat components to feel like a modern consumer messaging app. The message bubbles must be highly rounded to feel tactile, and the bottom input area must be transformed from a rigidly bordered footer into a distinct, floating pill shape.

## Acceptance criteria
- [ ] Message bubbles (`message.component.scss`) have a `border-radius` of at least `20px`.
- [ ] Bubble padding is adjusted for optimal text breathing room, and a soft shadow is applied.
- [ ] The chat input area (`message-list.component.scss`) has its rigid top border removed.
- [ ] The text input itself is styled as a floating pill (rounded corners, soft shadow, visually disconnected from the absolute bottom edge).
- [ ] The chat header utilizes a frosted glass effect similar to the main navbar.

## Blocked by
- `.scratch/ux-redesign/01-theme-dark-mode.md`
