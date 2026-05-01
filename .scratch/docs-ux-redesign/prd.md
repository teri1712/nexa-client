# Search & Docs UX Redesign PRD

Labels: needs-triage

## Problem Statement

Following the main layout redesign, the Search and Document pages remain visually unappealing and excessively "form-like". The stark, outlined Angular Material text fields and cards feel like an enterprise dashboard rather than a polished consumer product, failing to align with the modern, elevated aesthetics established in the rest of the application.

## Solution

Redesign the Search, Document Detail, and Document Upload pages to embrace a floating, elevated aesthetic. The search interface will be centered around a premium "omni-bar" (a unified pill shape where the input and filters share a single container). Furthermore, content and results will be displayed on softly shadowed, floating cards rather than rigid, outlined containers.

## User Stories

1. As a user, I want the search bar to be a large, seamless omni-bar, so that the search experience feels premium and the primary input action is highly inviting.
2. As a user, I want the search filter and search button to be visually integrated into the search bar, so that the interface does not look like a disjointed data-entry form.
3. As a user, I want my search results to be grouped inside an elevated, rounded card, so that they look like a distinct, organized "tray" of information rather than a raw list of links.
4. As a user, I want the document reading and uploading interfaces to use floating cards with soft drop shadows instead of harsh 1px borders, so that the entire application feels consistent and modern.

## Implementation Decisions

- **Search Module Layout**: Modify `search.component.scss` and `html` to transform the `.search-bar-wrapper` into an omni-bar. The `mat-form-field` outlines will be removed via targeted CSS overrides so they blend seamlessly into the parent pill shape container.
- **Search Results Container**: Wrap the `mat-nav-list` search results in a new `mat-card` container to create the elevated "tray" effect.
- **Document Details & Upload Layout**: Remove `appearance="outlined"` from the core `mat-card` components in `document.component` and `add-document`. Apply soft `box-shadow` CSS properties to create a floating effect.
- **Dependency Constraint**: Ensure the solution strictly uses the already installed `@angular/material` (v21) components, overriding their base styles where necessary instead of adding new UI frameworks.

## Testing Decisions

- Due to the purely visual nature of these CSS/SCSS structural changes, traditional behavioral unit tests will not be written.
- Verification will rely on manual visual testing across both Light and Dark mode operating system preferences.
- Specifically, ensure the integrated filter dropdown inside the new omni-bar still receives click events and overlays properly without z-index issues.

## Out of Scope

- Changing the underlying search algorithm or the backend search API.
- Altering the document upload flow logic or file validation.
- Adding new features to the document viewer (e.g., native in-browser PDF rendering).

## Further Notes

- This PRD acts as Phase 2 of the overarching UX Redesign, specifically targeting the document-heavy pages to match the consumer-app vibe of the main chat interface.
