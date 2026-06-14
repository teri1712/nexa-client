# Knowledge Management Dashboard

## Overview
The Knowledge Management Dashboard allows administrators to monitor and trigger the daily knowledge indexing process. This process analyzes user queries to improve the knowledge base.

## Architecture

### Components
- **KnowledgeDashboardComponent**: The main interface for managing knowledge indexing.
  - Displays today's indexing status.
  - Allows triggering/restarting the indexing process.
  - Lists historical indexing logs with pagination.

### Services
- **IndexKnowledgeService**: Handles indexing log endpoints.
  - `getIndexLogs(page, size)`: Fetches paginated logs from `/index-logs`.
  - `getIndexLogByDate(date)`: Fetches status for a specific date from `/index-logs/{date}`.
  - `triggerIndexing()`: Initiates indexing via `POST /index-logs/trigger`.

### Models
- **LogStatus**: `CREATED`, `RUNNING`, `COMPLETED`, `FAILED`.
- **IndexLogResponse**: Contains log ID, date, status, and message.

## UI/UX Guidelines
- **Visual Feedback**: Uses a pulse indicator (spinner) for active indexing.
- **Polling**: Automatically polls for status updates every 2 seconds when today's indexing is in `CREATED` or `RUNNING` state.
- **Contextual Actions**:
  - Shows "Initialize Indexing" if no indexing exists for today.
  - Shows "Resume Process" if today's indexing has `FAILED`.

## Testing Strategy
- **E2E**: Verified via `cypress/e2e/knowledge.cy.ts`.
- **Fixtures**: Uses the following fixtures for mocking:
  - `cypress/fixtures/cluster-logs-success.json` (Needs renaming/updating?)
  - `cypress/fixtures/cluster-log-today-failed.json` (Needs renaming/updating?)
