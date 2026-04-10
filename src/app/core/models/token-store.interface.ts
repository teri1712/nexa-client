import { Signal } from '@angular/core';
import { ProfileResponse } from './auth.models';

/**
 * Read-only view of the token store.
 * Components and services that only need to read session state inject this.
 * Only data-layer classes that manage session mutations inject TokenStore directly.
 */
export abstract class ITokenStore {
  abstract readonly profile: Signal<ProfileResponse | null>;
  abstract readonly isLoggedIn: Signal<boolean>;
  abstract readonly isAdmin: Signal<boolean>;
  /** Becomes true when the refresh token has been invalidated server-side. */
  abstract readonly sessionExpired: Signal<boolean>;
  /** Raw access token from storage — use for guard checks where signal timing may lag. */
  abstract getAccessToken(): string | null;
}

