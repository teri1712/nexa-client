# Chat Interface Overrides

> **PROJECT:** Nexa
> **Generated:** 2026-05-30
> **Page Type:** AI Chat / Conversational UI

---

## Page-Specific Rules

### Layout & Container
- **Glass Container:** The chat window uses `var(--mat-sys-surface)` with a 1px border.
- **Header:** Integrated look with a subtle gradient-bottom border.

### Bubbles
- **User:** Primary background (`var(--mat-sys-primary)`), white text, sharp corner on bottom-right.
- **Bot:** Surface background with `insight` gradient border, sharp corner on bottom-left.

### Input Area
- **Floating Design:** The input feels detached or subtly separated with a top-border and shadow.
- **Custom Input:** No standard Material borders; use a clean, high-contrast surface.

### Agent Bubble (FAB)
- **Visuals:** Pulsating glow using `var(--app-gradient-accent)`.
- **Glassmorphism:** `backdrop-filter: blur(8px)`.
