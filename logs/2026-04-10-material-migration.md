# 2026-04-10 – Migrate to Angular Material Design

## Prompt
> "Please migrate to Angular Material design and components instead of hard coding UI styles"

## What was done

### Theme setup
- `src/styles.scss`: Replaced all custom CSS design tokens and hand-crafted `.btn`, `.field`, `.spinner`, `.alert` utility classes with Angular Material M3 theme via `@use '@angular/material' as mat` + `mat.theme()` mixin (violet primary palette, light theme). Kept only minimal reset + shared layout helpers (`alert`, `slider-row`, `avatar`).
- `src/index.html`: Added Google Fonts (Roboto + Material Icons).

### App shell (`app.ts` / `app.html` / `app.scss`)
- Replaced hand-coded `<header>` navbar with `<mat-toolbar>`.
- Nav links use `mat-button` directive; logout uses `mat-stroked-button`.
- Added `MatToolbarModule`, `MatButtonModule`, `MatIconModule` to component imports.

### Login (`login.ts` / `login.html` / `login.scss`)
- Card: `<mat-card>` replaces custom `.login-card` div.
- Form fields: `<mat-form-field appearance="outline">` + `matInput` + `<mat-error>`.
- Buttons: `mat-flat-button` (submit), `mat-button` (back/admin toggle).
- Spinner: `<mat-spinner diameter="18">` replaces custom CSS spinner.
- Error banner: uses shared `.alert--error` styled with `--mat-sys-*` tokens.

### Register Admin (`register-admin.ts` / `register-admin.html` / `register-admin.scss`)
- Wrapped in `<mat-card>`.
- All inputs converted to `<mat-form-field appearance="outline">` + `matInput`.
- Gender slider: `<mat-slider>` with `matSliderThumb` replaces raw `<input type="range">`.
- Submit: `mat-flat-button` with `<mat-spinner>` loading state.

### Profile (`profile.ts` / `profile.html` / `profile.scss`)
- Custom tab buttons replaced with `<mat-tab-group>` + `<mat-tab>`.
- Role badge replaced with `<mat-chip>` (highlighted + color="primary" for admin).
- Form fields converted to `<mat-form-field>` + `matInput`.
- Gender slider: `<mat-slider>` + `matSliderThumb`.
- Submit buttons: `mat-flat-button` with spinner.

### Home (`home.ts` / `home.html` / `home.scss`)
- Role badge replaced with `<mat-chip-set>` + `<mat-chip>`.

## Build status
✅ `ng build --configuration development` — successful, no errors.

---

# 2026-04-10 – DI decoupling: AuthService extends TokenStore + IAuthService interface

## Prompt
> AuthService extends TokenStore (single owner of session state).
> Decouple clients with IAuthService interface so they inject the interface, not the impl.

## What was done

### `AuthService` now extends `TokenStore`
- Removed the `TokenStore` field injection from `AuthService`.
- `AuthService` inherits all signals and mutation methods from `TokenStore`.
- `TokenStore` loses `providedIn: 'root'`; `AuthService` is the single root instance.
- `this.tokenStore.xxx()` calls become `this.xxx()` throughout `AuthService`.

### New `IAuthService` abstract class (`core/models/auth-service.interface.ts`)
- Exposes `loginWithOidc`, `loginWithCredentials`, `registerAdmin`, `logout`.
- Components inject this instead of `AuthService` — hides all token-store internals.

### `ITokenStore` updated (`core/models/token-store.interface.ts`)
- Added `getAccessToken(): string | null` so guards can do raw localStorage checks.

### `app.config.ts` — three aliases to the single `AuthService` instance
- `{ provide: TokenStore, useExisting: AuthService }`
- `{ provide: ITokenStore, useExisting: AuthService }`
- `{ provide: IAuthService, useExisting: AuthService }`

### `auth.interceptor.ts`
- Injects `AuthService` directly (the concrete class with full token-mutation access).
- Comment clarifies it's the only caller of mutation methods during auto-refresh.

### All consumers now inject interfaces
- `app.ts` → `ITokenStore` + `IAuthService`
- `profile.ts` → `ITokenStore` + `IAuthService`
- `login.ts` → `ITokenStore` + `IAuthService`
- `register-admin.ts` → `IAuthService`
- `auth.guard.ts` → `ITokenStore`
- `admin.guard.ts` → `ITokenStore`

## Test status
✅ All 23 E2E tests pass (login: 7, profile: 9, register-admin: 7)


## Prompt
> TokenService → TokenStore rename (done externally); then:
> - Logout must send refresh token as `?refresh_token=` query param
> - After changing password, auto re-login admin instead of forcing logout
> - Decouple read/write on TokenStore via `ITokenStore` abstract class + `sessionExpired` signal
> - When session expires, show snackbar with "Sign out" action

## What was done

### `ITokenStore` abstract class (`token-store.interface.ts`)
- Created read-only DI interface exposing `profile`, `isLoggedIn`, `isAdmin`, `sessionExpired` signals.
- Provided in `app.config.ts` as `{ provide: ITokenStore, useExisting: TokenStore }`.

### `TokenStore` (`token-store.service.ts`)
- Added `sessionExpired` readonly signal.
- Added `markSessionExpired()` — called when refresh token is invalidated.
- Added `updateAccessToken()` — updates only the access token in localStorage (used after refresh).
- `storeSession()` now resets `sessionExpired` to `false` on fresh login.
- Implements `ITokenStore`.

### `AuthService` (`auth.service.ts`)
- `logout()` now POSTs to `/logout?refresh_token=<token>` (fire-and-forget) before clearing local session.
- `loginWithCredentials()` is now used post-password-change for auto re-login.

### `AuthInterceptor` (`auth.interceptor.ts`)
- Token refresh now uses `POST /tokens/refresh?refresh_token=<token>` (query param, not Authorization header).
- On refresh failure: calls `tokenStore.markSessionExpired()` instead of navigating to login.

### `App` root component (`app.ts`)
- Injected `MatSnackBar`.
- Added `effect()` watching `tokenStore.sessionExpired()` — opens persistent snackbar "Your session has expired" with "Sign out" action that calls `authService.logout()`.

### `ProfileComponent` (`profile.ts`)
- `savePassword()`: after success, admin users are auto re-logged in with new password (no forced logout).
- Non-credential (OIDC) users still get logged out.

### Mock server (`mock-server/server.js`)
- `POST /tokens/refresh` now reads refresh token from `?refresh_token=` query param (decoded from base64).
- Added `POST /logout` endpoint — acknowledges request (mock has no server-side session state).

### E2E tests (`cypress/e2e/profile.cy.ts`)
- Updated: "changing password keeps admin logged in and shows success message" (was: redirects to login).
- Updated: "after changing password, can log out and re-login with new password" (admin stays on /profile, then explicitly signs out).

## Test status
✅ All 23 E2E tests pass (login: 7, profile: 9, register-admin: 7)
