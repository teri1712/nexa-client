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

