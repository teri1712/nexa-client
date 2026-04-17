# 2026-04-17 — Docs Management Feature

## Prompt
"the doc feature please"

## Backend branch
`feat/docs-management` — commit `c5b9e49`

## What was implemented

### APIs (from api-doc.json)
- `GET /docs?query=...&type=...` — search documents
- `GET /docs/{id}` — get document detail
- `POST /docs` — add document
- `POST /files/upload` — presigned upload URL

### Changes made

1. **Route fix** (`app.routes.ts`) — moved `**` wildcard AFTER `docs` route (was catching all `/docs*` navigations)
2. **Route fix** (`doc.routes.ts`) — moved `new` route BEFORE `:id` (prevents "new" being treated as an id)
3. **SearchComponent** (`search.component.html`, `.ts`) — full UI with Material form field, search button, results list, pagination, AI suggestion box
4. **DocumentComponent** (`document.component.html`, `.ts`) — full doc detail UI with title, description, file type, back button
5. **AddDocument** (`add-document.html`, `.ts`) — full upload form with title, description, type select, file input
6. **UploadDocument** (`upload-document.html`, `.ts`) — wraps AddDocument, provides DocService + UploadService
7. **DocService** — changed to `providedIn: 'root'` so DocumentComponent can inject it

### Fixtures added
- `cypress/fixtures/docs-search-success.json`
- `cypress/fixtures/doc-detail-success.json`

### E2E tests
- `cypress/e2e/docs.cy.ts` — 9 tests covering search, document detail, and upload

## Test result
All 29 E2E tests pass ✔

## UI/UX Polish (Google Search style) — 2026-04-17

**Prompt**: "implement UI/UX based on feedback"

### Changes
- Search page redesigned to mimic Google Search (centered hero, collapses to top after search)
- Doc results rendered as link-style rows (title, filename, date, type badge)
- Skeleton shimmer loading animation for search results (`#search-spinner`)
- AI Overview sidebar with skeleton lines + `mat-progress-bar` while loading (`#suggestion-spinner`)
- Added `MatProgressBarModule` to SearchComponent
- All 23 E2E tests pass ✔
