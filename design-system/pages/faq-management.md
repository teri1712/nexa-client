# FAQ Management Dashboard

## Overview
The FAQ Management Dashboard allows administrators to monitor and trigger the daily FAQ clustering process. This process analyzes user queries to generate dynamic FAQ suggestions.

## Architecture

### Components
- **FaqDashboardComponent**: The main interface for managing FAQ clusters.
  - Displays today's clustering status.
  - Allows triggering/restarting the clustering process.
  - Lists historical clustering logs with pagination.

### Services
- **FaqService**: Updated to handle cluster log endpoints.
  - `getClusterLogs(page, size)`: Fetches paginated logs from `/cluster-logs`.
  - `getClusterLogByDate(date)`: Fetches status for a specific date from `/cluster-logs/{date}`.
  - `triggerCluster()`: Initiates clustering via `POST /cluster-logs/trigger`.

### Models
- **LogStatus**: `CREATED`, `RUNNING`, `COMPLETED`, `FAILED`.
- **ClusterLogResponse**: Contains log ID, date, status, and message.

## UI/UX Guidelines
- **Access**: Restricted to users with the `ADMIN` role via `adminGuard`.
- **Polling**: Automatically polls for status updates every 5 seconds when today's cluster is in `CREATED` or `RUNNING` state.
- **Triggering**: 
  - Shows "Start Cluster" if no cluster exists for today.
  - Shows "Restart Cluster" if today's cluster has `FAILED`.
- **Pagination**: Custom numeric pagination (1, 2, 3...) at the bottom of the log table.

## Testing
- **E2E Tests**: `cypress/e2e/faq.cy.ts` verifies:
  - Admin-only navigation.
  - Correct button display based on status.
  - Status polling logic.
  - Pagination functionality.
- **Mocking**:
  - `cypress/fixtures/cluster-logs-success.json`
  - `cypress/fixtures/cluster-log-today-failed.json`
