# Smart Query & FAQ Integration

## Overview
The Smart Query interface now includes dynamic FAQ suggestions (Trending FAQs) that appear on the dashboard. This feature replaces static "Quick Access" chips with real-time data from the Nexa backend.

## Architecture

### Components
- **SearchComponent**: Fetches and displays FAQ chips. When a chip is clicked, it populates the search bar and executes a search.
- **MessageListComponent**: Handles the chat assistant interaction (previously updated).

### Services
- **FaqService**: Interacts with the `/faqs` endpoint.
  - `getFaqs()`: Returns a list of `FaqResponse` objects.

### Models
- **FaqResponse**:
  ```typescript
  export interface FaqResponse {
      question: string;
  }
  ```

## UI/UX Guidelines
- **Placement**: FAQs are rendered as chips directly below the main search bar on the dashboard.
- **Interactions**:
  - Clicking a chip performs a search immediately.
  - Hovering over a chip applies the primary gradient and a subtle lift effect.
- **Visuals**:
  - Uses `--app-gradient-primary` for active/hover states.
  - Follows the 8dp spacing rhythm for chip gaps.

## Testing
- **E2E Tests**: `cypress/e2e/doc.cy.ts` verifies that FAQ chips load and correctly trigger searches.
- **Mocking**: Use `cypress/fixtures/faqs-success.json` for consistent test data.
