# Workspace Sync — 2026-04-09

## Prompt
> "sync if there are any missing apis (user-infos just removed). And sync the context files with current workspace."

---

## Backend API Audit (branch: `feat/users-management`, HEAD: `27cd1bb`)

### Latest backend commit
**`27cd1bb`** — *feat: Introduce admin role and enhance user management with admin registration and OAuth login*

### API contracts (current, confirmed from `api-doc.json` + source)

| Endpoint | Method | Status | Frontend implemented? |
|---|---|---|---|
| `/user-login` | POST | ✅ active | ✅ `auth.service.ts` |
| `/tokens/refresh` | POST | ✅ active | ✅ `auth.service.ts` |
| `/admins` | POST | ✅ active | ✅ `auth.service.ts` |
| `/profiles/me` | GET / PATCH | ✅ active | ✅ `profile.service.ts` |
| `/profiles/me/password` | POST | ✅ active | ✅ `profile.service.ts` |
| `/user-infos` | GET | ❌ **REMOVED** (`UseInfoController.java` deleted in `27cd1bb`) | — never implemented, nothing to remove |

**Result: Frontend is fully aligned with current backend API surface. No dead code to remove.**

---

## Workspace Gaps Fixed

### 1. `environment.test.ts` — Created
Missing test environment file; created pointing to mock server at `http://localhost:3000`.

### 2. `angular.json` — Updated
- Added `fileReplacements` for **production** build (was missing — `environment.prod.ts` was never actually applied).
- Added `fileReplacements` for new **test** build configuration.
- Added **test** serve configuration (`ng serve --configuration test`).

### 3. `package.json` — Updated
- Added `start:test` script (`ng serve --configuration test`) to run the app against the mock server.
- Added `build:prod` script for clarity.

---

## Still Pending (to be set up with first feature)

| Item | Notes |
|---|---|
| Mock server (expressjs) | Needs to be created under `mock-server/` when first E2E feature is implemented |
| Cypress E2E | Needs installation + setup |
| Angular Material | Not yet installed — needed for UI components |
| `users/services/` | Empty scaffold — was likely planned for `/user-infos`; kept for future use |
| `users/components/user-card/` | Empty scaffold — kept for future use |

---

## User Journeys (from backend `.feature` files)

- **Login** (`login.feature`): Admin credential login, Google OIDC login, wrong password / unknown user errors
- **Sign Up** (`signup.feature`): Admin registers new admin or user accounts; username conflict error
- **Profile** (`profile.feature`): Change password (invalidates session), partial profile update (name, gender)

