# UX Redesign PRD

Labels: needs-triage

## Problem Statement

The current Nexa Client Angular application has a dated, enterprise-grid aesthetic that the user finds unappealing. The application lacks the visual polish, tactile feedback, and proper dark mode support expected of modern consumer applications, which diminishes user engagement with the core chat functionality.

## Solution

Redesign the application's UX to embrace a modern consumer-app aesthetic while remaining solidly built upon Angular Material 3. The redesign will introduce a vibrant Violet primary color palette with native dark mode support, a premium "frosted glass" top navigation bar, and a tactile, pill-based chat interface featuring highly rounded chat bubbles.

## User Stories

1. As a user, I want the application to automatically adapt to my system's dark or light mode preference, so that the interface is comfortable to read in any environment.
2. As a user, I want the top navigation bar to have a frosted glass effect (`backdrop-filter`), so that the layout feels spacious and modern as content scrolls underneath.
3. As a user, I want my chat messages to be displayed in highly rounded bubbles matching the primary theme color, so that the conversation interface feels tactile, friendly, and engaging.
4. As a user, I want the chat input area to be a distinct, floating pill shape without harsh grid borders, so that the primary interaction point of the chat interface feels modern and intuitive.

## Implementation Decisions

- **Global Styles**: Modify `src/styles.scss` to explicitly implement the `violet` Material 3 theme palette. Introduce `@media (prefers-color-scheme: dark)` and CSS custom properties to ensure seamless dark/light mode toggling.
- **Layout/Navigation Module**: Modify `src/app/pages/home/home.scss` to convert the existing `mat-toolbar` into a frosted glass component using transparency and `backdrop-filter: blur()`.
- **Chat List Module**: Modify `src/app/features/message-list/message-list.component.scss` to remove rigid borders and transform the input area into a floating, pill-shaped container.
- **Chat Bubble Module**: Modify `src/app/features/message/message.component.scss` to increase the border radius of bubbles to `20px` and refine the internal padding for better text readability.
- **Dependency Constraint**: The solution will strictly use the already installed `@angular/material` (v21) components and vanilla CSS. No new styling libraries (e.g., Tailwind) will be introduced.

## Testing Decisions

- Due to the purely visual nature of these CSS/SCSS changes, traditional behavioral unit tests will not be written for these modules.
- Verification will rely on manual visual testing across both Light and Dark mode operating system preferences to ensure contrast ratios and layout spacing remain correct.

## Out of Scope

- Migrating away from Angular Material components.
- Changing the underlying chat logic, routing, or API interactions.
- Refactoring the core `mat-sidenav` structural behavior.

## Further Notes

- This PRD is the direct output of a collaborative design session that locked in the specific aesthetics and module targets.
